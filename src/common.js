/* shared helpers for all diagram pages */
(function () {
'use strict';
const E = window.Eng;
E.PAGES = {};
E.COUNT = {};
E.W = 2600;

const LN = {
  prov: { name: 'Proveedor', sub: 'externo', kind: 'ext' },
  sup: { name: 'Proveedor', sub: 'externo', kind: 'ext' },
  dep: { name: 'Encargado de Depósito', sub: 'escáner y tablet', kind: 'person' },
  adm: { name: 'Compras / Administración', sub: 'carga las facturas', kind: 'person' },
  ek: { name: 'e-Karú', sub: 'sistema único', kind: 'ek' },
  cli: { name: 'Cliente', sub: 'mayorista, minorista o franquicia', kind: 'ext' },
  ven: { name: 'Administración / Ventas', sub: 'pedido y factura del cliente', kind: 'person' },
  sifen: { name: 'SIFEN (DNIT)', sub: 'valida y aprueba los documentos', kind: 'ext' },
  con: { name: 'Cliente en consignación', sub: 'minorista o franquicia · vende al público', kind: 'person' },
  des: { name: 'Local o cliente que recibe', sub: 'salón, sucursal o cliente', kind: 'person' },
  plant: { name: 'Operario de Planta', sub: 'tablet y escáner', kind: 'person' },
  bal: { name: 'Balanza', sub: 'Mettler Toledo: su software y su impresora', kind: 'bal' },
  suc: { name: 'Salones y sucursales', sub: 'locales propios de Glacé · tablet y escáner', kind: 'person' },
  caja: { name: 'Cajero/a del salón', sub: 'caja e-Karú Ventas y escáner', kind: 'person' },
  clis: { name: 'Cliente del salón', sub: 'con o sin tarjeta del Club en el celular', kind: 'ext' },
  encs: { name: 'Encargado/a del salón', sub: 'tablet', kind: 'person' },
  cen: { name: 'Operario del Depósito Central', sub: 'tablet y escáner', kind: 'person' },
  prod: { name: 'Producción', sub: 'planta', kind: 'person' },
  dist: { name: 'Distribuidores', sub: 'externo · insumos que Glacé no fabrica', kind: 'ext' },
  can: { name: 'Canales de venta', sub: 'cajas de salones y franquicias, pedidos de sucursales y clientes', kind: 'person' },
  plan: { name: 'Planificación', sub: 'encargado de producción y compras', kind: 'person' }
};
E.lane = (id, h, rows, over = {}) => Object.assign({ id }, LN[id], { h, rows }, over);

E.mk = function (id, num, hdr, o = {}) {
  const p = new E.Page(Object.assign({ w: E.W, h: 2000, num, id, cols: 10, taskW: 180, fs: 15 }, o));
  p.counter = E.COUNT[num] || 0;
  p.header(hdr);
  return p;
};
E.fin = function (p, gap = 34) {
  const last = p.bands[p.bands.length - 1];
  p.render();
  const ly = (p.legendY !== undefined ? p.legendY : last.bottom + gap);
  const lb = p.legend(ly);
  p.h = lb + p.M + 6;
  p.svg.setAttribute('height', p.h);
  p.svg.setAttribute('viewBox', `0 0 ${p.w} ${p.h}`);
  p.bg.setAttribute('height', p.h);
  E.COUNT[p.num] = p.counter;
  return p;
};
})();

/* ---------- legend (replaces the engine's first version) ---------- */
(function () {
'use strict';
const E = window.Eng, { S, TXT, tw, icon, C } = E;
E.Page.prototype.legend = function (y) {
  const g = S('g', {}, this.svg), M = this.M, x0 = M, w = this.w - 2 * M, h = 100;
  S('rect', { x: x0, y, width: w, height: h, rx: 12, fill: '#F6F9F7', stroke: C.grid, 'stroke-width': 1 }, g);
  TXT(g, 'LEYENDA', x0 + 22, y + 34, { size: 12, weight: 700, fill: C.muted, anchor: 'start', ls: 1.4 });
  TXT(g, 'Cómo leer el diagrama', x0 + 22, y + 52, { size: 12.5, fill: C.faint, anchor: 'start' });
  const task = (fill, stroke, bdg, bc, extra) => ({
    iw: 36, draw: (x, cy) => {
      S('rect', { x, y: cy - 12, width: 36, height: 24, rx: 6, fill, stroke, 'stroke-width': 1.6 }, g);
      if (bdg) { S('circle', { cx: x + 2, cy: cy - 10, r: 8.4, fill: '#fff' }, g); S('circle', { cx: x + 2, cy: cy - 10, r: 7.2, fill: bc }, g); icon(g, bdg, x + 2, cy - 10, '#fff', 0.55); }
      if (extra) extra(x, cy);
    }
  });
  const circ = (sw, inner, thrw, ic) => ({
    iw: 22, draw: (x, cy) => {
      S('circle', { cx: x + 11, cy, r: 10, fill: '#fff', stroke: C.line, 'stroke-width': sw }, g);
      if (inner) S('circle', { cx: x + 11, cy, r: 7, fill: thrw ? C.line : 'none', stroke: C.line, 'stroke-width': 1.3 }, g);
      if (ic) icon(g, ic, x + 11, cy, thrw ? '#fff' : C.line, 0.6);
    }
  });
  const dia = (kind) => ({
    iw: 26, draw: (x, cy) => {
      S('path', { d: `M${x + 13},${cy - 13}l13,13l-13,13l-13,-13z`, fill: '#fff', stroke: C.line, 'stroke-width': 1.9 }, g);
      if (kind === 'and') icon(g, 'plus', x + 13, cy, C.line, 0.62);
      if (kind === 'or') S('circle', { cx: x + 13, cy, r: 6.4, fill: 'none', stroke: C.line, 'stroke-width': 1.9 }, g);
    }
  });
  const row0 = [
    ['Tarea manual (persona)', task('#fff', C.line)],
    ['Escaneo de código de barras', task('#fff', C.line, 'barcode', C.ink)],
    ['Persona en pantalla de e-Karú', task('#fff', C.line, 'screen', C.ek)],
    ['Imprime etiqueta', task('#fff', C.line, 'printer', C.ink)],
    ['Automático en e-Karú', task(C.ekFill, C.ek, 'gear', C.ek)],
    ['Balanza (su software e impresora)', task(C.balFill, C.bal, 'gear', C.bal)],
    ['Externo / proveedor', task('#fff', C.ext)],
    ['Subproceso', task('#fff', C.line, null, null, (x, cy) => {
      S('rect', { x: x + 14, y: cy + 1, width: 9, height: 9, fill: '#fff', stroke: C.line, 'stroke-width': 1.2 }, g);
      S('path', { d: `M${x + 15.8},${cy + 5.5}h5.4M${x + 18.5},${cy + 2.8}v5.4`, stroke: C.line, 'stroke-width': 1.2 }, g);
    })],
    ['N.º de paso', { iw: 30, draw: (x, cy) => { S('rect', { x, y: cy - 9.5, width: 30, height: 19, rx: 9.5, fill: C.ink }, g); TXT(g, '1.4', x + 15, cy + 4, { size: 11.5, weight: 700, fill: '#fff' }); } }]
  ];
  const row1 = [
    ['Inicio', circ(2.2)],
    ['Fin', circ(5)],
    ['Espera', circ(1.8, true, false, 'clock')],
    ['Enlace: viene de otro bloque', circ(1.8, true, false, 'link')],
    ['Enlace: sigue en otro bloque', circ(1.8, true, true, 'link')],
    ['Decisión', dia()],
    ['Una o más salidas', dia('or')],
    ['Paralelo (separa / une)', dia('and')],
    ['Flujo', { iw: 34, draw: (x, cy) => S('path', { d: `M${x},${cy}H${x + 34}`, stroke: C.line, 'stroke-width': 1.9, 'marker-end': 'url(#ar)' }, g) }],
    ['Mensaje (correo, alerta, camión)', { iw: 34, draw: (x, cy) => S('path', { d: `M${x},${cy}H${x + 34}`, stroke: C.line, 'stroke-width': 1.7, 'stroke-dasharray': '6 4', 'marker-start': 'url(#dot)', 'marker-end': 'url(#arOpen)' }, g) }],
    ['Documento', { iw: 20, draw: (x, cy) => S('path', { d: `M${x},${cy - 12}h12l8,8v16h-20z`, fill: '#fff', stroke: C.muted, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, g) }],
    ['Se repite por cada ítem', { iw: 38, draw: (x, cy) => S('rect', { x, y: cy - 11, width: 38, height: 22, rx: 6, fill: 'rgba(20,35,31,0.045)', stroke: C.muted, 'stroke-width': 1.5, 'stroke-dasharray': '5 3' }, g) }]
  ];
  const lay = (items, cy) => {
    let x = x0 + 190;
    const gaps = [];
    for (const [label, it] of items) {
      it.draw(x, cy);
      const tx = x + it.iw + 10;
      TXT(g, label, tx, cy + 4.6, { size: 13.5, fill: C.ink2, anchor: 'start' });
      x = tx + tw(label, 13.5, 400) + 30;
    }
    return x;
  };
  const xe0 = lay(row0, y + 31), xe1 = lay(row1, y + 70);
  E.legendMaxX = Math.max(xe0, xe1);
  return y + h;
};
})();
