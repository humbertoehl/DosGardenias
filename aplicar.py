import re, csv

filas = list(csv.DictReader(open('generos_revisar.csv', encoding='utf-8-sig')))
html = open('catalogo.html', encoding='utf-8').read()
cards = re.findall(r'<div class="album-card".*?</div>\s*</div>', html, re.S)

assert len(cards) == len(filas), f'DESAJUSTE: {len(cards)} tarjetas vs {len(filas)} filas'

nuevo = html
for card, fila in zip(cards, filas):
    c = card
    # 1. reemplazar los géneros detallados
    c = re.sub(r'(genre-tags">).*?(</p>)',
               lambda m: m.group(1) + fila['generos_limpios'] + m.group(2),
               c, flags=re.S)
    # 2. agregar la categoría como atributo de datos
    c = re.sub(r'<div class="album-card"',
               f'<div class="album-card" data-categoria="{fila["categoria_propuesta"]}"',
               c, count=1)
    nuevo = nuevo.replace(card, c, 1)

open('catalogo.html', 'w', encoding='utf-8').write(nuevo)
print('catalogo.html actualizado')