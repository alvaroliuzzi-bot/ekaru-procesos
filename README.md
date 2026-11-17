<div align="center">

<img src=".github/assets/banner.svg" width="100%" alt="Glacé × e-Karú · De la fábrica al salón">

![Versión](https://img.shields.io/badge/📌_versión-final_·_12%2F11%2F2026-1D7A6B?style=for-the-badge)
![PDF](https://img.shields.io/badge/📄_PDF-17_páginas-14231F?style=for-the-badge)
![BPMN](https://img.shields.io/badge/🔀_diagramas-BPMN-F2A541?style=for-the-badge)
![MVP](https://img.shields.io/badge/🚀_MVP-Etapas_0–3_%2B_salón_piloto-E0457B?style=for-the-badge)
![JS](https://img.shields.io/badge/hecho_con-JavaScript_%2B_Playwright-6D5BD0?style=for-the-badge&logo=javascript&logoColor=white)

<a href="docs/Glace_eKaru_Informe_final.pdf"><img src="https://img.shields.io/badge/📄_ABRIR_EL_INFORME_FINAL-PDF-1D9A84?style=for-the-badge&labelColor=0F5C50" height="42" alt="Abrir el informe final (PDF)"></a>

<a href="#-las-17-páginas-clic-para-ampliar"><img src="docs/img/todas_las_paginas.jpg" width="100%" alt="Las 17 páginas del informe (clic para ver cada una en grande)"></a>

</div>

<img src=".github/assets/cards.svg" width="100%" alt="Procesos 0 a 3: planificación, recepción, producción y despacho">

### 🔁 El ciclo completo

```mermaid
flowchart LR
    P0["0 · Planificación<br/>MRP"]:::teal --> P1["1 · Recepción<br/>materia prima"]:::gold
    P1 --> P2["2 · Producción<br/>y envase"]:::pink
    P2 --> P3["3 · Pedidos<br/>y despacho"]:::violet
    P3 --> S["🛎️ Salones<br/>Ventas + Club"]:::coral
    P3 --> C["🚚 Canales<br/>mayoristas · franquicias"]:::coral
    S -- "la venta del día<br/>es el pedido de mañana" --> P0
    C --> P0
    classDef teal fill:#1D9A84,stroke:#0F5C50,color:#fff
    classDef gold fill:#F2A541,stroke:#B8801A,color:#14231F
    classDef pink fill:#E0457B,stroke:#8C2F5F,color:#fff
    classDef violet fill:#6D5BD0,stroke:#3F2F9E,color:#fff
    classDef coral fill:#FF8A5B,stroke:#C2552E,color:#fff
```

### 🔎 Las 17 páginas (clic para ampliar)

Cada miniatura abre la página en tamaño real (2600 px de ancho): en GitHub se puede acercar con un clic y moverse por las tablas y los diagramas.

> [!TIP]
> **Visor con zoom:** [Glacé × e-Karú · Visor del informe](https://claude.ai/artifact/WfckNi11dfU8bmnRuTp2d5): clic en cualquier tabla o diagrama y se acerca a ella; **Espacio** (o «Tabla ›») salta a la siguiente, también de una página a otra: 66 tablas y diagramas en total. Tiene índice con búsqueda y vista de todas las páginas. Es privado: se comparte desde claude.ai.

<table>
<tr><td align="center" width="25%"><a href="docs/paginas/01_ov.jpg"><img src="docs/paginas/mini/01_ov.jpg" width="100%" alt="1 · Vista general: doce decisiones, procesos y roles"></a><br><sub><b>1</b> · Vista general</sub></td><td align="center" width="25%"><a href="docs/paginas/02_resp.jpg"><img src="docs/paginas/mini/02_resp.jpg" width="100%" alt="2 · Respuesta a e-Karú: cuatro puntos y plan por etapas"></a><br><sub><b>2</b> · Respuesta a e-Karú</sub></td><td align="center" width="25%"><a href="docs/paginas/03_codes.jpg"><img src="docs/paginas/mini/03_codes.jpg" width="100%" alt="3 · Códigos de barras: prefijos, lectura, balde único y cambio"></a><br><sub><b>3</b> · Códigos de barras</sub></td><td align="center" width="25%"><a href="docs/paginas/04_p0.jpg"><img src="docs/paginas/mini/04_p0.jpg" width="100%" alt="4 · Proceso 0 · Planificación (MRP): 0A de la venta al plan · 0B del plan a las órdenes"></a><br><sub><b>4</b> · Proceso 0 · Planificación (MRP)</sub></td></tr>
<tr><td align="center" width="25%"><a href="docs/paginas/05_p1a.jpg"><img src="docs/paginas/mini/05_p1a.jpg" width="100%" alt="5 · Proceso 1 · Recepción de materia prima: 1A recepción física · 1R rechazo y reclamo"></a><br><sub><b>5</b> · Proceso 1 · Recepción de materia prima</sub></td><td align="center" width="25%"><a href="docs/paginas/06_p1b.jpg"><img src="docs/paginas/mini/06_p1b.jpg" width="100%" alt="6 · Proceso 1 · 1B factura por CDC → tres vías, precios y costos"></a><br><sub><b>6</b> · Proceso 1 · 1B factura por CDC → tres vías, precios y costos</sub></td><td align="center" width="25%"><a href="docs/paginas/07_p2a.jpg"><img src="docs/paginas/mini/07_p2a.jpg" width="100%" alt="7 · Proceso 2 · Producción y envase: 2A orden y elaboración · 2B baldes y balanza"></a><br><sub><b>7</b> · Proceso 2 · Producción y envase</sub></td><td align="center" width="25%"><a href="docs/paginas/08_p2b.jpg"><img src="docs/paginas/mini/08_p2b.jpg" width="100%" alt="8 · Proceso 2 · 2C productos terminados · 2D Promo Pack 12 palitos"></a><br><sub><b>8</b> · Proceso 2 · 2C productos terminados · 2D Promo Pack 12 palitos</sub></td></tr>
<tr><td align="center" width="25%"><a href="docs/paginas/09_p2c.jpg"><img src="docs/paginas/mini/09_p2c.jpg" width="100%" alt="9 · Proceso 2 · 2E bases, sabores y categorías"></a><br><sub><b>9</b> · Proceso 2 · 2E bases, sabores y categorías</sub></td><td align="center" width="25%"><a href="docs/paginas/10_p3a.jpg"><img src="docs/paginas/mini/10_p3a.jpg" width="100%" alt="10 · Proceso 3 · Pedidos y despacho: 3A pedido y despacho · 3B recepción en el local"></a><br><sub><b>10</b> · Proceso 3 · Pedidos y despacho</sub></td><td align="center" width="25%"><a href="docs/paginas/11_p3b.jpg"><img src="docs/paginas/mini/11_p3b.jpg" width="100%" alt="11 · Proceso 3 · 3C faltantes y Backorder · 3D vida de un balde"></a><br><sub><b>11</b> · Proceso 3 · 3C faltantes y Backorder · 3D vida de un balde</sub></td><td align="center" width="25%"><a href="docs/paginas/12_p3c.jpg"><img src="docs/paginas/mini/12_p3c.jpg" width="100%" alt="12 · Proceso 3 · 3E venta a clientes con factura"></a><br><sub><b>12</b> · Proceso 3 · 3E venta a clientes con factura</sub></td></tr>
<tr><td align="center" width="25%"><a href="docs/paginas/13_p3d.jpg"><img src="docs/paginas/mini/13_p3d.jpg" width="100%" alt="13 · Proceso 3 · 3F Nota de Remisión · 3G consignación"></a><br><sub><b>13</b> · Proceso 3 · 3F Nota de Remisión · 3G consignación</sub></td><td align="center" width="25%"><a href="docs/paginas/14_p3h.jpg"><img src="docs/paginas/mini/14_p3h.jpg" width="100%" alt="14 · Salones: 3H venta con e-Karú Ventas y Club · 3I balde terminado"></a><br><sub><b>14</b> · Salones</sub></td><td align="center" width="25%"><a href="docs/paginas/15_canales.jpg"><img src="docs/paginas/mini/15_canales.jpg" width="100%" alt="15 · Canales: mayoristas, minoristas y franquicias (caso aparte)"></a><br><sub><b>15</b> · Canales</sub></td><td align="center" width="25%"><a href="docs/paginas/16_ops.jpg"><img src="docs/paginas/mini/16_ops.jpg" width="100%" alt="16 · Operación y proyecto: datos de partida, qué pasa si, maestros, costos y gobierno"></a><br><sub><b>16</b> · Operación y proyecto</sub></td></tr>
<tr><td align="center" width="25%"><a href="docs/paginas/17_scope.jpg"><img src="docs/paginas/mini/17_scope.jpg" width="100%" alt="17 · Qué debe hacer e-Karú · módulos (MVP), puntos a definir y material de ejemplo"></a><br><sub><b>17</b> · Qué debe hacer e-Karú · módulos (MVP), puntos a definir y material de ejemplo</sub></td></tr>
</table>

## 🧭 En una frase por proceso

| | Proceso | Qué cambia |
|:-:|---|---|
| **0** | **Planificación (MRP)** | La venta real de todos los canales se convierte en pronóstico, plan por sabor y producto, y órdenes de compra, producción y reposición. Ventana congelada de 48 h. |
| **1** | **Recepción de materia prima** | Cada entrega llega con su Orden de Compra; la factura se trae por su CDC y se controla en tres vías: orden, recepción y factura. |
| **2** | **Producción y envase** | La orden llega planificada; cada balde sale de la balanza con su código, el Nº de orden y queda «liberado» al cerrar la orden. |
| **3** | **Pedidos y despacho** | Cada salón y sucursal recibe su pedido sugerido; los clientes, su factura con el código de cada línea; la Nota de Remisión sale del mismo escaneo. |
| **🛎️** | **Salones** | La caja usa el update de **e-Karú Ventas** (grupos PADRE, sabores y balde por sabor) y **e-Karú Club** pone el sello con la misma venta. |
| **🚚** | **Canales** | Salones, sucursales, mayoristas, minoristas y franquicias (caso aparte), cada uno con su forma de pedir, su precio y su documento. |

<p align="center"><img src="docs/img/pag01_vision_general.jpg" width="85%" alt="Vista general: doce decisiones y los procesos"></p>

<img src=".github/assets/divider.svg" width="100%">

## 📈 Planificación (Proceso 0)

De cada venta al plan de la semana, y del plan a las órdenes. Parámetros (stock de seguridad, mínimo y máximo por local, merma, capacidad, arranque del pronóstico), estados del stock y calidad, e indicadores.

<p align="center"><img src="docs/img/pag04_planificacion_mrp.jpg" width="85%" alt="Proceso 0: planificación MRP"></p>

<img src=".github/assets/divider.svg" width="100%">

## 🏭 Producción con balde liberado

<p align="center"><img src="docs/img/pag07_produccion.jpg" width="85%" alt="Proceso 2: orden de producción y envase de baldes"></p>

<img src=".github/assets/divider.svg" width="100%">

## 🛎️ Salones: e-Karú Ventas + e-Karú Club

La venta en la caja descuenta el grupo PADRE y los gramos de cada balde, y suma el sello del Club. Cuando un balde se vacía, e-Karú controla su rendimiento; al cierre, la venta del día se convierte en el pedido sugerido de mañana.

<p align="center"><img src="docs/img/pag14_salones_club.jpg" width="85%" alt="Salones: venta con e-Karú Ventas y Club"></p>

<img src=".github/assets/divider.svg" width="100%">

## 🚚 Canales y franquicias

<p align="center"><img src="docs/img/pag15_canales.jpg" width="85%" alt="Canales: de la fábrica a cada destino"></p>

<img src=".github/assets/divider.svg" width="100%">

## ⚙️ Operación y proyecto

Datos de partida (lo que falta medir está marcado), doce situaciones fuera del caso ideal, un solo maestro de datos, auditoría, inventario rotativo, costos y márgenes, Glacé Compras como puente y el gobierno del proyecto.

<p align="center"><img src="docs/img/pag16_operacion.jpg" width="85%" alt="Operación y proyecto"></p>

<img src=".github/assets/divider.svg" width="100%">

## 📑 Contenido del PDF

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

<img src=".github/assets/divider.svg" width="100%">

## 🏷️ Códigos de barra en una tabla

| Prefijo | Uso | Ejemplo |
|---|---|---|
| `2` + sabor + peso | Balde (lo imprime la balanza) | `2 000001 01105 8` |
| `2` + … + transacción | Balde único, Code 128 de 21 dígitos (propuesta) | `2 000001 01105 00041129 3` |
| `22` | Producto: Nº de producto + fecha de elaboración | `22 0001 261110 4` |
| `23` / `24` / `25` | Promo Pack · ID de balde · insumo interno | |
| `29` | Grupo PADRE | `2 900002 80008 1` |

<p align="center"><img src="docs/img/pag09_bases_sabores.jpg" width="70%" alt="Bases y sabores con su código de balanza"></p>

<img src=".github/assets/divider.svg" width="100%">

## 🧪 Cómo se genera

`src/` tiene un motor propio de diagramas BPMN en JavaScript (`engine.js`), una página por archivo (`p0.js`, `p1a.js` … `p3h.js`, `canales.js`, `ops.js`, `textpages.js`) y los datos (`catalog.js`: catálogo, bases, sabores y códigos de balanza).

```bash
pip install playwright pypdf && playwright install chromium
cd src
# primero las páginas con diagramas, después las de texto (la numeración de pasos depende del orden)
python build.py p1a p1b p2a p2b p2c p3a p3b p3c p3d p3h p0 ov resp codes canales ops scope --pdf --nopng
python merge.py   # une las 17 páginas en out/Glace_eKaru_Informe_final.pdf
```

> [!TIP]
> `build.py` avisa si dos elementos de un diagrama se superponen o si un texto no entra (`warns=`); la versión publicada tiene 0 avisos.

> [!IMPORTANT]
> Las facturas y remisiones de ejemplo dentro del PDF son ficticias. Los valores marcados «propuesta» o «falta medir» los decide o mide Glacé.

<img src=".github/assets/divider.svg" width="100%">

<div align="center">

<sub>Parte de: [ekaru-etiquetas](https://github.com/alvaroliuzzi-bot/ekaru-etiquetas) · [glace-compras](https://github.com/alvaroliuzzi-bot/glace-compras) · [paginas-web](https://github.com/alvaroliuzzi-bot/paginas-web)</sub>

</div>
