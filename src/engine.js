/* BPMN-style swimlane diagram engine (browser, SVG). Glacé × e-Karú */
(function () {
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const FONT = '"Inter TT", Inter, "Helvetica Neue", Arial, sans-serif';

const C = {
  ink: '#14231F', ink2: '#33453F', muted: '#5B6D66', faint: '#93A39C',
  line: '#20302B', grid: '#C9D4CF', head: '#E6EEEA', paper: '#FFFFFF', pool: '#8FA29A',
  ek: '#1D7A6B', ekDark: '#0E5247', ekFill: '#D8EDE7', ekLane: '#EEF7F4',
  bal: '#B8801A', balDark: '#74500D', balFill: '#FBEBC8', balLane: '#FEF8E8',
  gc: '#8C2F5F', gcFill: '#F3DFEA', gcLane: '#FBF1F6',
  ext: '#667085', extLane: '#F5F6F6',
  yes: '#2B7A3B', no: '#B3392E'
};

const REG = {};
/* ---------- tiny helpers ---------- */
function S(tag, a, p) {
  const e = document.createElementNS(NS, tag);
  if (a) for (const k in a) { const v = a[k]; if (v !== undefined && v !== null) e.setAttribute(k, v); }
  if (p) p.appendChild(e);
  return e;
}
function TXT(p, s, x, y, o = {}) {
  const t = S('text', {
    x, y, 'font-family': FONT, 'font-size': o.size || 14, 'font-weight': o.weight || 400,
    fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'letter-spacing': o.ls,
    'font-style': o.style
  }, p);
  t.textContent = s;
  return t;
}
function LINES(p, lines, x, cy, o = {}) {
  const size = o.size || 14, lh = o.lh || size * 1.3, n = lines.length;
  const y0 = cy - (n - 1) * lh / 2;
  const t = S('text', {
    'font-family': FONT, 'font-size': size, 'font-weight': o.weight || 400, fill: o.fill || C.ink,
    'text-anchor': o.anchor || 'middle', 'letter-spacing': o.ls, 'font-style': o.style
  }, p);
  lines.forEach((ln, i) => { const ts = S('tspan', { x, y: y0 + i * lh + size * 0.36 }, t); ts.textContent = ln; });
  return t;
}
const _ctx = document.createElement('canvas').getContext('2d');
function tw(s, size = 14, weight = 400, ls = 0) {
  _ctx.font = `${weight} ${size}px ${FONT}`;
  return _ctx.measureText(s).width + ls * s.length;
}
function greedy(words, maxW, size, weight) {
  const out = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (!cur || tw(t, size, weight) <= maxW) cur = t; else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  return out;
}
function wrap(text, maxW, size = 14, weight = 400) {
  const res = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(/ +/).filter(Boolean);
    if (!words.length) { res.push(''); continue; }
    let g = greedy(words, maxW, size, weight);
    const n = g.length;
    if (n > 1) {
      let lo = Math.max(...words.map(w => tw(w, size, weight))), hi = maxW;
      if (lo > hi) lo = hi;
      for (let k = 0; k < 14; k++) { const mid = (lo + hi) / 2; if (greedy(words, mid, size, weight).length <= n) hi = mid; else lo = mid; }
      g = greedy(words, hi + 0.6, size, weight);
    }
    res.push(...g);
  }
  return res;
}
const maxLineW = (lines, size, weight) => Math.max(0, ...lines.map(l => tw(l, size, weight)));

/* ---------- icons (drawn in a 0,0-centred 16px box) ---------- */
function gearPath(r1 = 7.4, r2 = 5.5, n = 8, hole = 2.3) {
  let d = '';
  const t1 = Math.PI / n * 0.64, t2 = Math.PI / n * 0.36;
  const pt = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
  for (let i = 0; i < n; i++) {
    const a = i * 2 * Math.PI / n;
    const pts = [pt(r2, a - t1), pt(r1, a - t2), pt(r1, a + t2), pt(r2, a + t1)];
    pts.forEach((p, j) => { d += (i === 0 && j === 0 ? 'M' : 'L') + p[0].toFixed(2) + ',' + p[1].toFixed(2) + ' '; });
  }
  d += 'Z ';
  d += `M${hole},0 A${hole},${hole} 0 1,0 ${-hole},0 A${hole},${hole} 0 1,0 ${hole},0 Z`;
  return d;
}
function icon(p, kind, cx, cy, col, sc = 1) {
  const g = S('g', { transform: `translate(${cx},${cy}) scale(${sc})` }, p);
  const st = { fill: 'none', stroke: col, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  switch (kind) {
    case 'barcode':
      [[-6.6, 1.3], [-4.3, 0.8], [-2.7, 2.1], [0.2, 0.8], [1.8, 1.7], [4.2, 0.8], [5.7, 1.0]]
        .forEach(([x, w]) => S('rect', { x, y: -5.6, width: w, height: 11.2, fill: col }, g));
      break;
    case 'screen':
      S('rect', { x: -6.6, y: -5.6, width: 13.2, height: 9.4, rx: 1.6, ...st }, g);
      S('path', { d: 'M-3.6,6.6H3.6M0,3.8V6.6', ...st }, g);
      break;
    case 'printer':
      S('rect', { x: -3.8, y: -6.4, width: 7.6, height: 4.6, ...st }, g);
      S('rect', { x: -6.8, y: -1.8, width: 13.6, height: 6.4, rx: 1.6, fill: col, stroke: col, 'stroke-width': 1 }, g);
      S('rect', { x: -3.8, y: 2.0, width: 7.6, height: 4.6, fill: '#fff', stroke: col, 'stroke-width': 1.4 }, g);
      break;
    case 'gear':
      S('path', { d: gearPath(), fill: col, 'fill-rule': 'evenodd' }, g);
      break;
    case 'envelope':
      S('rect', { x: -6.8, y: -4.8, width: 13.6, height: 9.6, rx: 1.2, ...st }, g);
      S('path', { d: 'M-6.8,-4.8L0,1.2L6.8,-4.8', ...st }, g);
      break;
    case 'clock':
      S('circle', { cx: 0, cy: 0, r: 7, ...st }, g);
      S('path', { d: 'M0,-4.2V0L3.4,2', ...st }, g);
      break;
    case 'link':
      S('path', { d: 'M-6,0H3.5M-0.8,-4.6L4.6,0L-0.8,4.6', ...st, 'stroke-width': 1.9 }, g);
      break;
    case 'plus':
      S('path', { d: 'M-8.5,0H8.5M0,-8.5V8.5', ...st, 'stroke-width': 3.4, 'stroke-linecap': 'butt' }, g);
      break;
    case 'x':
      S('path', { d: 'M-6,-6L6,6M6,-6L-6,6', ...st, 'stroke-width': 3, 'stroke-linecap': 'butt' }, g);
      break;
  }
  return g;
}
function badge(p, kind, cx, cy, bg, r = 11.5) {
  S('circle', { cx, cy, r: r + 1.6, fill: '#fff' }, p);
  S('circle', { cx, cy, r, fill: bg }, p);
  icon(p, kind, cx, cy, '#fff', 0.86);
}

/* ---------- task styles ---------- */
const STY = {
  manual: { fill: '#fff', stroke: C.line },
  scan: { fill: '#fff', stroke: C.line, badge: 'barcode', bc: C.ink },
  user: { fill: '#fff', stroke: C.line, badge: 'screen', bc: C.ek },
  print: { fill: '#fff', stroke: C.line, badge: 'printer', bc: C.ink },
  auto: { fill: C.ekFill, stroke: C.ek, badge: 'gear', bc: C.ek },
  bal: { fill: C.balFill, stroke: C.bal, badge: 'gear', bc: C.bal },
  balprint: { fill: C.balFill, stroke: C.bal, badge: 'printer', bc: C.bal },
  gc: { fill: C.gcFill, stroke: C.gc, badge: 'gear', bc: C.gc },
  gcuser: { fill: '#fff', stroke: C.gc, badge: 'screen', bc: C.gc },
  ext: { fill: '#fff', stroke: C.ext },
  extmsg: { fill: '#fff', stroke: C.ext, badge: 'envelope', bc: C.ext }
};
const LANECOL = { ek: C.ekLane, bal: C.balLane, gc: C.gcLane, ext: C.extLane, person: '#FFFFFF' };
const LANEACC = { ek: C.ek, bal: C.bal, gc: C.gc, ext: C.ext, person: C.ink2 };

/* ---------- geometry helpers ---------- */
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function roundedPath(pts, r = 9) {
  let p = [pts[0]];
  for (let i = 1; i < pts.length; i++) if (dist(pts[i], p[p.length - 1]) > 0.05) p.push(pts[i]);
  const q = [p[0]];
  for (let i = 1; i < p.length - 1; i++) {
    const a = q[q.length - 1], b = p[i], c = p[i + 1];
    const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (Math.abs(cr) < 0.5) continue;
    q.push(b);
  }
  q.push(p[p.length - 1]);
  let d = `M${q[0][0].toFixed(1)},${q[0][1].toFixed(1)}`;
  for (let i = 1; i < q.length - 1; i++) {
    const a = q[i - 1], b = q[i], c = q[i + 1];
    const l1 = dist(a, b), l2 = dist(b, c), rr = Math.min(r, l1 / 2, l2 / 2);
    const p1 = [b[0] + (a[0] - b[0]) / l1 * rr, b[1] + (a[1] - b[1]) / l1 * rr];
    const p2 = [b[0] + (c[0] - b[0]) / l2 * rr, b[1] + (c[1] - b[1]) / l2 * rr];
    d += ` L${p1[0].toFixed(1)},${p1[1].toFixed(1)} Q${b[0].toFixed(1)},${b[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  d += ` L${q[q.length - 1][0].toFixed(1)},${q[q.length - 1][1].toFixed(1)}`;
  return { d, pts: q };
}

/* ======================================================= PAGE ======================================================= */
class Page {
  constructor(o) {
    Object.assign(this, { M: 40, LH: 172, taskW: 176, minTaskH: 72, cols: 10, bandGap: 38, fs: 14.5 }, o);
    this.pitch = (this.w - 2 * this.M - this.LH) / this.cols;
    this.svg = S('svg', { xmlns: NS, width: this.w, height: this.h, viewBox: `0 0 ${this.w} ${this.h}`, 'font-family': FONT });
    const defs = S('defs', {}, this.svg);
    const mk = (id, inner, extra = {}) => {
      const m = S('marker', { id, viewBox: '0 0 10 10', refX: 9.4, refY: 5, markerWidth: 11, markerHeight: 11, markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse', ...extra }, defs);
      return m;
    };
    S('path', { d: 'M0,0.5L10,5L0,9.5Z', fill: C.line }, mk('ar'));
    S('path', { d: 'M0.6,0.8L9.4,5L0.6,9.2Z', fill: '#fff', stroke: C.line, 'stroke-width': 1.3, 'stroke-linejoin': 'round' }, mk('arOpen'));
    S('circle', { cx: 5, cy: 5, r: 3.4, fill: '#fff', stroke: C.line, 'stroke-width': 1.3 }, mk('dot', null, { refX: 5 }));
    this.bg = S('rect', { width: this.w, height: this.h, fill: '#fff' }, this.svg);
    this.bands = []; this.counter = 0; this.warns = []; this.tasks = [];
  }
  header({ num, title, sub, tag }) {
    const g = S('g', {}, this.svg), M = this.M;
    S('rect', { x: M, y: M, width: 70, height: 70, rx: 16, fill: C.ink }, g);
    TXT(g, num, M + 35, M + 51, { size: 40, weight: 700, fill: '#fff' });
    TXT(g, title, M + 94, M + 34, { size: 36, weight: 700, anchor: 'start', fill: C.ink, ls: -0.4 });
    LINES(g, wrap(sub, 1500, 17.5, 400), M + 94, M + 63, { size: 17.5, lh: 23, anchor: 'start', fill: C.muted });
    // right tag
    const rx = this.w - M;
    const pw = 214;
    S('rect', { x: rx - pw, y: M + 2, width: pw, height: 30, rx: 15, fill: C.ekFill }, g);
    TXT(g, tag || 'PROCESO IDEAL · TO-BE', rx - pw / 2, M + 22, { size: 13, weight: 700, fill: C.ekDark, ls: 1.1 });
    TXT(g, 'Glacé S.A. · update de e-Karú', rx, M + 54, { size: 14, weight: 600, fill: C.ink2, anchor: 'end' });
    TXT(g, 'Versión 2 · 10/11/2026', rx, M + 73, { size: 13, fill: C.muted, anchor: 'end' });
    S('line', { x1: M, x2: this.w - M, y1: M + 96, y2: M + 96, stroke: C.grid, 'stroke-width': 1.2 }, g);
    this.headBottom = M + 96;
  }
  band(o) { const b = new Band(this, o); this.bands.push(b); return b; }
  render() { for (const b of this.bands) b.render(); }
  legend(y) {
    const g = S('g', {}, this.svg), M = this.M;
    const x0 = M, w = this.w - 2 * M, h = 84;
    S('rect', { x: x0, y, width: w, height: h, rx: 12, fill: '#F6F9F7', stroke: C.grid, 'stroke-width': 1 }, g);
    TXT(g, 'LEYENDA', x0 + 20, y + 28, { size: 12, weight: 700, fill: C.muted, anchor: 'start', ls: 1.4 });
    // row 1: tasks
    let x = x0 + 112, yy = y + 24;
    const item = (draw, label, adv) => { draw(x, yy); TXT(g, label, x + 36, yy + 4.5, { size: 13.5, fill: C.ink2, anchor: 'start' }); x += adv; };
    const miniTask = (fill, stroke, bdg, bc) => (cx, cy) => {
      S('rect', { x: cx - 4, y: cy - 12, width: 30, height: 24, rx: 6, fill, stroke, 'stroke-width': 1.6 }, g);
      if (bdg) { S('circle', { cx: cx - 1, cy: cy - 9, r: 7.5, fill: '#fff' }, g); S('circle', { cx: cx - 1, cy: cy - 9, r: 6.4, fill: bc }, g); icon(g, bdg, cx - 1, cy - 9, '#fff', 0.5); }
    };
    item(miniTask('#fff', C.line), 'Tarea manual', 150);
    item(miniTask('#fff', C.line, 'barcode', C.ink), 'Escaneo de código de barras', 232);
    item(miniTask('#fff', C.line, 'screen', C.ek), 'Persona en pantalla de e-Karú', 246);
    item(miniTask('#fff', C.line, 'printer', C.ink), 'Imprime etiqueta', 168);
    item(miniTask(C.ekFill, C.ek, 'gear', C.ek), 'Automático en e-Karú', 192);
    item(miniTask(C.balFill, C.bal, 'gear', C.bal), 'Balanza (su software)', 192);
    item(miniTask(C.gcFill, C.gc, 'gear', C.gc), 'Glacé Compras', 150);
    item((cx, cy) => {
      S('rect', { x: cx - 4, y: cy - 12, width: 30, height: 24, rx: 6, fill: '#fff', stroke: C.line, 'stroke-width': 1.6 }, g);
      S('rect', { x: cx + 5, y: cy + 3, width: 8, height: 8, fill: '#fff', stroke: C.line, 'stroke-width': 1.2 }, g);
      S('path', { d: `M${cx + 6.5},${cy + 7}h5M${cx + 9},${cy + 4.5}v5`, stroke: C.line, 'stroke-width': 1.2 }, g);
    }, 'Subproceso', 140);
    // row 2: events & gateways & flows
    x = x0 + 112; yy = y + 58;
    item((cx, cy) => S('circle', { cx: cx + 11, cy, r: 9, fill: '#fff', stroke: C.line, 'stroke-width': 1.8 }, g), 'Inicio', 100);
    item((cx, cy) => S('circle', { cx: cx + 11, cy, r: 9, fill: '#fff', stroke: C.line, 'stroke-width': 4 }, g), 'Fin', 90);
    item((cx, cy) => { S('circle', { cx: cx + 11, cy, r: 9, fill: '#fff', stroke: C.line, 'stroke-width': 1.6 }, g); S('circle', { cx: cx + 11, cy, r: 6.4, fill: 'none', stroke: C.line, 'stroke-width': 1.2 }, g); icon(g, 'clock', cx + 11, cy, C.line, 0.55); }, 'Espera', 112);
    item((cx, cy) => { S('circle', { cx: cx + 11, cy, r: 9, fill: '#fff', stroke: C.line, 'stroke-width': 1.6 }, g); S('circle', { cx: cx + 11, cy, r: 6.4, fill: 'none', stroke: C.line, 'stroke-width': 1.2 }, g); icon(g, 'link', cx + 11, cy, C.line, 0.55); }, 'Enlace a otra parte', 190);
    item((cx, cy) => S('path', { d: `M${cx + 11},${cy - 11}l11,11l-11,11l-11,-11z`, fill: '#fff', stroke: C.line, 'stroke-width': 1.8 }, g), 'Decisión', 118);
    item((cx, cy) => { S('path', { d: `M${cx + 11},${cy - 11}l11,11l-11,11l-11,-11z`, fill: '#fff', stroke: C.line, 'stroke-width': 1.8 }, g); icon(g, 'plus', cx + 11, cy, C.line, 0.62); }, 'Paralelo (separa / une)', 218);
    item((cx, cy) => S('path', { d: `M${cx - 2},${cy}H${cx + 26}`, stroke: C.line, 'stroke-width': 1.9, 'marker-end': 'url(#ar)' }, g), 'Flujo', 100);
    item((cx, cy) => S('path', { d: `M${cx - 2},${cy}H${cx + 26}`, stroke: C.line, 'stroke-width': 1.7, 'stroke-dasharray': '6 4', 'marker-start': 'url(#dot)', 'marker-end': 'url(#arOpen)' }, g), 'Mensaje (correo, alerta)', 214);
    item((cx, cy) => { S('rect', { x: cx + 5, y: cy - 11, width: 16, height: 21, rx: 1.5, fill: '#fff', stroke: C.muted, 'stroke-width': 1.3 }, g); }, 'Documento', 130);
    item((cx, cy) => { S('path', { d: `M${cx + 8},${cy - 10}h-6v20h6`, fill: 'none', stroke: C.muted, 'stroke-width': 1.4 }, g); }, 'Nota', 90);
    S('rect', { x: this.w - M - 104, y: y + 12, width: 14, height: 14, rx: 3, fill: C.ekFill, stroke: C.ek }, g);
    return y + h;
  }
}

/* ======================================================= BAND ======================================================= */
class Band {
  constructor(page, o) {
    this.page = page; this.o = o; this.nodes = {}; this.order = []; this.edges = []; this.frames = [];
    this.top = o.y; this.titleH = o.title ? 54 : 0;
    let y = this.top + this.titleH;
    this.lanes = []; this.laneById = {};
    for (const L of o.lanes) {
      const lane = Object.assign({ kind: 'person' }, L, { top: y, bottom: y + L.h });
      lane.rows = L.rows || [L.h / 2];
      this.lanes.push(lane); this.laneById[L.id] = lane; y += L.h;
    }
    this.bottom = y;
  }
  colX(c) { return this.page.M + this.page.LH + (c - 0.5) * this.page.pitch; }
  add(id, n) { if (this.nodes[id]) throw new Error('duplicate node ' + id); n.id = id; n.band = this; this.nodes[id] = n; this.order.push(n); return n; }
  /* shorthand API */
  t(id, lane, col, text, type = 'manual', o = {}) {
    const n = this.add(id, Object.assign({ kind: 'task', lane, col, text, type }, o));
    if (o.no !== false) {
      n.no = o.no || `${this.page.num}.${++this.page.counter}`; this.page.tasks.push(n);
      (REG[this.page.id || this.page.num] = REG[this.page.id || this.page.num] || {})[id] = n.no;
    }
    return n;
  }
  sub(id, lane, col, text, o = {}) { const n = this.t(id, lane, col, text, o.type || 'manual', o); n.kind = 'sub'; return n; }
  ev(id, lane, col, k, label, o = {}) { return this.add(id, Object.assign({ kind: 'event', ek: k, lane, col, label }, o)); }
  gw(id, lane, col, k, label, o = {}) { return this.add(id, Object.assign({ kind: 'gw', gk: k, lane, col, label }, o)); }
  doc(id, lane, col, label, o = {}) { return this.add(id, Object.assign({ kind: 'doc', lane, col, label }, o)); }
  note(id, lane, col, text, o = {}) { return this.add(id, Object.assign({ kind: 'note', lane, col, text }, o)); }
  card(id, lane, col, o = {}) { return this.add(id, Object.assign({ kind: 'card', lane, col }, o)); }
  e(a, b, f, t, o = {}) { this.edges.push(Object.assign({ a, b, f, t }, o)); return this; }
  frame(ids, label, o = {}) { this.frames.push({ ids, label, o }); return this; }

  /* ---- layout ---- */
  layout(n) {
    const P = this.page, lane = this.laneById[n.lane];
    if (!lane) throw new Error('unknown lane ' + n.lane + ' for ' + n.id);
    n.cx = this.colX(n.col) + (n.dx || 0);
    n.cy = lane.top + lane.rows[n.row || 0] + (n.dy || 0);
    if (n.kind === 'task' || n.kind === 'sub') {
      n.w = n.w || P.taskW; n.fs = n.fs || P.fs; n.lh = n.fs * 1.28;
      n.lines = wrap(n.text, n.w - 26, n.fs, 400);
      n.h = Math.max(n.h || 0, P.minTaskH, Math.ceil((n.lines.length * n.lh + 28) / 8) * 8);
      if (n.kind === 'sub') n.h = Math.max(n.h, 84);
      n.hw = n.w / 2; n.hh = n.h / 2;
      if (n.lines.length > 6) P.warns.push(`task ${n.id} has ${n.lines.length} lines`);
    } else if (n.kind === 'event') {
      n.r = n.r || 19; n.hw = n.hh = n.r;
      n.lw = n.lw || 168;
      n.ll = n.label ? wrap(n.label, n.lw, 13.5, 600) : [];
    } else if (n.kind === 'gw') {
      n.half = n.half || 31; n.hw = n.hh = n.half;
      n.lw = n.lw || 172;
      n.ll = n.label ? wrap(n.label, n.lw, 13.5, 600) : [];
    } else if (n.kind === 'doc') {
      n.hw = 19; n.hh = 24;
      n.ll = n.label ? wrap(n.label, n.lw || 130, 13, 500) : [];
    } else if (n.kind === 'card') {
      n.w = n.w || 320; n.fs = n.fs || 14; n.lh = n.fs * 1.38;
      n.tl = wrap(n.title || '', n.w - 40, 15.5, 700);
      n.bl = (n.items || []).map(t => wrap(t, n.w - 62, n.fs, 400));
      const nl = n.bl.reduce((q, l) => q + l.length, 0);
      n.h = 20 + n.tl.length * 20 + 8 + nl * n.lh + Math.max(0, n.bl.length - 1) * 5 + 18;
      n.hw = n.w / 2; n.hh = n.h / 2;
    } else if (n.kind === 'note') {
      n.w = n.w || 210; n.fs = 13; n.lh = 16.5;
      n.lines = wrap(n.text, n.w - 20, 13, 400);
      n.h = n.lines.length * n.lh + 14; n.hw = n.w / 2; n.hh = n.h / 2;
    }
    // label placement
    n.lbl = null;
    if (n.ll && n.ll.length) {
      const lh = 16.4, lw = maxLineW(n.ll, 13.5, 600) + 6, hh = n.ll.length * lh;
      const pos = n.lp || (n.kind === 'event' ? 'b' : (n.kind === 'doc' ? 'b' : 't'));
      let x, y;
      if (pos === 'b') { x = n.cx; y = n.cy + n.hh + 8 + hh / 2; }
      else if (pos === 't') { x = n.cx; y = n.cy - n.hh - 8 - hh / 2; }
      else if (pos === 'r') { x = n.cx + n.hw + 10 + lw / 2; y = n.cy; }
      else { x = n.cx - n.hw - 10 - lw / 2; y = n.cy; }
      x += (n.lx || 0); y += (n.ly || 0);
      n.lbl = { x, y, w: lw, h: hh, lh };
    }
    n.box = { x1: n.cx - n.hw, y1: n.cy - n.hh, x2: n.cx + n.hw, y2: n.cy + n.hh };
  }
  port(n, s) {
    switch (s) {
      case 'r': return [n.cx + n.hw, n.cy];
      case 'l': return [n.cx - n.hw, n.cy];
      case 't': return [n.cx, n.cy - n.hh];
      case 'b': return [n.cx, n.cy + n.hh];
    }
    throw new Error('bad port ' + s);
  }
  /* resolve symbolic coordinate: number | 'cx:id' 'r:id+10' 'lt:LANE' 'lb:LANE' 'lm:LANE' 'row:LANE:k' 'col:3.5' */
  rs(v) {
    if (typeof v === 'number' || v === null || v === undefined) return v;
    const m = /^([a-z]+):([\w.]+?)(?::(\d+))?([+-]\d+(?:\.\d+)?)?$/.exec(v);
    if (!m) throw new Error('bad coord ' + v);
    const [, k, id, extra, off] = m; let val;
    if (k === 'lt') val = this.laneById[id].top;
    else if (k === 'lb') val = this.laneById[id].bottom;
    else if (k === 'lm') val = (this.laneById[id].top + this.laneById[id].bottom) / 2;
    else if (k === 'row') val = this.laneById[id].top + this.laneById[id].rows[+extra];
    else if (k === 'col') val = this.colX(parseFloat(id));
    else {
      const n = this.nodes[id]; if (!n) throw new Error('unknown node in coord ' + v);
      val = ({ cx: n.cx, cy: n.cy, l: n.box.x1, r: n.box.x2, t: n.box.y1, b: n.box.y2 })[k];
    }
    return val + (off ? parseFloat(off) : 0);
  }
  route(ed) {
    const a = this.nodes[ed.a], b = this.nodes[ed.b];
    if (!a || !b) throw new Error(`edge ${ed.a}->${ed.b}: unknown node`);
    const p0 = this.port(a, ed.f), p1 = this.port(b, ed.t);
    let pts;
    if (ed.via) {
      pts = [p0];
      for (const v of ed.via) {
        const prev = pts[pts.length - 1];
        let x = this.rs(v[0]), y = this.rs(v[1]);
        if (x === null || x === undefined) x = prev[0];
        if (y === null || y === undefined) y = prev[1];
        pts.push([x, y]);
      }
      pts.push(p1);
    } else {
      const hf = ed.f === 'r' || ed.f === 'l', ht = ed.t === 'r' || ed.t === 'l';
      if (hf && ht) {
        if (Math.abs(p0[1] - p1[1]) < 0.6) pts = [p0, p1];
        else { const mx = ed.mx !== undefined ? this.rs(ed.mx) : (p0[0] + p1[0]) / 2; pts = [p0, [mx, p0[1]], [mx, p1[1]], p1]; }
      } else if (!hf && !ht) {
        if (Math.abs(p0[0] - p1[0]) < 0.6) pts = [p0, p1];
        else { const my = ed.my !== undefined ? this.rs(ed.my) : (p0[1] + p1[1]) / 2; pts = [p0, [p0[0], my], [p1[0], my], p1]; }
      } else if (hf && !ht) pts = [p0, [p1[0], p0[1]], p1];
      else pts = [p0, [p0[0], p1[1]], p1];
    }
    return pts;
  }

  /* ---- drawing ---- */
  render() {
    const P = this.page, M = P.M, LH = P.LH, W = P.w;
    for (const n of this.order) this.layout(n);
    const root = S('g', {}, P.svg);
    const gL = S('g', {}, root), gF = S('g', {}, root), gE = S('g', {}, root), gN = S('g', {}, root), gT = S('g', {}, root);
    // title
    if (this.o.title) {
      const ty = this.top;
      const tag = this.o.tag || '';
      let x = M;
      if (tag) {
        const tww = tw(tag, 12.5, 700, 1.2) + 22;
        S('rect', { x, y: ty + 4, width: tww, height: 26, rx: 13, fill: C.ink }, gL);
        TXT(gL, tag, x + tww / 2, ty + 21.5, { size: 12.5, weight: 700, fill: '#fff', ls: 1.2 });
        x += tww + 14;
      }
      TXT(gL, this.o.title, x, ty + 25, { size: 21, weight: 700, anchor: 'start', fill: C.ink, ls: -0.2 });
      if (this.o.desc) TXT(gL, this.o.desc, M, ty + 47, { size: 14, anchor: 'start', fill: C.muted });
    }
    // lanes
    const x0 = M, x1 = W - M, ytop = this.top + this.titleH;
    for (const L of this.lanes) {
      S('rect', { x: x0, y: L.top, width: x1 - x0, height: L.h, fill: LANECOL[L.kind] || '#fff' }, gL);
      S('rect', { x: x0, y: L.top, width: LH, height: L.h, fill: C.head }, gL);
      S('rect', { x: x0, y: L.top, width: 7, height: L.h, fill: LANEACC[L.kind] }, gL);
      const nl = wrap(L.name, LH - 38, 15.5, 700), sl = L.sub ? wrap(L.sub, LH - 38, 12.5, 400) : [];
      const th = nl.length * 19 + (sl.length ? 6 + sl.length * 16 : 0);
      let yy = L.top + L.h / 2 - th / 2;
      LINES(gL, nl, x0 + 22, yy + (nl.length * 19) / 2, { size: 15.5, lh: 19, weight: 700, anchor: 'start', fill: C.ink });
      if (sl.length) LINES(gL, sl, x0 + 22, yy + nl.length * 19 + 6 + (sl.length * 16) / 2, { size: 12.5, lh: 16, anchor: 'start', fill: C.muted });
    }
    for (let i = 0; i < this.lanes.length; i++) {
      const L = this.lanes[i];
      S('line', { x1: x0, x2: x1, y1: L.bottom, y2: L.bottom, stroke: C.pool, 'stroke-width': i === this.lanes.length - 1 ? 1.8 : 1.2 }, gL);
    }
    S('line', { x1: x0, x2: x1, y1: ytop, y2: ytop, stroke: C.pool, 'stroke-width': 1.8 }, gL);
    S('line', { x1: x0 + LH, x2: x0 + LH, y1: ytop, y2: this.bottom, stroke: C.pool, 'stroke-width': 1.2 }, gL);
    S('rect', { x: x0, y: ytop, width: x1 - x0, height: this.bottom - ytop, fill: 'none', stroke: C.pool, 'stroke-width': 1.8, rx: 3 }, gL);

    // frames (iteration / grouping)
    for (const f of this.frames) {
      let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
      for (const id of f.ids) {
        const n = this.nodes[id]; if (!n) throw new Error('frame: unknown node ' + id);
        x1 = Math.min(x1, n.box.x1); y1 = Math.min(y1, n.box.y1); x2 = Math.max(x2, n.box.x2); y2 = Math.max(y2, n.box.y2);
        if (n.lbl) { x1 = Math.min(x1, n.lbl.x - n.lbl.w / 2); x2 = Math.max(x2, n.lbl.x + n.lbl.w / 2); y1 = Math.min(y1, n.lbl.y - n.lbl.h / 2); y2 = Math.max(y2, n.lbl.y + n.lbl.h / 2); }
      }
      const pad = f.o.pad === undefined ? 22 : f.o.pad;
      f.box = { x1: x1 - pad - (f.o.pl || 0), y1: y1 - pad - (f.o.pt || 0), x2: x2 + pad + (f.o.pr || 0), y2: y2 + pad + (f.o.pb || 0) };
      const b = f.box;
      S('rect', { x: b.x1, y: b.y1, width: b.x2 - b.x1, height: b.y2 - b.y1, rx: 18, fill: f.o.fill || 'rgba(20,35,31,0.045)', stroke: f.o.stroke || C.muted, 'stroke-width': 1.7, 'stroke-dasharray': '10 6' }, gF);
      const lw = tw(f.label, 13, 700, 0.4) + 44;
      const lpf = f.o.lp || 'tl';
      const tx = lpf.endsWith('r') ? b.x2 - 22 - lw : b.x1 + 22, ty = lpf.startsWith('b') ? b.y2 - 13 : b.y1 - 13;
      f.pill = { x1: tx, y1: ty, x2: tx + lw, y2: ty + 26 };
      S('rect', { x: tx, y: ty, width: lw, height: 26, rx: 13, fill: '#fff', stroke: f.o.stroke || C.muted, 'stroke-width': 1.5 }, gF);
      // loop icon
      const g = S('g', { transform: `translate(${tx + 15},${ty + 13})` }, gF);
      S('path', { d: 'M-5,1.2A5.2,5.2 0 1,1 -1.6,5.3', fill: 'none', stroke: C.ink2, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g);
      S('path', { d: 'M-7.8,-1.4L-5,2.2L-2.4,-1.2Z', fill: C.ink2 }, g);
      TXT(gF, f.label, tx + 28, ty + 17.5, { size: 13, weight: 700, fill: C.ink2, anchor: 'start', ls: 0.4 });
    }
    // edges
    for (const ed of this.edges) {
      ed.pts = this.route(ed);
      const style = ed.k || 'seq';
      const rp = roundedPath(ed.pts, ed.r || 9);
      ed.q = rp.pts;
      const a = { d: rp.d, fill: 'none', stroke: ed.c || C.line, 'stroke-linejoin': 'round' };
      if (style === 'seq') Object.assign(a, { 'stroke-width': 1.9, 'marker-end': 'url(#ar)' });
      else if (style === 'msg') Object.assign(a, { 'stroke-width': 1.7, 'stroke-dasharray': '7 5', 'marker-start': 'url(#dot)', 'marker-end': 'url(#arOpen)' });
      else if (style === 'assoc') Object.assign(a, { stroke: C.muted, 'stroke-width': 1.4, 'stroke-dasharray': '2.2 4' });
      S('path', a, gE);
    }
    // nodes
    for (const n of this.order) this.drawNode(n, gN, gT);
    // edge labels
    for (const ed of this.edges) if (ed.label) this.drawEdgeLabel(ed, gT);
    this.check();
  }
  drawNode(n, gN, gT) {
    const P = this.page;
    if (n.kind === 'task' || n.kind === 'sub') {
      const st = STY[n.type] || STY.manual;
      const x = n.cx - n.hw, y = n.cy - n.hh;
      const g = S('g', { 'data-id': n.id }, gN);
      S('rect', { x, y, width: n.w, height: n.h, rx: 11, fill: n.fill || st.fill, stroke: n.stroke || st.stroke, 'stroke-width': n.kind === 'sub' ? 2.6 : 2 }, g);
      const tx = n.cx, ty = n.cy - (n.kind === 'sub' ? 5 : 0);
      LINES(g, n.lines, tx, ty + 1, { size: n.fs, lh: n.lh, weight: 400, fill: C.ink });
      if (n.kind === 'sub') {
        const bx = n.cx - 8, by = n.cy + n.hh - 22;
        S('rect', { x: bx, y: by, width: 16, height: 16, fill: '#fff', stroke: C.line, 'stroke-width': 1.4 }, g);
        S('path', { d: `M${bx + 3.5},${by + 8}h9M${bx + 8},${by + 3.5}v9`, stroke: C.line, 'stroke-width': 1.4 }, g);
      }
      if (st.badge) badge(g, st.badge, x + 3, y + 3, n.bc || st.bc);
      if (n.no) {
        const s = String(n.no), w = tw(s, 11.5, 700) + 12;
        S('rect', { x: x + n.w - w - 9, y: y - 9.5, width: w, height: 19, rx: 9.5, fill: C.ink }, g);
        TXT(g, s, x + n.w - w / 2 - 9, y + 4, { size: 11.5, weight: 700, fill: '#fff' });
      }
    } else if (n.kind === 'event') {
      const g = S('g', { 'data-id': n.id }, gN);
      const k = n.ek, r = n.r;
      if (k === 'end') S('circle', { cx: n.cx, cy: n.cy, r, fill: '#fff', stroke: C.line, 'stroke-width': 5 }, g);
      else {
        S('circle', { cx: n.cx, cy: n.cy, r, fill: n.fill || '#fff', stroke: C.line, 'stroke-width': k === 'start' || k === 'msg' ? 2.2 : 1.8 }, g);
        if (k === 'timer' || k === 'link' || k === 'mid') S('circle', { cx: n.cx, cy: n.cy, r: r - 4.2, fill: n.thrw ? C.line : 'none', stroke: C.line, 'stroke-width': 1.5 }, g);
        if (k === 'timer') icon(g, 'clock', n.cx, n.cy, C.line, 0.78);
        if (k === 'link') icon(g, 'link', n.cx, n.cy, n.thrw ? '#fff' : C.line, 0.78);
        if (k === 'msg') icon(g, 'envelope', n.cx, n.cy, C.line, 0.86);
      }
      this.drawLbl(n, gT);
    } else if (n.kind === 'gw') {
      const g = S('g', { 'data-id': n.id }, gN), h = n.half;
      S('path', { d: `M${n.cx},${n.cy - h}L${n.cx + h},${n.cy}L${n.cx},${n.cy + h}L${n.cx - h},${n.cy}Z`, fill: '#fff', stroke: C.line, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
      if (n.gk === 'and') icon(g, 'plus', n.cx, n.cy, C.line, 1.0);
      if (n.gk === 'or') S('circle', { cx: n.cx, cy: n.cy, r: 12.5, fill: 'none', stroke: C.line, 'stroke-width': 2.4 }, g);
      this.drawLbl(n, gT);
    } else if (n.kind === 'doc') {
      const g = S('g', { 'data-id': n.id }, gN), x = n.cx - n.hw, y = n.cy - n.hh, w = 2 * n.hw, h = 2 * n.hh, f = 11;
      S('path', { d: `M${x},${y}H${x + w - f}L${x + w},${y + f}V${y + h}H${x}Z`, fill: '#fff', stroke: C.muted, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, g);
      S('path', { d: `M${x + w - f},${y}V${y + f}H${x + w}`, fill: 'none', stroke: C.muted, 'stroke-width': 1.4 }, g);
      S('path', { d: `M${x + 6},${y + 20}H${x + w - 6}M${x + 6},${y + 27}H${x + w - 6}M${x + 6},${y + 34}H${x + w - 12}`, stroke: C.faint, 'stroke-width': 1.3 }, g);
      this.drawLbl(n, gT, 500);
    } else if (n.kind === 'card') {
      const g = S('g', { 'data-id': n.id }, gN), x = n.cx - n.hw, y = n.cy - n.hh, ac = n.stroke || C.ek;
      S('rect', { x, y, width: n.w, height: n.h, rx: 14, fill: n.fill || '#fff', stroke: ac, 'stroke-width': 1.8 }, g);
      let yy = y + 20 + 10;
      n.tl.forEach((ln) => { TXT(g, ln, x + 20, yy, { size: 15.5, weight: 700, fill: n.tc || C.ink, anchor: 'start' }); yy += 20; });
      yy += 8 - 4;
      n.bl.forEach((lines, i) => {
        S('circle', { cx: x + 26, cy: yy + 3.2, r: 2.6, fill: ac }, g);
        lines.forEach((ln) => { TXT(g, ln, x + 38, yy + n.fs * 0.36 + 3.2, { size: n.fs, fill: C.ink2, anchor: 'start' }); yy += n.lh; });
        yy += 5;
      });
    } else if (n.kind === 'note') {
      const g = S('g', { 'data-id': n.id }, gN), x = n.cx - n.hw, y = n.cy - n.hh;
      S('path', { d: `M${x + 9},${y}H${x}V${y + n.h}H${x + 9}`, fill: 'none', stroke: C.muted, 'stroke-width': 1.5 }, g);
      LINES(g, n.lines, x + 14, n.cy, { size: 13, lh: n.lh, anchor: 'start', fill: C.ink2 });
    }
  }
  drawLbl(n, gT, weight = 600) {
    if (!n.lbl) return;
    const l = n.lbl;
    S('rect', { x: l.x - l.w / 2 - 2, y: l.y - l.h / 2 - 1, width: l.w + 4, height: l.h + 2, rx: 4, fill: n.lbg || 'none' }, gT);
    LINES(gT, n.ll, l.x, l.y, { size: n.kind === 'doc' ? 13 : 13.5, lh: l.lh, weight, fill: n.kind === 'doc' ? C.ink2 : C.ink });
  }
  drawEdgeLabel(ed, gT) {
    const q = ed.q, s0 = q[0], s1 = q[1];
    const horiz = Math.abs(s1[1] - s0[1]) < 0.5, dirx = Math.sign(s1[0] - s0[0]), diry = Math.sign(s1[1] - s0[1]);
    const col = ed.lc || (/^(Sí|Si)/.test(ed.label) ? C.yes : (/^No/.test(ed.label) ? C.no : C.ink2));
    const w = tw(ed.label, 13.5, 700) + 8;
    let x, y, anchor = 'start';
    if (ed.lpos) { x = ed.lpos[0]; y = ed.lpos[1]; anchor = ed.lanchor || 'middle'; }
    else if (horiz) { x = s0[0] + dirx * 14 + (dirx < 0 ? -w + 8 : 0); y = s0[1] - 8; anchor = 'start'; x = dirx < 0 ? s0[0] - 14 : s0[0] + 14; anchor = dirx < 0 ? 'end' : 'start'; }
    else { x = s0[0] + 9; y = s0[1] + diry * 18 + (diry < 0 ? -2 : 6); anchor = 'start'; }
    if (ed.ldx) x += ed.ldx; if (ed.ldy) y += ed.ldy;
    const bx = anchor === 'start' ? x - 3 : (anchor === 'end' ? x - w + 3 : x - w / 2);
    S('rect', { x: bx, y: y - 12.5, width: w, height: 17, rx: 4, fill: '#fff', 'fill-opacity': 0.92 }, gT);
    TXT(gT, ed.label, x, y, { size: 13.5, weight: 700, fill: col, anchor });
    ed.lbox = { x1: bx, y1: y - 12.5, x2: bx + w, y2: y + 4.5 };
  }

  /* ---- automatic checks ---- */
  check() {
    const P = this.page, W = P.warns, tag = `[${this.o.tag || this.o.title}]`;
    const obs = [];
    for (const n of this.order) {
      if (n.kind === 'note' && !n.solid) { obs.push({ id: n.id, ...n.box, soft: true }); continue; }
      obs.push({ id: n.id, ...n.box });
      if (n.lbl) obs.push({ id: n.id + '.label', x1: n.lbl.x - n.lbl.w / 2, x2: n.lbl.x + n.lbl.w / 2, y1: n.lbl.y - n.lbl.h / 2, y2: n.lbl.y + n.lbl.h / 2 });
    }
    // frames must not clip foreign nodes
    for (const f of this.frames) for (const n of this.order) {
      if (f.ids.includes(n.id)) continue;
      const bb = n.box, fb = f.box;
      if (bb.x1 < fb.x2 && bb.x2 > fb.x1 && bb.y1 < fb.y2 && bb.y2 > fb.y1) W.push(`${tag} frame '${f.label}' overlaps foreign node ${n.id}`);
    }
    // node/node overlap
    for (let i = 0; i < obs.length; i++) for (let j = i + 1; j < obs.length; j++) {
      const a = obs[i], b = obs[j];
      if (a.id.split('.')[0] === b.id.split('.')[0]) continue;
      if (a.x1 < b.x2 - 1 && b.x1 < a.x2 - 1 && a.y1 < b.y2 - 1 && b.y1 < a.y2 - 1) W.push(`${tag} overlap: ${a.id} / ${b.id}`);
    }
    // lane containment
    for (const n of this.order) {
      const L = this.laneById[n.lane], bb = n.box;
      if (bb.y1 < L.top + 1 || bb.y2 > L.bottom - 1) W.push(`${tag} node ${n.id} leaves lane ${n.lane} (${Math.round(bb.y1 - L.top)}..${Math.round(bb.y2 - L.top)} of ${L.h})`);
      if (n.lbl && (n.lbl.y - n.lbl.h / 2 < L.top - 0.5 || n.lbl.y + n.lbl.h / 2 > L.bottom + 0.5)) W.push(`${tag} label of ${n.id} leaves lane ${n.lane}`);
      if (bb.x2 > P.w - P.M || bb.x1 < P.M + P.LH) W.push(`${tag} node ${n.id} outside content area`);
    }
    // edges vs obstacles
    const segs = [];
    this.edges.forEach((ed, ei) => {
      const q = ed.q;
      for (let i = 0; i < q.length - 1; i++) {
        const a = q[i], b = q[i + 1];
        segs.push({ ei, ed, a, b, h: Math.abs(a[1] - b[1]) < 0.5, i });
        const x1 = Math.min(a[0], b[0]), x2 = Math.max(a[0], b[0]), y1 = Math.min(a[1], b[1]), y2 = Math.max(a[1], b[1]);
        for (const o of obs) {
          if (o.soft && ed.k === 'assoc') continue;
          if (o.id === ed.a || o.id === ed.b || o.id.startsWith(ed.a + '.') && false) continue;
          const eps = 1.5;
          if (x2 > o.x1 + eps && x1 < o.x2 - eps && y2 > o.y1 + eps && y1 < o.y2 - eps) W.push(`${tag} edge ${ed.a}->${ed.b} passes through ${o.id}`);
        }
        // own endpoints: segment must not run inside own node (other than at its port)
        for (const own of [ed.a, ed.b]) {
          const n = this.nodes[own], bb = n.box, eps = 3;
          if (x2 > bb.x1 + eps && x1 < bb.x2 - eps && y2 > bb.y1 + eps && y1 < bb.y2 - eps) W.push(`${tag} edge ${ed.a}->${ed.b} runs inside its own node ${own}`);
        }
      }
    });
    // edge/edge overlaps and crossings
    let cross = 0;
    for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
      const s = segs[i], t = segs[j];
      if (s.ei === t.ei) continue;
      if (s.ed.k === 'assoc' || t.ed.k === 'assoc') continue;
      if (s.h && t.h) {
        if (Math.abs(s.a[1] - t.a[1]) < 2) {
          const lo = Math.max(Math.min(s.a[0], s.b[0]), Math.min(t.a[0], t.b[0])), hi = Math.min(Math.max(s.a[0], s.b[0]), Math.max(t.a[0], t.b[0]));
          if (hi - lo > 6) W.push(`${tag} edges overlap (h): ${s.ed.a}->${s.ed.b} & ${t.ed.a}->${t.ed.b} at y=${Math.round(s.a[1])}`);
        }
      } else if (!s.h && !t.h) {
        if (Math.abs(s.a[0] - t.a[0]) < 2) {
          const lo = Math.max(Math.min(s.a[1], s.b[1]), Math.min(t.a[1], t.b[1])), hi = Math.min(Math.max(s.a[1], s.b[1]), Math.max(t.a[1], t.b[1]));
          if (hi - lo > 6) W.push(`${tag} edges overlap (v): ${s.ed.a}->${s.ed.b} & ${t.ed.a}->${t.ed.b} at x=${Math.round(s.a[0])}`);
        }
      } else {
        const h = s.h ? s : t, v = s.h ? t : s;
        const hx1 = Math.min(h.a[0], h.b[0]), hx2 = Math.max(h.a[0], h.b[0]), vy1 = Math.min(v.a[1], v.b[1]), vy2 = Math.max(v.a[1], v.b[1]);
        if (v.a[0] > hx1 + 2 && v.a[0] < hx2 - 2 && h.a[1] > vy1 + 2 && h.a[1] < vy2 - 2) { cross++; W.push(`${tag} edges cross: ${h.ed.a}->${h.ed.b} x ${v.ed.a}->${v.ed.b} at (${Math.round(v.a[0])},${Math.round(h.a[1])})`); }
      }
    }
    // frame label pills must stay free of edges
    for (const f of this.frames) {
      if (!f.pill) continue;
      for (const sg of segs) {
        const x1 = Math.min(sg.a[0], sg.b[0]), x2 = Math.max(sg.a[0], sg.b[0]), y1 = Math.min(sg.a[1], sg.b[1]), y2 = Math.max(sg.a[1], sg.b[1]);
        if (x2 > f.pill.x1 - 2 && x1 < f.pill.x2 + 2 && y2 > f.pill.y1 - 2 && y1 < f.pill.y2 + 2) W.push(`${tag} frame label '${f.label}' touched by edge ${sg.ed.a}->${sg.ed.b}`);
      }
    }
    // edge labels vs obstacles/edges
    for (const ed of this.edges) {
      if (!ed.lbox) continue;
      const lb = ed.lbox;
      for (const o of obs) {
        if (lb.x2 > o.x1 && lb.x1 < o.x2 && lb.y2 > o.y1 && lb.y1 < o.y2) W.push(`${tag} label '${ed.label}' (${ed.a}->${ed.b}) overlaps ${o.id}`);
      }
      for (const s of segs) {
        if (s.ei === this.edges.indexOf(ed)) continue;
        const x1 = Math.min(s.a[0], s.b[0]), x2 = Math.max(s.a[0], s.b[0]), y1 = Math.min(s.a[1], s.b[1]), y2 = Math.max(s.a[1], s.b[1]);
        if (lb.x2 > x1 - 1 && lb.x1 < x2 + 1 && lb.y2 > y1 - 1 && lb.y1 < y2 + 1) W.push(`${tag} label '${ed.label}' (${ed.a}->${ed.b}) touches edge ${s.ed.a}->${s.ed.b}`);
      }
    }
  }
}

window.Eng = { Page, Band, C, S, TXT, LINES, tw, wrap, maxLineW, icon, badge, FONT, STY, roundedPath, REG, LANECOL, LANEACC };
})();
