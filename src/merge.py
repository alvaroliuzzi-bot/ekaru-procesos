import json, os, sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject, BooleanObject, DictionaryObject, ArrayObject, FloatObject, NumberObject

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
ORDER = ['ov', 'resp', 'codes', 'p0', 'p1a', 'p1b', 'p2a', 'p2b', 'p2c', 'p3a', 'p3b', 'p3c', 'p3d', 'p3h', 'canales', 'ops', 'scope']
TITLES = [
    '1 · Vista general: doce decisiones, procesos y roles',
    '2 · Respuesta a e-Karú: cuatro puntos y plan por etapas',
    '3 · Códigos de barras: prefijos, lectura, balde único y cambio',
    '4 · Proceso 0 · Planificación (MRP): 0A de la venta al plan · 0B del plan a las órdenes',
    '5 · Proceso 1 · Recepción de materia prima: 1A recepción física · 1R rechazo y reclamo',
    '6 · Proceso 1 · 1B factura por CDC → tres vías, precios y costos',
    '7 · Proceso 2 · Producción y envase: 2A orden y elaboración · 2B baldes y balanza',
    '8 · Proceso 2 · 2C productos terminados · 2D Promo Pack 12 palitos',
    '9 · Proceso 2 · 2E bases, sabores y categorías',
    '10 · Proceso 3 · Pedidos y despacho: 3A pedido y despacho · 3B recepción en el local',
    '11 · Proceso 3 · 3C faltantes y Backorder · 3D vida de un balde',
    '12 · Proceso 3 · 3E venta a clientes con factura',
    '13 · Proceso 3 · 3F Nota de Remisión · 3G consignación',
    '14 · Salones: 3H venta con e-Karú Ventas y Club · 3I balde terminado',
    '15 · Canales: mayoristas, minoristas y franquicias (caso aparte)',
    '16 · Operación y proyecto: datos de partida, qué pasa si, maestros, costos y gobierno',
    '17 · Qué debe hacer e-Karú · módulos (MVP), puntos a definir y material de ejemplo',
]
res = json.load(open(os.path.join(OUT, 'results.json'), encoding='utf-8'))
w = PdfWriter()
sizes = []
for i, k in enumerate(ORDER):
    r = PdfReader(os.path.join(OUT, k + '.pdf'))
    assert len(r.pages) == 1, (k, len(r.pages))
    pg = r.pages[0]
    sizes.append((float(pg.mediabox.width), float(pg.mediabox.height)))
    w.add_page(pg)
for i, t in enumerate(TITLES):
    w.add_outline_item(t, i)
# enlaces del índice (página 1)
H = sizes[0][1]
groups = {}
for l in res['ov'].get('links', []):
    g = groups.setdefault(l['goto'], [1e9, 1e9, -1e9, -1e9])
    g[0] = min(g[0], l['x']); g[1] = min(g[1], l['y']); g[2] = max(g[2], l['x'] + l['w']); g[3] = max(g[3], l['y'] + l['h'])
k = 0.75  # px -> pt
for goto, (x0, y0, x1, y1) in sorted(groups.items()):
    rect = (x0 * k, H - y1 * k, x1 * k, H - y0 * k)
    target = w.pages[goto - 1].indirect_reference   # destino = referencia a la página (no un número)
    annot = DictionaryObject({
        NameObject('/Type'): NameObject('/Annot'),
        NameObject('/Subtype'): NameObject('/Link'),
        NameObject('/Rect'): ArrayObject([FloatObject(round(v, 2)) for v in rect]),
        NameObject('/Border'): ArrayObject([NumberObject(0), NumberObject(0), NumberObject(0)]),
        NameObject('/Dest'): ArrayObject([target, NameObject('/Fit')]),
    })
    annot_ref = w._add_object(annot)
    pg0 = w.pages[0]
    if '/Annots' not in pg0:
        pg0[NameObject('/Annots')] = ArrayObject()
    pg0['/Annots'].append(annot_ref)
w.add_metadata({
    '/Title': 'Glacé × e-Karú · Informe final: de la fábrica al salón (TO-BE)',
    '/Author': 'Glacé S.A.',
    '/Subject': 'Proceso ideal con e-Karú como único sistema: planificación MRP, recepción de materia prima, producción y envase, pedidos y despacho, salones con e-Karú Ventas y Club, y canales',
    '/Keywords': 'Glacé, e-Karú, MRP, código de barras, balanza, factura, Nota de Remisión, SIFEN, e-Karú Club, BPMN',
    '/Creator': 'Claude',
})
root = w._root_object
root[NameObject('/Lang')] = TextStringObject('es-PY')
root[NameObject('/ViewerPreferences')] = DictionaryObject({NameObject('/DisplayDocTitle'): BooleanObject(True)})
w.page_mode = '/UseOutlines'
dst = os.path.join(OUT, 'Glace_eKaru_Informe_final.pdf')
with open(dst, 'wb') as f:
    w.write(f)
print('written', dst, os.path.getsize(dst) // 1024, 'KB')
for k_, s in zip(ORDER, sizes):
    print(k_, 'pt', round(s[0], 1), 'x', round(s[1], 1))
print('links:', {g: [round(v) for v in b] for g, b in groups.items()})
