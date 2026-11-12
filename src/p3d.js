/* PROCESO 3 · página F — Nota de Remisión Electrónica (3F) y consignación a sucursales (3G) */
(function () {
'use strict';
const E = window.Eng;
const T = E.TP;

E.PAGES.p3d = function () {
  const pg = T.embed('3', 'p3d', (p) => {
    /* ---------- 3F · Nota de Remisión ---------- */
    const F = p.band({
      y: 0, tag: '3F', title: 'Nota de Remisión Electrónica del despacho',
      desc: 'Para los destinos que la requieren, e-Karú arma la remisión con los mismos ítems escaneados en el despacho, la envía a SIFEN y el camión sale con el KuDE impreso.',
      lanes: [E.lane('cen', 170, [85]), E.lane('ek', 250, [90, 200]), E.lane('sifen', 150, [75]), E.lane('des', 170, [85])]
    });
    F.ev('Lin', 'cen', 1, 'link', 'F · Viene del despacho cuando el destino requiere remisión: 3A (local) o 3E (cliente)', { lp: 't', lw: 300 });
    F.gw('Gr', 'ek', 2, 'xor', '¿El destino requiere Nota de Remisión?', { lw: 150 });
    F.t('Enre', 'ek', 3, 'Arma la Nota de Remisión con lo escaneado: destino, motivo, ítems con código de barras y cantidad, sin precios', 'auto', { w: 200 });
    F.t('Tveh', 'cen', 4, 'Registrar en la tablet el vehículo, el conductor y la fecha y hora de inicio del traslado', 'user');
    F.t('Esend', 'ek', 5, 'Firma y envía la Nota de Remisión a SIFEN antes de que salga el camión', 'auto');
    F.t('Sapr', 'sifen', 6, 'Valida y aprueba el documento; le asigna el CDC y el QR', 'ext', { no: false });
    F.t('Eapp', 'ek', 7, 'Recibe la aprobación y genera el KuDE con su código QR', 'auto');
    F.t('Tprint', 'cen', 8, 'Imprimir el KuDE y subirlo al camión con la mercadería', 'print');
    F.t('Tdis', 'cen', 9, 'Despachar el camión al destino', 'manual');
    F.t('Rrec', 'des', 9, 'Recibir el camión con el KuDE de la remisión', 'scan');
    F.ev('Lb', 'des', 10, 'link', 'Local: sigue en 3B · Cliente: entrega (3.28)', { thrw: true, lp: 'b', lw: 150 });
    F.ev('End0', 'ek', 2, 'end', 'Sin remisión: el despacho sigue (3A → 3B, o 3E → entrega 3.28)', { row: 1, lp: 'r', lw: 150 });
    F.note('N1', 'cen', 2, `Qué locales y clientes la requieren, y con qué motivo, se define con el contador (punto ${T.opNo('Nota de Remisión: qué destinos la requieren')}).`, { w: 250, dx: 100 });
    F.note('N2', 'des', 3, 'Sin precios ni impuestos: la remisión solo ampara el traslado físico de la mercadería.', { w: 260 });

    F.e('Lin', 'Gr', 'b', 'l');
    F.e('Gr', 'Enre', 'r', 'l', { label: 'Sí' });
    F.e('Gr', 'End0', 'b', 't', { label: 'No' });
    F.e('Enre', 'Tveh', 'r', 'b');
    F.e('Tveh', 'Esend', 'r', 't');
    F.e('Esend', 'Sapr', 'r', 't', { k: 'msg' });
    F.e('Sapr', 'Eapp', 'r', 'b', { k: 'msg' });
    F.e('Eapp', 'Tprint', 'r', 'b');
    F.e('Tprint', 'Tdis', 'r', 'l');
    F.e('Tdis', 'Rrec', 'b', 't', { k: 'msg' });
    F.e('Rrec', 'Lb', 'r', 'l');
    F.e('Enre', 'N2', 'b', 't', { k: 'assoc' });

    /* ---------- 3G · consignación ---------- */
    const G = p.band({
      y: F.bottom + 44, tag: '3G', title: 'Consignación: el cliente vende y Glacé factura lo vendido',
      desc: 'La mercadería llega con su Nota de Remisión. Al cierre del período, e-Karú suma lo vendido por código de barras y emite la factura final.',
      lanes: [E.lane('con', 170, [85]), E.lane('ek', 250, [90, 200]), E.lane('ven', 150, [75])]
    });
    G.ev('Lc', 'con', 1, 'link', 'F · Llegó la mercadería con su Nota de Remisión', { lp: 'b', lw: 150 });
    G.t('Sv', 'con', 2, 'Vender al público escaneando el código de barras de cada producto', 'scan');
    G.ev('Ecut', 'ek', 3, 'timer', 'Fin del período de liquidación (ej.: cada mes)', { lp: 'b', lw: 150 });
    G.t('Esum', 'ek', 4, 'Suma lo vendido en el período por código de barras y lo valoriza con la lista del cliente', 'auto', { w: 200 });
    G.t('Tchk', 'ven', 5, 'Revisar el resumen con el cliente y confirmarlo', 'user');
    G.t('Efin', 'ek', 6, 'Emite la factura final de lo vendido, con el código de barras de cada línea', 'auto', { w: 200 });
    G.gw('Gre', 'ek', 7, 'xor', '¿Se devuelve mercadería sin vender?', { lw: 140 });
    G.ev('End3', 'ek', 8, 'end', 'Consignación liquidada y facturada', { lp: 'b', lw: 150 });
    G.ev('Lr', 'ek', 7, 'link', 'F · Devolver con Nota de Remisión (3F)', { row: 1, thrw: true, lp: 'r', lw: 170 });
    G.note('N3', 'con', 5, `Cómo informa el cliente lo vendido (caja de e-Karú, planilla o reporte) se define con Glacé (punto ${T.opNo('Consignación a clientes')}).`, { w: 300 });

    G.e('Lc', 'Sv', 'r', 'l');
    G.e('Sv', 'Ecut', 'r', 't');
    G.e('Ecut', 'Esum', 'r', 'l');
    G.e('Esum', 'Tchk', 'r', 't');
    G.e('Tchk', 'Efin', 'r', 'b');
    G.e('Efin', 'Gre', 'r', 'l');
    G.e('Gre', 'End3', 'r', 'l', { label: 'No' });
    G.e('Gre', 'Lr', 'b', 't', { label: 'Sí' });
    G.frame(['Sv'], 'Por cada venta', { lp: 'bl' });
  });

  /* ---------- formato de la Nota de Remisión ---------- */
  const fields = [
    ['Emisor', 'Glacé S.A.: RUC, timbrado, establecimiento, punto de expedición y número del documento.', 'Configuración de e-Karú'],
    ['Motivo del traslado', 'Por qué se mueve la mercadería: venta, consignación, traslado entre locales de la empresa o devolución, entre otros.', `Marca del destino (punto ${T.opNo('Nota de Remisión: qué destinos la requieren')})`],
    ['Destinatario', 'Nombre, RUC o documento, y dirección y ciudad del destino.', 'Ficha del cliente o de la sucursal'],
    ['Ítems', 'Código de barras, descripción, unidad de medida y cantidad (el lote, si se informa). Sin precios ni impuestos.', 'Escaneo del despacho ' + T.refs('p3a', ['Tpick']) + T.refs('p3c', ['Tscan'])],
    ['Transporte', 'Modalidad, vehículo (chapa), conductor (nombre y documento), puntos de salida y de llegada, y fecha y hora de inicio del traslado.', 'Pantalla de la tablet ' + T.refs('p3d', ['Tveh'])],
    ['Referencias', 'La factura o la Orden de Despacho a la que acompaña.', 'e-Karú'],
    ['Aprobación', 'CDC de 44 dígitos y código QR. El KuDE impreso lleva ambos.', 'SIFEN los genera; e-Karú imprime el KuDE ' + T.refs('p3d', ['Esend', 'Eapp', 'Tprint'])]
  ];
  const trs = fields.map((f) => `<tr><td class="k" style="width:19%">${f[0]}</td><td>${f[1]}</td><td style="width:27%">${f[2]}</td></tr>`).join('');
  const tbl = `<table class="tbl"><thead><tr><th>GRUPO</th><th>DATOS QUE LLEVA</th><th>DE DÓNDE LOS TOMA e-Karú</th></tr></thead><tbody>${trs}</tbody></table>
    <div class="note" style="margin-top:20px"><b>A validar con el contador y con el manual técnico de SIFEN:</b> los campos obligatorios exactos, los motivos válidos para cada tipo de destino, cuándo una factura que acompaña la mercadería puede reemplazar a la remisión y el plazo de aprobación antes de que salga el camión. El código QR y el CDC los exige SIFEN en el KuDE; no cambian el proceso interno, que sigue usando solo códigos de barras.</div>`;

  const mk = (n) => `<span class="mk">${n}</span>`;
  const line = (code, kind, desc, un, qty) => `<tr><td><span class="bc" data-bc="${code}" data-k="${kind}"></span><div class="dg">${code}</div></td><td>${desc}</td><td>${un}</td><td class="r">${qty}</td></tr>`;
  const nre = `<div class="inv"><div class="tg">EJEMPLO DE FORMATO · DATOS FICTICIOS</div>
    <div class="top"><div><div class="co">GLACÉ S.A.</div><div>RUC 80000000-0 · Timbrado 00000000</div><div>Dirección de ejemplo 123 · Asunción</div></div><div class="no"><div class="ti">NOTA DE REMISIÓN ELECTRÓNICA</div><div class="mono">001-001-0000045</div><div>Fecha: 09/11/2026</div></div></div>
    <div class="cl">${mk(1)}<b>Motivo:</b> traslado entre locales de la empresa &nbsp;·&nbsp; <b>Documento asociado:</b> Orden de Despacho</div>
    <div class="cl">${mk(2)}<b>Destinatario:</b> Sucursal de ejemplo · RUC 80000000-0 · Dirección de ejemplo 456, ciudad de ejemplo</div>
    <div class="cl">${mk(3)}<b>Transporte:</b> terrestre · chapa ABC 123 · conductor: Nombre Apellido, CI 0.000.000 · inicio: 09/11/2026 08:30</div>
    <table><thead><tr><th>${mk(4)}CÓDIGO DE BARRAS</th><th>DESCRIPCIÓN</th><th>UN.</th><th class="r">CANT.</th></tr></thead><tbody>
    ${line('2000001011058', 'ean', 'Helado Amarena (balde)', 'kg', '1,105')}
    ${line('2200012611050', 'ean', 'Palito con cobertura', 'un', '24')}
    ${line('2200192611031', 'ean', 'Brownie porción', 'un', '12')}
    </tbody></table>
    <div class="ft"><div class="qr">QR de<br>SIFEN</div><div><div class="ti" style="margin-bottom:3px">${mk(5)}CDC (44 dígitos, lo asigna SIFEN)</div><div class="mono" style="font-size:13px">0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000</div></div></div></div>`;
  const leg = `<div class="lg">
    <div>${mk(1)}</div><div><b>Motivo.</b> Define si la remisión acompaña una venta, una consignación o un traslado entre locales de la empresa.</div>
    <div>${mk(2)}</div><div><b>Destinatario.</b> Sale de la ficha de la sucursal o del cliente.</div>
    <div>${mk(3)}</div><div><b>Transporte.</b> Lo carga el operario en la tablet antes de que salga el camión.</div>
    <div>${mk(4)}</div><div><b>Ítems.</b> Son los mismos que se escanearon en el despacho, con su código de barras y sin precios.</div>
    <div>${mk(5)}</div><div><b>CDC y QR.</b> Los asigna SIFEN al aprobar la remisión.</div></div>`;

  const html = T.head('n3', 'Recepción de pedidos y despacho',
    'Fases F y G · Nota de Remisión Electrónica y consignación. Cómo se resuelve la remisión que requieren algunos locales y clientes y qué formato tiene, y cómo se factura lo que los clientes venden en consignación.') +
    '<section><div id="dg"></div></section>' +
    `<section><div class="two" style="grid-template-columns:1fr 1.05fr;gap:40px"><div><div class="st"><span class="pill">FORMATO</span><h2>Nota de Remisión Electrónica: qué datos lleva</h2></div><p class="sd">Documento tipo 7 de SIFEN. Ampara el traslado físico de la mercadería y no lleva precios ni impuestos.</p>${tbl}</div><div><div class="st"><span class="pill">EJEMPLO</span><h2>Cómo se ve el documento</h2></div><p class="sd">Remisión de un despacho a una sucursal, con los ítems escaneados. Datos ficticios.</p>${nre}${leg}</div></div></section>`;
  return T.mount(html, (el) => {
    el.querySelector('#dg').appendChild(pg.svg);
    el.querySelectorAll('.bc').forEach((s) => { s.appendChild(T.barcode(s.dataset.bc, s.dataset.k, 176, 40)); s.style.display = 'block'; });
  }, { warns: pg.warns, tasks: pg.tasks });
};
})();
