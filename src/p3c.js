/* PROCESO 3 · página E — venta a clientes con factura (mayoristas, minoristas y franquicias) */
(function () {
'use strict';
const E = window.Eng;
const T = E.TP;
const { S } = E;

/* ---------- códigos de barras para los ejemplos (EAN-13 de la balanza y Code 128 del catálogo) ---------- */
const C128 = ["212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", "114131", "311141", "411131", "211412", "211214", "211232", "2331112"];
function c128(code) {
  /* inicio C + pares de dígitos; si sobra un dígito: cambio a B (100) + carácter ('0' = 16) */
  const d = code.split('').map(Number), n = d.length, ev = n - (n % 2), v = [105];
  for (let i = 0; i < ev; i += 2) v.push(d[i] * 10 + d[i + 1]);
  if (n % 2) { v.push(100); v.push(16 + d[n - 1]); }
  let sum = v[0]; for (let k = 1; k < v.length; k++) sum += k * v[k];
  v.push(sum % 103); v.push(106);
  let m = '';
  v.forEach((x) => { let bar = true; for (const ch of C128[x]) { m += (bar ? '1' : '0').repeat(+ch); bar = !bar; } });
  return m;
}
/* kind: 'ean' (EAN-13 válido, el del balde) o 'c128' (los 13 dígitos del catálogo) */
function barcode(code, kind, w, h) {
  const mods = kind === 'ean' ? E.EAN.modules(code) : c128(code);
  const q = 10, mw = w / (mods.length + 2 * q);
  const svg = S('svg', { xmlns: 'http://www.w3.org/2000/svg', width: w, height: h, viewBox: `0 0 ${w} ${h}` });
  let i = 0;
  while (i < mods.length) {
    if (mods[i] === '1') { let j = i; while (j + 1 < mods.length && mods[j + 1] === '1') j++; S('rect', { x: (q + i) * mw, y: 0, width: (j - i + 1) * mw, height: h, fill: '#101916' }, svg); i = j + 1; } else i++;
  }
  return svg;
}
T.barcode = barcode;
T.c128 = c128;

T.addCss(`
.tp .inv{position:relative;border:1.8px solid #8FA29A;border-radius:12px;background:#fff;padding:26px 28px 24px;font-size:14.5px;line-height:20px;color:#33453F}
.tp .inv .tg{position:absolute;right:20px;top:-14px;background:#FBEBC8;color:#74500D;border:1.4px solid #E7CF98;border-radius:14px;padding:3px 14px;font-size:12px;font-weight:700;letter-spacing:.9px}
.tp .inv .top{display:flex;justify-content:space-between;gap:24px;padding-bottom:12px;border-bottom:1.4px solid #C9D4CF}
.tp .inv .co{font-size:21px;line-height:26px;font-weight:700;color:#14231F;letter-spacing:.3px}
.tp .inv .ti{font-size:12.5px;font-weight:700;letter-spacing:1.1px;color:#5B6D66}
.tp .inv .no{text-align:right}
.tp .inv .no .mono{font-size:17px;font-weight:700;color:#14231F}
.tp .inv .cl{padding:10px 0;border-bottom:1.4px solid #C9D4CF}
.tp .inv .cl b{color:#14231F}
.tp .inv table{width:100%;border-collapse:collapse;margin-top:8px}
.tp .inv th{text-align:left;font-size:11.5px;letter-spacing:.8px;font-weight:700;color:#5B6D66;padding:6px 8px;border-bottom:1.4px solid #14231F;white-space:nowrap}
.tp .inv td{padding:9px 8px;border-bottom:1px solid #E1E9E5;vertical-align:middle}
.tp .inv td.r,.tp .inv th.r{text-align:right}
.tp .inv td .dg{font-family:${T.MONO};font-size:12.5px;letter-spacing:.5px;color:#14231F;margin-top:2px}
.tp .inv .tot{display:flex;justify-content:flex-end;gap:36px;padding-top:12px;font-weight:700;color:#14231F}
.tp .inv .ft{display:flex;gap:18px;align-items:center;margin-top:16px;padding-top:14px;border-top:1.4px dashed #8FA29A}
.tp .inv .qr{flex:0 0 76px;height:76px;border:1.6px solid #14231F;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#5B6D66;text-align:center;line-height:14px}
.tp .mk{display:inline-flex;width:20px;height:20px;border-radius:10px;background:#1D7A6B;color:#fff;font-size:12px;font-weight:700;align-items:center;justify-content:center;margin-right:7px;vertical-align:1px;letter-spacing:0}
.tp .lg{display:grid;grid-template-columns:28px 1fr;gap:4px 8px;margin-top:20px;font-size:14.8px;line-height:21px}
.tp .lg .mk{margin:2px 0 0}
.tp .lg b{color:#14231F}
`);

E.PAGES.p3c = function () {
  /* ---------- 3E · diagrama ---------- */
  const pg = T.embed('3', 'p3c', (p) => {
    const A = p.band({
      y: 0, tag: '3E', title: 'Venta a un cliente: escanear, facturar y despachar',
      desc: 'Mientras el Depósito Central separa el pedido escaneando, e-Karú arma la factura: cada escaneo agrega su línea con el código de barras y registra la salida de la fábrica.',
      lanes: [E.lane('cli', 150, [75]), E.lane('ven', 150, [75]), E.lane('ek', 190, [95]), E.lane('cen', 170, [85], { sub: 'salida de fábrica · tablet y escáner' })]
    });
    A.ev('S', 'cli', 1, 'start', 'El cliente hace su pedido: mayorista, minorista o franquicia', { lp: 'r', lw: 170 });
    A.t('Tped', 'ven', 2, 'Recibir el pedido del cliente (portal o tablet) con su lista; si su crédito está bloqueado, queda retenido', 'user', { w: 196 });
    A.t('Eord', 'ek', 3, 'Crea la orden de venta con los precios de esa lista y la Orden de Picking del pedido', 'auto', { w: 200 });
    A.t('Tscan', 'cen', 4, 'Separar el pedido escaneando el código de barras de cada balde y cada producto', 'scan', { w: 196 });
    A.t('Eline', 'ek', 5, 'Agrega la línea a la factura: producto, código de barras, cantidad y precio de la lista', 'auto', { w: 200 });
    A.t('Eexit', 'ek', 6, 'Registra la salida de la fábrica con ese mismo escaneo y descuenta el stock por lote', 'auto', { w: 200 });
    A.gw('Gdoc', 'ek', 7, 'xor', '¿Qué documento lleva? (definido en el pedido)', { lw: 130 });
    A.t('Efac', 'ek', 8, 'Emite la factura electrónica y la envía a SIFEN: cada línea lleva el código de barras', 'auto', { w: 200 });
    A.t('Tdel', 'cen', 9, 'Entregar la mercadería con la factura impresa (KuDE)', 'manual');
    A.ev('End', 'cen', 10, 'end', 'Cliente con su mercadería y su factura con código de barras', { lp: 'b', lw: 190 });
    A.ev('Lf', 'cen', 7, 'link', 'F · Remisión (3F) y consignación (3G)', { thrw: true, lp: 'b', lw: 170 });
    A.note('Nlin', 'ven', 5, 'En un balde, el peso viaja en el código (01105 = 1,105 kg) y e-Karú lo usa como cantidad.', { w: 250 });
    A.note('Nrm', 'ven', 8, 'Si el cliente o la franquicia también exige Nota de Remisión, e-Karú la arma con los mismos ítems escaneados (3F).', { w: 270 });

    A.e('S', 'Tped', 'b', 'l');
    A.e('Tped', 'Eord', 'r', 't');
    A.e('Eord', 'Tscan', 'r', 't');
    A.e('Tscan', 'Eline', 'r', 'b');
    A.e('Eline', 'Eexit', 'r', 'l');
    A.e('Eexit', 'Gdoc', 'r', 'l');
    A.e('Gdoc', 'Efac', 'r', 'l', { label: 'Venta' });
    A.e('Gdoc', 'Lf', 'b', 't', { label: 'Traslado' });
    A.e('Efac', 'Tdel', 'r', 't');
    A.e('Tdel', 'End', 'r', 'l');
    A.e('Eline', 'Nlin', 't', 'b', { k: 'assoc' });
    A.e('Efac', 'Nrm', 't', 'b', { k: 'assoc' });
    A.frame(['Tscan', 'Eline', 'Eexit'], 'Por cada balde o producto', { lp: 'bl' });
  });

  /* ---------- tabla por tipo de cliente ---------- */
  const rows = [
    ['Mayorista', 'Cliente que compra por mayor. Hoy figura como depósito con el nombre del cliente (ej.: Bar Florida, San Marzano). Ideal: pide en el portal de pedidos (página 15).', 'Mayorista', 'Factura. Nota de Remisión solo si el cliente la requiere.', 'Sí, en cada línea'],
    ['Minorista', 'Comercio que revende (despensa, kiosco, supermercado).', 'Minorista', 'Factura; o consignación si se acuerda (3G).', 'Sí, en cada línea'],
    ['Franquicia', 'Local franquiciado, con su propia caja e-Karú y el Club con la marca Glacé. Caso aparte (página 15).', 'Franquicia', 'Factura. Nota de Remisión si corresponde.', 'Sí, en cada línea'],
    ['Salón o sucursal de Glacé', 'Traslado entre locales de la empresa, sin venta. El pedido lo sugiere e-Karú (0B); el salón vende con e-Karú Ventas y Club (3H).', 'Sin precio', 'Orden de Despacho. Nota de Remisión en los locales que la requieren (3F).', 'Sí, en los ítems de la remisión'],
    ['Cliente en consignación', 'Vende al público por cuenta de Glacé.', 'Lista de la sucursal, al liquidar', 'Nota de Remisión al enviar (3F) y factura final al liquidar (3G).', 'Sí, en ambos documentos']
  ];
  const trs = rows.map((r) => `<tr><td class="k" style="width:15%">${r[0]}</td><td style="width:29%">${r[1]}</td><td style="width:13%">${r[2]}</td><td style="width:26%">${r[3]}</td><td>${r[4]}</td></tr>`).join('');
  const tbl = `<table class="tbl"><thead><tr><th>DESTINO</th><th>QUÉ ES</th><th>LISTA DE PRECIOS</th><th>DOCUMENTO AL DESPACHAR</th><th>CÓDIGO DE BARRAS</th></tr></thead><tbody>${trs}</tbody></table>
    <div class="note" style="margin-top:20px"><b>Propuesta, para validar con el contador:</b> qué destino lleva factura, remisión o ambas depende de si hay venta y de cómo esté constituido cada local (puntos ${T.opNo('Nota de Remisión: qué destinos la requieren')} y ${T.opNo('Consignación a clientes')} de la última página). El resultado que se busca es siempre el mismo: el documento final muestra el código de barras de cada producto.</div>`;

  /* ---------- ejemplo de factura ---------- */
  const mk = (n) => `<span class="mk">${n}</span>`;
  const line = (code, kind, desc, qty, un, price, tot) => `<tr><td><span class="bc" data-bc="${code}" data-k="${kind}"></span><div class="dg">${code}</div></td><td>${desc}</td><td class="r">${qty}</td><td>${un}</td><td class="r">${price}</td><td class="r">${tot}</td></tr>`;
  const inv = `<div class="inv"><div class="tg">EJEMPLO DE FORMATO · DATOS FICTICIOS</div>
    <div class="top"><div><div class="co">GLACÉ S.A.</div><div>RUC 80000000-0 · Timbrado 00000000</div><div>Dirección de ejemplo 123 · Asunción</div></div><div class="no"><div class="ti">FACTURA ELECTRÓNICA</div><div class="mono">001-001-0000123</div><div>Fecha: 09/11/2026</div></div></div>
    <div class="cl"><b>Cliente:</b> Mayorista de ejemplo S.R.L. · RUC 80000001-2 &nbsp;·&nbsp; <b>Lista de precios:</b> Mayorista &nbsp;${mk(3)}</div>
    <table><thead><tr><th>${mk(1)}CÓDIGO DE BARRAS</th><th>DESCRIPCIÓN</th><th class="r">${mk(2)}CANT.</th><th>UN.</th><th class="r">PRECIO</th><th class="r">TOTAL</th></tr></thead><tbody>
    ${line('2000001011058', 'ean', 'Helado Amarena (balde)', '1,105', 'kg', '50.000', '55.250')}
    ${line('2200012611050', 'ean', 'Palito con cobertura', '24', 'un', '5.000', '120.000')}
    ${line('2200192611031', 'ean', 'Brownie porción', '12', 'un', '8.000', '96.000')}
    </tbody></table>
    <div class="tot"><span>TOTAL Gs. 271.250</span><span style="font-weight:600;color:#33453F">IVA 10 % incluido: 24.659</span></div>
    <div class="ft"><div class="qr">QR de<br>SIFEN</div><div><div class="ti" style="margin-bottom:3px">${mk(4)}CDC (44 dígitos, lo asigna SIFEN)</div><div class="mono" style="font-size:13px">0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000</div></div></div></div>`;
  const leg = `<div class="lg">
    <div>${mk(1)}</div><div><b>Código de barras de cada línea.</b> Es el que se escaneó en el despacho. El del balde ya trae el peso; el de cada producto es 22 + Nº de producto + fecha de elaboración (numeración nueva, página 3).</div>
    <div>${mk(2)}</div><div><b>Cantidad.</b> En un balde sale del peso del código (01105 = 1,105 kg); en los demás productos, de las unidades escaneadas.</div>
    <div>${mk(3)}</div><div><b>Precio.</b> Sale de la lista del cliente: mayorista, minorista o franquicia.</div>
    <div>${mk(4)}</div><div><b>CDC y QR.</b> Los genera SIFEN al aprobar la factura y van en el KuDE por exigencia de SIFEN. El proceso interno sigue usando solo códigos de barras.</div></div>`;

  const html = T.head('n3', 'Recepción de pedidos y despacho',
    'Fase E · Venta a clientes con factura. Al escanear un balde o un producto para un cliente mayorista, minorista o franquicia, e-Karú agrega la línea a la factura con su código de barras y registra la salida de la fábrica.') +
    '<section><div id="dg"></div></section>' +
    `<section><div class="two" style="grid-template-columns:1.15fr 1fr;gap:40px"><div><div class="st"><span class="pill">POR DESTINO</span><h2>Qué lista y qué documento lleva cada destino</h2></div><p class="sd">Todos los destinos terminan igual: el documento muestra el código de barras de cada producto. Pasos ${T.refs('p3c', ['Tped', 'Eline', 'Efac'])}</p>${tbl}</div><div><div class="st"><span class="pill">EJEMPLO</span><h2>Cómo queda la factura final</h2></div><p class="sd">Factura de un mayorista con un balde, palitos y brownies. Datos ficticios.</p>${inv}${leg}</div></div></section>`;
  return T.mount(html, (el) => {
    el.querySelector('#dg').appendChild(pg.svg);
    el.querySelectorAll('.bc').forEach((s) => { s.appendChild(barcode(s.dataset.bc, s.dataset.k, 176, 40)); s.style.display = 'block'; });
  }, { warns: pg.warns, tasks: pg.tasks });
};
})();
