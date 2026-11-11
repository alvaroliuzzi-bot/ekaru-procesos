/* PROCESO 1 · página A — recepción física + rechazo por calidad */
(function () {
'use strict';
const E = window.Eng;
E.PAGES.p1a = function () {
  const p = E.mk('p1a', '1', {
    num: '1', title: 'Recepción de materia prima',
    sub: 'Fase A · Recepción física. El camión llega, se controla la calidad y cada ítem entra al stock con su código de barras, sin esperar la factura. La Fase B (factura → precios y costos) sigue en la página siguiente.'
  });

  /* ---------- banda principal ---------- */
  const A = p.band({
    y: p.headBottom + 26, tag: '1A', title: 'Recepción física del camión',
    desc: 'Escáner y tablet en el depósito. e-Karú reconoce cada ítem por su código de barras y deja la recepción «pendiente de factura».',
    lanes: [E.lane('prov', 132, [60]), E.lane('dep', 345, [100, 255]), E.lane('ek', 232, [116])]
  });

  A.ev('S1', 'prov', 1, 'start', 'Llega el camión con la mercadería y la factura (electrónica o papel)', { lp: 'r', lw: 150 });
  A.ev('Ac', 'dep', 1, 'link', 'A · Llega la reposición', { row: 1, lp: 'b', lw: 150 });
  A.t('A1', 'dep', 1, 'Inspección visual y física de los insumos: temperatura, empaque y vencimiento', 'manual');
  A.gw('G1', 'dep', 2, 'xor', '¿Calidad física OK?');
  A.ev('Rr', 'dep', 2, 'link', 'Rechazo por calidad (continúa en R)', { row: 1, thrw: true, lp: 'b', lw: 150 });
  A.gw('G2', 'dep', 3, 'xor', '¿El ítem trae código de barras?');
  A.t('Alab', 'dep', 3, 'Imprimir con e-Karú Etiquetas la etiqueta interna del insumo y pegarla en cada bulto', 'print', { row: 1 });
  A.t('Asc', 'dep', 4, 'Escanear el código de barras del ítem (EAN del proveedor o etiqueta interna)', 'scan');
  A.t('Erec', 'ek', 5, 'Reconoce el insumo por su código. Si es nuevo, pide vincularlo (solo la primera vez)', 'auto');
  A.t('Aqty', 'dep', 6, 'Indicar cantidad, lote y fecha de vencimiento en la tablet', 'user');
  A.t('Estock', 'ek', 7, 'Registra la entrada al stock con lote y vencimiento; estado «pendiente de factura»', 'auto');
  A.t('Astore', 'dep', 8, 'Trasladar y almacenar en la cámara de frío o el depósito seco', 'manual');
  A.ev('End', 'dep', 9, 'end', 'Insumos en stock, disponibles para producción. Factura pendiente: sigue en 1B', { lp: 'b', lw: 170 });

  A.e('S1', 'A1', 'b', 't');
  A.e('Ac', 'A1', 't', 'b');
  A.card('Kno', 'ek', 1, { title: 'Insumos que hoy llegan sin código de barras', items: ['Frutas a granel', 'Conos y vasos', 'Isopor de 1 kg, ½ kg y ¼ kg', 'e-Karú les crea un código interno propio de 13 dígitos, con dígito de control EAN-13 válido'], w: 430, dx: 126 });
  A.e('Alab', 'Kno', 'b', 't', { k: 'assoc' });
  A.e('A1', 'G1', 'r', 'l');
  A.e('G1', 'G2', 'r', 'l', { label: 'Sí' });
  A.e('G1', 'Rr', 'b', 't', { label: 'No' });
  A.e('G2', 'Asc', 'r', 'l', { label: 'Sí' });
  A.e('G2', 'Alab', 'b', 't', { label: 'No' });
  A.e('Alab', 'Asc', 'r', 'b');
  A.e('Asc', 'Erec', 'r', 't');
  A.e('Erec', 'Aqty', 'r', 'b');
  A.e('Aqty', 'Estock', 'r', 't');
  A.e('Estock', 'Astore', 'r', 'b');
  A.e('Astore', 'End', 'r', 'l');
  A.frame(['G2', 'Alab', 'Asc', 'Erec', 'Aqty', 'Estock'], 'Por cada ítem de la entrega');

  /* ---------- banda R: rechazo ---------- */
  const R = p.band({
    y: A.bottom + 44, tag: '1R', title: 'Rechazo por calidad: reclamo y reposición',
    desc: 'Todo lo hace e-Karú: marca el rechazo, arma el reclamo con foto y lo envía por correo. Sin Odoo, sin correos manuales.',
    lanes: [E.lane('prov', 262, [70, 196]), E.lane('ek', 170, [85]), E.lane('dep', 170, [85])]
  });
  R.ev('Rc', 'dep', 1, 'link', 'R · Rechazo por calidad', { lp: 'b', lw: 140 });
  R.t('A2', 'dep', 2, 'Devolver el ítem en el camión y marcar «Rechazo por calidad» en la tablet (motivo y foto)', 'user');
  R.t('Ecl', 'ek', 3, 'Crea el reclamo (ítem, cantidad, motivo y foto) y lo envía por correo formal al proveedor', 'auto');
  R.t('Prec', 'prov', 4, 'Recibir el reclamo y responder: reponer o acreditar', 'extmsg', { no: false });
  R.gw('Grep', 'prov', 5, 'xor', '¿Repone la mercadería?');
  R.t('Pnc', 'prov', 5, 'Emitir la nota de crédito electrónica', 'ext', { no: false, row: 1 });
  R.t('Enc', 'ek', 5, 'Registra la nota de crédito (llega por SIFEN) y cierra el reclamo', 'auto');
  R.ev('Eend', 'ek', 6, 'end', 'Reclamo cerrado', { lp: 'b', lw: 120 });
  R.t('Pship', 'prov', 7, 'Enviar el camión de reposición', 'ext', { no: false });
  R.t('Arec', 'dep', 7, 'Recibir el camión de reposición', 'manual');
  R.ev('Aout', 'dep', 8, 'link', 'Volver a la inspección (A)', { thrw: true, lp: 'b', lw: 150 });

  R.e('Rc', 'A2', 'r', 'l');
  R.e('A2', 'Ecl', 'r', 'b');
  R.e('Ecl', 'Prec', 'r', 'b', { k: 'msg' });
  R.e('Prec', 'Grep', 'r', 'l');
  R.e('Grep', 'Pship', 'r', 'l', { label: 'Sí' });
  R.e('Grep', 'Pnc', 'b', 't', { label: 'No' });
  R.e('Pnc', 'Enc', 'b', 't', { k: 'msg' });
  R.e('Enc', 'Eend', 'r', 'l');
  R.e('Pship', 'Arec', 'b', 't', { k: 'msg' });
  R.e('Arec', 'Aout', 'r', 'l');

  return E.fin(p);
};
})();
