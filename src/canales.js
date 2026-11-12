/* CANALES · de la fábrica a cada destino: salones, sucursales, mayoristas, minoristas y franquicias (caso aparte) */
(function () {
'use strict';
const E = window.Eng;
const T = E.TP;

T.addCss(`
.tp .map{display:grid;grid-template-columns:330px 56px 330px 56px 1fr;align-items:stretch}
.tp .map .ar{display:flex;align-items:center;justify-content:center}
.tp .map .src{border:1.8px solid #14231F;border-radius:16px;padding:20px 22px;background:#fff;display:flex;flex-direction:column;gap:10px}
.tp .map .src h3{margin:0;font-size:21px;line-height:26px;font-weight:700}
.tp .map .src p{margin:0;font-size:15px;line-height:21.5px;color:#33453F}
.tp .map .dst{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
.tp .map .dc{border:1.8px solid #1D7A6B;border-radius:16px;background:#fff;padding:18px 18px 18px;display:flex;flex-direction:column;gap:9px}
.tp .map .dc.fr{border-style:dashed;border-color:#8C2F5F;background:#FBF1F6}
.tp .map .dc h3{margin:0;font-size:19.5px;line-height:24px;font-weight:700}
.tp .map .dc .q{font-size:11.5px;font-weight:700;letter-spacing:1px;color:#5B6D66;margin:2px 0 -4px}
.tp .map .dc p{margin:0;font-size:14.5px;line-height:20.5px;color:#33453F}
.tp .map .dc .yes{color:#2B7A3B;font-weight:700}.tp .map .dc .no{color:#9B2C22;font-weight:700}
.tp .opt{border:1.8px solid #8C2F5F;border-radius:16px;background:#fff;padding:20px 24px 22px;display:flex;flex-direction:column;gap:10px}
.tp .opt.rec{box-shadow:0 0 0 3px #F3DFEA}
.tp .opt .ot{display:flex;align-items:center;gap:12px}
.tp .opt .ot .L{flex:0 0 40px;height:40px;border-radius:12px;background:#8C2F5F;color:#fff;font-weight:700;font-size:20px;display:flex;align-items:center;justify-content:center}
.tp .opt h3{margin:0;font-size:20px;line-height:25px;font-weight:700}
.tp .opt .tg{display:inline-block;font-size:11.5px;font-weight:700;letter-spacing:1px;padding:3px 9px;border-radius:9px;background:#F3DFEA;color:#8C2F5F;margin-left:auto;white-space:nowrap}
.tp .opt p{margin:0;font-size:15px;line-height:22px;color:#33453F}
.tp .opt .pc{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:auto}
.tp .opt .pc div{border-radius:10px;padding:10px 13px;font-size:14px;line-height:20px}
.tp .opt .pc .p{background:#DCEFE0;color:#1E5A2A}.tp .opt .pc .c{background:#FBE1DE;color:#7E241C}
.tp .opt .pc b{display:block;font-size:11px;letter-spacing:1px;margin-bottom:3px}
.tp .phs{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1.8px solid #8FA29A;border-radius:14px;overflow:hidden}
.tp .phs > div{padding:18px 22px 20px;border-left:1px solid #D5DFDA;background:#fff}
.tp .phs > div:first-child{border-left:none}
.tp .phs .w{font-size:12px;font-weight:700;letter-spacing:1.1px;color:#1D7A6B;margin-bottom:6px}
.tp .phs h4{margin:0 0 8px;font-size:17.5px;line-height:23px;font-weight:700}
.tp .phs p{margin:0;font-size:14.8px;line-height:21px;color:#33453F}
`);

E.PAGES.canales = function () {
  const ar = '<div class="ar"><svg width="40" height="24" viewBox="0 0 40 24"><path d="M2,12H32M25,4L34,12L25,20" fill="none" stroke="#20302B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  const dc = (title, what, how, doc, club, dg, cls) => `<div class="dc${cls ? ' ' + cls : ''}"><h3>${title}</h3><p>${what}</p><div class="q">CÓMO PIDE</div><p>${how}</p><div class="q">DOCUMENTO</div><p>${doc}</p><div class="q">e-KARÚ CLUB</div><p>${club}</p><div class="chips" style="margin-top:auto">${dg.map((x) => `<span class="chip"><b>${x}</b></span>`).join('')}</div></div>`;
  const map = `<div class="map">
    <div class="src"><div class="lbl" style="margin:0">FÁBRICA</div><h3>Plan, compra y producción</h3><p><b>0</b> · el MRP decide qué producir y qué comprar.</p><p><b>1</b> · la materia prima entra escaneando, contra su Orden de Compra.</p><p><b>2</b> · cada balde y producto sale con su código y queda «liberado».</p></div>${ar}
    <div class="src"><div class="lbl" style="margin:0">DEPÓSITO CENTRAL</div><h3>Picking, despacho y documento</h3><p><b>3A</b> · picking FEFO por escaneo para los locales propios.</p><p><b>3E</b> · para clientes, cada escaneo es una línea de la factura.</p><p><b>3F</b> · la Nota de Remisión sale del mismo escaneo.</p></div>${ar}
    <div class="dst">
      ${dc('Salones', 'Heladerías propias con atención al público.', 'e-Karú le sugiere el pedido cada noche; el encargado lo confirma.', 'Orden de Despacho; remisión si la requiere.', '<span class="yes">Sí</span>, en la caja e-Karú Ventas.', ['0B', '3A', '3B', '3H', '3I'])}
      ${dc('Sucursales', 'Locales propios que reciben stock, sin atención de salón.', 'Igual que el salón: pedido sugerido y confirmación.', 'Orden de Despacho; remisión si la requiere.', '<span class="no">No</span>.', ['0B', '3A', '3B'])}
      ${dc('Mayoristas', 'Clientes que compran por mayor (bares, restaurantes, distribuidores).', 'Portal de pedidos de e-Karú con su lista; o Ventas lo carga.', 'Factura electrónica con el código de cada línea.', '<span class="no">No</span>.', ['3E', '3F'])}
      ${dc('Minoristas', 'Comercios que revenden (despensas, kioscos, supermercados).', 'Portal o pedido sugerido por su historial, en la visita o la ruta.', 'Factura; o consignación si se acuerda.', '<span class="no">No</span>.', ['3E', '3G'])}
      ${dc('Franquicias', 'Otra empresa que vende con la marca Glacé. Caso aparte: ver abajo.', 'Como cliente con lista franquicia (opción A o B).', 'Factura; remisión si corresponde.', '<span class="yes">Sí</span>, en su propia caja e-Karú.', ['3E', '3H'], 'fr')}
    </div></div>`;

  const rows = [
    ['Salón propio', 'Sin precio: traslado entre locales', 'Sí: baldes (gramos que quedan), grupos PADRE y productos, en vivo', 'Ventas por sabor y por hora, Club, rendimiento por balde', 'Pedidos completos > 95 %, quiebres < 2 %, rendimiento del balde'],
    ['Sucursal propia', 'Sin precio: traslado entre locales', 'Sí: lo recibido y lo dado de baja', 'Consumo o ventas, según cómo trabaje el local', 'Pedidos completos > 95 %, vencidos < 1 %'],
    ['Mayorista', 'Lista mayorista, por kilo o por unidad', 'No: Glacé ve sus pedidos, facturas y saldo', 'Historial de pedidos para el pronóstico', 'Pedidos a tiempo y completos, días de cobro'],
    ['Minorista', 'Lista minorista', 'Solo si está en consignación (3G)', 'Historial de pedidos; venta real si es consignación', 'Pedidos a tiempo, devoluciones por vencimiento'],
    ['Franquicia', 'Lista franquicia', 'Según la opción elegida (abajo)', 'Pedidos; con la opción B, también su venta por sabor', 'Según el contrato de franquicia']
  ];
  const tbl = `<table class="tbl"><thead><tr><th style="width:12%">CANAL</th><th style="width:17%">PRECIO</th><th style="width:22%">STOCK DEL CANAL EN e-KARÚ</th><th>QUÉ DATO LE DA AL MRP</th><th style="width:25%">CÓMO SE MIDE</th></tr></thead><tbody>${rows.map((r, i) => `<tr${i % 2 ? ' class="al"' : ''}><td class="k">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}</tbody></table>`;

  const b2b = [
    ['Portal de pedidos', 'Cada cliente tiene su enlace: ve su lista de precios, arma el pedido, lo repite con un toque y sigue su estado (pendiente, en picking, en camino, entregado). Hora de corte y pedido mínimo por cliente. El pedido entra directo a la Central de Pedidos (3E) y a la demanda del MRP (0A).'],
    ['Crédito y cobranza', 'Límite de crédito y plazo por cliente. Si tiene facturas vencidas o supera el límite, el pedido queda retenido hasta que Administración lo libera, con motivo. Como el control de crédito de un ERP: nadie despacha a un cliente bloqueado sin querer.'],
    ['Reparto por zona y día', 'e-Karú agrupa los pedidos por ruta y fecha de entrega; el picking sale por ruta y la factura (y la remisión, si hace falta) viaja con el camión.'],
    ['Devoluciones', 'Lo vencido o roto vuelve escaneado, con motivo. e-Karú arma la nota de crédito electrónica con el mismo código de barras y la merma queda registrada para calidad y para el pronóstico.']
  ];
  const b2bc = `<div class="grid4">${b2b.map((c) => `<div class="card"><h3>${c[0]}</h3><p>${c[1]}</p></div>`).join('')}</div>
    <div class="phs" style="margin-top:22px">
      <div><div class="w">ETAPA 0</div><h4>Clientes con su lista</h4><p>Los mayoristas dejan de figurar como depósitos y pasan a ser clientes, con su lista de precios y su unidad de venta.</p></div>
      <div><div class="w">ETAPA 3</div><h4>Pedido y factura escaneando</h4><p>Ventas carga el pedido y la factura se arma con el escaneo del despacho (3E), con su remisión si hace falta (3F).</p></div>
      <div><div class="w">ETAPA 5</div><h4>Portal y crédito</h4><p>Los clientes piden solos en el portal; e-Karú controla crédito y agrupa por ruta. Su historial entra al pronóstico.</p></div>
      <div><div class="w">DESPUÉS</div><h4>Pedido sugerido al minorista</h4><p>Con el historial, e-Karú le propone el pedido en la visita o la ruta, como hace con los salones.</p></div></div>`;

  const opt = (L, title, tag, txt, pro, con, rec) => `<div class="opt${rec ? ' rec' : ''}"><div class="ot"><div class="L">${L}</div><h3>${title}</h3>${tag ? `<span class="tg">${tag}</span>` : ''}</div><p>${txt}</p><div class="pc"><div class="p"><b>A FAVOR</b>${pro}</div><div class="c"><b>EN CONTRA</b>${con}</div></div></div>`;
  const fr = `<div class="three">
    ${opt('A', 'Cliente con su propio e-Karú', 'PARA EMPEZAR', 'La franquicia le compra a Glacé como cliente, con la lista franquicia (3E). Vende con su propia caja e-Karú (el mismo update de Ventas: grupos PADRE, sabores y baldes) y el Club con la marca Glacé. Usa los mismos códigos 22, 29 y 20.', 'Separación contable simple; se puede arrancar ya.', 'Glacé no ve su venta por sabor: su demanda entra al MRP solo como pedidos.', true)}
    ${opt('B', 'Cliente que comparte su venta', 'OBJETIVO', 'Igual que A, y además la franquicia comparte con Glacé su venta por sabor y su stock de baldes. e-Karú le sugiere el pedido como a un salón (0B) y su demanda real entra al pronóstico (0A).', 'Mejor plan para todos y menos quiebres en la franquicia.', 'Necesita un acuerdo de datos y que e-Karú lo permita entre dos empresas.')}
    ${opt('C', 'Consignación', '', 'Glacé es dueña de la mercadería hasta que se vende; al cierre factura lo vendido (3G).', 'Glacé ve stock y venta reales.', 'Más trabajo contable y de control; hay que validarlo con el contador.')}</div>
    <div class="two eq" style="margin-top:22px"><div class="card"><h3>Qué hay que decidir para las franquicias</h3><ul class="bl">
      <li><b>Club:</b> una sola tarjeta para toda la marca (un socio suma en salones y franquicias) o una por franquicia (punto ${T.opNo('Club en franquicias: una tarjeta o varias')}).</li>
      <li><b>Premios:</b> si la tarjeta es una sola, quién paga el premio que se canjea en otro local.</li>
      <li><b>Datos:</b> si la franquicia comparte su venta y su stock (opción B) y con qué permisos.</li>
      <li><b>Precio y documento:</b> lista franquicia, unidad de venta (kilo o balde) y si viaja remisión.</li></ul></div>
    <div class="card"><h3>Lo que conviene igual en cualquier opción</h3><ul class="bl">
      <li>El mismo catálogo y los mismos códigos de barras que Glacé: la franquicia escanea los baldes y productos tal como llegan.</li>
      <li>El mismo update de e-Karú Ventas en su caja, para que el balde se descuente por gramos y el Club funcione igual que en los salones (3H).</li>
      <li>Pedido con fecha de entrega y hora de corte, como cualquier cliente.</li>
      <li>Empezar con una franquicia piloto antes de sumar las demás.</li></ul></div></div>`;

  const html = T.head('n3', 'Canales: de la fábrica a cada destino',
    'Proceso 3 · Un solo e-Karú para todos los destinos, pero cada canal pide, recibe y paga a su manera. Los locales propios reciben su pedido sugerido; los clientes, su factura con el código de cada línea; las franquicias son un caso aparte.', 'CANALES · TO-BE') +
    T.sec('MAPA', 'Cinco destinos, un mismo código de barras', 'De izquierda a derecha: la fábrica (Procesos 0 a 2), el Depósito Central (Proceso 3) y cada destino con su forma de pedir, su documento y si usa el Club.', map) +
    T.sec('POR CANAL', 'Qué ve e-Karú de cada canal y qué le aporta al plan', 'El MRP planifica mejor cuanto más cerca de la venta real está el dato: por eso los salones aportan su venta por sabor y los clientes, su historial de pedidos.', tbl) +
    T.sec('MAYORISTAS Y MINORISTAS', 'La mejor manera de implementarlo', 'Cuatro piezas, como en un ERP grande, pero dentro de e-Karú. Se suman por etapas, sin frenar lo que ya funciona.', b2bc) +
    T.sec('FRANQUICIAS · CASO APARTE', 'Tres maneras de trabajar con una franquicia', 'La franquicia es otra empresa con la marca Glacé: usa su propia caja e-Karú y el Club con la marca Glacé. Proponemos empezar con A y pasar a B cuando e-Karú permita compartir datos entre empresas.', fr);
  return T.mount(html);
};
})();
