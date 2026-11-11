# Glacé × e-Karú — procesos ideales

Documento para los desarrolladores de e-Karú: cómo deberían funcionar en Glacé la recepción de materia prima, la producción y envase, y la recepción de pedidos y despacho, con e-Karú como único sistema y solo códigos de barra.

**Documento final:** [`docs/Glace_eKaru_Procesos_ideales.pdf`](docs/Glace_eKaru_Procesos_ideales.pdf) (13 páginas)

| Página | Contenido |
|---|---|
| 1 | Visión general, roles, índice |
| 2 | Respuesta a e-Karú: cuatro puntos y plan por etapas (0–4) |
| 3 | Códigos de barra: prefijos 20–29, reglas de lectura, balde único (Scale Manager), cambio en 8 pasos |
| 4–5 | Proceso 1: recepción de materia prima y facturas (CDC, Marangatu, papel) |
| 6–8 | Proceso 2: producción, envase de baldes, productos, bases y sabores (8 bases, 42 sabores, PLU) |
| 9–12 | Proceso 3: pedidos, picking, factura, Nota de Remisión, consignación |
| 13 | Qué debe hacer e-Karú y puntos abiertos (por responsable) |

## Cómo se genera el PDF

`src/` contiene un pequeño motor de diagramas BPMN en JavaScript (`engine.js`), una página por archivo (`p1a.js` … `p3d.js`, `textpages.js`) y los datos (`catalog.js`: catálogo, bases, sabores y códigos de balanza).

```bash
pip install playwright pypdf && playwright install chromium
cd src
# primero las páginas con diagramas, después las de texto (la numeración de pasos depende del orden)
python build.py p1a p1b p2a p2b p2c p3a p3b p3c p3d ov resp codes scope --pdf --nopng
python merge.py   # une las 13 páginas en out/Glace_eKaru_Procesos_ideales.pdf
```

`build.py` avisa si dos elementos de un diagrama se superponen (`warns=`); la versión publicada tiene 0 avisos.

Los datos de facturas y remisiones de ejemplo dentro del PDF son ficticios.
