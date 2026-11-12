/* PROCESO 3 · página H — salones: venta en la caja con e-Karú Ventas + e-Karú Club (3H) y balde terminado / cierre del día (3I) */
(function () {
'use strict';
const E = window.Eng;
const T = E.TP;

T.addCss(`
.tp .ol{margin:0;padding:0;list-style:none;counter-reset:o}
.tp .ol li{position:relative;padding-left:40px;margin:0 0 11px;font-size:15.5px;line-height:22px;color:#33453F;counter-increment:o}
.tp .ol li:last-child{margin-bottom:0}
.tp .ol li:before{content:counter(o);position:absolute;left:0;top:-1px;width:26px;height:26px;border-radius:8px;background:#1D7A6B;color:#fff;font-size:13.5px;font-weight:700;display:flex;align-items:center;justify-content:center}
.tp .ol li b{color:#14231F}
.tp .card.red{border-color:#B3392E}
.tp .card .kk{display:inline-block;font-size:11.5px;font-weight:700;letter-spacing:1.1px;color:#5B6D66;margin-bottom:6px}
.tp .clr{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;font-size:15px;line-height:21px;color:#33453F;margin:4px 0 12px}
.tp .clr .rk{font-weight:700;color:#14231F;white-space:nowrap}
`);

E.PAGES.p3h = function () {
  const pg = T.embed('3', 'p3h', (p) => {
    /* ---------- 3H · venta en la caja del salón ---------- */
    const A = p.band({
      y: 0, tag: '3H', title: 'Venta en la caja del salón: e-Karú Ventas y e-Karú Club en la misma venta',
      desc: 'El cajero escanea el grupo PADRE, elige sabores y baldes (como en el prototipo) y, si el cliente es socio, lo elige antes de cobrar. La venta descuenta el stock y pone el sello.',
      lanes: [E.lane('clis', 160, [80]), E.lane('caja', 300, [92, 222]), E.lane('ek', 300, [92, 222])]
    });
    A.ev('S', 'clis', 1, 'start', 'Pide en el mostrador (por ejemplo, Cono 2 con dos sabores)', { lp: 'r', lw: 170 });
    A.t('Kpad', 'caja', 2, 'Escanear el código PADRE del grupo (Cono 2, Vaso 1, Milkshake…)', 'scan');
    A.t('Ksab', 'caja', 3, 'Elegir los sabores y el balde abierto de cada sabor', 'user');
    A.t('Eprep', 'ek', 4, 'Arma la preparación: 1 unidad del grupo PADRE y 60 g por bocha de cada balde elegido', 'auto', { w: 196 });
    A.gw('Gsoc', 'caja', 5, 'xor', '¿Es socio del Club?', { lw: 140 });
    A.t('Cqr', 'clis', 6, 'Mostrar el QR de su tarjeta del Club en el celular', 'ext', { no: false });
    A.t('Ksoc', 'caja', 6, 'Elegir al socio (botón ★ o QR de su tarjeta). Si tiene un premio listo, agregarlo en Gs. 0', 'user', { w: 196 });
    A.gw('Gj', 'caja', 7, 'xor', '');
    A.t('Kcob', 'caja', 8, 'Cobrar la venta', 'user');
    A.t('Evta', 'ek', 9, 'Registra la venta: descuenta el grupo y los gramos de cada balde, suma el sello y lo imprime en el ticket', 'auto', { w: 200 });
    A.ev('End', 'ek', 10, 'end', 'Venta cobrada, stock descontado y sello sumado', { lp: 'b', lw: 150 });
    A.t('Ccel', 'clis', 10, 'Ver el sello nuevo en su tarjeta', 'ext', { no: false });
    A.ev('Ldat', 'ek', 10, 'link', 'Venta por sabor y local: sigue en 0B (pedido sugerido) y 0A (pronóstico)', { row: 1, thrw: true, lp: 'b', lw: 220 });
    A.note('Nme', 'ek', 2.6, 'Hoy el sello se suma solo en la caja de mostrador: las ventas cobradas desde Mesas todavía no suman (pedido a e-Karú).', { row: 1, w: 360 });
    A.note('Nprem', 'caja', 2.45, 'El premio entra en la venta en Gs. 0, marcado como premio del Club: descuenta el grupo y los gramos igual que una venta, y su costo se ve aparte.', { row: 1, w: 340 });
    A.note('Nsum', 'clis', 3.6, 'Se suma escaneando el cartel del Club con la cámara: celular, correo y nombre, sin bajar ninguna app.', { w: 380 });

    A.e('S', 'Kpad', 'b', 'l');
    A.e('Kpad', 'Ksab', 'r', 'l');
    A.e('Ksab', 'Eprep', 'r', 't');
    A.e('Eprep', 'Gsoc', 'r', 'l', { mx: 'cx:Eprep+135' });
    A.e('Gsoc', 'Ksoc', 'r', 'l', { label: 'Sí' });
    A.e('Gsoc', 'Gj', 'b', 'b', { label: 'No', via: [[null, 'row:caja:1'], ['cx:Gj', null]] });
    A.e('Cqr', 'Ksoc', 'b', 't', { k: 'msg' });
    A.e('Ksoc', 'Gj', 'r', 'l');
    A.e('Gj', 'Kcob', 'r', 'l');
    A.e('Kcob', 'Evta', 'b', 'l');
    A.e('Evta', 'End', 'r', 'l');
    A.e('Evta', 'Ccel', 't', 'l', { k: 'msg', via: [['cx:Evta', 'cy:Ccel']] });
    A.e('Evta', 'Ldat', 'b', 'l');

    /* ---------- 3I · balde terminado y cierre del día ---------- */
    const B = p.band({
      y: A.bottom + 44, tag: '3I', title: 'Balde terminado y cierre del día: el salón le avisa a la fábrica',
      desc: 'Cuando un balde se vacía, e-Karú compara lo vendido con su peso. Al cierre de caja, la venta del día se convierte en el pedido sugerido de mañana.',
      lanes: [E.lane('caja', 190, [95]), E.lane('ek', 300, [92, 222]), E.lane('encs', 180, [90])]
    });
    B.ev('S2', 'caja', 1, 'start', 'Se vacía un balde de la vitrina', { lp: 'b', lw: 140 });
    B.t('Kfin', 'caja', 2, 'Escanear el balde vacío («terminado») y el balde nuevo que se abre', 'scan', { w: 196 });
    B.t('Erend', 'ek', 3, 'Compara los gramos vendidos con el peso del código del balde: rendimiento del balde', 'auto', { w: 196 });
    B.gw('Gtol', 'ek', 4, 'xor', '¿Diferencia mayor a la tolerancia?', { lw: 150 });
    B.ev('Eok', 'ek', 5, 'end', 'Rendimiento normal', { lp: 'b', lw: 120 });
    B.t('Eav', 'ek', 5, 'Avisa al encargado: porciones grandes, balde sin registrar o venta sin escanear', 'auto', { row: 1, w: 196 });
    B.t('Hrev', 'encs', 6, 'Revisar con el cajero y registrar la causa', 'user');
    B.ev('Hend', 'encs', 7, 'end', 'Causa registrada (indicador por cajero y sabor)', { lp: 'b', lw: 170 });
    B.ev('Tc', 'ek', 7, 'timer', 'Cierre de caja, cada día', { lp: 'b', lw: 120 });
    B.t('Ecie', 'ek', 8, 'Cierra el día del salón: venta por sabor, Club (socios, sellos y premios) y gramos de cada balde', 'auto', { w: 200 });
    B.ev('Lsug', 'ek', 9.3, 'link', 'Sigue en 0B: pedido sugerido de mañana', { thrw: true, lp: 'r', lw: 150 });
    B.card('Kenc', 'encs', 9.05, { title: 'Lo que ve el encargado en e-Karú', items: ['Rendimiento por balde, sabor y cajero', 'Ventas con y sin Club y ticket promedio', 'Socios a un sello del premio', 'Baldes abiertos, gramos que quedan y vencimientos'], w: 470 });

    B.e('S2', 'Kfin', 'r', 'l');
    B.e('Kfin', 'Erend', 'r', 't');
    B.e('Erend', 'Gtol', 'r', 'l');
    B.e('Gtol', 'Eok', 'r', 'l', { label: 'No' });
    B.e('Gtol', 'Eav', 'b', 'l', { label: 'Sí' });
    B.e('Eav', 'Hrev', 'r', 't', { k: 'msg' });
    B.e('Hrev', 'Hend', 'r', 'l');
    B.e('Tc', 'Ecie', 'r', 'l');
    B.e('Ecie', 'Lsug', 'r', 'l');
  });

  /* ---------- prototipo e-Karú Ventas ---------- */
  const R = (ids) => T.refs('p3h', ids);
  const has = `<div class="card"><div class="kk">YA ESTÁ EN EL PROTOTIPO · e-KARÚ VENTAS</div><h3>Lo que el update ya muestra</h3><ul class="bl">
    <li><b>Grupos con código PADRE:</b> conos, vasos, milkshakes, smoothies y potes. Se escanea el grupo y se descuenta del grupo, no de un código individual.</li>
    <li><b>Sabores distintos y un balde por sabor:</b> Cono 2 = dos sabores, Cono 3 = tres; cada bocha descuenta sus gramos del balde elegido.</li>
    <li><b>Brownie con helado:</b> código del brownie más sabor y balde de helado.</li>
    <li><b>Promo Pack 12 palitos:</b> ID de paquete 23 asociado a los 12 palitos escaneados (2D).</li>
    <li><b>Stock y códigos:</b> baldes, grupos PADRE y productos con su código hijo con fecha de elaboración; movimientos de cada venta.</li></ul></div>`;
  const ideal = `<div class="card"><div class="kk">VERSIÓN IDEAL · PARA LOS DESARROLLADORES</div><h3>Lo que suma la versión final</h3><ol class="ol">
    <li><b>Botón ★ del Club en la misma pantalla de ventas:</b> elegir al socio antes de cobrar ${R(['Ksoc'])}; el sello lo pone la venta ${R(['Evta'])}.</li>
    <li><b>Premio en Gs. 0 que igual descuenta stock:</b> grupo PADRE y gramos de cada balde, con el costo de los premios en un reporte aparte.</li>
    <li><b>Qué compras suman, por grupo PADRE:</b> por ejemplo conos, vasos y milkshakes sí; a definir los potes y el Promo Pack.</li>
    <li><b>Ventas desde Mesas que también sumen sellos</b> (hoy solo suma la caja de mostrador).</li>
    <li><b>Balde terminado y rendimiento por balde</b> ${R(['Kfin', 'Erend'])}.</li>
    <li><b>Mismo lector por prefijos de la página 3</b> en la caja: 22 producto, 29 PADRE, 20 balde (13 o 21 dígitos), con la tabla de transición.</li>
    <li><b>Balde preseleccionado:</b> el último balde abierto de cada sabor ya viene marcado; el cajero solo toca si es otro. Criterio del piloto: tiempo por venta medido contra el de hoy (pág. 16).</li>
    <li><b>Stock del salón en vivo y cierre del día</b> que alimentan el pedido sugerido (0B) y el pronóstico (0A) ${R(['Ecie'])}.</li></ol><div class="note" style="margin-top:16px"><b>Plan B si la caja se hace lenta:</b> el balde se descuenta entero al abrirlo y se pesa lo que queda al cierre; se pierde el detalle por venta pero no el control de merma.</div></div>`;

  /* ---------- Club en Glacé ---------- */
  const rules = `<div class="card"><div class="kk">PROPUESTA PARA EMPEZAR · DECIDE GLACÉ</div><h3>Reglas del Club</h3><div class="clr">
    <span class="rk">Premio</span><span>Un producto, no un porcentaje: por ejemplo, «Juntá 6 sellos y ganá un Cono 2».</span>
    <span class="rk">Sello</span><span>1 por compra que suma, máximo 1 por día; monto mínimo opcional.</span>
    <span class="rk">Vencimiento</span><span>Por ejemplo, 90 días para completar la tarjeta.</span>
    <span class="rk">Bienvenida</span><span>Un sello por sumarse al Club (opcional; hoy se carga socio por socio).</span></div>
    <p style="font-size:14px;line-height:20px;color:#5B6D66">Objetivo corto y premio que dé ganas, como recomienda la presentación del Club. Son estudios de comportamiento, no promesas para cada local.</p></div>`;
  const sees = `<div class="card"><div class="kk">TABLERO DEL CLUB</div><h3>Qué ve Glacé</h3><ul class="bl">
    <li>Ventas con Club y sin Club, y el ticket promedio de cada una.</li>
    <li>Visitas por socio y socios a un sello del premio.</li>
    <li>Socios nuevos, tarjetas activas y sellos por ventas (y los anulados).</li>
    <li>Todo por mes y por local. Cada sello y cada premio tienen una venta detrás: nada «de palabra».</li></ul></div>`;
  const where = `<div class="card"><div class="kk">DÓNDE SE USA</div><h3>Salones y franquicias</h3><ul class="bl">
    <li><b>Salones propios:</b> con la caja e-Karú Ventas de cada salón.</li>
    <li><b>Franquicias:</b> también, cada una con su propia caja e-Karú y el Club con la marca Glacé (caso aparte, página 15).</li>
    <li><b>No se usa</b> en sucursales sin atención al público, mayoristas ni minoristas.</li>
    <li>A definir con e-Karú: una sola tarjeta para toda la marca o una por franquicia (punto ${T.opNo('Club en franquicias: una tarjeta o varias')}).</li></ul></div>`;

  const html = T.head('n3', 'Salones: e-Karú Ventas y e-Karú Club',
    'Fase H e I · La venta al público es donde termina la vida de cada balde. La caja del salón usa el update de e-Karú Ventas (grupos PADRE, sabores y balde por sabor) y el e-Karú Club suma el sello con la misma venta. Lo que se vende vuelve a la fábrica como pedido sugerido y pronóstico.') +
    '<section><div id="dg"></div></section>' +
    T.sec('PROTOTIPO', 'El update de e-Karú Ventas, hoy y en su versión ideal', 'El prototipo (sitio e-Karú Ventas) ya prueba cómo se vende con códigos PADRE. Para el informe final se le suman el Club, el balde terminado y el vínculo con la planificación.', `<div class="two eq">${has}${ideal}</div>`) +
    T.sec('e-KARÚ CLUB', 'El Club en Glacé: «el sello lo pone la venta»', 'El Club ya existe en e-Karú y funciona con su caja. Lo que falta decidir son las reglas de Glacé y cómo entra en las franquicias.', `<div class="three">${rules}${sees}${where}</div>`);
  return T.mount(html, (el) => { el.querySelector('#dg').appendChild(pg.svg); }, { warns: pg.warns, tasks: pg.tasks });
};
})();
