/* Catálogo maestro de Glacé (fuente: «Liste - Katalog» + e-Karú Etiquetas) y datos de producción de helados */
(function () {
'use strict';
const E = window.Eng;
const eanOk = (c) => {
  if (!/^\d{13}$/.test(c)) return false;
  let s = 0; for (let i = 0; i < 12; i++) s += (+c[i]) * (i % 2 ? 3 : 1);
  return (10 - s % 10) % 10 === +c[12];
};
const eanCheck = (c12) => { let s = 0; for (let i = 0; i < 12; i++) s += (+c12[i]) * (i % 2 ? 3 : 1); return (10 - s % 10) % 10; };
const CATS = [
  ['Palitos', [['Palito con cobertura', '2000001100014'], ['Palito frutilla', '2000002100017'], ['Palito frutilla al agua', '2000003100012'], ['Palito frutilla c/ relleno', '2000004100019'], ['Palito granizado', '2000005100015'], ['Palito mburucuyá a la crema', '2000006100011'], ['Palito menta', '2000007100018'], ['Palito oreo', '2000008100013'], ['Palito pistacho', '2000009100016']]],
  ['Alfajor', [['Alfajor chico 4 leches', '2000010200021'], ['Alfajor chico dulce de leche', '2000011200028'], ['Alfajor de maizena ×6', '2000012200025'], ['Alfajor grande almendras', '2000013200022'], ['Alfajor grande DL c/ microgalletitas', '2000014200029'], ['Alfajor grande pistacho', '2000015200026'], ['Alfajor maicena DeliFREE ×4', '2000016200023'], ['Alfajor con chocolate', '2000017200020']]],
  ['Brownie', [['Brownie bandeja pack', '2000018300037'], ['Brownie porción', '2000019300034'], ['Brownie DeliFREE', '2000020300031'], ['Brownie con helado', '2000021300038']]],
  ['Otros Postres', [['Pastafrola porción', '2000022400045'], ['Galletita cookies relleno', '2000023400042'], ['Brownie gatito', '2000024400049']]],
  ['Tartas', [['Tarta 3 quesos', '2000025500056'], ['Tarta acelga', '2000026500053'], ['Tarta jamón y queso', '2000027500050'], ['Tarta de pollo', '2000028500057']]],
  ['Cono Fan', [['Cono Fan', '2000029600064'], ['Cono Fan 2×1', '2000030600061'], ['Cono Fan 3×25', '2000031600068']]],
  ['Tortas', [['Torta amarena', '2000032700073'], ['Torta con frutilla premium', '2000033700076'], ['Torta brownie', '2000034700079'], ['Torta chocolate con frutilla', '2000035700072'], ['Torta Matilda chocolate', '2000036700075'], ['Torta crema con almendras', '2000037700078'], ['Torta DDL con chocolate', '2000038700071'], ['Torta de mburucuyá con chocolate', '2000039700074'], ['Torta helada red velvet', '2000040700070'], ['Torta Insignia Glacé frutilla', '2000041700073'], ['Torta mburucuyá con frutilla premium', '2000042700076'], ['Torta Oreo premium', '2000043700079'], ['Torta pie de limón con frutos del bosque', '2000044700072']]],
  ['Tortas DeliFREE', [['Torta amarena DeliFREE', '2000045700075'], ['Torta Tramontana DeliFREE', '2000046700078'], ['Torta chocolate frutilla DeliFREE', '2000047700071']]]
];
const PADRE = [
  ['Vasos Milkshake / Smoothies', '2900001800081'], ['Pote 1 kg', '2900002800088'], ['Pote ½ kg', '2900003800085'], ['Pote ¼ kg', '2900004800082'],
  ['Vaso 1', '2900005800089'], ['Vaso 2', '2900006800086'], ['Vaso 3', '2900007800083'], ['Cono 2', '2900008800080'], ['Cono 3', '2900009800087']
];
const nProd = CATS.reduce((n, c) => n + c[1].length, 0);
const all = CATS.flatMap((c) => c[1]).concat(PADRE);
const nBad = all.filter((x) => !eanOk(x[1])).length;
const fmt = (c) => `${c[0]} ${c.slice(1, 7)} ${c.slice(7, 12)} ${c[12]}`;
E.CAT = { CATS, PADRE, nProd, nAll: all.length, nBad, nOk: all.length - nBad, eanOk, eanCheck, fmt };

/* helados: 8 bases y sus sabores (lista entregada por Glacé el 10/11/2026) */
E.HEL = {
  vols: [150, 250, 350],
  /* [base, receta, [[sabor, código de balanza o null, subcategoría o null, nombre en la balanza si el cruce es probable]]]
     Los 5 cruces por nombre distinto (Menta granizada, Banana split, Café, Tramontana diet, Frutos rojos) confirmados por Glacé el 10/11/2026
     Códigos: lista de artículos (PLU) del Scale Manager, «pesaje hasta 10 de julio», recibida el 10/11/2026 */
  bases: [
    ['Neutra', 'crema', [['Menta', '000032'], ['Vainilla', '000015'], ['Banana', '000011'], ['Frutilla', '000079', null, null, 'nuevo'], ['Frutilla tentación', '000047'], ['Pistacho', '000078'], ['Coco split', '000005'], ['Leche condensada', '000003'], ['Frutos del bosque', '000030'], ['Açaí', '000066'], ['4 leches', '000008'], ['Cielo', '000053'], ['Capuchino', '000068'], ['Pie de limón', '000033'], ['Amarena', '000001', 'base blanca'], ['Oreo', '000010', 'base blanca'], ['Granizado', '000080', 'base blanca', null, 'nuevo'], ['Tramontana', '000013', 'base blanca'], ['Crema con almendras', '000006', 'base blanca']]],
    ['Chocolate', 'crema', [['Chocolate clásico', '000018'], ['Chocolate amargo', '000017'], ['Chocolate con almendras', '000019'], ['Chocolate con brownie', '000048'], ['Suizo', '000021']]],
    ['Dulce de leche', 'crema', [['Dulce de leche', '000023'], ['DDL con brownie (Glacé)', '000025'], ['DDL con granizado', '000026'], ['Doble dulce de leche (tentación)', '000027'], ['DDL con Oreo', '000070']]],
    ['Leche sin lactosa', 'DeliFREE', [['Chocolate DeliFREE', '000056'], ['Tramontana DeliFREE', '000075'], ['Americana con almendras DeliFREE', '000051'], ['Frutos rojos DeliFREE', '000035'], ['Maní DeliFREE', '000081', null, null, 'nuevo']]],
    ['Al agua', 'sorbete', [['Frutilla al agua', '000037'], ['Piña', '000041'], ['Açaí al agua', '000044'], ['Durazno', '000036'], ['Frutos rojos al agua', '000004']]],
    ['Huevo', 'crema', [['Sambayón', '000012']]],
    ['Americana', 'crema', [['Americana', '000002']]],
    ['Proteica', 'proteica', [['Choco proteico', '000082', null, null, 'nuevo']]]
  ],
  /* sabores que están en la balanza y no en la lista de Glacé */
  /* sabores que están en la balanza y no estaban en la lista: se siguen produciendo (Glacé, 10/11/2026); base propuesta. Mango (45) y Limón con romero (46) ya no se producen */
  extra: [['Crema flan', 7, 'Neutra'], ['Mascarpone', 14, 'Neutra'], ['Frutilla c/ jengibre', 16, 'Neutra'], ['Stracciatella', 20, 'Neutra · base blanca'], ['Negro fresh', 22, 'Chocolate'], ['DL c/ almendras', 24, 'Dulce de leche'], ['Cereza al maraschino', 28, 'Neutra'], ['Mburucuyá a la crema', 31, 'Neutra'], ['Portuguesa', 34, 'Neutra'], ['Limón al agua', 38, 'Al agua'], ['Mburucuyá al agua', 40, 'Al agua'], ['DL c/ microgalletita', 42, 'Dulce de leche'], ['Café sin lactosa', 43, 'Leche sin lactosa'], ['Americana sin lactosa', 50, 'Leche sin lactosa'], ['Dulce de leche diet', 55, 'Dulce de leche'], ['Frutilla sin lactosa', 58, 'Leche sin lactosa'], ['Açaí sin lactosa', 61, 'Leche sin lactosa'], ['Banana sin lactosa', 64, 'Leche sin lactosa'], ['Banana diet', 67, 'Neutra'], ['Panettone', 69, 'Neutra'], ['Delirio de Pascua', 74, 'Neutra']],
  confirmar: []
};
E.HEL.nSab = E.HEL.bases.reduce((n, b) => n + b[2].length, 0);
E.HEL.nCod = E.HEL.bases.reduce((n, b) => n + b[2].filter((s) => s[1] && !s[4]).length, 0);   /* ya cargados en la balanza */
E.HEL.nNew = E.HEL.bases.reduce((n, b) => n + b[2].filter((s) => s[4]).length, 0);            /* a crear en la balanza (PLU propuesto) */
E.HEL.nProb = E.HEL.bases.reduce((n, b) => n + b[2].filter((s) => s[3]).length, 0);           /* cruce probable, a confirmar */
E.HEL.nMiss = E.HEL.nSab - E.HEL.nCod - E.HEL.nProb - E.HEL.nNew;                                            /* sin código en la balanza */
E.HEL.nSub = E.HEL.bases.reduce((n, b) => n + b[2].filter((s) => s[2]).length, 0);

/* ---------- nueva numeración (propuesta v2): prefijos internos 20–29 sin choques ---------- */
const pad = (n, k) => String(n).padStart(k, '0');
const full = (d12) => d12 + eanCheck(d12);
const prodNo = (code) => +code.slice(1, 7);            /* 2 000001 10001 4 -> 1 */
const yymmdd = (d) => pad(d.getFullYear() % 100, 2) + pad(d.getMonth() + 1, 2) + pad(d.getDate(), 2);
const NEWX = {
  date: new Date(2026, 10, 10),
  prod: (n, d) => full('22' + pad(n, 4) + yymmdd(d || NEWX.date)),
  ins: (n, d) => full('25' + pad(n, 4) + yymmdd(d || NEWX.date)),
  pack: (n) => full('23' + pad(n, 10)),
  idb: (n) => full('24' + pad(n, 10)),
  padreFix: (c) => full(c.slice(0, 12)),
  prodNo,
  fmt2: (c) => `${c.slice(0, 2)} ${c.slice(2, 6)} ${c.slice(6, 12)} ${c[12]}`
};
E.CAT.NEW = NEWX;
})();
