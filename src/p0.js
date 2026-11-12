/* PROCESO 0 · Planificación (MRP): une los tres procesos — de la venta al plan, y del plan a las órdenes */
(function () {
'use strict';
const E = window.Eng;
const T = E.TP;

T.addCss(`
.tp .stc{display:flex;align-items:stretch;gap:10px}
.tp .stc i{font-style:normal;align-self:center;color:#5B6D66;font-weight:700;font-size:20px}
.tp .stc .sb{flex:1;border:1.8px solid;border-radius:12px;padding:14px 16px 16px;background:#fff;display:flex;flex-direction:column;gap:5px}
.tp .stc .sb b{font-size:17px;line-height:22px;color:#14231F}
.tp .stc .sb span{font-size:14.2px;line-height:20px;color:#33453F}
.tp .stc .sn{width:26px;height:26px;border-radius:8px;color:#fff;font-size:13.5px;font-weight:700;display:flex;align-items:center;justify-content:center}
.tp .card.red{border-color:#B3392E}
.tp .kp{display:grid;grid-template-columns:repeat(5,1fr);gap:22px}
.tp .kp .card{padding:20px 22px 22px}
.tp .kp .fm{font-family:${T.MONO};font-size:13.5px;line-height:19px;color:#14231F;background:#F1F5F3;border-radius:8px;padding:8px 10px;margin:8px 0 10px}
.tp .kp .mt{font-size:13.5px;font-weight:700;color:#1D7A6B}
.tp .seqs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0 12px}
.tp .seqs span{display:inline-flex;align-items:center;height:30px;padding:0 13px;border-radius:15px;font-size:14px;font-weight:600;border:1.2px solid #C9D4CF;background:#fff;color:#14231F;white-space:nowrap}
.tp .seqs i{font-style:normal;color:#5B6D66;font-weight:700}
`);

E.PAGES.p0 = function () {
  const pg = T.embed('0', 'p0', (p) => {
    /* ---------- 0A · de la venta al plan aprobado ---------- */
    const A = p.band({
      y: 0, tag: '0A', title: 'De cada venta al plan de la semana',
      desc: 'e-Karú junta la demanda real de todos los canales, la proyecta y calcula qué producir y qué comprar. Planificación solo revisa y aprueba.',
      lanes: [E.lane('can', 170, [85]), E.lane('ek', 290, [130]), E.lane('plan', 220, [110])]
    });
    A.ev('S', 'can', 1, 'start', 'Cada venta en la caja de salones y franquicias (con o sin Club) y cada pedido de sucursal o cliente', { lp: 'r', lw: 250 });
    A.t('Edem', 'ek', 2, 'Registra la demanda real por sabor, producto, canal y local, todos los días', 'auto');
    A.t('Efc', 'ek', 3, 'Proyecta la demanda de las próximas semanas: historia reciente ajustada por temporada, feriados y promociones', 'auto', { w: 196 });
    A.t('Emps', 'ek', 4, 'Plan maestro por sabor y producto: el mayor entre proyección y pedidos firmes + stock de seguridad − stock disponible', 'auto', { w: 196 });
    A.t('Ebom', 'ek', 5, 'Explota las recetas en 3 niveles (base → mezcla base blanca → sabor) y arma tandas de 150, 250 o 350 L', 'auto', { w: 196 });
    A.t('Enet', 'ek', 6, 'Necesidad neta de cada insumo: necesidad − stock usable − compras en camino, según el plazo del proveedor', 'auto', { w: 196 });
    A.t('Eseq', 'ek', 7, 'Propone el orden de las tandas para limpiar menos y respetar los alérgenos', 'auto');
    A.t('Pok', 'plan', 8, 'Revisar y aprobar el plan en la tablet: mover, sumar o quitar tandas, siempre con motivo', 'user', { w: 196 });
    A.ev('Lout', 'plan', 9, 'link', 'Plan aprobado: sigue en 0B', { thrw: true, lp: 'b', lw: 140 });
    A.card('Kdat', 'plan', 3, { title: 'Datos que genera el escaneo (con el update de la caja)', items: ['Ventas por sabor en gramos (cada bocha descuenta del balde)', 'Pedidos de sucursales y clientes (3A, 3E)', 'Stock por lote y vencimiento, en fábrica, salones, sucursales y en tránsito', 'Recetas, rendimiento real y plazos de cada proveedor (1A, 2B)'], w: 470, dx: 40 });
    A.note('Nst', 'can', 4, 'Stock disponible = stock liberado (sin vencidos ni bloqueados por calidad) en fábrica y locales + en tránsito.', { w: 300 });
    A.note('Nfz', 'can', 7, 'Las próximas 48 h quedan congeladas: el plan nuevo no mueve lo que ya está en la planta.', { w: 280 });

    A.e('S', 'Edem', 'b', 'l');
    A.e('Edem', 'Efc', 'r', 'l');
    A.e('Efc', 'Emps', 'r', 'l');
    A.e('Emps', 'Ebom', 'r', 'l');
    A.e('Ebom', 'Enet', 'r', 'l');
    A.e('Enet', 'Eseq', 'r', 'l');
    A.e('Eseq', 'Pok', 'r', 't');
    A.e('Pok', 'Lout', 'r', 'l');
    A.e('Emps', 'Nst', 't', 'b', { k: 'assoc' });
    A.e('Eseq', 'Nfz', 't', 'b', { k: 'assoc' });

    /* ---------- 0B · del plan a las órdenes, y control diario ---------- */
    const B = p.band({
      y: A.bottom + 44, tag: '0B', title: 'Del plan a las órdenes de los tres procesos, y control de cada día',
      desc: 'Un solo plan genera las tres órdenes. Cada noche e-Karú compara el plan con lo escaneado y replanifica solo lo que no está congelado.',
      lanes: [E.lane('ek', 480, [82, 240, 398]), E.lane('plan', 170, [85])]
    });
    B.ev('Lin', 'ek', 1, 'link', 'Plan aprobado (0A)', { row: 1, lp: 'b', lw: 120 });
    B.gw('Gs', 'ek', 2, 'and', '', { row: 1 });
    B.t('Eop', 'ek', 3, 'Libera las Órdenes de Producción de cada día, en el orden propuesto', 'auto', { row: 0, w: 214 });
    B.t('Eoc', 'ek', 3, 'Genera las Órdenes de Compra por proveedor (mínimo y empaque) y las envía por correo', 'auto', { row: 1, w: 214 });
    B.t('Erp', 'ek', 3, 'Genera cada noche el pedido sugerido de cada salón y sucursal, hasta su máximo por sabor', 'auto', { row: 2, w: 214 });
    B.ev('L2', 'ek', 4, 'link', 'Proceso 2 · 2A Orden de producción', { row: 0, thrw: true, lp: 'r', lw: 150 });
    B.ev('L1', 'ek', 4, 'link', 'Proceso 1 · 1A Llega el camión', { row: 1, thrw: true, lp: 'r', lw: 150 });
    B.ev('L3', 'ek', 4, 'link', 'Proceso 3 · 3A El local lo confirma', { row: 2, thrw: true, lp: 'r', lw: 150 });
    B.ev('Td', 'ek', 6, 'timer', 'Cierre de cada día', { row: 0, lp: 'b', lw: 110 });
    B.t('Ecmp', 'ek', 7, 'Compara plan y real: producción escaneada, ventas, stock, vencimientos y compras atrasadas', 'auto', { row: 0, w: 196 });
    B.gw('Gdv', 'ek', 8, 'xor', '¿Hay un desvío fuera de tolerancia?', { row: 0, lw: 150 });
    B.ev('Eok', 'ek', 10, 'end', 'El plan sigue igual', { row: 0, lp: 'b', lw: 110 });
    B.t('Erepl', 'ek', 8, 'Replanifica lo no congelado y avisa qué cambió y por qué', 'auto', { row: 1 });
    B.t('Prev', 'plan', 9, 'Revisar el cambio y aprobarlo', 'user');
    B.ev('Eend', 'plan', 10, 'end', 'Plan actualizado: las órdenes nuevas siguen el mismo camino', { lp: 'b', lw: 170 });

    B.e('Lin', 'Gs', 'r', 'l');
    B.e('Gs', 'Eop', 't', 'l');
    B.e('Gs', 'Eoc', 'r', 'l');
    B.e('Gs', 'Erp', 'b', 'l');
    B.e('Eop', 'L2', 'r', 'l');
    B.e('Eoc', 'L1', 'r', 'l');
    B.e('Erp', 'L3', 'r', 'l');
    B.e('Td', 'Ecmp', 'r', 'l');
    B.e('Ecmp', 'Gdv', 'r', 'l');
    B.e('Gdv', 'Eok', 'r', 'l', { label: 'No' });
    B.e('Gdv', 'Erepl', 'b', 't', { label: 'Sí' });
    B.e('Erepl', 'Prev', 'r', 't');
    B.e('Prev', 'Eend', 'r', 'l');
  });

  const R = (ids) => T.refs('p0', ids);

  /* ---------- parámetros ---------- */
  const par = [
    ['Stock de seguridad por sabor (fábrica)', 'Cubre la variación de la venta mientras se repone.', 'Stock de seguridad = Z × desvío de la venta semanal × √(semanas de reposición). Z = 1,65 (95 %) para los sabores A (los que más margen dejan) y 1,28 (90 %) para el resto (clasificación ABC).', 'e-Karú lo calcula; Producción fija el nivel de servicio'],
    ['Mínimo y máximo por local y sabor', 'Dispara el pedido sugerido de cada salón y sucursal (3A).', 'Mínimo = venta media diaria × días hasta el próximo camión + seguridad. Máximo = mínimo + un ciclo de reparto, limitado por el lugar en la vitrina y la cámara.', 'e-Karú lo propone; cada local lo confirma'],
    ['Plazo de cada proveedor e insumo', 'Cuándo hay que pedir para que el insumo llegue a tiempo.', 'Se mide solo: fecha de la Orden de Compra → fecha de recepción escaneada (1A). Se usa el promedio de las últimas entregas.', 'e-Karú lo mide'],
    ['Tanda mínima y volúmenes', 'Cómo se agrupa la necesidad en tandas.', '150, 250 o 350 L por base (punto ' + T.opNo('Volumen de las tandas') + '). Una tanda no se divide entre dos días.', 'Producción'],
    ['Ventana congelada', 'Evita cambiar lo que ya está en marcha.', '48 h. Dentro de ese plazo solo se cambia con aprobación de Planificación.', 'Planificación'],
    ['Vida útil y FEFO', 'Qué stock cuenta como usable.', 'Vencimiento = elaboración + 120 días (parámetro por producto). Lo vencido o bloqueado por calidad no cuenta como disponible.', 'Producción'],
    ['Rendimiento y merma estándar', 'Pasa de litros de mezcla a kilos de helado.', 'Sale del cierre de cada orden (real frente a teórico, 2B) y se actualiza cada mes.', 'e-Karú lo mide'],
    ['Merma estándar por sabor', 'Overrun, restos en el balde y derretido: sin ella el stock nunca coincide.', 'Se mide 4 semanas en el salón piloto (peso al abrir y al terminar, 3I). De ahí sale también la tolerancia del balde terminado.', 'Producción, con el encargado del piloto'],
    ['Capacidad semanal', 'El plan no puede pedir más de lo que entra.', 'Litros por día de la planta y lugares en la cámara. Lo que la supera no se convierte en orden: se muestra como alerta para adelantar o repartir.', 'Producción'],
    ['Arranque del pronóstico', 'Al principio no hay venta por sabor en las cajas.', 'Hasta tener 8 semanas de venta por sabor, se usa la producción escaneada (Etapa 1) y los pedidos como demanda. En temporada alta, plan mensual aprobado a mano.', 'Planificación']
  ];
  const parTbl = `<table class="tbl"><thead><tr><th style="width:17%">PARÁMETRO</th><th style="width:19%">PARA QUÉ</th><th>CÓMO SE CALCULA · VALOR INICIAL PROPUESTO</th><th style="width:18%">QUIÉN LO DEFINE</th></tr></thead><tbody>${par.map((r) => `<tr><td class="k">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`;

  /* ---------- secuencia ---------- */
  const seq = `<div class="card"><h3>Orden de las tandas: limpiar menos sin arriesgar</h3><p>Entre bases y dentro de cada base, de lo más suave a lo más intenso, así entre una tanda y otra alcanza con un enjuague:</p>
    <div class="seqs"><span>Neutra · vainilla, crema</span><i>→</i><span>frutales claros</span><i>→</i><span>base blanca (Oreo, Granizado…)</span><i>→</i><span>Chocolate</span></div>
    <ul class="bl"><li><b>Leche sin lactosa (DeliFREE):</b> primera tanda del día o después de una limpieza completa, para que no quede lactosa en la máquina.</li><li><b>Sabores con alérgenos declarados (maní, almendras, pistacho y similares):</b> al final del día, antes de la limpieza completa. Los sin lactosa con alérgenos (Maní DeliFREE, Americana con almendras DeliFREE) van al final de la tanda DeliFREE, seguidos de limpieza completa.</li><li>e-Karú solo <b>propone</b> el orden ${R(['Eseq'])}; Producción puede cambiarlo, siempre con motivo. Propuesta a confirmar con Producción (punto ${T.opNo('Secuencia de tandas y alérgenos')}).</li></ul></div>`;
  const club = `<div class="card"><h3>Qué aporta la caja al plan</h3><ul class="bl"><li>Cada bocha vendida descuenta sus gramos del balde (3D): e-Karú sabe cuántos kilos de cada sabor se venden por día y por local ${R(['Edem'])}.</li><li>Los <b>premios del e-Karú Club</b> entran en la venta en Gs. 0 con el mismo código de producto: descuentan stock y cuentan como demanda, igual que una venta.</li><li>Los socios del Club muestran qué clientes vuelven y cada cuánto, por local: sirve para planificar promociones y medir su efecto en la demanda.</li><li>Las franquicias venden con su propia caja e-Karú: si comparten su venta, su pedido se calcula igual que el de un salón (opción B, página 15).</li></ul></div>`;

  /* ---------- estados del stock (calidad) ---------- */
  const STS = [
    ['En control', 'Balde recién envasado (2B), hasta cerrar la orden. Los insumos entran liberados si pasan la inspección (1A).', '#B8801A'],
    ['Liberado', 'Pasó el control: cuenta como disponible para el MRP.', '#1D7A6B'],
    ['Reservado', 'Separado en una Orden de Picking (3A, 3E).', '#1D7A6B'],
    ['En tránsito', 'Salió de la Central con su Orden de Despacho.', '#1D7A6B'],
    ['En el local', 'Escaneado al llegar al salón o la sucursal (3B).', '#1D7A6B'],
    ['Abierto · terminado', 'Balde en la vitrina: baja por gramos; vacío, «terminado» (3I).', '#1D7A6B']
  ];
  const chain = `<div class="stc">${STS.map((x, i) => `<div class="sb" style="border-color:${x[2]}"><div class="sn" style="background:${x[2]}">${i + 1}</div><b>${x[0]}</b><span>${x[1]}</span></div>${i < STS.length - 1 ? '<i>→</i>' : ''}`).join('')}</div>
    <div class="two eq" style="margin-top:22px"><div class="card red"><h3>Bloqueado o vencido</h3><p>Si un control falla, e-Karú bloquea el lote en cualquier estado y abre una <b>no conformidad</b>: qué falló, cuánto y dónde está (se busca por código, 3D). Se decide reprocesar, descartar o devolver al proveedor (1R). Lo bloqueado y lo vencido nunca cuentan como disponible.</p></div>
    <div class="card"><h3>Causa y acción, no solo el arreglo</h3><p>Cuando la misma falla se repite (por ejemplo, tres veces el mismo insumo o la misma merma), se busca la causa con los datos escaneados y se define una acción con responsable y fecha. Se cierra solo cuando tres lotes seguidos salen bien. «Error del operario» no es una causa: la pregunta es por qué el sistema lo permitió.</p></div></div>`;

  /* ---------- indicadores ---------- */
  const kpi = [
    ['Precisión del pronóstico', 'Error ponderado = Σ |real − pronóstico| ÷ Σ real, por sabor y semana', 'menos de 25 %', 'Si sube 4 semanas seguidas, se revisa el método'],
    ['Cumplimiento del plan', 'Tandas hechas en su día ÷ tandas planificadas', 'más de 90 %', 'Lo escaneado en 2A y 2B frente al plan'],
    ['Quiebres en los salones', 'Sabores agotados en la vitrina ÷ sabores del surtido', 'menos de 2 %', 'Lo marca la caja y el stock del salón'],
    ['Días de stock', 'Stock por sabor ÷ venta media diaria', '7 a 21 días', 'Por debajo: riesgo de quiebre; por encima: riesgo de vencimiento'],
    ['Vencidos y merma', 'Kilos dados de baja ÷ kilos producidos', 'menos de 1 %', 'Por vencimiento, rotura o calidad']
  ];
  const kpis = `<div class="kp">${kpi.map((k) => `<div class="card"><h3>${k[0]}</h3><div class="fm">${k[1]}</div><div class="mt">Meta inicial: ${k[2]}</div><p style="margin-top:6px;font-size:14.5px;line-height:21px">${k[3]}</p></div>`).join('')}</div>
    <div class="note" style="margin-top:18px"><b>Metas iniciales propuestas:</b> son puntos de partida propuestos, no promesas. Se ajustan con los primeros tres meses de datos reales de Glacé.</div>`;

  const html = T.head('n0', 'Planificación (MRP): une los tres procesos',
    'Proceso 0 · Antes de recibir, producir o despachar, e-Karú calcula qué hace falta. La demanda real de todos los canales se convierte en un plan, y el plan en las órdenes de compra (Proceso 1), de producción (Proceso 2) y de reposición de salones y sucursales (Proceso 3).', 'PLANIFICACIÓN · TO-BE') +
    '<section><div id="dg"></div></section>' +
    T.sec('PARÁMETROS', 'Lo que el MRP necesita saber', 'Diez parámetros por sabor, local o proveedor. e-Karú mide o calcula la mayoría; las personas solo fijan los que son decisiones.', parTbl) +
    `<section><div class="two eq">${seq}${club}</div></section>` +
    T.sec('CALIDAD', 'Estados del stock: solo lo liberado se planifica y se vende', 'Cada escaneo cambia el estado del lote o del balde. Así el MRP, el picking y la caja ven lo mismo.', chain) +
    T.sec('INDICADORES', 'Cómo se sabe que la planificación funciona', 'Se ven por semana, por sabor y por local, en un tablero de e-Karú.', kpis);
  return T.mount(html, (el) => { el.querySelector('#dg').appendChild(pg.svg); }, { warns: pg.warns, tasks: pg.tasks });
};
})();
