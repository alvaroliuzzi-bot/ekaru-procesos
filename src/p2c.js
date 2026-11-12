/* PROCESO 2 · página C — bases, sabores y categorías (diagrama 2E + datos maestros) */
(function () {
'use strict';
const E = window.Eng;
const T = E.TP;

T.addCss(`
.tp .eqs{display:grid;grid-template-columns:1.05fr 40px 1.2fr 40px .85fr 40px 1.1fr;align-items:stretch;margin-bottom:26px}
.tp .eqs .o2{display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:700;color:#5B6D66}
.tp .eqs .bx{border:1.8px solid #1D7A6B;border-radius:14px;padding:16px 22px 20px;background:#fff}
.tp .eqs .bx.res{background:#EEF7F4}
.tp .eqs .k{font-size:12px;font-weight:700;letter-spacing:1.2px;color:#0E5247;margin:0 0 6px}
.tp .eqs h3{margin:0 0 9px;font-size:19.5px;line-height:25px;font-weight:700}
.tp .eqs p{margin:0;font-size:15px;line-height:22px;color:#33453F}
.tp .pills{display:flex;flex-wrap:wrap;gap:8px}
.tp .pl{display:inline-flex;align-items:center;height:30px;padding:0 15px;border-radius:15px;background:#D8EDE7;color:#0E5247;font-weight:700;font-size:15.5px}
.tp .pl.vol{background:#FBEBC8;color:#74500D}
.tp table.cp td{padding:9px 18px;font-size:15px}
.tp table.cp th{padding:10px 18px}
.tp .tbl td.mut,.tp .tbl span.mut{color:#8A9A93}
.tp .cols4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;align-items:start}
.tp .colx{display:flex;flex-direction:column;gap:24px}
.tp .cat{border:1.6px solid #8FA29A;border-radius:14px;overflow:hidden;background:#fff}
.tp .cat h4{margin:0;padding:11px 18px;background:#E6EEEA;display:flex;justify-content:space-between;align-items:center;font-size:17px;line-height:22px;font-weight:700}
.tp .cat h4 span{font-size:13px;font-weight:600;color:#5B6D66}
.tp .cat table{width:100%;border-collapse:collapse;font-size:14.2px;line-height:19px}
.tp .cat td{padding:6.5px 18px;border-top:1px solid #E1E9E5;color:#33453F}
.tp .cat td.c{font-family:${T.MONO};font-size:13px;text-align:right;white-space:nowrap;color:#475467;padding-left:6px}
.tp .cat.pad h4{background:#F3E9CF}
.tp .cat.pad td.c{color:#74500D}
.tp .cat tr.subrow td{background:#F4F7F5;font-size:11.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5B6D66;padding:5px 18px}
.tp .cat td.in{padding-left:32px}
.tp .cols3x{display:grid;grid-template-columns:repeat(3,1fr)}
.tp .cols3x table+table{border-left:1px solid #E1E9E5}
.tp .kn{padding:9px 0;border-top:1px solid #E1E9E5}
.tp .kn.kf{border-top:0;padding-top:2px}
.tp .kn .knA{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-size:15.5px}
.tp .kn .knA span{font-size:14px;color:#5B6D66;text-align:right}
.tp .kn .knB{font-family:${T.MONO};font-size:14.5px;margin-top:3px;color:#33453F}
.tp .kn .knB b{color:#0E5247}
`);

E.PAGES.p2c = function () {
  const K = E.CAT, H = E.HEL;

  /* ---------- 2E · qué se produce ---------- */
  const pg = T.embed('2', 'p2c', (p) => {
    const A = p.band({
      y: 0, tag: '2E', title: 'Qué se produce: base, sabor y volumen, o categoría y producto',
      desc: 'La tablet muestra solo combinaciones que existen: cada sabor aparece únicamente dentro de su base y cada producto, dentro de su categoría.',
      lanes: [
        E.lane('ek', 220, [110], { id: 'ekh', sub: 'sistema único · lista de sabores' }),
        E.lane('plant', 330, [95, 235]),
        E.lane('ek', 220, [110], { id: 'ekp', sub: 'sistema único · lista de productos' })
      ]
    });
    A.ev('Lin', 'plant', 1, 'link', 'A · Viene de 2A: se abre «Elegir qué se produce»', { lp: 'b', lw: 150 });
    A.gw('Gq', 'plant', 2, 'xor', '¿Qué se produce?', { lw: 120 });
    A.t('Pb', 'plant', 3, `Elegir la base del helado (${H.bases.length} bases: neutra, chocolate, DDL, sin lactosa, al agua…)`, 'user');
    A.t('Es', 'ekh', 4, 'Muestra solo los sabores de esa base, con el título de su subcategoría si la tiene', 'auto');
    A.t('Ps', 'plant', 5, 'Elegir el sabor de esa lista (ej.: Neutra → Cielo; Neutra → base blanca → Amarena)', 'user');
    A.t('Pv', 'plant', 6, 'Elegir el volumen de la tanda: 150, 250 o 350 L', 'user');
    A.t('Pc', 'plant', 3, `Elegir la categoría del producto (${K.CATS.length} categorías)`, 'user', { row: 1 });
    A.t('Ec', 'ekp', 4, 'Muestra los productos de esa categoría, cada uno con su código de barras', 'auto');
    A.t('Pp', 'plant', 5, 'Elegir el producto y cuántas unidades elaborar', 'user', { row: 1 });
    A.gw('Gj', 'plant', 7, 'xor', '');
    A.ev('Lout', 'plant', 8, 'link', 'A · Sigue en 2A: e-Karú explota la receta y crea la Orden de Producción', { thrw: true, lp: 'b', lw: 190 });
    A.card('Kh', 'ekh', 7, { title: 'Lo que e-Karú guarda de cada sabor', items: [`La base a la que pertenece (una de las ${H.bases.length}) y su subcategoría, si la tiene (ej.: «base blanca»)`, 'Su receta hija sobre la base; en «base blanca», sobre la mezcla intermedia', 'El código de sabor de 6 dígitos de la balanza (000001 = Amarena)'], w: 640, dx: 150 });
    A.card('Kp', 'ekp', 7, { title: 'Lo que e-Karú guarda de cada producto', items: [`La categoría (${K.CATS.length}) y el nombre del producto (${K.nProd} en total)`, 'Su Nº de producto: el código es 22 + Nº + fecha de elaboración', 'El grupo PADRE que descuenta: vasos, conos o potes'], w: 640, dx: 150 });

    A.e('Lin', 'Gq', 'r', 'l');
    A.e('Gq', 'Pb', 'r', 'l', { label: 'Helado' });
    A.e('Gq', 'Pc', 'b', 'l', { label: 'Producto' });
    A.e('Pb', 'Es', 'r', 'b');
    A.e('Es', 'Ps', 'r', 't');
    A.e('Ps', 'Pv', 'r', 'l');
    A.e('Pv', 'Gj', 'r', 'l');
    A.e('Pc', 'Ec', 'r', 't');
    A.e('Ec', 'Pp', 'r', 'b');
    A.e('Pp', 'Gj', 'r', 'b');
    A.e('Gj', 'Lout', 'r', 'l');
  });

  /* ---------- helados ---------- */
  const mono = (t) => `<span class="mono">${t}</span>`;
  const eq = `<div class="eqs">
    <div class="bx"><div class="k">BASE · ${H.bases.length}</div><h3>Elegir la base</h3><div class="pills">${H.bases.map((b) => `<span class="pl">${b[0]}</span>`).join('')}</div><p style="margin-top:12px">Receta de la base (BOM Padre).</p></div>
    <div class="o2">+</div>
    <div class="bx"><div class="k">SABOR · ${H.nSab} · FILTRADO POR BASE</div><h3>Elegir el sabor</h3><p>Cada sabor pertenece a una sola base y agrega su variación sobre ella (BOM Hijo). Trae el código de sabor de 6 dígitos que usa la balanza. Una base puede agrupar sus sabores en una subcategoría (la Neutra, en «base blanca» y el resto).</p></div>
    <div class="o2">×</div>
    <div class="bx"><div class="k">VOLUMEN · ${H.vols.length}</div><h3>Elegir la tanda</h3><div class="pills">${H.vols.map((v) => `<span class="pl vol">${v} L</span>`).join('')}</div><p style="margin-top:12px">Escala todas las cantidades.</p></div>
    <div class="o2">=</div>
    <div class="bx res"><div class="k">RESULTADO</div><h3>Orden de Producción y Hoja de Dosificación</h3><p>La cantidad exacta de cada insumo para esa tanda ${T.refs('p2a', ['Ebom', 'Eord'])}</p></div>
  </div>`;
  const bcard = (b) => {
    let last = null;
    const rows = b[2].map((x) => {
      const sub = x[2] || null;
      const hd = sub && sub !== last ? `<tr class="subrow"><td colspan="2">Subcategoría · ${sub}</td></tr>` : '';
      last = sub;
      const code = x[4] ? `<span style="color:#1F4E9A;font-weight:700">${x[1]} · crear</span>` : x[1] ? `<b style="color:#0E5247">${x[1]}</b>` : '<span style="color:#B3392E">no está en la balanza</span>';
      return `${hd}<tr><td${sub ? ' class="in"' : ''}>${x[0]}</td><td class="c">${code}</td></tr>`;
    }).join('');
    return `<div class="cat"><h4>${b[0]}<span>${b[2].length} ${b[2].length === 1 ? 'sabor' : 'sabores'} · base ${b[1]}</span></h4><table>${rows}</table></div>`;
  };
  const B = H.bases;
  const grid = `<div class="cols4"><div class="colx">${bcard(B[0])}</div><div class="colx">${bcard(B[1])}${bcard(B[2])}</div><div class="colx">${bcard(B[3])}${bcard(B[4])}</div><div class="colx">${bcard(B[5])}${bcard(B[6])}${bcard(B[7])}</div></div>`;
  const all = B.flatMap((b) => b[2].map((x) => [b[0], ...x]));
  const nuevos = all.filter((x) => x[5]);
  const conf = `<div class="cat pad"><h4>A crear en la balanza<span>${nuevos.length} sabores · PLU propuesto</span></h4><table>${nuevos.map((x) => `<tr><td>${x[1]} <span style="color:#5B6D66">· ${x[0]}</span></td><td class="c"><b style="color:#1F4E9A">${x[2]}</b></td></tr>`).join('')}<tr><td colspan="2"><span style="color:#5B6D66">Los PLU 79 a 82 siguen al último usado (78). Si Glacé prefiere reusar un número libre de la lista, vale igual: lo que importa es que e-Karú tenga el mismo número.</span></td></tr></table></div>`;
  const note = `<div class="note"><b>Cruce con la balanza (10/11/2026):</b> lista de artículos (PLU) del Scale Manager contra los ${H.nSab} sabores de la lista. ${H.nCod} ya tienen código (6 con otro nombre en la balanza, confirmados: Menta granizada, Banana split, Café, Tramontana diet, Frutos rojos y Cielo «Crema del cielo») y ${H.nNew} se crean en la balanza. El código de sabor es el Nº de PLU con 6 dígitos: PLU 1 = 000001 (punto ${T.opNo('Sabores: código de balanza de cada uno')} de la última página).</div>`;
  const rep = `<div class="card"><h3>Nombres que se repiten entre bases</h3><p>Frutilla, Açaí, Frutos rojos, Chocolate, Oreo, Granizado, Tramontana y las almendras están en más de una base (por ejemplo, Tramontana en la Neutra (base blanca) y Tramontana DeliFREE en Leche sin lactosa). Cada uno es un sabor distinto, con su propia receta y su propio código de balanza; en la tablet se muestra siempre con su base.</p></div>`;
  const subc = `<div class="card"><h3>Subcategoría «base blanca»</h3><p>La Neutra tiene ${H.nSub} de sus ${B[0][2].length} sabores en la subcategoría «base blanca» (Amarena, Oreo, Granizado, Tramontana y Crema con almendras); los demás (Menta, Vainilla, Banana, Frutilla, Cielo, Coco split, 4 leches…) quedan fuera de ella, sin subcategoría. En e-Karú la subcategoría es un dato opcional del sabor: pone un título en la lista de la tablet y no agrega ningún paso al operario. Además, la base blanca tiene <b>receta propia</b> (una mezcla intermedia) y <b>se elabora en la misma tanda</b> que el sabor (confirmado el 10/11/2026): e-Karú explota en la misma orden una receta de tres niveles, base Neutra → mezcla base blanca → variación del sabor, sin stock intermedio. Los demás sabores siguen con dos niveles.</p></div>`;
  const known = [['Amarena', 'Neutra · base blanca', '2000001011058'], ['Dulce de leche', 'base Dulce de leche', '2000023011050'], ['Crema del cielo', 'Neutra · «Cielo»', '2000053011051']];
  const knownCard = `<div class="card"><h3>El código de sabor une balanza y e-Karú</h3>${known.map((r, i) => `<div class="kn${i ? '' : ' kf'}"><div class="knA"><b>${r[0]}</b><span>→ ${r[1]}</span></div><div class="knB">${r[2][0]} <b>${r[2].slice(1, 7)}</b> ${r[2].slice(7, 12)} ${r[2][12]}</div></div>`).join('')}<p style="margin-top:10px;font-size:14.5px">Etiquetas reales del 29/10/2026. En verde, el Nº de PLU como código de sabor. El nombre puede ser distinto («Crema del cielo» en la balanza, «Cielo» en la tablet); manda el código.</p></div>`;
  const exL = H.extra;
  const exRows = (arr) => `<table>${arr.map((x) => `<tr><td>${x[0]}</td><td class="c">${String(x[1]).padStart(6, '0')}</td><td class="c" style="color:#74500D">${x[2]}</td></tr>`).join('')}</table>`;
  const third = Math.ceil(exL.length / 3);
  const extraCard = `<div class="cat pad" style="margin-top:24px"><h4>Sabores de la balanza que no estaban en la lista<span>${exL.length} sabores · se siguen produciendo · base propuesta · Mango (45) y Limón con romero (46) ya no se producen: desactivarlos en la balanza</span></h4><div class="cols3x">${exRows(exL.slice(0, third))}${exRows(exL.slice(third, 2 * third))}${exRows(exL.slice(2 * third))}</div></div>`;
  const left = `${grid}<div class="two" style="grid-template-columns:1fr 1fr;gap:24px;margin-top:24px">${subc}${rep}</div>${extraCard}`;
  const side = `${note}<div style="margin-top:22px">${knownCard}</div><div style="margin-top:22px">${conf}</div>`;

  /* ---------- productos terminados ---------- */
  const N = K.NEW;
  const no = (c) => String(N.prodNo(c)).padStart(4, '0');
  const cat = (i) => { const c = K.CATS[i]; return `<div class="cat"><h4>${c[0]}<span>${c[1].length} ${c[1].length === 1 ? 'producto' : 'productos'}</span></h4><table>${c[1].map((x) => `<tr><td>${x[0]}</td><td class="c"><b style="color:#1F4E9A">${no(x[1])}</b></td><td class="c" style="color:#A0A9A5;text-decoration:line-through">${K.fmt(x[1])}</td></tr>`).join('')}</table></div>`;
  };
  const padre = `<div class="cat pad"><h4>Grupos PADRE<span>${K.PADRE.length} grupos</span></h4><table>${K.PADRE.map((x) => { const f = N.padreFix(x[1]); return `<tr><td>${x[0]}</td><td class="c">${K.fmt(f).slice(0, -1)}<b style="color:#B3392E">${f[12]}</b></td></tr>`; }).join('')}</table></div>`;
  const ex = N.prod(1);
  const how = `<div class="card"><h3>Cómo se arma el código nuevo</h3><p class="mono" style="font-size:21px;font-weight:700;margin:4px 0 10px">${N.fmt2(ex)}</p><ul class="bl"><li><b>22</b>: prefijo de producto terminado (no choca con los baldes, que empiezan con 20).</li><li><b>0001</b>: Nº de producto, en azul en las tablas. Es el número actual, así nadie tiene que aprender códigos nuevos.</li><li><b>261110</b>: fecha de elaboración AAMMDD (10/11/2026). Es el lote: e-Karú lleva el stock por producto y fecha.</li><li><b>${ex[12]}</b>: dígito de control EAN-13, calculado al imprimir.</li><li>Tachado: el código viejo, válido solo durante la transición. PADRE: mismo número, en rojo el último dígito corregido.</li></ul></div>`;
  const cols = `<div class="cols4"><div class="colx">${cat(0)}${cat(2)}${cat(3)}</div><div class="colx">${cat(1)}${cat(4)}${cat(5)}</div><div class="colx">${cat(6)}${cat(7)}</div><div class="colx">${padre}${how}</div></div>`;

  const html = T.head('n2', 'Producción y envase',
    'Fase E · Bases, sabores y categorías. Cómo se elige en la tablet qué se produce y qué datos maestros necesita e-Karú: los helados salen de una base, un sabor y un volumen; el resto de los productos, de su categoría.') +
    '<section><div id="dg"></div></section>' +
    T.sec('HELADOS', `${H.bases.length} bases, ${H.nSab} sabores y tres volúmenes`, 'La receta de cada tanda es la receta de la base más la variación del sabor, escalada al volumen elegido. Lista de bases y sabores entregada por Glacé.',
      eq + `<div class="two" style="grid-template-columns:2.6fr 1fr;gap:28px"><div>${left}</div><div>${side}</div></div>`) +
    T.sec('PRODUCTOS TERMINADOS', `${K.CATS.length} categorías, ${K.nProd} productos y ${K.PADRE.length} grupos PADRE`, 'Catálogo de e-Karú Etiquetas con el Nº de producto (azul) que usa el código nuevo 22 + Nº + fecha. Los grupos PADRE sirven para descontar consumibles al vender: vasos, conos y potes.', cols);
  return T.mount(html, (el) => { el.querySelector('#dg').appendChild(pg.svg); }, { warns: pg.warns, tasks: pg.tasks });
};
})();
