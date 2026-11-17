/* Páginas de texto: Vista general · Códigos de barras · Qué debe hacer e-Karú (+ API E.TP para las páginas híbridas 2E, 3E y 3F/3G) */
(function () {
'use strict';
const E = window.Eng;
const { S, TXT, LINES, wrap, tw, C, FONT, icon, REG } = E;
const MONO = '"DejaVu Sans Mono", "Liberation Mono", Menlo, Consolas, monospace';

/* ------------------------------------------------------------------ CSS */
const CSS = `
.tp{width:2600px;background:#fff;color:#14231F;font-family:"Inter TT",Inter,"Helvetica Neue",Arial,sans-serif;padding:0 40px 46px;box-sizing:border-box;-webkit-font-smoothing:antialiased}
.tp *{box-sizing:border-box}
.tp .hd{position:relative;height:136px;border-bottom:1.2px solid #C9D4CF;margin-bottom:30px}
.tp .nb{position:absolute;left:0;top:40px;width:70px;height:70px;border-radius:16px;background:#14231F;display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;line-height:1;font-weight:700}
.tp h1{position:absolute;left:94px;top:38px;margin:0;font-size:36px;line-height:44px;font-weight:700;letter-spacing:-.4px}
.tp .sub{position:absolute;left:94px;top:86px;margin:0;width:1640px;font-size:17.5px;line-height:23px;color:#5B6D66}
.tp .tag{position:absolute;right:0;top:42px;width:214px;height:30px;border-radius:15px;background:#D8EDE7;color:#0E5247;font-size:13px;font-weight:700;letter-spacing:1.1px;display:flex;align-items:center;justify-content:center}
.tp .r1{position:absolute;right:0;top:78px;font-size:14px;font-weight:600;color:#33453F}
.tp .r2{position:absolute;right:0;top:98px;font-size:13px;color:#5B6D66}
.tp section{margin-bottom:40px}
.tp .st{display:flex;align-items:center;gap:14px;margin:0 0 4px}
.tp .pill{display:inline-flex;align-items:center;height:26px;padding:0 11px;border-radius:13px;background:#14231F;color:#fff;font-size:12.5px;font-weight:700;letter-spacing:1.2px;white-space:nowrap}
.tp h2{margin:0;font-size:21px;line-height:26px;font-weight:700;letter-spacing:-.2px}
.tp .sd{margin:0 0 18px;font-size:14px;line-height:19px;color:#5B6D66}
.tp .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.tp .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.tp .grid5{display:grid;grid-template-columns:repeat(5,1fr);gap:24px}
.tp .card{background:#fff;border:1.8px solid #1D7A6B;border-radius:14px;padding:22px 26px 24px}
.tp .card h3{margin:0 0 9px;font-size:19.5px;line-height:25px;font-weight:700;letter-spacing:-.1px}
.tp .card p{margin:0;font-size:15.5px;line-height:23px;color:#33453F}
.tp .pr{display:flex;gap:18px;align-items:flex-start}
.tp .pr .n{flex:0 0 40px;height:40px;border-radius:20px;background:#1D7A6B;color:#fff;font-size:19px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px}
.tp .flow{display:grid;grid-template-columns:1fr 56px 1fr 56px 1fr;align-items:stretch}
.tp .flow .ar{display:flex;align-items:center;justify-content:center}
.tp .proc{background:#fff;border:1.8px solid #14231F;border-radius:16px;padding:0;display:flex;flex-direction:column;overflow:hidden}
.tp .proc .ph{display:flex;align-items:center;gap:16px;padding:20px 26px 0}
.tp .proc .ph .big{flex:0 0 52px;height:52px;border-radius:13px;background:#14231F;color:#fff;font-size:28px;font-weight:700;display:flex;align-items:center;justify-content:center}
.tp .proc .ph h3{margin:0;font-size:23px;line-height:28px;font-weight:700;letter-spacing:-.2px}
.tp .proc .pb{padding:14px 26px 24px;display:flex;flex-direction:column;gap:14px;flex:1}
.tp .proc p{margin:0;font-size:15.5px;line-height:23px;color:#33453F}
.tp .lbl{font-size:11.5px;font-weight:700;letter-spacing:1.2px;color:#5B6D66;margin:0 0 7px}

.tp .chips{display:flex;flex-wrap:wrap;gap:8px}
.tp .chip{display:inline-flex;align-items:center;gap:8px;min-height:28px;padding:3px 12px;border-radius:14px;background:#F1F5F3;border:1px solid #C9D4CF;font-size:13.5px;font-weight:600;color:#33453F;white-space:nowrap}
.tp .chip b{font-weight:700;color:#14231F}
.tp .dot{display:inline-block;width:10px;height:10px;border-radius:5px}
.tp .res{margin-top:auto;padding:13px 16px;border-radius:10px;background:#EEF7F4;border:1px solid #BFE0D6;font-size:14.5px;line-height:21px;color:#0E5247;font-weight:600}
.tp table.tbl{width:100%;border-collapse:separate;border-spacing:0;font-size:15.5px;line-height:22px;border:1.8px solid #8FA29A;border-radius:12px;overflow:hidden}
.tp .tbl th{background:#E6EEEA;text-align:left;font-size:12.5px;letter-spacing:1.1px;font-weight:700;color:#33453F;padding:12px 20px}
.tp .tbl td{padding:15px 20px;border-top:1px solid #D5DFDA;vertical-align:top;color:#33453F}
.tp .tbl td.k{font-weight:700;color:#14231F}
.tp .tbl td.old{color:#7A5A57}
.tp .tbl .strike{text-decoration:line-through;text-decoration-color:#B3392E;text-decoration-thickness:2px}
.tp .tbl tr.al td{background:#FAFCFB}
.tp .two{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start}
.tp .two.eq{align-items:stretch}
.tp .three{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;align-items:stretch}
.tp ul.bl{margin:0;padding:0;list-style:none}
.tp ul.bl li{position:relative;padding-left:20px;margin:0 0 9px;font-size:15.5px;line-height:22px;color:#33453F}
.tp ul.bl li:last-child{margin-bottom:0}
.tp ul.bl li:before{content:"";position:absolute;left:3px;top:9px;width:7px;height:7px;border-radius:4px;background:#1D7A6B}
.tp .idx{display:grid;grid-template-columns:44px 1fr;gap:0;font-size:15.5px;line-height:22px}
.tp .idx div{padding:8px 0;border-bottom:1px solid #E1E9E5}
.tp .idx .pg{font-weight:700;color:#1D7A6B}
.tp .idx .tt b{font-weight:700}
.tp .idx .tt span{color:#5B6D66}
.tp .ref{display:inline-block;margin-left:5px;padding:0 7px;height:19px;line-height:19px;border-radius:10px;background:#14231F;color:#fff;font-size:11.5px;font-weight:700;vertical-align:1px;white-space:nowrap}
.tp .mod h3{display:flex;align-items:center;gap:10px}
.tp .mod h3 .mn{flex:0 0 28px;height:28px;border-radius:8px;background:#14231F;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center}
.tp .op{background:#fff;border:1.6px solid #8FA29A;border-radius:14px;padding:20px 22px 22px;display:flex;gap:16px}
.tp .op .n{flex:0 0 34px;height:34px;border-radius:10px;background:#B8801A;color:#fff;font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center}
.tp .op h4{margin:0 0 6px;font-size:17px;line-height:22px;font-weight:700}
.tp .op p{margin:0;font-size:14.8px;line-height:21.5px;color:#33453F}
.tp .op p.pp{margin-top:7px;color:#0E5247}
.tp .op p.pp b{font-weight:700}
.tp .note{background:#FEF8E8;border:1.6px solid #E7CF98;border-radius:12px;padding:16px 20px;font-size:14.8px;line-height:21.5px;color:#5A4210}
.tp .mono{font-family:${MONO}}
/* colores vivos (no cambian medidas: solo fondos, bordes y degradados) */
.tp{background-image:linear-gradient(90deg,#1D9A84 0 14.3%,#3CC4A8 0 28.6%,#F2A541 0 42.9%,#FF8A5B 0 57.2%,#E0457B 0 71.5%,#B0336A 0 85.8%,#6D5BD0 0);background-size:100% 12px;background-repeat:no-repeat}
.tp .nb{background:linear-gradient(135deg,#1D9A84,#6D5BD0)}
.tp .tag{background:linear-gradient(90deg,#1D9A84,#3CC4A8);color:#fff}
.tp .pill{background:linear-gradient(90deg,#14231F,#1D7A6B)}
.tp section:nth-of-type(4n+2) .pill{background:linear-gradient(90deg,#B8801A,#F2A541)}
.tp section:nth-of-type(4n+3) .pill{background:linear-gradient(90deg,#8C2F5F,#E0457B)}
.tp section:nth-of-type(4n+4) .pill{background:linear-gradient(90deg,#3F2F9E,#6D5BD0)}
.tp .grid3>.card:nth-child(4n+2),.tp .grid4>.card:nth-child(4n+2),.tp .grid5>.card:nth-child(4n+2){border-color:#D48A12}
.tp .grid3>.card:nth-child(4n+3),.tp .grid4>.card:nth-child(4n+3),.tp .grid5>.card:nth-child(4n+3){border-color:#E0457B}
.tp .grid3>.card:nth-child(4n+4),.tp .grid4>.card:nth-child(4n+4),.tp .grid5>.card:nth-child(4n+4){border-color:#6D5BD0}
.tp .flow>.proc:nth-child(1){border-color:#1D9A84} .tp .flow>.proc:nth-child(1) .big{background:#1D9A84}
.tp .flow>.proc:nth-child(3){border-color:#D48A12} .tp .flow>.proc:nth-child(3) .big{background:#D48A12}
.tp .flow>.proc:nth-child(5){border-color:#E0457B} .tp .flow>.proc:nth-child(5) .big{background:#E0457B}
.tp .flow>.proc:nth-child(7){border-color:#6D5BD0} .tp .flow>.proc:nth-child(7) .big{background:#6D5BD0}
`;
let cssOn = false;
const EXTRA = [];
function injectCss() { if (cssOn) return; const st = document.createElement('style'); st.textContent = CSS + EXTRA.join('\n'); document.head.appendChild(st); cssOn = true; }

/* ------------------------------------------------------------------ helpers */
const ICON = {
  flow: '<svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="35" r="6.5"/><circle cx="35" cy="35" r="6.5"/><circle cx="54" cy="35" r="6.5"/><path d="M23,35H28M42,35H47"/></svg>',
  bars: '<svg width="70" height="70" viewBox="0 0 70 70" fill="#fff"><rect x="15" y="20" width="3.4" height="30"/><rect x="21.5" y="20" width="2" height="30"/><rect x="26.5" y="20" width="4.4" height="30"/><rect x="34" y="20" width="2" height="30"/><rect x="39" y="20" width="3.4" height="30"/><rect x="45.5" y="20" width="2" height="30"/><rect x="50.5" y="20" width="4" height="30"/></svg>',
  check: '<svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15,22l4,4l7,-8M15,36l4,4l7,-8M15,50l4,4l7,-8"/><path d="M34,23H56M34,37H56M34,51H56"/></svg>'
};
function head(ic, title, sub, tag) {
  const glyph = /^n\d$/.test(ic) ? ic.slice(1) : ICON[ic];
  return `<div class="hd"><div class="nb">${glyph}</div><h1>${title}</h1><p class="sub">${sub}</p><div class="tag">${tag || 'PROCESO IDEAL · TO-BE'}</div><div class="r1">Glacé S.A. · informe final para e-Karú</div><div class="r2">Versión final · 12/11/2026</div></div>`;
}
function sec(pill, title, desc, body) {
  return `<section><div class="st"><span class="pill">${pill}</span><h2>${title}</h2></div><p class="sd">${desc || ''}</p>${body}</section>`;
}
const dot = (c) => `<span class="dot" style="background:${c}"></span>`;
const CH = {
  ek: `<span class="chip">${dot('#1D7A6B')}e-Karú</span>`,
  bal: `<span class="chip">${dot('#B8801A')}Balanza</span>`,
  lab: `<span class="chip">${dot('#1D7A6B')}e-Karú Etiquetas</span>`,
  esc: `<span class="chip">${dot('#14231F')}Escáner y tablet</span>`,
  prov: `<span class="chip">${dot('#667085')}Proveedor</span>`,
  sifen: `<span class="chip">${dot('#667085')}SIFEN</span>`
};
const stepRef = (page, id) => { const n = (REG[page] || {})[id]; return `<span class="ref">${n || '?'}</span>`; };
const refs = (page, ids) => ids.map((i) => stepRef(page, i)).join('');

function mount(html, fill, extra) {
  injectCss();
  const el = document.createElement('div');
  el.className = 'tp';
  el.innerHTML = html;
  if (fill) fill(el);
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;left:-12000px;top:0;width:2600px;visibility:hidden';
  probe.appendChild(el);
  document.body.appendChild(probe);
  const h = Math.ceil(el.getBoundingClientRect().height);
  probe.removeChild(el);
  document.body.removeChild(probe);
  return Object.assign({ el, w: 2600, h, warns: [], tasks: [] }, extra || {});
}

/* diagrama BPMN embebido dentro de una página de texto (sin cabecera propia; el ancho útil es 2520) */
function embed(num, id, build, o = {}) {
  const p = new E.Page(Object.assign({ w: 2520, h: 2000, num, id, cols: 10, taskW: 180, fs: 15, M: 4 }, o));
  p.counter = E.COUNT[num] || 0;
  p.headBottom = 0;
  build(p);
  E.fin(p, 30);
  return p;
}

/* ------------------------------------------------------------------ EAN-13 */
const EAN = (function () {
  const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
  const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
  const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
  const P = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];
  const check = (d12) => { let s = 0; for (let i = 0; i < 12; i++) s += (+d12[i]) * (i % 2 ? 3 : 1); return (10 - s % 10) % 10; };
  function modules(code) {
    const d = code.split('').map(Number);
    if (d.length !== 13 || check(code.slice(0, 12)) !== d[12]) throw new Error('EAN-13 inválido: ' + code);
    let m = '101'; const par = P[d[0]];
    for (let i = 0; i < 6; i++) m += (par[i] === 'L' ? L : G)[d[1 + i]];
    m += '01010';
    for (let i = 0; i < 6; i++) m += R[d[7 + i]];
    return m + '101';
  }
  /* dibuja las barras en el grupo g; devuelve la geometría */
  function bars(g, code, x0, y, mw, h, ext, fill) {
    const m = modules(code);
    const guard = (i) => i < 3 || (i >= 45 && i < 50) || i >= 92;
    let i = 0;
    while (i < 95) {
      if (m[i] === '1') {
        let j = i; const gd = guard(i);
        while (j + 1 < 95 && m[j + 1] === '1' && guard(j + 1) === gd) j++;
        S('rect', { x: x0 + i * mw, y, width: (j - i + 1) * mw, height: h + (gd ? ext : 0), fill: fill || '#000' }, g);
        i = j + 1;
      } else i++;
    }
    return m;
  }
  return { modules, bars, check };
})();
window.Eng.EAN = EAN;

/* ================================================================== puntos a definir (compartidos por varias páginas) */
const OPST = {"Numeración nueva de códigos": "ap", "Balde único: serie en el código": "gl", "Facturación electrónica de Glacé": "ct", "Excel de Marangatu: frecuencia": "ap", "QR del KuDE en la recepción": "ek", "Facturas de papel: carga de los ítems": "gl", "Quién registra la producción": "gl", "Sabores: código de balanza de cada uno": "gl", "Volumen de las tandas": "gl", "Lote y vencimiento": "ap", "Reglas del grupo PADRE": "ap", "Escaneo en productos individuales": "ap", "Equivalencias de facturas": "ap", "Código de barras en la factura": "ct", "Listas de precios y unidad de venta": "gl", "Nota de Remisión: qué destinos la requieren": "ct", "Consignación a clientes": "ct", "Brownies, pastafrola y tartas en los salones": "gl", "Política FEFO": "ap", "Equipos y conexión": "ek", "Datos de partida": "ap", "Roles y permisos": "gl", "Salones y sucursales: cuál es cuál": "gl", "Parámetros del MRP": "gl", "Secuencia de tandas y alérgenos": "gl", "Club: reglas del premio": "gl", "Club en franquicias: una tarjeta o varias": "ek", "Ventas desde Mesas": "ek", "Premios del Club: stock y costo": "ap", "Balde terminado: tolerancia": "ap", "Portal de pedidos y crédito de clientes": "ek", "Franquicias: forma de trabajo": "gl", "Historial de ventas por sabor": "gl", "Datos de partida: volumen de hoy": "gl", "Merma estándar por sabor": "gl", "Capacidad de planta y cámaras": "gl", "Gobierno del proyecto": "gl", "Qué existe hoy en e-Karú": "ek", "Caja sin conexión": "ek", "Temperatura: en e-Karú o en planilla": "gl"};
function opsList() {
  const K = E.CAT, H = E.HEL;
  return [
    ['Numeración nueva de códigos', `Los códigos de producto empiezan igual que los baldes (2 000001…) y solo ${K.nOk} de ${K.nAll} tienen bien el dígito de control.`, 'Prefijos 20 balde, 22 producto (22 + Nº + fecha de elaboración), 23 Promo Pack, 24 ID de balde, 25 insumo interno y 29 PADRE. Aprobarlos y fijar la fecha de corte antes de imprimir más etiquetas (página 3).'],
    ['Balde único: serie en el código', 'Dos baldes del mismo sabor y peso llevan el mismo código.', 'El software de la balanza (Scale Manager) arma el código con campos a elección y tiene el campo N, número de transacción de 2 a 8 dígitos (visto en pantalla el 10/11/2026). Formato propuesto: Code 128 «2PPPPPPQQQQQNNNNNNNNC», 21 dígitos. Falta probar que ofrezca Code 128 y que N cambie en cada etiqueta. Si no: ID de balde 24… impreso por e-Karú. Mientras tanto: FEFO por sabor y peso y conteo al cierre.'],
    ['Facturación electrónica de Glacé', 'e-Karú trae las facturas de compra por su CDC con el certificado de Glacé. También hace falta para facturar electrónicamente a los clientes y emitir Notas de Remisión.', 'Confirmar con el contador si ya está activa y cargar el certificado digital en e-Karú durante la Etapa 0.'],
    ['Excel de Marangatu: frecuencia', 'El Excel es la lista completa de facturas de compra. ¿Cada cuánto se puede bajar y desde cuándo aparece una factura electrónica en él?', 'Bajarlo cada semana y al cierre del mes. e-Karú muestra qué factura no tiene recepción y qué recepción no tiene factura.'],
    ['QR del KuDE en la recepción', 'Para traer la factura el mismo día hace falta su CDC, que viene en el QR del KuDE impreso.', 'Escáner 2D (o la cámara de la tablet) en la recepción. Validar con e-Karú que la consulta por CDC devuelve los ítems de la factura.'],
    ['Facturas de papel: carga de los ítems', 'El Excel de Marangatu trae una fila por factura, sin ítems. En octubre hubo 1 factura de papel sobre 168.', 'Foto con lectura automática de ítems (ya existe en e-Karú) o carga a mano. Definirlo con el ejemplo de factura de papel que entrega Glacé.'],
    ['Quién registra la producción', 'e-Karú necesita saber quién escanea y quién cierra cada orden en la fábrica.', 'El operario de envasado escanea cada balde al salir de la balanza; el encargado de producción cierra la orden y la compara con el conteo físico. Glacé nombra a las personas y sus reemplazos.'],
    ['Sabores: código de balanza de cada uno', `Cruzada la lista de artículos (PLU) de la balanza con los ${H.nSab} sabores: ${H.nCod} ya tienen código y ${H.nNew} se crean en la balanza (Frutilla, Granizado, Maní DeliFREE y Choco proteico, PLU 79 a 82). Otros ${H.extra.length} sabores de la balanza se siguen produciendo y no estaban en la lista.`, 'Crear los 4 PLU en la balanza con el mismo número que en e-Karú y confirmar la base de los ' + H.extra.length + ' sabores extra (hay una propuesta en 2E). e-Karú guarda el código (Nº de PLU con 6 dígitos) como clave; el nombre puede ser distinto.'],
    ['Volumen de las tandas', 'Los volúmenes usados son 150, 250 y 350 L; el borrador anterior mencionaba una vez 200 L.', 'Confirmar los volúmenes y si son los mismos para todas las bases (por ejemplo, la base proteica).'],
    ['Lote y vencimiento', 'El EAN del balde no trae fechas, aunque la etiqueta las imprime.', 'Productos: la fecha de elaboración va en el código 22. Baldes: e-Karú la toma al registrarlo. Vencimiento = elaboración + 120 días, como parámetro por producto.'],
    ['Reglas del grupo PADRE', 'Cómo se descuenta al vender (grupo + cantidad a consumir) y cómo se da de baja por vencimiento o rotura.', 'Partir de lo ya probado en el prototipo. Corregir el último dígito de los 9 códigos PADRE en el mismo cambio de etiquetas.'],
    ['Escaneo en productos individuales', '¿Unidad por unidad o un escaneo más la cantidad?', 'Un escaneo + cantidad en producción y recepción; unidad por unidad solo en el Promo Pack.'],
    ['Equivalencias de facturas', 'Cada ítem de factura debe equivaler a un insumo de e-Karú.', 'Crear la equivalencia la primera vez que aparece el ítem y reutilizarla después.'],
    ['Código de barras en la factura', 'La factura electrónica debe llevar el código de barras de cada producto, para que el cliente lo escanee.', 'Va en el campo del código interno del ítem (dCodInt) del documento electrónico de SIFEN, que es texto y admite los 21 dígitos del balde con transacción; el GTIN tiene un campo aparte, que no se usa con códigos internos 20–29. El KuDE lo imprime en la columna «Código». Confirmar con el contador.'],
    ['Listas de precios y unidad de venta', 'El código del balde trae el peso: ¿se factura por kilo o por balde? ¿Con qué lista: mayorista, minorista o franquicia? Los mayoristas figuran hoy como depósitos con el nombre del cliente (ej.: Bar Florida, San Marzano).', 'Una lista de precios por tipo de cliente y una unidad de venta por producto (kg o unidad), definidas por Glacé. Los mayoristas pasan a ser clientes con su lista (Etapa 0).'],
    ['Nota de Remisión: qué destinos la requieren', '¿Qué sucursales y clientes necesitan Nota de Remisión Electrónica y con qué motivo? SIFEN prevé, entre otros, traslado por venta, consignación y traslado entre locales de la empresa. La nota se emite y aprueba antes de que salga la mercadería (contingencia: 72 h; a confirmar con el contador y el manual técnico de SIFEN).', 'Una marca «requiere remisión» y un motivo por destino: sucursal propia = traslado entre locales; consignación = consignación; cliente sin factura en el viaje = traslado por venta. Si la factura viaja con la mercadería, puede no hacer falta remisión: confirmarlo con el contador.'],
    ['Consignación a clientes', 'Cómo se informa lo vendido, cada cuánto se factura y quién emite la factura final.', 'El cierre periódico de 3G: e-Karú suma lo vendido por código de barras y emite la factura final. Confirmarlo con el contador.'],
    ['Brownies, pastafrola y tartas en los salones', 'Se evalúa evitar el escáner por salón: ingreso al llegar y baja por vencimiento.', 'Decidir con el resultado de la encuesta al personal de caja, que está en curso.'],
    ['Política FEFO', 'Qué pasa si el operario toma un lote distinto del sugerido.', 'Permitirlo con aviso y dejar constancia en el registro.'],
    ['Equipos y conexión', 'Modelo de escáneres y tablets, señal dentro de las cámaras frías y escáner 2D para el QR del KuDE en la recepción.', 'Probar un puesto piloto antes de equipar todos los puestos.'],
    ['Datos de partida', 'Carga inicial de proveedores, insumos, recetas (base, mezcla base blanca y sabor), códigos y stock inicial en e-Karú.', 'Armar una planilla de carga con Compras y Producción.'],
    ['Roles y permisos', 'Qué puede hacer cada rol: planificación, depósito, planta, central, ventas, compras, salón y sucursal.', 'Definir una persona responsable por puesto y los permisos por rol.'],
    ['Salones y sucursales: cuál es cuál', 'Un salón vende al público con caja e-Karú y Club; una sucursal recibe stock sin atención de salón. Hoy los locales propios figuran como Mariano, Sacramento y San Lorenzo.', 'Glacé marca cada local como salón o sucursal en e-Karú: de eso dependen la caja, el Club y el pedido sugerido.'],
    ['Parámetros del MRP', 'Nivel de servicio por sabor, plazo y mínimo de compra por proveedor, días de reparto de cada local y tolerancia de rendimiento.', 'Arrancar con los valores de la página 4 y 8 semanas de ventas; revisarlos cada mes con los indicadores.'],
    ['Secuencia de tandas y alérgenos', 'Orden de las bases en el día, tiempos de limpieza, qué sabores llevan alérgenos declarados (maní, almendras, pistacho y otros) y cómo se protege la leche sin lactosa.', 'Sin lactosa primero o después de una limpieza completa; de lo más suave a lo más intenso; alérgenos al final del día (página 4). Confirmarlo con Producción.'],
    ['Club: reglas del premio', 'Cuántos sellos, qué premio, qué compras suman, máximo por día, monto mínimo y vencimiento.', 'Empezar con «6 sellos = 1 Cono 2», 1 sello por día y 90 días de vencimiento (página 14), en un salón piloto.'],
    ['Club en franquicias: una tarjeta o varias', '¿Un socio suma sellos en salones y franquicias con la misma tarjeta, aunque sean empresas distintas? ¿Quién paga el premio que se canjea en otro local?', 'Preguntar a e-Karú si el Club admite varias empresas. Mientras tanto, una tarjeta por franquicia con la marca Glacé.'],
    ['Ventas desde Mesas', 'Hoy el sello del Club se suma solo al cobrar en la caja de mostrador: las ventas cobradas desde Mesas no suman.', 'Si los salones atienden en mesa, pedir a e-Karú que Mesas también sume.'],
    ['Premios del Club: stock y costo', 'El premio entra en la venta en Gs. 0. Si no descontara stock, el balde y el grupo PADRE quedarían con diferencia.', 'El premio descuenta el grupo y los gramos igual que una venta; su costo se ve en un reporte de premios.'],
    ['Balde terminado: tolerancia', '¿Cuánta diferencia entre lo vendido y el peso del balde es normal?', 'Avisar cuando supera el 5 % del peso del balde y ajustar el valor con los datos del primer mes.'],
    ['Portal de pedidos y crédito de clientes', '¿e-Karú ya ofrece un portal de pedidos por cliente y control de crédito, o hay que desarrollarlo?', 'Etapa 5: portal con lista de precios, hora de corte y pedido mínimo; crédito con retención de pedidos.'],
    ['Franquicias: forma de trabajo', 'Cliente con su propio e-Karú, cliente que comparte su venta, o consignación.', 'Empezar como cliente (opción A) con una franquicia piloto y pasar a compartir su venta (opción B, página 15).'],
    ['Historial de ventas por sabor', 'El primer pronóstico necesita ventas por sabor y por local; el descuento por gramos llega recién con el update de la caja.', 'Exportar las ventas de las cajas actuales de las últimas 8 a 52 semanas, aunque sea por producto, para arrancar.'],
    ['Datos de partida: volumen de hoy', 'Ventas por día, baldes por semana, tiempo por venta, merma y diferencias de inventario de hoy (pág. 16).', 'Medirlos en las 2 semanas antes de la Etapa 1, con el sistema actual.'],
    ['Merma estándar por sabor', 'Sin merma estándar, el stock por gramos y la tolerancia del balde terminado no coinciden con la realidad.', 'Medir 4 semanas en el salón piloto: peso al abrir y al terminar cada balde.'],
    ['Capacidad de planta y cámaras', 'El MRP necesita litros por día y lugares en la cámara para no planificar más de lo posible.', 'Contarlos en una semana normal y en una de pico.'],
    ['Gobierno del proyecto', 'Responsable en Glacé y en e-Karú, salón piloto y quién firma cada etapa.', 'Nombrarlos antes de la Etapa 0 (pág. 16).'],
    ['Qué existe hoy en e-Karú', 'Para cada módulo: ¿existe, hay que desarrollarlo o queda fuera de e-Karú? (recetas, lotes, mínimos, órdenes de compra, Club entre empresas, roles, auditoría).', 'e-Karú lo marca en la reunión y cotiza por etapa.'],
    ['Caja sin conexión', '¿La caja sigue vendiendo sin internet y cómo sincroniza stock y sellos?', 'Requisito: vender sin conexión y sincronizar al volver. Probarlo en el piloto.'],
    ['Temperatura: en e-Karú o en planilla', 'La cadena de frío (recepción, cámaras, transporte y vitrinas) no está en el sistema.', 'Decidirlo; si es en e-Karú, un registro por cámara y por camión con alerta.']
  ];
}
const opsOrdered = () => { const R = { gl: 0, ct: 1, ek: 2, ap: 3 }; return opsList().map((o, i) => [o, i]).sort((a, b) => (R[OPST[a[0][0]]] - R[OPST[b[0][0]]]) || (a[1] - b[1])).map((x) => x[0]); };
const opNo = (title) => opsOrdered().findIndex((o) => o[0] === title) + 1;

/* ================================================================== 1 · VISTA GENERAL */
E.PAGES.ov = function () {
  const principles = [
    ['Un solo sistema: e-Karú', 'Stock, compras, producción, etiquetas, pedidos y facturas viven en e-Karú. No hay Odoo ni una segunda base de datos que sincronizar.'],
    ['Solo códigos de barras', 'Glacé no imprime QR. Todo se identifica con un código de barras de 13 dígitos con prefijo por familia (20 balde, 22 producto, 25 insumo, 29 grupo), sin choques. Solo se leen dos QR: el del KuDE del proveedor, que trae el CDC, y en los salones el de la tarjeta del Club del cliente, que no identifica productos.'],
    ['La balanza etiqueta sus baldes', 'La balanza Mettler Toledo, con su software y su propia impresora pequeña, imprime la etiqueta y el código de cada balde (2 + sabor + peso + control; propuesta: + número de transacción de la balanza, para que cada balde sea único). e-Karú solo lo lee; la tabla nutricional se imprime aparte, en otra impresora.'],
    ['e-Karú Etiquetas imprime los productos', 'Código 22 + Nº de producto + fecha de elaboración, código PADRE de grupo, ID de paquete del Promo Pack, etiqueta nutricional de 10 × 8 cm y el código interno de los insumos que llegan sin código (frutas a granel, conos, vasos e isopor). BarTender deja de ser necesario.'],
    ['e-Karú trae las facturas por su CDC', 'SIFEN no envía las facturas al comprador: e-Karú las trae por su CDC, que toma del QR del KuDE al recibir y del Excel de Marangatu cada semana. Solo las facturas de papel se cargan (foto o a mano).'],
    ['Una escaneada, una línea de factura', 'Al escanear un balde o un producto para un cliente, e-Karú agrega la línea a la factura con su código de barras y el precio de la lista del cliente, y registra la salida de la fábrica.'],
    ['La remisión sale del mismo despacho', 'Los locales y clientes que la requieren reciben una Nota de Remisión Electrónica que e-Karú arma con lo escaneado. Nadie la digita.'],
    ['Solo lo liberado se usa', 'Cada lote y cada balde tienen un estado: en control, liberado, reservado, en tránsito, en el local. Lo bloqueado o vencido no se planifica, no se despacha y no se vende; el picking sugiere primero lo que vence antes (FEFO).'],
    ['El MRP planifica todo', 'Con la venta real de cada canal, e-Karú pronostica, arma el plan por sabor y producto, agrupado en tandas por base, y explota las recetas en tres niveles. De ahí salen las Órdenes de Compra, las de Producción y los pedidos sugeridos (Proceso 0).'],
    ['Cada local recibe su pedido sugerido', 'Cada noche e-Karú calcula el pedido de cada salón y sucursal con su stock, su venta y su mínimo por sabor. El local solo lo revisa y lo confirma.'],
    ['La venta del salón cierra el círculo', 'En la caja, e-Karú Ventas descuenta el grupo PADRE y los gramos de cada balde, y el e-Karú Club pone el sello con la misma venta. Esa venta vuelve a la fábrica como dato para el plan.'],
    ['Cada canal con su forma de pedir', 'Salones y sucursales, con pedido sugerido; mayoristas y minoristas, con portal de pedidos, lista de precios y crédito; franquicias, caso aparte, con su propia caja e-Karú y el Club.']
  ];
  const pcards = principles.map((p, i) => `<div class="card"><div class="pr"><div class="n">${i + 1}</div><div><h3>${p[0]}</h3><p>${p[1]}</p></div></div></div>`).join('');
  const arrow = '<div class="ar"><svg width="40" height="24" viewBox="0 0 40 24"><path d="M2,12H32M25,4L34,12L25,20" fill="none" stroke="#20302B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  const proc = (n, t, p, pages, sys, res) => `<div class="proc"><div class="ph"><div class="big">${n}</div><h3>${t}</h3></div><div class="pb"><p>${p}</p><div><div class="lbl">DIAGRAMAS</div><div class="chips">${pages.map((x) => `<span class="chip"><b>${x[0]}</b>${x[1]}</span>`).join('')}</div></div><div><div class="lbl">INTERVIENEN</div><div class="chips">${sys.join('')}</div></div><div class="res">${res}</div></div></div>`;
  const flow = `<div class="flow" style="grid-template-columns:1fr 46px 1fr 46px 1fr 46px 1fr">${proc(0, 'Planificación (MRP)', 'e-Karú junta la venta de los salones y franquicias y los pedidos de sucursales y clientes, pronostica la demanda y propone el plan por base. Planificación lo aprueba y e-Karú genera solo las órdenes de compra, de producción y de reposición.', [['0A', 'De la venta al plan'], ['0B', 'Del plan a las órdenes']], [CH.ek, `<span class="chip">${dot('#14231F')}Planificación</span>`], 'Un plan aprobado y todas las órdenes que salen de él.')}${arrow}${proc(1, 'Recepción de materia prima', 'El camión llega con lo que pidió la Orden de Compra, se controla la calidad y cada ítem entra al stock escaneando su código. Con el CDC del QR del KuDE (o del Excel de Marangatu) e-Karú trae la factura y controla orden, recepción y factura. Solo las de papel se cargan.', [['1A', 'Recepción física'], ['1R', 'Rechazo y reclamo'], ['1B', 'Factura → precios y costos']], [CH.ek, CH.esc, CH.sifen], 'Insumos en stock con lote y vencimiento, y compras con precio, IVA y costo.')}${arrow}${proc(2, 'Producción y envase', 'La orden llega planificada, los insumos se retiran escaneando y cada balde sale de la balanza con su propio código; queda «liberado» al cerrar la orden. Los demás productos salen con la etiqueta de e-Karú Etiquetas.', [['2A', 'Orden y elaboración'], ['2B', 'Baldes y balanza'], ['2C', 'Productos terminados'], ['2D', 'Promo Pack 12 palitos'], ['2E', 'Bases, sabores y categorías']], [CH.ek, CH.bal, CH.lab, CH.esc], 'Baldes y productos liberados, identificados con su código de barras.')}${arrow}${proc(3, 'Recepción de pedidos y despacho', 'e-Karú sugiere el pedido de cada salón y sucursal, la Central lo prepara escaneando y el local lo recibe escaneando. Los clientes reciben su factura con el código de cada línea. En el salón, la venta descuenta el balde y suma el sello del Club.', [['3A', 'Pedido y despacho'], ['3B', 'Recepción en el local'], ['3C', 'Faltantes y Backorder'], ['3D', 'Vida de un balde'], ['3E', 'Venta a clientes con factura'], ['3F', 'Nota de Remisión'], ['3G', 'Consignación'], ['3H', 'Venta en el salón y Club'], ['3I', 'Balde terminado']], [CH.ek, CH.esc, CH.sifen, `<span class="chip">${dot('#8C2F5F')}e-Karú Club</span>`], 'Cada local con su stock real, cada cliente con su factura y cada venta del salón de vuelta en el plan.')}</div>
  <div class="note" style="margin-top:18px;background:#F6F9F7;border-color:#C9D4CF;color:#33453F"><b style="color:#14231F">Destinos:</b> salones (venta al público con Club) · sucursales (reciben stock, sin Club) · mayoristas · minoristas · franquicias (caso aparte). Cómo pide, qué documento lleva y qué dato aporta cada uno: página 15.</div>`;

  const refR = (page, ids) => refs(page, ids);
  const roles = [
    ['e-Karú', 'automático', 'Trae las facturas de SIFEN por su CDC y las empareja con lo recibido. Registra la producción al leer los códigos que se escanean. Arma la factura y la remisión con lo escaneado.', 'Siempre', refR('p1b', ['Ecdc', 'Eexc', 'Ematch']) + refR('p2a', ['Ereg']) + refR('p3c', ['Eline', 'Efac']) + refR('p3d', ['Enre'])],
    ['Compras / Administración', 'persona', 'Baja de Marangatu el Excel «DetalleComprobantesRegistrados» y lo sube a e-Karú, que completa los CDC que falten. Carga los ítems de las facturas de papel (foto o a mano) y resuelve las diferencias de compra.', 'Cada semana y al cierre del mes', refR('p1b', ['Tdl', 'Tup', 'Titem', 'Tres'])],
    ['Encargado de Depósito', 'persona que escanea', 'Escanea cada ítem que llega para dar el ingreso físico de la materia prima, con su cantidad, lote y vencimiento, y el QR del KuDE de la factura.', 'En cada entrega', refR('p1a', ['Asc', 'Aqty']) + refR('p1b', ['Tqr'])],
    ['Operario de Planta', 'persona que escanea', 'Retira los insumos escaneándolos y escanea cada balde y producto terminado. Con eso e-Karú registra la producción: nadie la digita. Propuesta: el operario de envasado escanea cada balde y el encargado de producción cierra la orden.', 'En cada orden de producción', refR('p2a', ['Ppick', 'Pscan'])],
    ['Operario del Depósito Central', 'persona que escanea', 'Arma los pedidos de los locales y de los clientes escaneando cada balde y producto. Ese escaneo registra la salida de la fábrica y arma la factura.', 'En cada pedido', refR('p3a', ['Tpick']) + refR('p3c', ['Tscan'])],
    ['Administración / Ventas', 'persona', 'Recibe el pedido del cliente (portal de pedidos o tablet) con su lista de precios: mayorista, minorista o franquicia, y revisa su crédito.', 'En cada pedido de cliente', refR('p3c', ['Tped'])],
    ['Salones y sucursales', 'persona', 'Revisan y confirman el pedido que sugiere e-Karú y reciben la mercadería escaneando lo que llega.', 'En cada reposición', refR('p3a', ['T1', 'R2'])],
    ['Planificación', 'encargado de producción y compras', 'Revisa y aprueba el plan que propone el MRP; dentro de las 48 h congeladas solo cambia con motivo. Aprueba los cambios cuando hay un desvío.', 'Cada semana y ante un desvío', refR('p0', ['Pok', 'Prev'])],
    ['Cajero/a del salón', 'persona que escanea', 'Escanea el grupo PADRE, elige sabores y baldes, elige al socio del Club antes de cobrar y escanea cada balde que se termina.', 'En cada venta', refR('p3h', ['Kpad', 'Ksoc', 'Kfin'])],
    ['Encargado/a del salón', 'persona', 'Confirma el pedido sugerido del salón y revisa los avisos de rendimiento de los baldes.', 'Cada día', refR('p3a', ['T1']) + refR('p3h', ['Hrev'])]
  ];
  const rolesTbl = `<table class="tbl"><thead><tr><th style="width:17%">ROL</th><th>QUÉ HACE</th><th style="width:15%">CUÁNDO</th><th style="width:9%">PASOS</th></tr></thead><tbody>${roles.map((r) => `<tr><td class="k">${r[0]}<div style="font-weight:500;font-size:13px;color:#5B6D66;margin-top:2px">${r[1]}</div></td><td>${r[2]}</td><td>${r[3]}</td><td style="white-space:nowrap">${r[4]}</td></tr>`).join('')}</tbody></table>`;
  const who = `<div class="two eq" style="margin-bottom:24px"><div class="card"><h3>¿Quién carga las compras?</h3><p><b>Casi nadie: e-Karú las trae por su CDC.</b> El depósito escanea lo que llega (ingreso físico) y el QR del KuDE. Compras sube cada semana el Excel de Marangatu, que completa los CDC que falten y marca las facturas de papel: solo esas se cargan, con foto o a mano.</p></div><div class="card"><h3>¿Quién registra la producción en la fábrica?</h3><p><b>e-Karú, con los escaneos de la fábrica.</b> Propuesta: el operario de envasado escanea cada balde apenas sale de la balanza y los productos al etiquetarlos; el encargado de producción cierra la orden y la compara con el conteo físico. Glacé nombra a las personas.</p></div></div>`;

  const rows = [
    ['Odoo OCR para leer las facturas', 'e-Karú trae cada factura de SIFEN por su CDC (QR del KuDE y Excel de Marangatu). Las de papel entran con foto o a mano.'],
    ['Códigos QR de lote y de balde', 'Código de barras con prefijo por familia: el de la balanza para los baldes (20) y el de e-Karú Etiquetas para productos (22) e insumos sin código (25).'],
    ['BarTender para imprimir las etiquetas', 'La balanza imprime con su propia impresora la etiqueta y el código del balde. La impresora térmica de e-Karú Etiquetas imprime los códigos de productos y la tabla nutricional de 10 × 8 cm.'],
    ['App móvil de Odoo para recibir y hacer el picking', 'Escáner de código de barras o tablet con e-Karú.'],
    ['Órdenes de producción, listas de materiales y picking en Odoo', 'Recetas (base + sabor), Orden de Producción, Hoja de Dosificación y Orden de Picking dentro de e-Karú.'],
    ['Dos sistemas (Odoo y e-Karú) con datos sincronizados', 'Una sola base de datos: e-Karú.']
  ];
  const tbl = `<table class="tbl"><thead><tr><th style="width:38%">ANTES · BORRADOR CON ODOO, QR Y BARTENDER</th><th>AHORA · PROCESO IDEAL</th></tr></thead><tbody>${rows.map((r) => `<tr><td class="old"><span class="strike">${r[0]}</span></td><td class="k" style="font-weight:600;color:#14231F">${r[1]}</td></tr>`).join('')}</tbody></table>`;
  const equip = `<div class="card"><h3>Equipos necesarios</h3><ul class="bl"><li>Escáner de código de barras y tablet en el depósito de materia prima, la planta, el Depósito Central y cada salón y sucursal.</li><li>Impresora térmica de etiquetas (HPRT HT400, 203 dpi) con e-Karú Etiquetas: etiquetas de 2 × 3 cm y nutricional de 10 × 8 cm.</li><li>Balanza Mettler Toledo con su software y su impresora pequeña, que imprime la etiqueta y el código de cada balde.</li><li>Escáner 2D (lee códigos de barras y QR) en la recepción de materia prima, para el QR del KuDE, y en la caja de cada salón y franquicia, para el QR del Club en el celular.</li><li>Impresora común en el Depósito Central para el KuDE de las facturas y de las remisiones.</li><li>Caja e-Karú con escáner en cada salón y en cada franquicia, con el update de Ventas y el Club.</li><li>Conexión de red en cada puesto; en las cámaras frías se define con un puesto piloto (punto ${opNo('Equipos y conexión')} de la última página).</li></ul></div>`;
  const how = `<div class="card"><h3>Cómo leer los diagramas</h3><ul class="bl"><li>Cada carril es un participante: personas (planificación, depósito, planta, central, ventas, compras, salones y sucursales), sistemas (e-Karú en verde, balanza en ámbar) y externos (proveedores, clientes, distribuidores y SIFEN).</li><li>Cada paso lleva un número negro con el formato proceso.paso, por ejemplo 2.14. La página de requisitos usa los mismos números.</li><li>El Proceso 0 (planificación) usa los mismos símbolos; sus pasos se numeran 0.1, 0.2…</li><li>Los enlaces con letra (A, B, C, D, F, R) unen un bloque con otro: «viene de» y «sigue en». Un marco punteado indica que el paso se repite por cada ítem.</li><li>La flecha punteada es un mensaje entre participantes (correo, alerta, camión). Cada página trae su leyenda completa.</li></ul></div>`;
  const idx = `<div class="card"><h3>Contenido de este documento</h3><div class="idx">
    <div class="pg" data-goto="1">1</div><div class="tt" data-goto="1"><b>Vista general</b> <span>· decisiones, procesos, roles y qué se elimina</span></div>
    <div class="pg" data-goto="2">2</div><div class="tt" data-goto="2"><b>Respuesta a e-Karú</b> <span>· cuatro puntos y plan por etapas</span></div>
    <div class="pg" data-goto="3">3</div><div class="tt" data-goto="3"><b>Códigos de barras</b> <span>· prefijos, lectura, balde único y cambio</span></div>
    <div class="pg" data-goto="4">4</div><div class="tt" data-goto="4"><b>Proceso 0</b> <span>· planificación MRP, estados del stock e indicadores</span></div>
    <div class="pg" data-goto="5">5</div><div class="tt" data-goto="5"><b>Proceso 1</b> <span>· 1A recepción física · 1R rechazo y reclamo</span></div>
    <div class="pg" data-goto="6">6</div><div class="tt" data-goto="6"><b>Proceso 1</b> <span>· 1B factura → tres vías, precios y costos</span></div>
    <div class="pg" data-goto="7">7</div><div class="tt" data-goto="7"><b>Proceso 2</b> <span>· 2A orden y elaboración · 2B baldes y balanza</span></div>
    <div class="pg" data-goto="8">8</div><div class="tt" data-goto="8"><b>Proceso 2</b> <span>· 2C productos terminados · 2D Promo Pack</span></div>
    <div class="pg" data-goto="9">9</div><div class="tt" data-goto="9"><b>Proceso 2</b> <span>· 2E bases, sabores y categorías</span></div>
    <div class="pg" data-goto="10">10</div><div class="tt" data-goto="10"><b>Proceso 3</b> <span>· 3A pedido y despacho · 3B recepción en el local</span></div>
    <div class="pg" data-goto="11">11</div><div class="tt" data-goto="11"><b>Proceso 3</b> <span>· 3C faltantes y Backorder · 3D vida de un balde</span></div>
    <div class="pg" data-goto="12">12</div><div class="tt" data-goto="12"><b>Proceso 3</b> <span>· 3E venta a clientes con factura</span></div>
    <div class="pg" data-goto="13">13</div><div class="tt" data-goto="13"><b>Proceso 3</b> <span>· 3F Nota de Remisión · 3G consignación</span></div>
    <div class="pg" data-goto="14">14</div><div class="tt" data-goto="14"><b>Salones</b> <span>· 3H venta con e-Karú Ventas y Club · 3I balde terminado</span></div>
    <div class="pg" data-goto="15">15</div><div class="tt" data-goto="15"><b>Canales</b> <span>· mayoristas, minoristas y franquicias (caso aparte)</span></div>
    <div class="pg" data-goto="16">16</div><div class="tt" data-goto="16"><b>Operación y proyecto</b> <span>· datos de partida, qué pasa si, costos y gobierno</span></div>
    <div class="pg" data-goto="17">17</div><div class="tt" data-goto="17"><b>Qué debe hacer e-Karú</b> <span>· módulos (MVP) y puntos a definir</span></div></div></div></div>`;
  const html = head('flow', 'Glacé × e-Karú: de la fábrica al salón',
    'Informe final del proceso ideal: un solo e-Karú con planificación MRP, tres procesos con solo códigos de barras, los salones con e-Karú Ventas y Club, y cada canal con su documento.', 'INFORME FINAL · TO-BE') +
    sec('LA IDEA', 'Doce decisiones que ordenan todo el proceso', 'Las ocho de la versión anterior (sin Odoo, sin QR propios y sin BarTender) y cuatro nuevas: planificación, reposición, salones con Club y canales.', `<div class="grid4">${pcards}</div>`) +
    sec('LOS PROCESOS', 'Del plan a la materia prima, al balde, a cada local y a cada cliente', 'El Proceso 0 planifica y los tres procesos ejecutan. Cada uno tiene su diagrama con carriles (quién hace cada paso) y un número por paso, que se usa también en la página de requisitos.', flow) +
    sec('QUIÉN HACE QUÉ', 'Quién carga, quién escanea y qué hace e-Karú solo', 'Se espera que e-Karú automatice las compras y la producción. Las personas escanean; solo las facturas de papel se cargan.', who + rolesTbl) +
    sec('QUÉ SE ELIMINA', 'Qué sale del borrador anterior y qué lo reemplaza', '', tbl) +
    `<section class="three">${equip}${how}${idx}</section>`;
  return mount(html);
};


/* ================================================================== 2 · RESPUESTA A e-KARÚ + PLAN POR ETAPAS */
EXTRA.push(`
.tp .pt{border:1.8px solid #14231F;border-radius:16px;background:#fff;display:flex;flex-direction:column;overflow:hidden}
.tp .pt .ph{display:flex;gap:14px;align-items:center;padding:18px 24px 14px;border-bottom:1px solid #E1E9E5}
.tp .pt .ph .big{flex:0 0 46px;height:46px;border-radius:12px;background:#14231F;color:#fff;font-size:24px;font-weight:700;display:flex;align-items:center;justify-content:center}
.tp .pt .ph h3{margin:0;font-size:21px;line-height:26px;font-weight:700}
.tp .pt .pbd{padding:16px 24px 20px;display:flex;flex-direction:column;gap:14px;flex:1}
.tp .pt .cf{font-size:15px;line-height:22px;color:#5A4210;background:#FEF8E8;border:1px solid #E7CF98;border-radius:10px;padding:10px 14px}
.tp .pt .who2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:auto}
.tp .pt .who2 div{border-radius:10px;padding:10px 14px;font-size:14.2px;line-height:20px}
.tp .pt .who2 .g{background:#FBEBC8;color:#5A4210}
.tp .pt .who2 .e{background:#D8EDE7;color:#0E5247}
.tp .pt .who2 b{display:block;font-size:11.5px;letter-spacing:1px;margin-bottom:3px}
.tp .pt .pg2{font-size:13.5px;font-weight:700;color:#1D7A6B}
.tp .stt{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.8px;padding:3px 10px;border-radius:10px;white-space:nowrap}
.tp .stt.ok{background:#DCEFE0;color:#2B7A3B}.tp .stt.pa{background:#FBEBC8;color:#74500D}.tp .stt.pe{background:#FBE1DE;color:#9B2C22}.tp .stt.pr{background:#E3ECFB;color:#1F4E9A}
.tp .et{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:#1D7A6B;color:#fff;font-weight:700;font-size:20px}
`);
E.PAGES.resp = function () {
  const K = E.CAT, H = E.HEL, N = K.NEW;
  const pt = (n, title, conf, items, gl, ek, pages) => `<div class="pt"><div class="ph"><div class="big">${n}</div><h3>${title}</h3></div><div class="pbd"><div class="cf"><b>Coincidimos.</b> ${conf}</div><div><div class="lbl">LO QUE PROPONEMOS</div><ul class="bl">${items.map((i) => `<li>${i}</li>`).join('')}</ul></div><div class="who2"><div class="g"><b>GLACÉ</b>${gl}</div><div class="e"><b>e-KARÚ</b>${ek}</div></div><div class="pg2">Detalle: ${pages}</div></div></div>`;
  const pts = `<div class="two eq" style="grid-template-columns:1fr 1fr;gap:26px">
  ${pt(1, 'Los códigos de producto chocan con los baldes',
    `El palito con cobertura (2 000001 10001 4) se leería como «Amarena, 10,001 kg», y solo ${K.nOk} de ${K.nAll} códigos tienen bien el último dígito. Tomamos su propuesta del 22 y la completamos.`,
    ['<b>Un prefijo por familia</b> dentro del rango interno 20–29: 20 balde (sin cambios), 22 producto, 23 Promo Pack, 24 ID de balde, 25 insumo interno, 29 grupo PADRE.',
      `<b>Producto = 22 + Nº de producto + fecha de elaboración + control</b>, por ejemplo ${N.fmt2(N.prod(1))}. El Nº es el actual (0001 a 00${K.nProd}), así que la tabla de cambio es directa, y la fecha hace de lote para el stock y el FEFO.`,
      'Todo se imprime como EAN-13 con control válido. Grupos PADRE: mismo número; proponemos corregir solo su último dígito en el mismo cambio (9 etiquetas).',
      'Cambio en 8 pasos con una tabla de transición de 2 semanas para los códigos viejos. Hasta el corte no se imprimen etiquetas de productos.'],
    'Aprobar los prefijos, actualizar e-Karú Etiquetas, reetiquetar el stock y fijar la fecha de corte.',
    'Lector por prefijos (7 reglas), campo «Nº de producto» y tabla de transición.', 'página 3 (prefijos, lectura y cambio) y 2E (Nº de cada producto)')}
  ${pt(2, 'Dos baldes iguales tienen el mismo código',
    'Mismo sabor y mismo peso dan el mismo código, y en el despacho no se sabe qué balde salió ni de qué lote.',
    ['<b>A · Recomendada:</b> la balanza pone su número de transacción dentro del código. Ya vimos que el software de la balanza (Scale Manager) tiene ese campo (N, hasta 8 dígitos). Code 128 de 21 dígitos: 2 + sabor + peso + transacción + control (200000101105000411293). e-Karú sigue leyendo sabor y peso igual.',
      '<b>B · Si la balanza no puede:</b> e-Karú registra el balde e imprime en la HPRT un ID 24… que se pega al lado. Una etiqueta más por balde, con cualquier balanza.',
      '<b>C · Mientras tanto:</b> cada escaneo crea un balde, el despacho asigna el lote más viejo de ese sabor y peso (FEFO) y al cierre se compara con el conteo físico. Sirve para arrancar, no como solución final.'],
    'Configurar el formato en Scale Manager e imprimir dos etiquetas de prueba (pasos en la página 3).',
    'Aceptar el código de 21 dígitos, guardar la transacción y rechazar una repetida.', 'página 3 (balde único) y 2B')}
  ${pt(3, 'Las facturas de compra no llegan solas desde SIFEN',
    'SIFEN no le envía las facturas al comprador: e-Karú las trae por su CDC, con la facturación electrónica de Glacé activa. La versión anterior de este documento decía otra cosa; ya está corregido en 1B.',
    ['<b>Camino diario:</b> al recibir, el depósito escanea el QR del KuDE que viene con la mercadería. El QR trae el CDC y e-Karú trae la factura el mismo día, con ítems, precios e IVA. Si SIFEN todavía no la tiene, e-Karú reintenta sola.',
      '<b>Control semanal y de cierre:</b> Compras sube el Excel de Marangatu. e-Karú consulta los CDC que falten, marca las filas sin CDC como facturas de papel y muestra qué factura no tiene recepción y qué recepción no tiene factura.',
      '<b>Papel:</b> foto con lectura de ítems o carga a mano (en octubre fue 1 de 168). Mientras no esté activa la facturación electrónica, XML o foto, como ya permite e-Karú.'],
    'Confirmar la facturación electrónica y cargar el certificado digital; escáner 2D (o cámara de la tablet) en la recepción.',
    'Consulta por CDC desde el QR y desde el Excel, reintento automático y control de que no falte ninguna factura.', 'página 6 (diagrama 1B)')}
  ${pt(4, 'El alcance, por etapas',
    'Es mucho desarrollo para hacerlo de una vez. Mantenemos sus cinco etapas y su orden: el registro real de la fábrica llega primero.',
    ['A cada etapa le sumamos <b>qué necesita antes</b> y <b>cuándo se considera lista</b>, para que nadie arranque una etapa sin sus datos ni la cierre sin probarla.',
      'La facturación electrónica de Glacé es requisito de las Etapas 2 y 3: conviene confirmarla ya, durante la Etapa 0.',
      'Si la prueba en la balanza se demora, la Etapa 1 arranca con la opción C y pasa a A o B sin rehacer nada: el lector ya acepta los tres formatos.',
      'Sumamos la <b>Etapa 5</b> (planificación MRP, reposición automática y portal de pedidos) y los <b>salones en paralelo</b>: el Club ya existe en e-Karú y no depende de la fábrica.'],
    'Las 6 entradas de la Etapa 0 (tabla de abajo).', 'El detalle de cada etapa, a partir de este plan.', 'tabla de abajo')}
  </div>`;

  const et = [
    ['0', 'Ya, casi sin desarrollo', 'Registro real de la fábrica desde el primer día y códigos que no chocan.', `Numeración nueva y reetiquetado · maestro de ${H.bases.length} bases y ${H.nSab} sabores (más los ${H.extra.length} sabores de la balanza que se siguen produciendo) · registro diario de los baldes producidos (escaneando el código actual o a mano) · mayoristas como clientes con su lista de precios · compras con lote y vencimiento.`, 'Prefijos aprobados · códigos de sabor de la balanza · quién registra la producción · formato del código del balde probado en la balanza.', 'Todas las etiquetas nuevas se leen bien en todos los puestos y cada balde producido figura en e-Karú el mismo día.', '3 · 2E'],
    ['1', 'Producción por escaneo', 'La producción se registra sola al escanear.', 'Escanear el balde en la fábrica y registrar la producción · recetas base + sabor por volumen · Orden de Producción y Hoja de Dosificación · etiquetas de productos 22.', 'Etapa 0 · tablet y escáner en la planta · balde único A o B (si no está: opción C).', 'Una semana de producción registrada solo con escaneos, sin diferencias sin explicar frente al conteo físico.', '2A · 2B · 2C · 2E'],
    ['2', 'Compras', 'Costo real con facturas traídas por CDC.', 'QR del KuDE en la recepción · Excel de Marangatu semanal y de cierre · facturas de papel con foto · recepción de materia prima escaneando · códigos internos 25 para insumos sin código.', 'Facturación electrónica activa y certificado en e-Karú · escáner 2D · ejemplo de factura de papel.', 'El cierre de un mes cuadra: cada fila del Excel tiene su factura en e-Karú y cada recepción, su factura.', '1A · 1B'],
    ['3', 'Pedidos y despacho', 'Cada local y cliente recibe lo escaneado, con su documento.', 'Pedidos de salones y sucursales · picking FEFO · despacho · factura a clientes escaneando · Nota de Remisión Electrónica.', 'Etapa 0 · listas de precios · qué destinos requieren remisión (contador) · facturación electrónica activa.', 'Una semana de pedidos despachados solo escaneando, con cada remisión aprobada antes de que salga el camión.', '3A · 3B · 3C · 3E · 3F'],
    ['4', 'Trazabilidad y consignación', 'Del insumo a la factura del cliente, y vuelta.', 'Lote de punta a punta · estados del stock y no conformidades · consignación con liquidación periódica y factura final.', 'Balde único (A o B) · Etapas 2 y 3 funcionando · reglas de consignación con el contador.', 'Desde una factura de cliente se llega al balde, a su orden y al lote de insumos (y al revés) en menos de 15 minutos: se prueba con un retiro simulado.', '3D · 3G · 0'],
    ['5', 'Planificación y canales', 'El plan, las compras y la reposición salen solos.', 'Pronóstico por sabor · plan maestro agrupado en tandas por base · MRP en tres niveles · Órdenes de Compra automáticas · pedido sugerido a salones y sucursales · portal de pedidos y crédito para clientes.', 'Etapas 1 a 3 funcionando · 8 semanas de ventas por sabor · parámetros del MRP (página 4).', 'Un mes en que las compras y los pedidos de los locales salen del plan, con menos de 25 % de error en el pronóstico.', '0A · 0B · 15'],
    ['S', 'Salones, en paralelo', 'Venta por grupo PADRE y Club en la caja.', 'Update de e-Karú Ventas en la caja · e-Karú Club con las reglas de Glacé · balde terminado y cierre del día.', 'Numeración nueva (Etapa 0) · reglas del Club · un salón piloto con escáner.', 'Un mes de ventas con grupos PADRE y Club en el salón piloto: tiempo por venta dentro de lo acordado frente al de hoy y merma del balde medida.', '3H · 3I']
  ];
  const etTbl = `<table class="tbl"><thead><tr><th style="width:5%">ETAPA</th><th style="width:15%">QUÉ SE LOGRA</th><th>QUÉ INCLUYE</th><th style="width:20%">NECESITA ANTES</th><th style="width:20%">LISTA CUANDO</th><th style="width:8%">PÁGINAS</th></tr></thead><tbody>${et.map((r) => `<tr><td><span class="et">${r[0]}</span></td><td><b style="color:#14231F">${r[1]}</b><div style="margin-top:4px">${r[2]}</div></td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td style="font-weight:700;color:#1D7A6B">${r[6]}</td></tr>`).join('')}</tbody></table>`;

  const ST = { ok: ['ok', 'LISTO'], pa: ['pa', 'PARCIAL'], pe: ['pe', 'PENDIENTE'], pr: ['pr', 'PROPUESTA'] };
  const chk = [
    ['Número de transacción en el código del balde', 'pa', 'Glacé', 'El software de la balanza tiene el campo (N, hasta 8 dígitos). Falta: elegir Code 128, cargar el formato 2PPPPPPQQQQQNNNNNNNNC e imprimir dos etiquetas de prueba (página 3).'],
    ['Planilla de sabores con su base y su código de balanza', 'pa', 'Glacé', `Lista de artículos (PLU) recibida y cruzada (ver 2E): ${H.nCod} de ${H.nSab} con código. Falta crear ${H.nNew} PLU en la balanza (79 a 82) y confirmar la base de ${H.extra.length} sabores de la balanza que no estaban en la lista.`],
    ['Ejemplo de factura de papel', 'pe', 'Glacé', 'Enviar una foto o un escaneo de una factura de papel real, con sus ítems.'],
    ['Quién registra la producción en la fábrica', 'pr', 'Glacé', 'Propuesta: el operario de envasado escanea cada balde al salir de la balanza y el encargado de producción cierra la orden y la compara con el conteo físico. Glacé nombra a las dos personas y sus reemplazos.'],
    ['Numeración nueva de códigos', 'pr', 'Glacé + e-Karú', 'Aprobar los prefijos de la página 3 y fijar la fecha de corte. Hasta entonces, no imprimir etiquetas de productos.'],
    ['Facturación electrónica de Glacé', 'pe', 'Glacé (contador)', 'Confirmar si está activa y cargar el certificado digital en e-Karú. La necesitan las Etapas 2 y 3.']
  ];
  const chkTbl = `<table class="tbl"><thead><tr><th style="width:24%">QUÉ HACE FALTA</th><th style="width:9%">ESTADO</th><th style="width:11%">QUIÉN</th><th>PRÓXIMO PASO</th></tr></thead><tbody>${chk.map((r) => `<tr><td class="k">${r[0]}</td><td><span class="stt ${ST[r[1]][0]}">${ST[r[1]][1]}</span></td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`;

  const chg = `<div class="card"><h3>Qué cambió en la versión final</h3><ul class="bl">
    <li><b>Página 1:</b> doce decisiones, el nuevo Proceso 0 y los roles de planificación y de los salones.</li>
    <li><b>Página 4 · Proceso 0 (nuevo):</b> planificación MRP, parámetros, estados del stock, calidad e indicadores.</li>
    <li><b>Páginas 5 a 13:</b> los mismos tres procesos, con Orden de Compra y control de tres vías (1A, 1B), orden planificada y balde liberado (2A, 2B) y pedido sugerido a salones y sucursales (3A).</li>
    <li><b>Página 14 (nueva):</b> salones con e-Karú Ventas y Club (3H, 3I) y la versión ideal del prototipo.</li>
    <li><b>Página 15 (nueva):</b> canales; mayoristas y minoristas; franquicias como caso aparte.</li>
    <li><b>Página 16 (nueva):</b> datos de partida, qué pasa si algo falla, maestros, auditoría, inventario, costos, Glacé Compras y gobierno del proyecto.</li>
    <li><b>Página 17:</b> quince módulos marcados MVP o después, y los puntos a definir nuevos.</li></ul></div>`;

  const html = head('check', 'Respuesta a e-Karú: cuatro puntos y plan por etapas',
    'Glacé coincide con los cuatro puntos que plantearon. Para cada uno: qué se confirma, qué proponemos y qué hace cada parte. Después, el plan por etapas con lo que necesita cada una y lo que falta para arrancar la Etapa 0.', 'RESPUESTA A e-KARÚ') +
    sec('LOS 4 PUNTOS', 'Qué se confirma y qué proponemos', 'Coincidimos también con la idea general: un solo sistema (e-Karú), solo códigos de barras, la balanza imprimiendo el código de cada balde y los mayoristas como clientes con su lista de precios.', pts) +
    sec('ETAPAS', 'Plan por etapas, con requisitos y criterio de cierre', 'Las cinco etapas que propuso e-Karú, en el mismo orden, más la Etapa 5 (planificación y canales) y los salones en paralelo. MVP: Etapas 0 a 3 y el salón piloto; la Etapa 5 se cotiza aparte. Cada una dice qué necesita antes de empezar y cómo se sabe que está lista.', etTbl) +
    sec('ETAPA 0', 'Qué hace falta para arrancar', 'Las cuatro entradas que pidió e-Karú, más dos que salen de esta respuesta.', `<div class="two" style="grid-template-columns:1.9fr 1fr;gap:28px"><div>${chkTbl}</div>${chg}</div>`);
  return mount(html);
};


/* ================================================================== 2 · CÓDIGOS DE BARRAS */
function anatomySvg() {
  const W = 1500, H = 690;
  const svg = S('svg', { xmlns: 'http://www.w3.org/2000/svg', width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'font-family': FONT });
  const col = { pre: '#14231F', sab: '#1D7A6B', pes: '#B8801A', ctl: '#667085' };
  const tint = { sab: '#D8EDE7', pes: '#FBEBC8', ctl: '#E4E7EC', pre: '#E6EEEA' };
  const code = '2000001011058';
  const mw = 8, x0 = 128, yT = 52, hD = 178, ext = 44, yb = yT + hD, yg = yb + ext;
  const g = S('g', {}, svg);
  const X = (m) => x0 + m * mw;
  // fondos de color por segmento
  S('rect', { x: X(3), y: yT - 22, width: 42 * mw, height: yg - yT + 40, rx: 8, fill: tint.sab }, g);
  S('rect', { x: X(50), y: yT - 22, width: 35 * mw, height: yg - yT + 40, rx: 8, fill: tint.pes }, g);
  S('rect', { x: X(85), y: yT - 22, width: 7 * mw, height: yg - yT + 40, rx: 8, fill: tint.ctl }, g);
  S('rect', { x: x0 - 92, y: yb + 4, width: 80, height: yg - yb + 18, rx: 8, fill: tint.pre }, g);
  EAN.bars(g, code, x0, yT, mw, hD, ext, '#101916');
  // dígitos legibles
  const dg = (ch, cx, c) => TXT(g, ch, cx, yg - 6, { size: 38, weight: 700, fill: c, anchor: 'middle' });
  const digs = code.split('');
  g.querySelectorAll && 0;
  const setMono = (t) => { t.setAttribute('font-family', MONO); return t; };
  setMono(dg(digs[0], x0 - 52, col.pre));
  for (let i = 0; i < 6; i++) setMono(dg(digs[1 + i], X(3 + 7 * i + 3.5), '#0E5247'));
  for (let i = 0; i < 6; i++) setMono(dg(digs[7 + i], X(50 + 7 * i + 3.5), i < 5 ? '#74500D' : '#475467'));
  // corchetes bajo los dígitos
  const yBr = yg + 34;
  const seg = [
    { k: 'pre', a: x0 - 92, b: x0 - 12, c: col.pre, lvl: 0 },
    { k: 'sab', a: X(3) + 2, b: X(45) - 2, c: col.sab, lvl: 3 },
    { k: 'pes', a: X(50) + 2, b: X(85) - 2, c: col.pes, lvl: 2 },
    { k: 'ctl', a: X(85) + 2, b: X(92) - 2, c: col.ctl, lvl: 1 }
  ];
  const cards = [
    { k: 'pre', tag: 'PREFIJO', big: '2', title: 'Código de uso interno', body: 'El prefijo 2 está reservado a los códigos de uso interno de cada empresa; los EAN de los productos de proveedores normalmente no lo usan.' },
    { k: 'sab', tag: 'SABOR · 6 DÍGITOS', big: '000001', title: 'Qué sabor es', body: '000001 = Amarena, 000023 = Dulce de leche, 000053 = Crema del cielo. e-Karú necesita la tabla código ↔ sabor.' },
    { k: 'pes', tag: 'PESO · 5 DÍGITOS', big: '01105', title: 'Cuánto pesa, en gramos', body: '01105 = 1105 g = 1,105 kg (la etiqueta lo imprime como 1.105 kg). Lo mide la balanza y va dentro del código.' },
    { k: 'ctl', tag: 'CONTROL · 1 DÍGITO', big: '8', title: 'Verificación EAN-13', body: 'La balanza lo calcula con los 12 dígitos anteriores. e-Karú lo valida en cada escaneo para descartar lecturas erróneas.' }
  ];
  const cw = 345, cg = 40, cy0 = 398, chh = 262;
  cards.forEach((cd, i) => {
    const s = seg[i], cx = i * (cw + cg), ccx = cx + cw / 2;
    // corchete
    S('path', { d: `M${s.a},${yBr - 7}V${yBr}H${s.b}V${yBr - 7}`, fill: 'none', stroke: s.c, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const mx = (s.a + s.b) / 2, ly = yBr + 20 + s.lvl * 15;
    S('path', { d: `M${mx},${yBr}V${ly}H${ccx}V${cy0}`, fill: 'none', stroke: s.c, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    S('circle', { cx: ccx, cy: cy0, r: 3.6, fill: s.c }, g);
    // tarjeta
    S('rect', { x: cx, y: cy0, width: cw, height: chh, rx: 14, fill: '#fff', stroke: s.c, 'stroke-width': 1.8 }, g);
    S('path', { d: `M${cx + 14},${cy0}H${cx + cw - 14}`, stroke: s.c, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    const pw = tw(cd.tag, 11.5, 700, 0.9) + 22;
    S('rect', { x: cx + 20, y: cy0 + 24, width: pw, height: 22, rx: 11, fill: tint[cd.k] }, g);
    TXT(g, cd.tag, cx + 20 + pw / 2, cy0 + 39, { size: 11.5, weight: 700, fill: s.c, ls: 0.9 });
    setMono(TXT(g, cd.big, cx + 20, cy0 + 96, { size: cd.big.length > 3 ? 44 : 52, weight: 700, fill: s.c, anchor: 'start' }));
    TXT(g, cd.title, cx + 20, cy0 + 132, { size: 18.5, weight: 700, anchor: 'start', fill: C.ink });
    wrap(cd.body, cw - 40, 15, 400).forEach((ln, li) => TXT(g, ln, cx + 20, cy0 + 170 + li * 21.5, { size: 15, anchor: 'start', fill: C.ink2 }));
  });
  // ejemplos reales
  const ex = [['AMARENA', '2000001011058', '100041129'], ['DULCE DE LECHE', '2000023011050', '100041130'], ['CREMA DEL CIELO', '2000053011051', '100041131']];
  const ex0 = 1010;
  TXT(g, 'Tres baldes reales', ex0, 44, { size: 18, weight: 700, anchor: 'start', fill: C.ink });
  TXT(g, 'Etiquetas de la balanza del 29/10/2026, todas de 1,105 kg', ex0, 66, { size: 13.5, anchor: 'start', fill: C.muted });
  ex.forEach((r, i) => {
    const y = 104 + i * 82;
    S('rect', { x: ex0, y: y - 18, width: 468, height: 68, rx: 10, fill: '#F6F9F7', stroke: C.grid, 'stroke-width': 1.2 }, g);
    TXT(g, r[0], ex0 + 16, y + 3, { size: 12.5, weight: 700, anchor: 'start', fill: C.muted, ls: 1 });
    const c = r[1];
    const t = S('text', { x: ex0 + 16, y: y + 38, 'font-family': MONO, 'font-size': 25, 'font-weight': 700, 'text-anchor': 'start' }, g);
    [[c[0], col.pre], [' ', col.pre], [c.slice(1, 7), '#0E5247'], [' ', col.pre], [c.slice(7, 12), '#74500D'], [' ', col.pre], [c[12], '#475467']].forEach(([s, f]) => { const ts = S('tspan', { fill: f, 'xml:space': 'preserve' }, t); ts.textContent = s; });
    TXT(g, 'serie impresa', ex0 + 456, y + 3, { size: 11, weight: 600, anchor: 'end', fill: C.faint });
    setMono(TXT(g, r[2], ex0 + 456, y + 36, { size: 17, weight: 600, anchor: 'end', fill: C.ink2 }));
  });
  return svg;
}

function labelSvg() {
  const W = 980, H = 440;
  const svg = S('svg', { xmlns: 'http://www.w3.org/2000/svg', width: W, height: H, viewBox: `0 0 ${W} ${H}`, 'font-family': FONT });
  const g = S('g', {}, svg);
  S('rect', { x: 6, y: 10, width: 556, height: 410, rx: 18, fill: '#000', opacity: 0.06 }, g);
  S('rect', { x: 2, y: 4, width: 556, height: 410, rx: 18, fill: '#fff', stroke: '#B7C4BE', 'stroke-width': 2 }, g);
  const T = (s, x, y, o) => TXT(g, s, x, y, Object.assign({ fill: '#111', anchor: 'start' }, o));
  const mono = (t) => { t.setAttribute('font-family', MONO); return t; };
  TXT(g, 'GLACE S.A', 280, 56, { size: 25, weight: 500, fill: '#111', ls: 0.6 });
  TXT(g, 'AMARENA', 280, 106, { size: 44, weight: 700, fill: '#111' });
  /* código de barras real de la etiqueta */
  const bx = 46, by = 134, mw = 3.0, bh = 104, ext = 12;
  EAN.bars(g, '2000001011058', bx, by, mw, bh, ext, '#111');
  const dy = by + bh + ext + 2;
  const dgs = '2000001011058';
  const mk = (ch, x) => mono(TXT(g, ch, x, dy + 12, { size: 14, fill: '#111', anchor: 'middle' }));
  mk(dgs[0], bx - 13);
  for (let i = 0; i < 6; i++) mk(dgs[1 + i], bx + (3 + 7 * i + 3.5) * mw);
  for (let i = 0; i < 6; i++) mk(dgs[7 + i], bx + (50 + 7 * i + 3.5) * mw);
  /* peso */
  T('PESO', 356, 202, { size: 21, fill: '#222' });
  T('1.105 kg', 356, 246, { size: 38, weight: 700 });
  /* fechas */
  T('FECHA DE ELABORACIÓN', 52, 296, { size: 14.5, fill: '#333' });
  T('29/10/26', 246, 296, { size: 17, fill: '#111' });
  T('FECHA DE VENCIMIENTO', 52, 336, { size: 14.5, fill: '#333' });
  T('26/02/27', 246, 336, { size: 17, fill: '#111' });
  T('Lote:', 356, 296, { size: 22, fill: '#222' });
  T('29/10/26', 418, 297, { size: 27, weight: 600 });
  mono(T('100041129', 380, 336, { size: 19, fill: '#222' }));
  TXT(g, 'Etiqueta de la balanza (ejemplo real)', 280, 396, { size: 12.5, fill: C.faint, ls: 0.4 });
  /* marcadores numerados */
  const mkr = (n, x, y) => { S('circle', { cx: x, cy: y, r: 12, fill: C.ek }, g); TXT(g, String(n), x, y + 4.5, { size: 13.5, weight: 700, fill: '#fff' }); };
  mkr(1, 27, 120); mkr(2, 436, 194); mkr(3, 29, 291); mkr(4, 29, 331); mkr(5, 512, 330);
  /* leyenda */
  const items = [
    [1, 'Código de barras EAN-13', 'Lleva el sabor y el peso. Es lo único que e-Karú lee al escanear.'],
    [2, 'Peso neto', 'Es el mismo dato que va dentro del código.'],
    [3, 'Fecha de elaboración = lote', 'No viaja en el código: e-Karú la toma de la Orden de Producción.'],
    [4, 'Vencimiento = elaboración + 120 días', 'Tampoco viaja en el código: lo calcula e-Karú.'],
    [5, 'Número de serie impreso', 'Contador de la balanza. Hoy no está dentro del código; la propuesta es incluirlo.']
  ];
  let y = 22;
  items.forEach(([n, t, d]) => {
    S('circle', { cx: 604, cy: y + 12, r: 12, fill: C.ek }, g); TXT(g, String(n), 604, y + 16.5, { size: 13.5, weight: 700, fill: '#fff' });
    TXT(g, t, 628, y + 17, { size: 16, weight: 700, anchor: 'start', fill: C.ink });
    const ls = wrap(d, 330, 14.5, 400);
    ls.forEach((ln, i) => TXT(g, ln, 628, y + 40 + i * 20, { size: 14.5, anchor: 'start', fill: C.ink2 }));
    y += 28 + ls.length * 20 + 20;
  });
  return svg;
}

EXTRA.push(`
.tp .clash{display:grid;grid-template-columns:1fr 70px 1fr 70px 1.12fr;align-items:stretch}
.tp .clash .ar{display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;color:#5B6D66}
.tp .bxc{border:1.8px solid #1D7A6B;border-radius:14px;padding:18px 24px 20px;background:#fff;display:flex;flex-direction:column;gap:10px}
.tp .bxc.bad{border-color:#B3392E;background:#FDF4F3}
.tp .bxc.ok{background:#EEF7F4}
.tp .bxc .k{font-size:12px;font-weight:700;letter-spacing:1.2px;color:#0E5247}
.tp .bxc.bad .k{color:#B3392E}
.tp .bxc p{margin:0;font-size:15px;line-height:22px;color:#33453F}
.tp .cd{font-family:${MONO};font-size:22px;font-weight:700;letter-spacing:.5px;white-space:nowrap}
.tp .cd i{font-style:normal;padding:1px 4px;border-radius:5px}
.tp .sg-p{background:#E6EEEA;color:#14231F}.tp .sg-s{background:#D8EDE7;color:#0E5247}.tp .sg-w{background:#FBEBC8;color:#74500D}.tp .sg-c{background:#E4E7EC;color:#475467}.tp .sg-n{background:#E3ECFB;color:#1F4E9A}.tp .sg-d{background:#F6E3F0;color:#7A2E62}.tp .sg-r{background:#FBE1DE;color:#9B2C22}
.tp .bcode{display:flex;flex-direction:column;gap:4px}
.tp .bcode svg{display:block}
.tp .bcode .cd{font-size:15px;font-weight:600}
.tp .rules{counter-reset:r;margin:0;padding:0;list-style:none}
.tp .rules li{position:relative;padding:11px 0 11px 46px;border-bottom:1px solid #E1E9E5;font-size:15.5px;line-height:22px;color:#33453F}
.tp .rules li:last-child{border-bottom:0}
.tp .rules li:before{counter-increment:r;content:counter(r);position:absolute;left:0;top:10px;width:30px;height:30px;border-radius:8px;background:#14231F;color:#fff;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center}
.tp .opt{border:1.8px solid #8FA29A;border-radius:14px;padding:20px 24px 22px;background:#fff;display:flex;flex-direction:column;gap:10px}
.tp .opt.rec{border-color:#1D7A6B;border-width:2.4px;background:#F4FAF8}
.tp .opt .tg{align-self:flex-start;font-size:11.5px;font-weight:700;letter-spacing:1.1px;padding:4px 10px;border-radius:10px;background:#E6EEEA;color:#33453F}
.tp .opt.rec .tg{background:#1D7A6B;color:#fff}
.tp .opt h3{margin:0;font-size:19px;line-height:25px}
.tp .opt p{margin:0;font-size:15px;line-height:22px;color:#33453F}
.tp .opt .meta{font-size:14px;line-height:20px;color:#5B6D66;border-top:1px solid #E1E9E5;padding-top:10px;margin-top:auto}
.tp .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.tp .stp{border:1.6px solid #8FA29A;border-radius:14px;padding:16px 20px 18px;background:#fff}
.tp .stp .sn{display:inline-flex;width:30px;height:30px;border-radius:15px;background:#1D7A6B;color:#fff;font-weight:700;font-size:15px;align-items:center;justify-content:center;margin-bottom:8px}
.tp .stp h4{margin:0 0 6px;font-size:16.5px;line-height:21px}
.tp .stp p{margin:0;font-size:14.6px;line-height:21px;color:#33453F}
.tp .stp .who{display:inline-block;margin-top:9px;font-size:12px;font-weight:700;letter-spacing:.8px;color:#0E5247;background:#D8EDE7;border-radius:9px;padding:2px 9px}
.tp .stp .who.gl{background:#FBEBC8;color:#74500D}
.tp ol.qs{margin:0;padding-left:24px}
.tp ol.qs li{font-size:15px;line-height:22px;color:#33453F;margin-bottom:8px}
`);
const seg = (parts) => `<span class="cd">${parts.map((p) => `<i class="sg-${p[1]}">${p[0]}</i>`).join(' ')}</span>`;
const bcode = (code, kind, w, h, label) => `<div class="bcode">${window.Eng.TP.barcode(code, kind, w, h).outerHTML}<span class="cd">${label || code}</span></div>`;

E.PAGES.codes = function () {
  const K = E.CAT, N = K.NEW;
  const pNew = N.prod(1), iNew = N.ins(1), pkNew = N.pack(1), idNew = N.idb(1), padNew = N.padreFix('2900002800088');
  const baldeSer = '200000101105000411293';

  /* ---------- el choque ---------- */
  const clash = `<div class="clash">
    <div class="bxc"><div class="k">BALDE DE AMARENA · BALANZA</div>${seg([['2', 'p'], ['000001', 's'], ['01105', 'w'], ['8', 'c']])}<p>2 + sabor <b>000001</b> + peso <b>1105 g</b> + control. Correcto.</p></div>
    <div class="ar">vs</div>
    <div class="bxc bad"><div class="k">PALITO CON COBERTURA · CATÁLOGO ACTUAL</div>${seg([['2', 'p'], ['000001', 's'], ['10001', 'r'], ['4', 'c']])}<p>Empieza igual que un balde. Al escanearlo, e-Karú leería <b>«Amarena, 10,001 kg»</b>. Además, el 4 final no es un dígito de control válido (solo ${K.nOk} de ${K.nAll} códigos lo tienen bien).</p></div>
    <div class="ar">→</div>
    <div class="bxc ok"><div class="k">PALITO CON COBERTURA · NUMERACIÓN NUEVA</div>${seg([['22', 'p'], ['0001', 'n'], ['261110', 'd'], [pNew[12], 'c']])}<p>Prefijo propio <b>22</b> + Nº de producto <b>0001</b> + fecha de elaboración <b>10/11/26</b> + control válido. No puede confundirse con un balde y ya trae su lote.</p></div>
  </div>`;

  /* ---------- mapa de prefijos ---------- */
  const rows = [
    ['20', 'Balde de helado', 'El sabor y el peso del balde', '2 + sabor (6) + peso en gramos (5) + control. Sin cambios. Regla: los códigos de sabor de la balanza quedan por debajo de 100000, así el balde siempre empieza con 20.', CH.bal, bcode('2000001011058', 'ean', 250, 50, '2 000001 01105 8'), refs('p2a', ['Blab', 'Ereg'])],
    ['2 + … + transacción', 'Balde único (propuesta)', 'Un balde puntual, con su número de transacción', '2 + sabor + peso + número de transacción de la balanza (8 dígitos) + control. Code 128, 21 dígitos. Se configura en Scale Manager (ver «Balde único»).', CH.bal, bcode(baldeSer, 'c128', 330, 50, '2 000001 01105 00041129 3'), refs('p2a', ['Ereg'])],
    ['22', 'Producto terminado', 'Un producto y su fecha de elaboración (lote)', '22 + Nº de producto (4) + fecha AAMMDD (6) + control. El Nº es el número actual del catálogo (Palito con cobertura = 0001). Etiqueta de 2 × 3 cm, impresa como EAN-13.', CH.lab, bcode(pNew, 'ean', 250, 50, N.fmt2(pNew)), refs('p2b', ['Ehijo', 'Pprint'])],
    ['23', 'Promo Pack', 'Un pack de 12 palitos', '23 + número de paquete (10) + control. e-Karú lo asocia a los 12 palitos escaneados.', CH.lab, bcode(pkNew, 'ean', 250, 50, '23 0000000001 6'), refs('p2b', ['Epk'])],
    ['24', 'ID de balde (plan B)', 'Un balde, si la balanza no puede incluir la serie', '24 + número correlativo (10) + control. e-Karú lo imprime al registrar el balde y se pega junto a la etiqueta de la balanza.', CH.lab, bcode(idNew, 'ean', 250, 50, '24 0000000001 3'), refs('p2a', ['Ereg'])],
    ['25', 'Insumo interno', 'Un insumo que llega sin código y su fecha de recepción', '25 + Nº de insumo (4) + fecha de recepción AAMMDD (6) + control. Frutas a granel, conos, vasos e isopor de 1 kg, ½ kg y ¼ kg.', CH.lab, bcode(iNew, 'ean', 250, 50, N.fmt2(iNew)), refs('p1a', ['Alab'])],
    ['29', 'Grupo PADRE', 'Un grupo de consumibles (vasos, conos, potes)', 'Mantiene su número (2 9000NN 80008). Propuesta: corregir solo el último dígito en el mismo cambio (Pote 1 kg: último dígito <b>8</b> → <b>1</b>); así los 9 PADRE también cierran el dígito de control.', CH.lab, bcode(padNew, 'ean', 250, 50, '2 900002 80008 1'), refs('p2b', ['Epadre'])],
    ['otro', 'EAN del proveedor', 'Un insumo comprado', 'El código del empaque (en Paraguay suele empezar con 784). e-Karú lo vincula una vez al insumo y después lo reconoce solo.', CH.prov, '<span class="mut" style="color:#8A9A93">el del empaque</span>', refs('p1a', ['Asc', 'Erec'])],
    ['21 · 26–28', 'Reservados', 'Nada por ahora', 'Quedan libres para usos futuros. Si se escanean hoy, e-Karú los rechaza.', '', '', '']
  ];
  const trs = rows.map((r) => `<tr><td class="k" style="width:7%"><span class="cd" style="font-size:20px">${r[0]}</span></td><td class="k" style="width:11%">${r[1]}</td><td style="width:14%">${r[2]}</td><td>${r[3]}</td><td style="width:11%"><div class="chips">${r[4]}</div></td><td style="width:15%">${r[5]}</td><td style="width:6%;white-space:nowrap">${r[6]}</td></tr>`).join('');
  const map = `<table class="tbl"><thead><tr><th>PREFIJO</th><th>TIPO</th><th>QUÉ IDENTIFICA</th><th>FORMATO Y REGLAS</th><th>LO IMPRIME</th><th>EJEMPLO</th><th>PASOS</th></tr></thead><tbody>${trs}</tbody></table>
  <div class="note" style="margin-top:18px"><b>Por qué 20 a 29:</b> GS1 reserva los prefijos 20 a 29 para uso interno de cada empresa; ningún GTIN comercial los usa. Si un proveedor trae etiquetas de peso variable que empiezan con 2, e-Karú las trata por la tabla de equivalencias. Dentro de ese rango, cada familia tiene su prefijo y e-Karú sabe qué es un código antes de buscarlo. La etiqueta nutricional de 10 × 8 cm no lleva código. En la factura al cliente va el código escaneado de cada línea (3E).</div>`;

  /* ---------- cómo lee e-Karú ---------- */
  const rules = `<ol class="rules">
    <li><b>21 dígitos que empiezan con 2</b> → balde con transacción: sabor (dígitos 2–7), peso (8–12) y transacción (13–20); se valida el control del final. Si esa transacción ya está registrada, avisa «balde ya escaneado».</li>
    <li><b>13 dígitos</b> → valida el dígito de control EAN-13. Si no cierra, rechaza y pide escanear de nuevo.</li>
    <li><b>20</b> → balde: el sabor tiene que existir en el maestro y el peso estar en el rango del envase (ej.: 0,5 a 12 kg). Si no, rechaza.</li>
    <li><b>22</b> → producto: Nº de producto existente y fecha válida, no futura. La fecha es el lote.</li>
    <li><b>23 · 24 · 25 · 29</b> → Promo Pack, ID de balde, insumo interno (Nº + fecha de recepción) y grupo PADRE.</li>
    <li><b>21 y 26 a 28</b> → reservados: rechaza.</li>
    <li><b>Cualquier otro</b> → EAN de proveedor: lo busca en las equivalencias; si no existe, pide vincularlo (1A).</li>
  </ol>`;
  const trans = `<div class="card"><h3>Durante el cambio</h3><ul class="bl"><li>Los ${K.nProd} códigos viejos de producto se aceptan solo como <b>tabla de transición</b>: e-Karú busca primero el código exacto en esa tabla, antes de las reglas 2 y 3. Así un palito viejo nunca se lee como balde.</li><li>La tabla se apaga en la fecha de corte (propuesta: 2 semanas después de reetiquetar el stock).</li><li>e-Karú Etiquetas imprime los códigos nuevos como <b>EAN-13</b> (comando TSPL «EAN13»; la impresora calcula el control). Hoy los imprime como Code 128 porque los viejos no cierran.</li><li>Ningún número se reutiliza: un producto dado de baja conserva su Nº.</li><li><b>QR del Club:</b> la caja del salón lo lee solo desde el botón del Club (★), para elegir al socio. No es un código de producto y no pasa por estas reglas.</li></ul></div>`;

  /* ---------- balde único ---------- */
  const anat = `<div class="card" style="padding:24px 28px"><div class="lbl">BALDE ÚNICO · CODE 128 DE 21 DÍGITOS · FORMATO 2PPPPPPQQQQQNNNNNNNNC</div>${seg([['2', 'p'], ['000001', 's'], ['01105', 'w'], ['00041129', 'n'], ['3', 'c']])}<div style="margin:16px 0 10px">${window.Eng.TP.barcode(baldeSer, 'c128', 760, 92).outerHTML}</div><p style="margin:0;font-size:15px;line-height:22px;color:#33453F">Las mismas letras que usa hoy Scale Manager (P = PLU o sabor, Q = peso, C = control) + N, el número de transacción que cambia en cada pesaje. Con 21 dígitos el Code 128 mide unos 4 cm con un módulo de 0,25 mm. e-Karú sigue leyendo sabor y peso igual, y la transacción hace único a cada balde: al registrarlo en la fábrica queda atado a su fecha de elaboración (lote) y en el despacho se sabe exactamente qué balde salió.</p></div>`;
  const opts = `<div class="three" style="gap:22px">
    <div class="opt rec"><span class="tg">A · RECOMENDADA</span><h3>La balanza pone la transacción en el código</h3><p>Se cambia una vez el formato del código en Scale Manager: Code 128 con 2PPPPPPQQQQQNNNNNNNNC (21 dígitos). El campo N ya existe en el software.</p><p class="meta">Glacé: configuración y prueba en Scale Manager. e-Karú: regla 1 del lector. Sin pasos extra en la planta.</p></div>
    <div class="opt"><span class="tg">B · SI LA BALANZA NO PUEDE</span><h3>e-Karú le da un ID a cada balde</h3><p>Al escanear el balde en la fábrica, e-Karú lo registra e imprime en la HPRT una etiqueta chica con un ID 24… que se pega al lado. De ahí en adelante se escanea ese ID.</p><p class="meta">Una etiqueta y un pegado más por balde. Funciona con cualquier balanza.</p></div>
    <div class="opt"><span class="tg">C · MIENTRAS TANTO (ETAPAS 0 Y 1)</span><h3>Sin serie, con reglas</h3><p>Cada escaneo crea un balde. En el despacho, e-Karú asigna el lote más viejo de ese sabor y peso (FEFO). Al cierre de turno se compara lo escaneado con el conteo físico.</p><p class="meta">No detecta un doble escaneo ni asegura el lote exacto: sirve para arrancar, no como solución final.</p></div>
  </div>`;
  const mt = `<div class="card"><h3>Prueba en Scale Manager (visto el 10/11/2026)</h3><p style="margin-bottom:10px">Hoy el formato es <span class="mono">2PPPPPPQQQQQC</span> (EAN-13). El software ofrece además N (transacción, 2–8 dígitos), D (fecha) y J (hora).</p><ol class="qs">
    <li>En «Barcode Type», ver si se puede elegir Code 128. Si no, queda la opción B.</li>
    <li>En «Barcode Format», cargar <span class="mono">2PPPPPPQQQQQNNNNNNNNC</span>.</li>
    <li>Imprimir dos etiquetas del mismo sabor y peso: los dos códigos tienen que ser distintos.</li>
    <li>Ver que N coincida con la serie impresa en la etiqueta (o con sus últimos 8 dígitos) y que no se reinicie al apagar la balanza.</li>
    <li>Escanear las dos etiquetas con el escáner de la fábrica y con el del depósito.</li>
    <li>Opcional: agregar la fecha (DDDDDD = AAMMDD) antes de N; el código queda de 27 dígitos y trae el lote.</li></ol></div>`;

  /* ---------- migración ---------- */
  const st = [
    ['Congelar', 'No imprimir más etiquetas de productos hasta el corte (ya pedido por e-Karú).', 'Glacé', 1],
    ['Aprobar los prefijos', 'Glacé y e-Karú aprueban esta página: 20, 22, 23, 24, 25 y 29.', 'Glacé + e-Karú', 1],
    ['Nº de producto', `Cada producto conserva su número actual (0001 a ${String(K.nProd).padStart(4, '0')}). La tabla está en 2E.`, 'e-Karú', 0],
    ['Lector por prefijos', 'e-Karú agrega las 7 reglas de arriba, el campo «Nº de producto» y la tabla de transición.', 'e-Karú', 0],
    ['e-Karú Etiquetas', 'Arma 22 + Nº + fecha de elaboración e imprime EAN-13. Corrige el último dígito de los 9 PADRE.', 'Glacé', 1],
    ['Prueba', 'Una etiqueta de cada tipo, leída con cada escáner (fábrica, depósito, sucursales y cajas). Listo cuando el 100 % se lee y e-Karú muestra producto y fecha correctos.', 'Glacé + e-Karú', 1],
    ['Reetiquetar', 'Inventario del stock de productos: etiqueta nueva con su fecha de elaboración real (o la de la etiqueta vieja).', 'Glacé', 1],
    ['Corte', 'Desde esa fecha solo valen los códigos nuevos; la tabla de transición se apaga 2 semanas después.', 'Glacé + e-Karú', 1]
  ];
  const steps = `<div class="steps">${st.map((s, i) => `<div class="stp"><span class="sn">${i + 1}</span><h4>${s[0]}</h4><p>${s[1]}</p><span class="who${s[3] ? ' gl' : ''}">${s[2]}</span></div>`).join('')}</div>`;

  const html = head('bars', 'Códigos de barras',
    'Numeración v2. Cada familia de códigos tiene su propio prefijo, así ningún código de producto se confunde con un balde. Cómo está armado el código del balde, cómo hacerlo único, qué prefijo usa cada código, cómo los lee e-Karú y cómo se hace el cambio.') +
    `<section><div class="two" style="grid-template-columns:1500px 980px;gap:40px"><div><div class="st"><span class="pill">BALDES</span><h2>Anatomía del código que imprime la balanza</h2></div><p class="sd">Ejemplo real: balde de Amarena de 1,105 kg. Cada color es una parte distinta del mismo código de 13 dígitos.</p><div id="fa"></div></div><div><div class="st"><span class="pill">ETIQUETA</span><h2>Qué trae la etiqueta de la balanza</h2></div><p class="sd">No todo lo que se imprime está dentro del código de barras.</p><div id="fl"></div><div class="note" style="margin-top:8px"><b>Problema:</b> dos baldes del mismo sabor y peso llevan hoy el mismo código, y en el despacho no se sabe cuál es cuál ni de qué lote. La solución está en «Balde único», más abajo.</div></div></div></section>` +
    sec('EL CHOQUE', 'Por qué cambian los códigos de producto', 'Los códigos actuales del catálogo empiezan igual que los de la balanza. La solución es darles un prefijo propio y recalcular el control, en un solo cambio.', clash) +
    sec('PREFIJOS', 'Un prefijo por familia de códigos', 'Todos los códigos internos tienen 13 dígitos con dígito de control EAN-13 válido, salvo el balde con serie (Code 128 de 21 dígitos).', map) +
    sec('LECTURA', 'Cómo interpreta e-Karú cada escaneo', 'Las reglas se aplican en este orden, en todos los puestos: recepción, planta, depósito, despacho, salones, sucursales y cajas.', `<div class="two" style="grid-template-columns:1.45fr 1fr;gap:28px"><div class="card">${rules}</div>${trans}</div>`) +
    sec('BALDE ÚNICO', 'Cada balde con su propio código', 'La balanza ya imprime un número de serie en cada etiqueta. Si ese número entra en el código de barras, cada balde es único y la trazabilidad es real.', `<div class="two" style="grid-template-columns:1fr 1fr;gap:28px;margin-bottom:24px">${anat}${mt}</div>${opts}`) +
    sec('CAMBIO', 'Cómo pasar a la numeración nueva (Etapa 0)', 'Ocho pasos cortos. Los baldes no cambian; solo productos, PADRE (último dígito) e insumos internos nuevos.', steps);
  return mount(html, (el) => { el.querySelector('#fa').appendChild(anatomySvg()); el.querySelector('#fl').appendChild(labelSvg()); });
};


/* ================================================================== 3 · QUÉ DEBE HACER e-KARÚ */
E.PAGES.scope = function () {
  const R = refs;
  const K = E.CAT;
  const mods = [
    ['Recepción de materia prima', [
      ['Reconocer cada insumo por su código de barras (EAN del proveedor o código interno de 13 dígitos) y vincular un código nuevo solo la primera vez.', R('p1a', ['Asc', 'Erec'])],
      ['Crear e imprimir el código interno 25 (Nº de insumo + fecha de recepción) de los insumos que llegan sin código: frutas a granel, conos, vasos e isopor de 1 kg, ½ kg y ¼ kg.', R('p1a', ['Alab'])],
      ['Registrar la entrada con cantidad, lote y vencimiento, en estado «pendiente de factura».', R('p1a', ['Aqty', 'Estock'])],
      ['Rechazo por calidad con motivo y foto, reclamo formal por correo al proveedor y seguimiento: reposición o nota de crédito.', R('p1a', ['A2', 'Ecl', 'Enc'])]]],
    ['Facturas de compra y costos', [
      ['Leer el CDC del QR del KuDE en la recepción y traer la factura de SIFEN por su CDC (con el certificado de Glacé): ítems, cantidades, precios e IVA; reintentar si todavía no está.', R('p1b', ['Tqr', 'Ecdc'])],
      ['Subir cada semana y al cierre el Excel «DetalleComprobantesRegistrados» de Marangatu: consultar los CDC que falten, marcar las facturas de papel y controlar que no falte ninguna. Ítems de papel con foto o a mano.', R('p1b', ['Tdl', 'Tup', 'Eexc', 'Titem'])],
      ['Emparejar cada línea con las recepciones pendientes, asignar precio, IVA y costo, y cerrar la compra.', R('p1b', ['Ematch', 'Eprice'])],
      ['Marcar diferencias (sin recepción, cantidad distinta, insumo sin equivalencia) y resolverlas: equivalencia, ajuste o nota de crédito.', R('p1b', ['Ediff', 'Tres'])],
      ['Guardar las equivalencias ítem de factura ↔ insumo y el historial de precios y costos.', '']]],
    ['Producción y baldes', [
      ['Recetas por niveles (base + variación de sabor; en «base blanca», base + mezcla intermedia + sabor), escalables por volumen; crear la Orden de Producción y la Hoja de Dosificación.', R('p2a', ['Ebom', 'Eord'])],
      ['Abrir la orden del día (planificada por el MRP desde la Etapa 5); avisar a Compras si faltan insumos y descontar los insumos escaneados por lote (FEFO), comparándolos con la Hoja de Dosificación.', R('p2a', ['Psel', 'Ppick', 'Eale', 'Econs'])],
      ['Leer el código del balde (sabor + peso, y la serie cuando esté), validar el dígito de control y registrar el balde con lote y vencimiento. La producción se registra sola al escanear.', R('p2a', ['Ereg'])],
      ['Cerrar la orden con el rendimiento real frente al teórico y la merma, y liberar los baldes.', R('p2a', ['Eclose'])]]],
    ['Bases, sabores y categorías', [
      [`Maestro de ${E.HEL.bases.length} bases y ${E.HEL.nSab} sabores, más los ${E.HEL.extra.length} sabores de la balanza que se siguen produciendo (base a confirmar): cada sabor pertenece a una base (y, si la tiene, a una subcategoría como «base blanca») y trae su código de sabor de la balanza.`, R('p2c', ['Pb', 'Es', 'Ps'])],
      ['Elegir en la tablet base, sabor y volumen (150, 250 o 350 L), mostrando solo las combinaciones que existen.', R('p2c', ['Pv'])],
      [`Maestro de categorías y productos: ${K.CATS.length} categorías, ${K.nProd} productos y ${K.PADRE.length} grupos PADRE, cada uno con su código de barras.`, R('p2c', ['Pc', 'Ec', 'Pp'])]]],
    ['Etiquetas (e-Karú Etiquetas)', [
      ['Armar el código 22 + Nº de producto + fecha de elaboración, el PADRE 29 y el ID de paquete 23 del Promo Pack; imprimir todo como EAN-13 válido.', R('p2b', ['Ehijo', 'Epadre', 'Epk'])],
      ['Imprimir en la impresora térmica las etiquetas de 2 × 3 cm, la nutricional de 10 × 8 cm y los códigos internos de insumos.', R('p1a', ['Alab']) + R('p2a', ['Pstick']) + R('p2b', ['Pprint', 'Ppr12'])],
      ['Sumar al stock por producto y fecha de elaboración, o por grupo.', R('p2b', ['Estock'])]]],
    ['Pedidos y despacho a salones y sucursales', [
      ['Pedido de cada local en su tablet (cargado a mano en el MVP; sugerido por e-Karú desde la Etapa 5) y pantalla Central de Pedidos con la disponibilidad real.', R('p3a', ['T1', 'E1', 'T2'])],
      ['Orden de Picking con FEFO, guiada por tablet; cierre con Orden de Despacho y stock «en tránsito».', R('p3a', ['E3', 'Tpick', 'Edisp'])],
      ['Estados del pedido: sugerido, pendiente, en picking, en tránsito, entregado y recibido parcialmente.', '']]],
    ['Recepción en el local y faltantes', [
      ['Escanear lo que llega y compararlo con la Orden de Despacho: código, lote y cantidad. Subir al stock solo lo escaneado y avisar a la Central.', R('p3a', ['R2', 'Ev', 'Eok', 'Epart'])],
      ['Crear el Backorder (desde el armado del pedido o desde la recepción) y clasificarlo: producción propia o insumo externo.', R('p3a', ['Ebo']) + R('p3a', ['Eal'])],
      ['Programar el faltante en la cola de producción o generar la orden de compra al distribuidor, y confirmar a la Central su disponibilidad.', R('p3b', ['Eprog', 'Epo', 'Eready'])]]],
    ['Venta a clientes con factura', [
      ['Recibir el pedido del cliente (portal de pedidos o tablet) con su lista de precios: mayorista, minorista o franquicia.', R('p3c', ['Tped', 'Eord'])],
      ['Escanear un balde o un producto y que e-Karú agregue la línea a la factura con su código de barras y el precio de la lista del cliente.', R('p3c', ['Tscan', 'Eline'])],
      ['Registrar con ese mismo escaneo la salida de la fábrica y descontar el stock por lote.', R('p3c', ['Eexit'])],
      ['Emitir la factura electrónica en SIFEN con el código de barras de cada línea y entregarla con la mercadería.', R('p3c', ['Efac', 'Tdel'])]]],
    ['Nota de Remisión y consignación', [
      ['Generar la Nota de Remisión Electrónica con lo escaneado, para los destinos que la requieren: motivo, destino, transporte e ítems con su código de barras, sin precios.', R('p3d', ['Enre', 'Tveh'])],
      ['Enviarla a SIFEN, esperar la aprobación antes de que salga el camión e imprimir el KuDE.', R('p3d', ['Esend', 'Eapp', 'Tprint'])],
      ['Consignación a clientes: sumar por código de barras lo vendido en el período y emitir la factura final con el código de cada línea.', R('p3d', ['Esum', 'Efin'])]]],
    ['Planificación (MRP)', [
      ['Registrar la demanda real por sabor, producto, canal y local y pronosticarla (historia reciente con temporada, feriados y promociones).', R('p0', ['Edem', 'Efc'])],
      ['Plan maestro por sabor y producto; recetas en tres niveles (base → mezcla base blanca → sabor) en tandas de 150, 250 o 350 L; necesidad neta de cada insumo.', R('p0', ['Emps', 'Ebom', 'Enet'])],
      ['Proponer el orden de las tandas (limpieza y alérgenos), aprobación del plan y ventana congelada de 48 h.', R('p0', ['Eseq', 'Pok'])],
      ['Generar las Órdenes de Producción y de Compra; cada noche, comparar plan y real y replanificar lo no congelado.', R('p0', ['Eop', 'Eoc', 'Ecmp', 'Erepl'])]]],
    ['Reposición de salones y sucursales', [
      ['Mínimo y máximo por local y sabor, con la venta y los días hasta el próximo camión.', ''],
      ['Pedido sugerido de cada local cada noche, en baldes enteros y unidades; el local lo revisa y lo confirma.', R('p0', ['Erp']) + R('p3a', ['T1'])],
      ['Indicadores por local: pedidos completos, quiebres en la vitrina y días de stock.', '']]],
    ['Salones: e-Karú Ventas y Club', [
      ['Venta por grupo PADRE con sabores y balde por sabor, como en el prototipo: 60 g por bocha.', R('p3h', ['Kpad', 'Ksab', 'Eprep'])],
      ['Botón del Club en la misma pantalla: elegir al socio antes de cobrar; premio en Gs. 0 que descuenta stock; sello automático en el ticket.', R('p3h', ['Ksoc', 'Evta'])],
      ['Ventas desde Mesas que también sumen sellos.', ''],
      ['Balde terminado, rendimiento por balde y cierre del día que alimenta el pedido sugerido.', R('p3h', ['Kfin', 'Erend', 'Ecie'])]]],
    ['Calidad y estados del stock', [
      ['Estados por lote y por balde: en control, liberado, reservado, en tránsito, en el local, abierto y terminado. Bloqueado y vencido no cuentan como disponible.', R('p2a', ['Ereg', 'Eclose'])],
      ['No conformidad con causa, acción, responsable y fecha; se cierra después de tres lotes sin repetir la falla.', ''],
      ['Compra contra Orden de Compra: control de tres vías (orden, recepción y factura).', R('p1a', ['Erec', 'Estock']) + R('p1b', ['Ematch'])]]],
    ['Clientes y franquicias', [
      ['Portal de pedidos por cliente con su lista de precios, hora de corte, pedido mínimo y estado del pedido.', R('p3c', ['Tped'])],
      ['Límite de crédito y plazo por cliente; pedido retenido si hay facturas vencidas.', ''],
      ['Pedidos agrupados por ruta y día de entrega; devoluciones escaneadas con nota de crédito.', ''],
      ['Franquicias: cliente con lista franquicia y su propia caja e-Karú con el Club; opción de compartir su venta (página 15).', '']]],
    ['Transversales', [
      ['Un solo catálogo maestro de productos, insumos, bases, sabores y códigos de barras, con un lector por prefijos igual en todos los puestos (página 3).', ''],
      ['Trazabilidad por lote del insumo al balde, al local y a la factura del cliente (alcance a definir).', ''],
      ['Uso ágil con tablet y escáner dentro de las cámaras frías; permisos por rol (planificación, depósito, planta, central, ventas, compras, salón, sucursal).', ''],
      ['KPIs y reportes: costo real, evolución de precios, mermas, faltantes por producto y proveedor, vencimientos próximos, ventas por cliente y lista de precios.', '']]]
  ];
  const LATER = ['Planificación (MRP)', 'Reposición de salones y sucursales', 'Clientes y franquicias'];
  const mcards = mods.map((m, i) => `<div class="card mod"><div style="margin:-6px 0 8px"><span class="stt ${LATER.includes(m[0]) ? 'pa' : 'ok'}">${LATER.includes(m[0]) ? 'DESPUÉS · ETAPA 5' : 'MVP'}</span></div><h3><span class="mn">${i + 1}</span>${m[0]}</h3><ul class="bl">${m[1].map((b) => `<li>${b[0]}${b[1]}</li>`).join('')}</ul></div>`).join('');
  const ops = opsOrdered();
  const OPL = { gl: ['#B3392E', 'FALTA UN DATO DE GLACÉ'], ct: ['#6B4FA0', 'CON EL CONTADOR'], ek: ['#1D7A6B', 'PROBAR CON e-KARÚ'], ap: ['#2B7A3B', 'PROPUESTA LISTA: SOLO APROBAR'] };
  const cnt = (k) => ops.filter((o) => OPST[o[0]] === k).length;
  const ocards = ops.map((o, i) => `<div class="op"><div class="n">${i + 1}</div><div><div style="font-size:11.5px;font-weight:700;letter-spacing:1px;color:${OPL[OPST[o[0]]][0]};margin-bottom:4px">${OPL[OPST[o[0]]][1]}</div><h4>${o[0]}</h4><p>${o[1]}</p><p class="pp"><b>Propuesta:</b> ${o[2]}</p></div></div>`).join('');
  const outScope = `<div class="note" style="margin-top:24px"><b>Ahora dentro del documento:</b> la venta en los salones (Updates 1 a 4 del prototipo e-Karú Ventas: conos, vasos, milkshakes, smoothies y brownie con helado) se une con el Club y con la planificación en la página 14.</div>`;
  const mat = [
    ['Excel de Marangatu', '«DetalleComprobantesRegistrados», octubre 2026', 'Entregado. 168 facturas de compra en 28 columnas, una fila por factura y sin ítems. 167 con CDC de 44 caracteres y 1 sin CDC: de ahí salen los CDC que e-Karú consulta.', 'ok'],
    ['Bases y sabores', 'Lista de Glacé y PLU de la balanza, 10/11/2026', `Recibidas: ${E.HEL.bases.length} bases y ${E.HEL.nSab} sabores, y la lista de artículos de la balanza. ${E.HEL.nCod} con código, ${E.HEL.nNew} a crear en la balanza y ${E.HEL.extra.length} sabores más de la balanza con base a confirmar (ver 2E).`, 'pa'],
    ['Factura de papel', 'Ejemplo real con sus ítems', 'Glacé la va a entregar. Sirve para definir cómo se cargan sus ítems (punto ' + opNo('Facturas de papel: carga de los ítems') + ').', 'pe'],
    ['Catálogo de productos', '«Liste – Katalog» y e-Karú Etiquetas', `Entregado. ${K.CATS.length} categorías, ${K.nProd} productos y ${K.PADRE.length} grupos PADRE. Su Nº de producto pasa al código nuevo 22 (ver 2E).`, 'ok'],
    ['Etiquetas de la balanza', 'Tres baldes reales del 29/10/2026', 'Entregadas. De ahí sale la anatomía del código del balde y el número de serie (página 3).', 'ok'],
    ['Presentación e-Karú Club', 'Capturas reales con datos de demostración', 'Entregada. Cómo se suma un socio, cómo pone el sello la venta y qué muestra el tablero (página 14).', 'ok'],
    ['Ventas por sabor', 'Historial de las cajas de los salones', 'Pendiente. Hace falta para el primer pronóstico (punto ' + opNo('Historial de ventas por sabor') + ').', 'pe'],
    ['Locales y clientes', 'Salones, sucursales, franquicias, mayoristas y minoristas', 'Pendiente. Con su tipo, lista de precios y días de reparto (puntos ' + opNo('Salones y sucursales: cuál es cuál') + ' y ' + opNo('Franquicias: forma de trabajo') + ').', 'pe']
  ];
  const SC = { ok: ['#2B7A3B', 'ENTREGADO'], pa: ['#B8801A', 'PARCIAL'], pe: ['#B3392E', 'PENDIENTE'] };
  const mcard = mat.map((m) => `<div class="card"><div class="lbl" style="color:${SC[m[3]][0]}">${SC[m[3]][1]}</div><h3>${m[0]}</h3><p style="font-weight:600;color:#14231F;margin-bottom:8px">${m[1]}</p><p>${m[2]}</p></div>`).join('');
  const html = head('check', 'Qué debe hacer e-Karú',
    'Requisitos que salen de la planificación, los tres procesos, los salones y los canales, agrupados por módulo. Los números negros son el paso del diagrama donde aparece cada uno. Al final, los puntos que hay que definir juntos y el material de ejemplo.') +
    sec('REQUISITOS', 'Quince módulos: doce del MVP y tres para después', 'Lo que e-Karú tiene que poder hacer para planificar, recibir, producir, despachar y vender con un solo sistema y solo códigos de barras. En la reunión, e-Karú marca en cada uno qué existe hoy, qué hay que desarrollar y qué queda fuera de e-Karú.', `<div class="grid5">${mcards}</div>${outScope}`) +
    sec('PUNTOS A DEFINIR', `${ops.length} puntos: ${cnt('gl')} esperan un dato de Glacé, ${cnt('ct')} al contador, ${cnt('ek')} una prueba con e-Karú y ${cnt('ap')} solo una aprobación`, 'Son los detalles que no se pueden inventar desde un diagrama: hay que decidirlos entre Glacé y los desarrolladores de e-Karú.', `<div class="grid3">${ocards}</div>`) +
    sec('MATERIAL DE EJEMPLO', 'Con qué datos reales se puede probar', 'Lo que Glacé ya entregó y lo que falta, para que e-Karú pruebe facturas, códigos, Club y pronóstico con datos reales.', `<div class="grid4">${mcard}</div>`);
  return mount(html);
};

/* ------------------------------------------------------------------ API para las páginas híbridas (diagrama + texto) */
E.TP = { head, sec, mount, embed, CH, refs, stepRef, ICON, dot, MONO, EAN, opNo, opsList, addCss: (c) => { EXTRA.push(c); } };
})();
