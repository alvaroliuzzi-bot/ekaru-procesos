/* PROCESO 3 · página A — pedido de la sucursal, picking, despacho y recepción */
(function () {
'use strict';
const E = window.Eng;
E.PAGES.p3a = function () {
  const p = E.mk('p3a', '3', {
    num: '3', title: 'Recepción de pedidos y despacho',
    sub: 'La sucursal carga su pedido en e-Karú, el Depósito Central lo prepara escaneando y la sucursal lo recibe escaneando. Todo con códigos de barras y en un solo sistema, sin Odoo y sin QR.'
  });

  /* ---------- 3A · pedido → picking → despacho ---------- */
  const A = p.band({
    y: p.headBottom + 26, tag: '3A', title: 'Del pedido de la sucursal al despacho',
    desc: 'e-Karú consolida los pedidos, muestra qué hay realmente en stock (por lote y vencimiento) y arma la Orden de Picking solo con lo disponible.',
    lanes: [E.lane('suc', 165, [82]), E.lane('ek', 330, [100, 245]), E.lane('cen', 250, [105])]
  });
  A.ev('S3a', 'suc', 1, 'start', 'Necesidad de reposición de helado en la sucursal', { lp: 'b', lw: 150 });
  A.t('T1', 'suc', 2, 'Cargar el pedido diario o semanal en e-Karú desde la tablet de la sucursal', 'user');
  A.t('E1', 'ek', 3, 'Consolida los pedidos de las sucursales en la Central de Pedidos y calcula la disponibilidad real de cada producto', 'auto', { w: 210 });
  A.t('T2', 'cen', 4, 'Revisar el pedido en la tablet con la disponibilidad real (✓ hay / ✗ no hay) y confirmarlo', 'user');
  A.gw('Gor', 'ek', 5, 'or', '¿Hay faltantes?', { lw: 150 });
  A.t('E3', 'ek', 6, 'Crea la Orden de Picking con el stock disponible, sugiriendo primero los lotes que vencen antes (FEFO)', 'auto', { w: 192 });
  A.t('Ebo', 'ek', 5, 'Crea el Backorder con lo que falta y avisa a Producción', 'auto', { row: 1 });
  A.ev('Ld', 'ek', 6, 'link', 'D · El faltante se resuelve en 3C (página siguiente)', { row: 1, thrw: true, lp: 'r', lw: 200 });
  A.t('Tpick', 'cen', 7, 'Recolectar en la cámara y escanear cada balde y cada producto, guiado por la tablet', 'scan', { w: 196 });
  A.t('Edisp', 'ek', 8, 'Cierra el picking, genera la Orden de Despacho y pasa el stock a «en tránsito»', 'auto');
  A.t('Ttruck', 'cen', 9, 'Cargar el camión y despachar a la sucursal', 'manual');
  A.ev('Lout', 'cen', 10, 'link', 'C · Camión en camino a la sucursal', { thrw: true, lp: 'b', lw: 150 });
  A.note('Nrem', 'cen', 9, 'Si la sucursal lo requiere, el camión lleva también la Nota de Remisión Electrónica, que e-Karú genera con lo escaneado (ver 3F).', { w: 250, dy: 98 });

  A.e('S3a', 'T1', 'r', 'l');
  A.e('T1', 'E1', 'r', 't');
  A.e('E1', 'T2', 'r', 't');
  A.e('T2', 'Gor', 'r', 'l', { mx: 'cx:T2+117' });
  A.e('Gor', 'E3', 'r', 'l', { label: 'Lo disponible' });
  A.e('Gor', 'Ebo', 'b', 't', { label: 'Lo que falta' });
  A.e('Ebo', 'Ld', 'r', 'l');
  A.e('E3', 'Tpick', 'r', 't');
  A.e('Tpick', 'Edisp', 'r', 'b');
  A.e('Edisp', 'Ttruck', 'r', 't');
  A.e('Ttruck', 'Lout', 'r', 'l');
  A.e('Ttruck', 'Nrem', 'b', 't', { k: 'assoc' });
  A.frame(['Tpick'], 'Por cada balde o producto', { lp: 'bl' });

  /* ---------- 3B · recepción en la sucursal ---------- */
  const B = p.band({
    y: A.bottom + 44, tag: '3B', title: 'Recepción en la sucursal: escanear y verificar',
    desc: 'La sucursal escanea lo que llega y e-Karú lo compara con la Orden de Despacho. El stock de la sucursal sube solo con lo que realmente se escaneó.',
    lanes: [E.lane('suc', 200, [100]), E.lane('ek', 330, [100, 245]), E.lane('cen', 170, [85])]
  });
  B.ev('Lc', 'suc', 1, 'link', 'C · Llega el camión de la Central', { lp: 'b', lw: 140 });
  B.t('R1', 'suc', 2, 'Recibir el camión y controlar la carga a la vista', 'manual');
  B.t('R2', 'suc', 3, 'Escanear cada balde y cada producto que llega', 'scan');
  B.t('Ev', 'ek', 4, 'Compara lo escaneado con la Orden de Despacho: código, lote y cantidad', 'auto');
  B.gw('Gall', 'ek', 5, 'xor', '¿Llegó todo lo despachado?', { lw: 150 });
  B.t('Eok', 'ek', 6, 'Pasa el 100 % al stock de la sucursal, marca el pedido «Entregado» y avisa a la Central', 'auto', { w: 200 });
  B.ev('End1', 'ek', 7, 'end', 'Pedido entregado, verificado y disponible en el inventario de la sucursal', { lp: 'b', lw: 190 });
  B.t('Epart', 'ek', 5, 'Ingresa a la sucursal solo lo escaneado (stock real) y marca «recibido parcialmente»', 'auto', { row: 1, w: 200 });
  B.t('Eal', 'ek', 6, 'Envía la alerta de discrepancia a la Central y deja el faltante como Backorder pendiente', 'auto', { row: 1, w: 200 });
  B.t('Trev', 'cen', 7, 'Revisar la discrepancia con la sucursal: reponer el faltante o ajustar', 'user');
  B.ev('Ld2', 'cen', 8, 'link', 'D · Backorder pendiente: sigue en 3C', { thrw: true, lp: 'b', lw: 150 });
  B.note('Nbr', 'suc', 5, 'Brownies, pastafrola y tartas: a definir si se controlan con escáner en cada salón o solo con ingreso al llegar y baja por vencimiento (encuesta al personal de caja en curso).', { w: 330 });
  B.card('Ks', 'ek', 9, { title: 'Estados del pedido en e-Karú', items: ['Pendiente: cargado por la sucursal', 'En picking: Orden de Picking generada', 'En tránsito: despachado y fuera del stock central', 'Entregado: verificado y en el stock de la sucursal', 'Recibido parcialmente: stock real ingresado y Backorder pendiente'], w: 520, dx: 28, dy: 60 });

  B.e('Lc', 'R1', 'r', 'l');
  B.e('R1', 'R2', 'r', 'l');
  B.e('R2', 'Ev', 'r', 't');
  B.e('Ev', 'Gall', 'r', 'l');
  B.e('Gall', 'Eok', 'r', 'l', { label: 'Sí' });
  B.e('Eok', 'End1', 'r', 'l');
  B.e('Gall', 'Epart', 'b', 't', { label: 'No' });
  B.e('Epart', 'Eal', 'r', 'l');
  B.e('Eal', 'Trev', 'r', 't', { k: 'msg' });
  B.e('Trev', 'Ld2', 'r', 'l');
  B.e('R2', 'Nbr', 'r', 'l', { k: 'assoc' });
  B.frame(['R2'], 'Por cada balde o producto');

  return E.fin(p);
};
})();
