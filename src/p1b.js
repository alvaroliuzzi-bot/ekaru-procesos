/* PROCESO 1 · página B — factura → precios y costos (v2: e-Karú trae las facturas por su CDC: QR del KuDE + Excel de Marangatu) */
(function () {
'use strict';
const E = window.Eng;
E.PAGES.p1b = function () {
  const p = E.mk('p1b', '1', {
    num: '1', title: 'Recepción de materia prima',
    sub: 'Fase B · Factura → precios y costos. e-Karú trae cada factura por su CDC (del QR del KuDE o del Excel de Marangatu, que además controla que no falte ninguna) y la compara con la Orden de Compra y la recepción: control de tres vías.'

  });

  const B = p.band({
    y: p.headBottom + 26, tag: '1B', title: 'De la factura de compra al precio y costo en e-Karú',
    desc: 'Camino diario: el depósito escanea el QR del KuDE y e-Karú trae la factura. Control semanal y de cierre: el Excel de Marangatu completa los CDC que falten y marca las facturas de papel, que son las únicas que se cargan.',
    lanes: [E.lane('sup', 150, [70]), E.lane('dep', 165, [82]), E.lane('ek', 330, [85, 245]), E.lane('adm', 215, [107], { sub: 'control semanal y facturas de papel' })]
  });

  B.ev('S1', 'sup', 1, 'start', 'Entrega la mercadería con el KuDE de la factura electrónica', { lp: 'r', lw: 200 });
  B.note('Nmes', 'sup', 5, 'Octubre 2026 (Excel de Marangatu): 167 de 168 facturas de compra tenían CDC y 1 era de papel. El Excel es la lista completa del mes: con él e-Karú controla que no falte ninguna.', { w: 560 });

  B.t('Tqr', 'dep', 2, 'Escanear el QR del KuDE al recibir la entrega: trae el CDC de la factura', 'scan', { w: 200 });
  B.note('Nqr', 'dep', 6, 'El QR del KuDE es del proveedor y contiene el CDC. Se lee con un escáner 2D o con la cámara de la tablet; si no, se tipea el CDC impreso. Glacé no imprime QR.', { w: 600 });

  B.ev('Tm', 'adm', 1, 'timer', 'Cada semana y al cierre del mes', { lp: 'b', lw: 130 });
  B.t('Tdl', 'adm', 2, 'Bajar de Marangatu el Excel de comprobantes registrados', 'manual', { w: 200 });
  B.t('Tup', 'adm', 3, 'Subir el Excel a e-Karú', 'user', { w: 190 });

  B.t('Ecdc', 'ek', 4, 'Consulta la factura en SIFEN por su CDC y la trae con ítems, cantidades, precios e IVA; si todavía no está, reintenta sola', 'auto', { w: 230 });
  B.t('Eexc', 'ek', 4, 'Lee el Excel: manda a consultar los CDC que todavía no tiene y deja las filas sin CDC como «factura de papel»', 'auto', { row: 1, w: 230 });
  B.note('Npre', 'ek', 2, 'Requisito: Glacé con facturación electrónica activa y su certificado digital cargado en e-Karú. Mientras tanto, e-Karú ya carga facturas por XML o con una foto.', { row: 1, w: 330 });
  B.t('Titem', 'adm', 5, 'Facturas de papel: cargar los ítems con una foto (lectura automática) o a mano', 'user', { w: 200 });

  B.t('Ematch', 'ek', 5, 'Empareja cada línea con la recepción y la Orden de Compra: insumo, cantidad y precio pactado (tres vías)', 'auto', { w: 214 });
  B.gw('Gok', 'ek', 6, 'xor', '¿Todo coincide?');
  B.t('Eprice', 'ek', 7, 'Asigna precio, IVA y costo a la recepción, actualiza el costo del insumo y la cierra', 'auto');
  B.ev('End1', 'ek', 8, 'end', 'Compra cerrada: stock valorizado, costos y KPIs disponibles', { lp: 'b', lw: 170 });
  B.t('Ediff', 'ek', 6, 'Marca la diferencia: sin recepción, cantidad o precio distinto de la Orden de Compra, o insumo sin equivalencia', 'auto', { row: 1, w: 200 });
  B.t('Tres', 'adm', 9, 'Resolver: equivalencia o ajuste (vuelve a 1.18) o pedir nota de crédito al proveedor', 'user');
  B.t('Pnc', 'sup', 10, 'Emitir la nota de crédito electrónica', 'extmsg', { no: false });
  B.ev('End2', 'dep', 10, 'end', 'Nota de crédito: e-Karú la trae por su CDC', { lp: 'b', lw: 170 });

  B.card('Kpi', 'adm', 7, { title: 'Con el precio de cada ítem, e-Karú permite', items: ['Costo real de cada producto y de cada balde', 'Evolución de precios y comparación entre proveedores', 'Detectar diferencias, faltantes y notas de crédito pendientes', 'Medir el plazo real de cada proveedor (Orden de Compra → recepción) para el MRP'], w: 500 });

  B.e('S1', 'Tqr', 'b', 'l');
  B.e('Tqr', 'Ecdc', 'r', 't');
  B.e('Tm', 'Tdl', 'r', 'l');
  B.e('Tdl', 'Tup', 'r', 'l');
  B.e('Tup', 'Eexc', 't', 'l');
  B.e('Eexc', 'Ecdc', 't', 'b');
  B.e('Eexc', 'Titem', 'b', 'l', { label: 'Sin CDC' });
  B.e('Titem', 'Ematch', 't', 'b');
  B.e('Ecdc', 'Ematch', 'r', 'l');
  B.e('Ematch', 'Gok', 'r', 'l');
  B.e('Gok', 'Eprice', 'r', 'l', { label: 'Sí' });
  B.e('Eprice', 'End1', 'r', 'l');
  B.e('Gok', 'Ediff', 'b', 't', { label: 'No' });
  B.e('Ediff', 'Tres', 'r', 't');
  B.e('Tres', 'Pnc', 'r', 'l', { k: 'msg', label: 'Nota de crédito', lc: '#33453F' });
  B.e('Pnc', 'End2', 'b', 't');

  return E.fin(p);
};
})();
