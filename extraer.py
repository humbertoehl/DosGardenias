import re, csv

html = open('catalogo.html', encoding='utf-8').read()
cards = re.findall(r'<div class="album-card".*?</div>\s*</div>', html, re.S)

with open('generos.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f)
    w.writerow(['n', 'titulo', 'artista', 'anio', 'generos_actuales',
                'categoria_propuesta', 'generos_limpios'])
    for i, c in enumerate(cards):
        t = re.search(r'<h2>(.*?)</h2>', c, re.S)
        a = re.search(r'<h3>(.*?)</h3>', c, re.S)
        y = re.search(r'album-year">(.*?)</', c, re.S)
        g = re.search(r'genre-tags">(.*?)</p>', c, re.S)
        w.writerow([
            i,
            t.group(1).strip() if t else '',
            a.group(1).strip() if a else '',
            y.group(1).strip() if y else '',
            g.group(1).strip() if g else '',
            '',   # categoria_propuesta — se llena en la Fase 2
            ''    # generos_limpios — se llena en la Fase 2
        ])

print(f'{len(cards)} discos exportados a generos.csv')