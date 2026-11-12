/* PROCESO 2 · página A — orden y elaboración + envase de baldes (balanza) */
(function () {
'use strict';
const E = window.Eng;
E.PAGES.p2a = function () {
  const p = E.mk('p2a', '2', {
    num: '2', title: 'Producción y envase',
    sub: 'La orden llega planificada por el MRP (Proceso 0), los insumos se retiran escaneando su código de barras y cada balde sale de la balanza con su propio código. Sin Odoo, sin QR y sin BarTender.'
  });

  /* ---------- 2A · orden y elaboración ---------- */
  const A = p.band({
    y: p.headBottom + 26, tag: '2A', title: 'Orden de producción y elaboración',
    desc: 'e-Karú calcula la receta, arma la Hoja de Dosificación y descuenta los insumos por lote (FEFO) a medida que se escanean.',
    lanes: [E.lane('plant', 300, [95, 225]), E.lane('ek', 300, [88, 218])]
  });
  A.ev('S3', 'plant', 1, 'start', 'Orden del día que planificó el MRP (0B) o faltante urgente de un pedido (3C)', { lp: 'b', lw: 170 });
  A.sub('Psel', 'plant', 2, 'Abrir en la tablet la orden del día (o elegir qué se produce: 2E)', { type: 'user', w: 196, h: 128 });
  A.t('Ebom', 'ek', 3, 'Explota la receta: base (+ base blanca si corresponde) + sabor, escalada al volumen', 'auto');
  A.t('Eord', 'ek', 4, 'Crea la Orden de Producción y la Hoja de Dosificación con la cantidad exacta de cada insumo', 'auto');
  A.gw('Gstk', 'ek', 5, 'xor', '¿Hay insumos suficientes?');
  A.t('Eale', 'ek', 5, 'Excepción: aunque el MRP los pidió, faltan insumos; avisa a Compras y deja la orden en espera', 'auto', { row: 1, w: 196 });
  A.ev('Ew', 'ek', 6, 'end', 'Orden en espera: e-Karú la reactiva al recibir los insumos (1A)', { row: 1, lp: 'b', lw: 215 });
  A.t('Ppick', 'plant', 6, 'Retirar los insumos de la cámara o del depósito escaneando cada código de barras', 'scan');
  A.t('Econs', 'ek', 7, 'Descuenta del stock los lotes escaneados (FEFO) y los compara con la Hoja de Dosificación', 'auto');
  A.t('Pproc', 'plant', 8, 'Elaborar según la Hoja de Dosificación (pesar, mezclar, pasteurizar, enfriar y saborizar)', 'manual');
  A.gw('Gwhat', 'plant', 9, 'xor', '¿Qué se envasa?');
  A.ev('LB', 'plant', 10, 'link', 'B · Baldes de helado', { thrw: true, lp: 'b', lw: 130 });
  A.ev('LC', 'plant', 9, 'link', 'C · Productos terminados (página siguiente)', { row: 1, thrw: true, lp: 'r', lw: 170 });

  A.e('S3', 'Psel', 'r', 'l');
  A.e('Psel', 'Ebom', 'r', 't');
  A.e('Ebom', 'Eord', 'r', 'l');
  A.e('Eord', 'Gstk', 'r', 'l');
  A.e('Gstk', 'Ppick', 'r', 'b', { label: 'Sí' });
  A.e('Gstk', 'Eale', 'b', 't', { label: 'No' });
  A.e('Eale', 'Ew', 'r', 'l');
  A.e('Ppick', 'Econs', 'r', 't');
  A.e('Econs', 'Pproc', 'r', 'b');
  A.e('Pproc', 'Gwhat', 'r', 'l');
  A.e('Gwhat', 'LB', 'r', 'l', { label: 'Baldes' });
  A.e('Gwhat', 'LC', 'b', 't', { label: 'Productos' });

  /* ---------- 2B · baldes ---------- */
  const B = p.band({
    y: A.bottom + 44, tag: '2B', title: 'Envase de baldes: balanza → e-Karú',
    desc: 'La balanza imprime con su propia impresora pequeña la etiqueta y el código de cada balde. e-Karú solo lo lee. La tabla nutricional se imprime aparte, en otra impresora.',
    lanes: [E.lane('plant', 215, [105]), E.lane('bal', 215, [105]), E.lane('ek', 215, [105])]
  });
  B.ev('LBc', 'plant', 1, 'link', 'B · Helado listo para envasar', { lp: 'b', lw: 140 });
  B.t('Pfill', 'plant', 2, 'Llenar el balde con el helado terminado y apoyarlo en la balanza', 'manual');
  B.t('Bw', 'bal', 3, 'Pesa el balde (peso neto) y toma el código del sabor', 'bal');
  B.t('Blab', 'bal', 4, 'Imprime la etiqueta con el código del balde (sabor y peso; con balde único, también la transacción), lote y vencimiento', 'balprint', { w: 200 });
  B.t('Pstick', 'plant', 5, 'Imprimir la tabla nutricional (10 × 8 cm) en la otra impresora, con e-Karú Etiquetas, y pegarla', 'print');
  B.t('Pinsp', 'plant', 6, 'Inspección organoléptica del balde (si falla, se bloquea)', 'manual');
  B.t('Pscan', 'plant', 7, 'Escanear la etiqueta del balde', 'scan');
  B.t('Ereg', 'ek', 7, 'Registra el balde «en control» con sabor, peso, Nº de orden (obligatorio), lote y vencimiento +120 días', 'auto', { w: 196 });
  B.t('Pmove', 'plant', 8, 'Trasladar a la cámara de congelación (−15 a −25 °C)', 'manual');
  B.t('Eclose', 'ek', 9, 'Cierra la orden: compara rendimiento real y teórico, registra la merma y libera los baldes', 'auto', { w: 196 });
  B.ev('End', 'ek', 10, 'end', 'Baldes liberados en stock con código, peso, lote y vencimiento', { lp: 'b', lw: 160 });

  B.note('Nlib', 'bal', 9.86, 'Calidad: el balde queda «en control» hasta que se cierra la orden. Si el rendimiento o la inspección fallan, e-Karú lo bloquea y abre una no conformidad. Solo lo liberado cuenta como stock para el MRP y el picking.', { w: 300 });
  B.e('LBc', 'Pfill', 'r', 'l');
  B.e('Pfill', 'Bw', 'r', 't');
  B.e('Bw', 'Blab', 'r', 'l');
  B.e('Blab', 'Pstick', 'r', 'b');
  B.e('Pstick', 'Pinsp', 'r', 'l');
  B.e('Pinsp', 'Pscan', 'r', 'l');
  B.e('Pscan', 'Ereg', 'b', 't');
  B.e('Ereg', 'Pmove', 'r', 'b');
  B.e('Pmove', 'Eclose', 'r', 't');
  B.e('Eclose', 'End', 'r', 'l');
  B.frame(['Pfill', 'Bw', 'Blab', 'Pstick', 'Pinsp', 'Pscan', 'Ereg', 'Pmove'], 'Por cada balde de la orden');

  return E.fin(p);
};
})();
