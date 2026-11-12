/* PROCESO 3 · página B — faltantes / Backorder + vida de un balde */
(function () {
'use strict';
const E = window.Eng;
const { S, TXT, LINES, wrap, tw, C, icon } = E;
E.PAGES.p3b = function () {
  const p = E.mk('p3b', '3', {
    num: '3', title: 'Recepción de pedidos y despacho',
    sub: 'Continuación · Qué pasa cuando falta mercadería: el Backorder se resuelve fabricando en la planta o comprando a un distribuidor, y vuelve a la Central listo para un nuevo picking.'
  });

  /* ---------- 3C · faltantes ---------- */
  const D = p.band({
    y: p.headBottom + 26, tag: '3C', title: 'Faltantes: el Backorder se resuelve y vuelve al picking',
    desc: 'El faltante puede nacer al armar el pedido (3A) o al recibirlo en el salón o la sucursal (3B). e-Karú lo clasifica, lo programa y avisa a la Central cuando ya está disponible.',
    lanes: [E.lane('prod', 190, [95]), E.lane('ek', 345, [100, 245]), E.lane('dist', 170, [85]), E.lane('cen', 190, [95])]
  });
  D.ev('Ld', 'ek', 1, 'link', 'D · Faltante o Backorder pendiente (viene de 3A o 3B)', { dy: 72.5, lp: 'b', lw: 150 });
  D.gw('Gs', 'ek', 2, 'or', '¿Qué falta?', { dy: 72.5, lp: 'r', lw: 110 });
  D.t('Eprog', 'ek', 3, 'Suma el faltante al plan como urgente (0B) y avisa a Producción', 'auto');
  D.t('Epo', 'ek', 3, 'Genera la orden de compra al distribuidor (isopor, conos, vasos) y se la envía', 'auto', { row: 1, w: 200 });
  D.sub('Pfab', 'prod', 4, 'Fabricar y envasar el faltante, baldes o cajas (Proceso 2)', { type: 'manual', h: 128 });
  D.t('Dconf', 'dist', 4, 'Confirmar el pedido y entregarlo a Glacé', 'ext', { no: false });
  D.sub('Crec', 'cen', 5, 'Recibir y escanear la entrega del distribuidor (como en 1A)', { type: 'scan', h: 128, w: 190 });
  D.gw('Gj', 'ek', 6, 'or', '', { dy: 72.5 });
  D.t('Tcol', 'cen', 7, 'Escanear los baldes e insumos del Backorder y asignarlos al pedido pendiente', 'scan', { w: 196 });
  D.t('Eready', 'ek', 8, 'Confirma a la Central de Pedidos que el Backorder está disponible («pedido casi listo»)', 'auto', { dy: 72.5, w: 200 });
  D.ev('End', 'ek', 9, 'end', 'Faltante resuelto y disponible: pasa a una nueva Orden de Picking (3A)', { dy: 72.5, lp: 'b', lw: 200 });

  D.e('Ld', 'Gs', 'r', 'l');
  D.e('Gs', 'Eprog', 't', 'l', { label: 'Producción propia' });
  D.e('Gs', 'Epo', 'b', 'l', { label: 'Insumo externo' });
  D.e('Eprog', 'Pfab', 'r', 'b', { k: 'msg' });
  D.e('Epo', 'Dconf', 'r', 't', { k: 'msg' });
  D.e('Pfab', 'Gj', 'r', 't');
  D.e('Dconf', 'Crec', 'r', 't', { k: 'msg' });
  D.e('Crec', 'Gj', 'r', 'b');
  D.e('Gj', 'Tcol', 'r', 't');
  D.e('Tcol', 'Eready', 'r', 'b');
  D.e('Eready', 'End', 'r', 'l');

  /* ---------- 3D · vida de un balde (banda sin carriles) ---------- */
  const M = p.M, W = p.w;
  const y0 = D.bottom + 44;
  const g = S('g', {}, p.svg);
  const tag = '3D', tww = tw(tag, 12.5, 700, 1.2) + 22;
  S('rect', { x: M, y: y0 + 4, width: tww, height: 26, rx: 13, fill: C.ink }, g);
  TXT(g, tag, M + tww / 2, y0 + 21.5, { size: 12.5, weight: 700, fill: '#fff', ls: 1.2 });
  TXT(g, 'Vida de un balde: el mismo código de barras de punta a punta', M + tww + 14, y0 + 25, { size: 21, weight: 700, anchor: 'start', fill: C.ink, ls: -0.2 });
  TXT(g, 'Cada paso se confirma escaneando el balde. e-Karú no necesita QR ni un segundo sistema para saber dónde está y cuánto queda.', M, y0 + 47, { size: 14, anchor: 'start', fill: C.muted });
  const by = y0 + 64, bh = 300;
  S('rect', { x: M, y: by, width: W - 2 * M, height: bh, rx: 4, fill: '#F6F9F7', stroke: C.pool, 'stroke-width': 1.8 }, g);

  // banner
  const bl = 'Mismo código de la balanza en todos los pasos';
  const bw = tw(bl, 14.5, 700) + 70, bx = W / 2 - bw / 2, byy = by + 38;
  S('path', { d: `M${M + 30},${byy}H${W - M - 30}`, stroke: C.ek, 'stroke-width': 1.6, 'stroke-dasharray': '3 5' }, g);
  S('rect', { x: bx, y: byy - 16, width: bw, height: 32, rx: 16, fill: '#fff', stroke: C.ek, 'stroke-width': 1.8 }, g);
  icon(g, 'barcode', bx + 26, byy, C.ek, 1.05);
  TXT(g, bl, bx + 46, byy + 5, { size: 14.5, weight: 700, fill: C.ekDark, anchor: 'start' });

  const steps = [
    { tag: 'PROCESO 2 · PRODUCCIÓN', title: 'Nace en la balanza', desc: 'La balanza pesa el balde e imprime su código. e-Karú lo registra «en control» y lo libera al cerrar la orden (2B).', st: 'Liberado en stock central, con lote' },
    { tag: '3A · PICKING', title: 'Sale por picking', desc: 'La tablet sugiere primero los lotes que vencen antes (FEFO). Cada balde se escanea al recolectarlo.', st: 'Reservado en la Orden de Picking' },
    { tag: '3A · DESPACHO', title: 'Viaja «en tránsito»', desc: 'Al cerrar el picking sale del stock central y queda registrado en la Orden de Despacho.', st: 'En tránsito, fuera del stock central' },
    { tag: '3B · RECEPCIÓN', title: 'Entra al salón o la sucursal', desc: 'Se escanea al llegar. Sube al stock del local solo lo que coincide con la Orden de Despacho.', st: 'En el stock del local' },
    { tag: '3H · VENTA EN EL SALÓN', title: 'Se consume al vender', desc: 'Cada venta descuenta los gramos del balde de cada sabor (60 g por bocha) y suma el sello del Club. Vacío, se escanea como terminado.', st: 'Consumido por gramos; terminado al vaciarse' }
  ];
  const gap = 58, padX = 30, n = steps.length, sw = (W - 2 * M - 2 * padX - (n - 1) * gap) / n, sy = by + 78, sh = 196;
  steps.forEach((s, i) => {
    const x = M + padX + i * (sw + gap);
    S('rect', { x, y: sy, width: sw, height: sh, rx: 14, fill: '#fff', stroke: C.ek, 'stroke-width': 1.8 }, g);
    const pw = tw(s.tag, 11.5, 700, 0.9) + 22;
    S('rect', { x: x + 18, y: sy + 16, width: pw, height: 22, rx: 11, fill: C.ekFill }, g);
    TXT(g, s.tag, x + 18 + pw / 2, sy + 31, { size: 11.5, weight: 700, fill: C.ekDark, ls: 0.9 });
    TXT(g, s.title, x + 18, sy + 69, { size: 19, weight: 700, anchor: 'start', fill: C.ink });
    LINES(g, wrap(s.desc, sw - 36, 14.5, 400), x + 18, sy + 112, { size: 14.5, lh: 19.5, anchor: 'start', fill: C.ink2 });
    S('path', { d: `M${x + 18},${sy + sh - 44}H${x + sw - 18}`, stroke: C.grid, 'stroke-width': 1.2 }, g);
    TXT(g, 'ESTADO', x + 18, sy + sh - 19, { size: 11, weight: 700, anchor: 'start', fill: C.muted, ls: 1.1 });
    TXT(g, s.st, x + 18 + 62, sy + sh - 18.5, { size: 13.5, weight: 700, anchor: 'start', fill: C.ekDark });
    if (i < n - 1) S('path', { d: `M${x + sw + 6},${sy + sh / 2}H${x + sw + gap - 6}`, stroke: C.line, 'stroke-width': 2, 'marker-end': 'url(#ar)' }, g);
  });
  p.legendY = by + bh + 34;

  return E.fin(p);
};
})();
