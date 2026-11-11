/* PROCESO 2 · página B — productos terminados (e-Karú Etiquetas) + Promo Pack 12 Palitos */
(function () {
'use strict';
const E = window.Eng;
E.PAGES.p2b = function () {
  const p = E.mk('p2b', '2', {
    num: '2', title: 'Producción y envase',
    sub: 'Continuación · Productos terminados. Cada producto sale con una etiqueta de e-Karú Etiquetas: código 22 + Nº de producto + fecha de elaboración, o código PADRE (29) si el producto se maneja por grupo. El Promo Pack de 12 palitos es la excepción.'
  });

  /* ---------- 2C · productos terminados ---------- */
  const C = p.band({
    y: p.headBottom + 26, tag: '2C', title: 'Productos terminados: etiqueta y stock con e-Karú Etiquetas',
    desc: 'Aquí no interviene la balanza: el código lo prepara e-Karú según el catálogo y lo imprime e-Karú Etiquetas (etiqueta física de 2 × 3 cm con código de barras y número).',
    lanes: [E.lane('plant', 215, [105]), E.lane('ek', 335, [100, 250])]
  });
  C.ev('LCc', 'plant', 1, 'link', 'C · Producto elaborado', { lp: 'b', lw: 140 });
  C.t('Ppack', 'plant', 2, 'Envasar los productos terminados de la orden', 'manual');
  C.gw('Gtype', 'ek', 3, 'xor', '¿El producto tiene código propio (hijo)?', { lw: 190 });
  C.t('Ehijo', 'ek', 4, 'Individual: arma el código 22 + Nº de producto + fecha de elaboración', 'auto', { w: 196 });
  C.t('Epadre', 'ek', 4, 'Por grupo: usa el código PADRE del grupo; el stock se lleva por grupo', 'auto', { row: 1, w: 196 });
  C.gw('Gj', 'ek', 5, 'xor', '');
  C.t('Pprint', 'plant', 5, 'Imprimir las etiquetas de 2 × 3 cm con e-Karú Etiquetas y pegarlas en cada producto', 'print');
  C.t('Pscan', 'plant', 6, 'Escanear el código e indicar la cantidad elaborada', 'scan');
  C.t('Estock', 'ek', 7, 'Suma al stock del producto por fecha de elaboración, o al stock del grupo', 'auto');
  C.t('Pstore', 'plant', 8, 'Guardar en la cámara de producto terminado', 'manual');
  C.ev('End', 'plant', 9, 'end', 'Productos en stock, etiquetados y listos para despachar (Proceso 3)', { lp: 'b', lw: 190 });
  C.card('Kc', 'ek', 9, { title: 'Qué producto lleva qué código', items: ['Código 22, uno por producto y fecha: palitos, alfajores, brownies, postres, tartas, Cono Fan y tortas', 'Código PADRE (29), uno por grupo: vasos, conos 2 y 3, milkshakes, smoothies y potes de 1 kg, ½ y ¼'], w: 500, dx: 66, dy: -8 });

  C.e('LCc', 'Ppack', 'r', 'l');
  C.e('Ppack', 'Gtype', 'b', 'l');
  C.e('Gtype', 'Ehijo', 'r', 'l', { label: 'Sí' });
  C.e('Gtype', 'Epadre', 'b', 'l', { label: 'No' });
  C.e('Ehijo', 'Gj', 'r', 'l');
  C.e('Epadre', 'Gj', 'r', 'b');
  C.e('Gj', 'Pprint', 't', 'b');
  C.e('Pprint', 'Pscan', 'r', 'l');
  C.e('Pscan', 'Estock', 'r', 't');
  C.e('Estock', 'Pstore', 'r', 'b');
  C.e('Pstore', 'End', 'r', 'l');
  C.frame(['Gtype', 'Ehijo', 'Epadre', 'Gj', 'Pprint', 'Pscan', 'Estock'], 'Por cada producto de la orden');

  /* ---------- 2D · Promo Pack ---------- */
  const D = p.band({
    y: C.bottom + 44, tag: '2D', title: 'Excepción: Promo Pack 12 Palitos',
    desc: 'El pack tiene un código padre con 12 códigos hijos. Se escanean los 12 palitos, e-Karú genera el ID de paquete y lo asocia a los 12 IDs.',
    lanes: [E.lane('plant', 235, [112]), E.lane('ek', 235, [112])]
  });
  D.ev('S12', 'plant', 1, 'start', 'Se arma un Promo Pack con 12 palitos', { lp: 'b', lw: 150 });
  D.t('Ps12', 'plant', 2, 'Escanear el código de cada palito del pack', 'scan');
  D.t('Epk', 'ek', 3, 'Genera el ID de paquete y lo asocia a los 12 IDs escaneados', 'auto');
  D.t('Ppr12', 'plant', 4, 'Imprimir la etiqueta con el ID de paquete (e-Karú Etiquetas) y pegarla en el pack', 'print');
  D.t('Est12', 'ek', 5, 'Registra el Promo Pack con sus 12 códigos hijos', 'auto');
  D.ev('End12', 'ek', 6, 'end', 'Promo Pack listo, identificado con su ID de paquete', { lp: 'b', lw: 170 });
  D.card('Kr', 'ek', 9, { title: 'Reglas de código de barras', items: ['Producto individual: 22 + Nº de producto + fecha de elaboración (EAN-13 válido)', 'Producto por grupo: un código PADRE por grupo; al vender se elige el grupo y la cantidad a consumir (ej.: grupo de 50 vasos, consumo 2)', 'Promo Pack 12 Palitos: ID de paquete 23… asociado a los 12 palitos', 'Balde de helado: código de la balanza (2 + sabor + peso, propuesta: + transacción); e-Karú solo lo lee'], w: 640, dx: -10, dy: 0 });

  D.e('S12', 'Ps12', 'r', 'l');
  D.e('Ps12', 'Epk', 'r', 't');
  D.e('Epk', 'Ppr12', 'r', 'b');
  D.e('Ppr12', 'Est12', 'r', 't');
  D.e('Est12', 'End12', 'r', 'l');
  D.frame(['Ps12'], 'Se repite 12 veces');

  return E.fin(p);
};
})();
