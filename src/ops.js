/* OPERACIÓN Y PROYECTO · datos de partida, qué pasa si, inventario, maestros, auditoría, costos, Glacé Compras y gobierno */
(function () {
'use strict';
const E = window.Eng;
const T = E.TP;

T.addCss(`
.tp .tbl td.mut{color:#8A5A1E;font-weight:600}
.tp .tbl td.ok2{color:#2B7A3B;font-weight:600}
.tp .gv{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
`);

E.PAGES.ops = function () {
  const K = E.CAT, H = E.HEL;
  /* ---------- datos de partida ---------- */
  const dp = [
    ['Ventas por día en cada salón (tickets y bochas)', 'Dimensionar la caja, el Club y el pedido sugerido', 'Reporte de la caja actual de las últimas 2 semanas', 'Encargados de salón', null],
    ['Baldes producidos por semana, por sabor', 'MRP, capacidad y stock de seguridad', 'Planilla de producción; desde la Etapa 1, el escaneo', 'Producción', null],
    ['Capacidad de la cámara (baldes) y de la planta (litros por día)', 'El MRP no puede planificar más de lo que entra', 'Contar lugares y medir una semana normal y una de pico', 'Producción', null],
    ['Merma por balde hoy (overrun, restos, derretido)', 'Tolerancia del balde terminado (3I) y costo real', 'Pesar 20 baldes al abrir y lo que queda al terminar, en el salón piloto', 'Encargado del salón piloto', null],
    ['Tiempo por venta en la caja hoy', 'Criterio de aceptación del salón piloto', 'Cronometrar 20 ventas (conos, vasos, milkshakes) en hora pico', 'Glacé y e-Karú', null],
    ['Diferencias de inventario hoy', 'Punto de partida del indicador de stock', 'Un conteo completo en la fábrica y en un salón', 'Depósito y encargado', null],
    ['Locales: salones, sucursales y franquicias', 'Canales, equipos y Club', 'Lista con tipo de cada local', 'Administración', null],
    ['Clientes mayoristas y minoristas activos, pedidos por semana', 'Portal, reparto y crédito', 'Facturación de los últimos 3 meses', 'Ventas', null],
    ['Facturas de compra por mes', 'Carga de compras (1B)', 'Excel de Marangatu', 'Compras', '168 en octubre 2026 (167 con CDC, 1 de papel)'],
    ['Catálogo activo', 'Códigos y maestros', 'Catálogo de e-Karú Etiquetas y lista de la balanza', 'Producción', `${K.nProd} productos, ${K.PADRE.length} grupos PADRE, ${H.nSab} sabores + ${H.extra.length} de la balanza`]
  ];
  const dpT = `<table class="tbl"><thead><tr><th style="width:26%">DATO</th><th style="width:20%">PARA QUÉ</th><th>CÓMO SE MIDE</th><th style="width:13%">QUIÉN</th><th style="width:17%">VALOR</th></tr></thead><tbody>${dp.map((r, i) => `<tr${i % 2 ? ' class="al"' : ''}><td class="k">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td>${r[4] ? `<td class="ok2">${r[4]}</td>` : '<td class="mut">Falta medir</td>'}</tr>`).join('')}</tbody></table>
    <div class="note" style="margin-top:18px"><b>Regla:</b> ningún indicador de este informe se declara cumplido sin su valor de partida. Lo que falta se mide en las 2 semanas anteriores a la Etapa 1, con el sistema de hoy.</div>`;

  /* ---------- qué pasa si ---------- */
  const qp = [
    ['La caja se queda sin internet', 'La venta no se frena: la caja sigue vendiendo y sincroniza al volver (sellos del Club incluidos).', 'Requisito para e-Karú: confirmar que la caja trabaja sin conexión y cómo sincroniza.', 'e-Karú'],
    ['La balanza o su impresora no funcionan', 'Se pesa en otra balanza y el balde se etiqueta con un ID 24 de e-Karú Etiquetas (opción B de la pág. 3).', 'Registro manual con motivo; se revisa al cierre de la orden.', 'Operario de planta'],
    ['Una etiqueta no se lee', 'Se tipea el número impreso. Si tampoco se puede, se reetiqueta con un ID 24.', 'e-Karú guarda que el código se tipeó, no se escaneó.', 'Quien escanea'],
    ['Se rompe un escáner', 'Se tipea el código mientras tanto; hay un escáner de repuesto en planta, Central y cada salón.', 'Cuántos repuestos: punto de equipos.', 'Encargado del puesto'],
    ['El cajero eligió el balde equivocado', 'El encargado corrige el movimiento con motivo; no se borra.', 'Queda en la auditoría con usuario y fecha.', 'Encargado del salón'],
    ['Se anula una venta', 'Se revierten solos el grupo PADRE, los gramos del balde y el sello del Club.', 'El Club ya lo hace; e-Karú lo extiende al stock.', 'Automático'],
    ['Un cliente devuelve mercadería', 'Se escanea al volver, con motivo; nota de crédito con el mismo código; calidad decide si se reprocesa o se descarta.', 'Ver devoluciones (pág. 15).', 'Ventas y calidad'],
    ['Un balde llega derretido o roto', 'En la recepción del local (3B) se da de baja con foto y motivo; cuenta como merma de transporte.', 'Si se repite, se busca la causa (pág. 4).', 'Local que recibe'],
    ['Se corta el frío en una cámara o vitrina', 'Los lotes afectados pasan a «bloqueado» hasta que calidad decide.', 'Decidir si la temperatura se registra en e-Karú o en planilla (punto abierto).', 'Calidad / encargado'],
    ['Un insumo vence en el depósito', 'e-Karú lo bloquea solo por fecha; baja con motivo.', 'Entra al indicador de vencidos y merma.', 'Automático'],
    ['Llega un pedido urgente fuera del plan', 'Entra como urgente; si toca las 48 h congeladas, lo aprueba Planificación con motivo.', 'Se ve en el control diario (0B).', 'Planificación'],
    ['El conteo no coincide con el sistema', 'El ajuste se hace solo con motivo; por encima del umbral, lo aprueba el responsable del área.', 'Umbral a definir con los datos de partida.', 'Responsable del área']
  ];
  const qpT = `<table class="tbl"><thead><tr><th style="width:20%">QUÉ PASA SI…</th><th>QUÉ SE HACE</th><th style="width:28%">CONTROL EN e-KARÚ</th><th style="width:13%">QUIÉN</th></tr></thead><tbody>${qp.map((r, i) => `<tr${i % 2 ? ' class="al"' : ''}><td class="k">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`;

  /* ---------- maestros, auditoría, inventario, costos ---------- */
  const mae = `<div class="card"><h3>Un solo maestro: e-Karú</h3><p style="margin-bottom:10px">La balanza (Scale Manager) y e-Karú Etiquetas copian los datos de e-Karú; nadie los cambia por su cuenta. Cada maestro tiene un responsable con nombre:</p><ul class="bl">
    <li><b>Sabores, bases y PLU de la balanza:</b> Producción.</li><li><b>Recetas y merma estándar:</b> Producción.</li><li><b>Productos, códigos y grupos PADRE:</b> Producción, con aprobación de Administración.</li><li><b>Proveedores, insumos y equivalencias:</b> Compras.</li><li><b>Clientes, listas de precios y crédito:</b> Ventas y Administración.</li><li><b>Parámetros del MRP:</b> Planificación.</li></ul></div>`;
  const aud = `<div class="card"><h3>Roles y auditoría</h3><ul class="bl">
    <li>Cada rol ve y hace solo lo suyo: planificación, depósito, planta, Central, ventas, compras, cajero, encargado de salón y franquicia.</li>
    <li>Toda anulación, ajuste de stock, cambio de precio, de receta o de parámetro queda con <b>usuario, fecha, hora y motivo</b>, sin poder borrarse.</li>
    <li>Los cambios en las 48 h congeladas y los ajustes sobre el umbral piden aprobación.</li>
    <li>Requisito para e-Karú: confirmar qué parte de esto ya existe.</li></ul></div>`;
  const inv = `<div class="card"><h3>Inventario sin parar la operación</h3><ul class="bl">
    <li><b>Conteo rotativo con escáner:</b> los sabores e insumos A cada semana; el resto, una vez por mes; en la fábrica y en cada local.</li>
    <li>e-Karú arma la lista del día y compara lo contado con el sistema.</li>
    <li>La diferencia se ajusta con motivo; por encima del umbral, aprueba el responsable.</li>
    <li>Indicador: diferencia de inventario frente al valor de partida.</li></ul></div>`;
  const cost = `<div class="card"><h3>Costos y márgenes</h3><ul class="bl">
    <li><b>Costo por receta:</b> insumos al precio real de la última compra (1B) + merma estándar → costo por kilo, por bocha y por producto.</li>
    <li><b>Margen</b> por producto, por local y por canal (salón, mayorista, minorista, franquicia).</li>
    <li><b>Costo de los premios del Club</b> y de la merma, por local.</li>
    <li><b>Exportación a la contabilidad:</b> el formato se define con el contador.</li></ul></div>`;
  const gc = `<div class="card"><h3>Glacé Compras: el puente hasta la Etapa 2</h3><p>Glacé ya tiene su propio programa, Glacé Compras: lee el Excel de Marangatu, baja los XML de e-Kuatia por CDC y entrega un Excel con las hojas Cabecera, Detalle y Pendientes. Mientras e-Karú no consulte las facturas por su CDC, ese Excel es la forma de cargar las compras con ítems. Se apaga cuando la Etapa 2 cierra un mes completo sin él. Pregunta para e-Karú: ¿su consulta por CDC funciona sin captcha?</p></div>`;

  /* ---------- gobierno ---------- */
  const gv = [
    ['Responsable del proyecto en Glacé', 'A nombrar', 'Decide prioridades, aprueba cada etapa y consigue los datos de partida.'],
    ['Responsable en e-Karú', 'A nombrar', 'Cotiza por etapa, entrega y prueba con Glacé.'],
    ['Salón piloto', 'A elegir', 'Prueba primero el update de la caja, el Club y el balde terminado.'],
    ['Firma de cada etapa', 'Glacé + e-Karú', 'El responsable de Glacé y el encargado del área firman cuando se cumple «lista cuando» (pág. 2).'],
    ['Seguimiento', 'Cada 2 semanas (propuesta)', 'Avance, indicadores y puntos abiertos de la pág. 17.'],
    ['Capacitación', 'Por rol, antes de cada etapa', 'Primero en el salón piloto y en un puesto de la fábrica; con una guía de una página por rol.']
  ];
  const gvT = `<table class="tbl"><thead><tr><th style="width:24%">QUÉ</th><th style="width:18%">QUIÉN / CUÁNDO</th><th>CÓMO</th></tr></thead><tbody>${gv.map((r, i) => `<tr${i % 2 ? ' class="al"' : ''}><td class="k">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>
    <div class="note" style="margin-top:18px"><b>MVP:</b> Etapas 0 a 3 y el salón piloto. El MRP, el portal de pedidos, el crédito y las franquicias (Etapa 5) se cotizan aparte, después de medir el MVP con los datos de partida.</div>`;

  const html = T.head('check', 'Operación y proyecto',
    'Lo que hace que el proceso ideal funcione en el día a día: con qué datos se arranca, qué pasa cuando algo falla, quién cuida cada dato, cómo se cuentan el stock y los costos, y quién lleva el proyecto.', 'OPERACIÓN · TO-BE') +
    T.sec('DATOS DE PARTIDA', 'Con qué números se arranca', 'Sin el valor de hoy no se puede probar que algo mejoró. Los que ya se conocen están en verde; el resto se mide antes de la Etapa 1.', dpT) +
    T.sec('QUÉ PASA SI…', 'Doce situaciones fuera del caso ideal', 'Cada una se prueba una vez en el piloto antes de cerrar la etapa que la usa.', qpT) +
    `<section><div class="two eq">${mae}${aud}</div></section>` +
    `<section><div class="three">${inv}${cost}${gc}</div></section>` +
    T.sec('GOBIERNO DEL PROYECTO', 'Quién lleva el proyecto y cómo se aprueba cada etapa', 'Sin un responsable con nombre en cada lado, las etapas no se cierran.', gvT);
  return T.mount(html);
};
})();
