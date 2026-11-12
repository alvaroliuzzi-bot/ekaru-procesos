<div align="center">

# 🍦 Glacé × e-Karú · De la fábrica al salón

**Informe final del proceso ideal: un solo e-Karú, solo códigos de barras, planificación MRP y cada canal con su documento**

![Versión](https://img.shields.io/badge/versión-final%20·%2012%2F11%2F2026-1D7A6B)
![Páginas](https://img.shields.io/badge/PDF-17%20páginas-14231F)
![Diagramas](https://img.shields.io/badge/diagramas-BPMN-B8801A)
![MVP](https://img.shields.io/badge/MVP-Etapas%200–3%20%2B%20salón%20piloto-8C2F5F)
![Hecho con](https://img.shields.io/badge/hecho%20con-JavaScript%20%2B%20Playwright-667085)

### [📄 Abrir el informe final (PDF)](docs/Glace_eKaru_Informe_final.pdf)

<img src="docs/img/todas_las_paginas.jpg" width="100%" alt="Las 17 páginas del informe">

</div>

---

## En una frase por proceso

| | Proceso | Qué cambia |
|:-:|---|---|
| **0** | **Planificación (MRP)** | La venta real de todos los canales se convierte en pronóstico, plan por sabor y producto, y órdenes de compra, producción y reposición. Ventana congelada de 48 h. |
| **1** | **Recepción de materia prima** | Cada entrega llega con su Orden de Compra; la factura se trae por su CDC y se controla en tres vías: orden, recepción y factura. |
| **2** | **Producción y envase** | La orden llega planificada; cada balde sale de la balanza con su código, el Nº de orden y queda «liberado» al cerrar la orden. |
| **3** | **Pedidos y despacho** | Cada salón y sucursal recibe su pedido sugerido; los clientes, su factura con el código de cada línea; la Nota de Remisión sale del mismo escaneo. |
| **🛎️** | **Salones** | La caja usa el update de **e-Karú Ventas** (grupos PADRE, sabores y balde por sabor) y **e-Karú Club** pone el sello con la misma venta. |
| **🚚** | **Canales** | Salones, sucursales, mayoristas, minoristas y franquicias (caso aparte), cada uno con su forma de pedir, su precio y su documento. |

<p align="center"><img src="docs/img/pag01_vision_general.jpg" width="85%" alt="Vista general: doce decisiones y los procesos"></p>

## Planificación (Proceso 0)

De cada venta al plan de la semana, y del plan a las órdenes. Parámetros (stock de seguridad, mínimo y máximo por local, merma, capacidad, arranque del pronóstico), estados del stock y calidad, e indicadores.

<p align="center"><img src="docs/img/pag04_planificacion_mrp.jpg" width="85%" alt="Proceso 0: planificación MRP"></p>

## Producción con balde liberado

<p align="center"><img src="docs/img/pag07_produccion.jpg" width="85%" alt="Proceso 2: orden de producción y envase de baldes"></p>

## Salones: e-Karú Ventas + e-Karú Club

La venta en la caja descuenta el grupo PADRE y los gramos de cada balde, y suma el sello del Club. Cuando un balde se vacía, e-Karú controla su rendimiento; al cierre, la venta del día se convierte en el pedido sugerido de mañana.

<p align="center"><img src="docs/img/pag14_salones_club.jpg" width="85%" alt="Salones: venta con e-Karú Ventas y Club"></p>

## Canales y franquicias

<p align="center"><img src="docs/img/pag15_canales.jpg" width="85%" alt="Canales: de la fábrica a cada destino"></p>

## Operación y proyecto

Datos de partida (lo que falta medir está marcado), doce situaciones fuera del caso ideal, un solo maestro de datos, auditoría, inventario rotativo, costos y márgenes, Glacé Compras como puente y el gobierno del proyecto.

<p align="center"><img src="docs/img/pag16_operacion.jpg" width="85%" alt="Operación y proyecto"></p>

## Contenido del PDF

| Pág. | Contenido |
|:-:|---|
| 1 | Vista general: doce decisiones, procesos, roles e índice |
| 2 | Respuesta a e-Karú: cuatro puntos y plan por etapas (MVP = Etapas 0–3 + salón piloto) |
| 3 | Códigos de barras: prefijos, reglas de lectura, balde único, cambio en 8 pasos |
| 4 | **Proceso 0** · planificación MRP, parámetros, estados del stock e indicadores |
| 5–6 | **Proceso 1** · recepción física, rechazo, factura por CDC y control de tres vías |
| 7–9 | **Proceso 2** · orden y envase, productos terminados, Promo Pack, bases y sabores |
| 10–13 | **Proceso 3** · pedidos, recepción en el local, faltantes, factura, remisión, consignación |
| 14 | **Salones** · venta con e-Karú Ventas y Club, balde terminado |
| 15 | **Canales** · mayoristas, minoristas y franquicias como caso aparte |
| 16 | **Operación y proyecto** · datos de partida, qué pasa si, costos y gobierno |
| 17 | **Qué debe hacer e-Karú** · 15 módulos (MVP o después), puntos a definir y material de ejemplo |

## Códigos de barra en una tabla

| Prefijo | Uso | Ejemplo |
|---|---|---|
| `2` + sabor + peso | Balde (lo imprime la balanza) | `2 000001 01105 8` |
| `2` + … + transacción | Balde único, Code 128 de 21 dígitos (propuesta) | `2 000001 01105 00041129 3` |
| `22` | Producto: Nº de producto + fecha de elaboración | `22 0001 261110 4` |
| `23` / `24` / `25` | Promo Pack · ID de balde · insumo interno | |
| `29` | Grupo PADRE | `2 900002 80008 1` |

<p align="center"><img src="docs/img/pag09_bases_sabores.jpg" width="70%" alt="Bases y sabores con su código de balanza"></p>

## Cómo se genera

`src/` tiene un motor propio de diagramas BPMN en JavaScript (`engine.js`), una página por archivo (`p0.js`, `p1a.js` … `p3h.js`, `canales.js`, `ops.js`, `textpages.js`) y los datos (`catalog.js`: catálogo, bases, sabores y códigos de balanza).

```bash
pip install playwright pypdf && playwright install chromium
cd src
# primero las páginas con diagramas, después las de texto (la numeración de pasos depende del orden)
python build.py p1a p1b p2a p2b p2c p3a p3b p3c p3d p3h p0 ov resp codes canales ops scope --pdf --nopng
python merge.py   # une las 17 páginas en out/Glace_eKaru_Informe_final.pdf
```

`build.py` avisa si dos elementos de un diagrama se superponen o si un texto no entra (`warns=`); la versión publicada tiene 0 avisos.

> Las facturas y remisiones de ejemplo dentro del PDF son ficticias. Los valores marcados «propuesta» o «falta medir» los decide o mide Glacé.

---

<sub>Parte de: [ekaru-etiquetas](https://github.com/alvaroliuzzi-bot/ekaru-etiquetas) · [glace-compras](https://github.com/alvaroliuzzi-bot/glace-compras) · [paginas-web](https://github.com/alvaroliuzzi-bot/paginas-web)</sub>
