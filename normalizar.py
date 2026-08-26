import csv, re, unicodedata

# --- Diccionario de correcciones: variante -> forma canónica ---
CORRECCIONES = {
    'r&b contemporáneo': 'R&B Contemporáneo',
    'contemporary r&b': 'R&B Contemporáneo',
    'r&b alternativo': 'R&B Alternativo',
    'alternative r&b': 'R&B Alternativo',
    'alternative rock': 'Rock Alternativo',
    'alternativo': 'Rock Alternativo',
    'jazz fusion': 'Jazz Fusión',
    'jazz-rock': 'Jazz Fusión',
    'neo-soul': 'Neo-Soul',
    'neo-psychedelia': 'Neo-Psicodelia',
    'neo-psicodélia': 'Neo-Psicodelia',
    'soundtrack': 'Banda Sonora',
    'film score': 'Banda Sonora',
    'electronic': 'Electrónica',
    'hip-hop': 'Hip Hop',
    'rap': 'Hip Hop',
    'reggaeton': 'Reggaetón',
    'soft-rock': 'Soft Rock',
    'nu-metal': 'Nu Metal',
    'un metal': 'Nu Metal',          # error de dedo
    'trash metal': 'Thrash Metal',   # error de dedo
    'rythm & blues': 'R&B',
    'post-bop': 'Post-Bop',
    'dance-pop': 'Dance-Pop',
    'folk progresivo': 'Folk Progresivo',
    'música andina': 'Andina',
    'nueva canción chilena': 'Nueva Canción Chilena',
    'infantil': 'Música Infantil',
    'psicodélico': 'Rock Psicodélico',
}

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', s)

# --- Reglas de categoría, EN ORDEN DE PRIORIDAD ---
# La primera que coincida gana. Por eso Pop va al final:
# de lo contrario "Pop Rock" caería en Pop en lugar de Rock.
REGLAS = [
 ('Clásica y Soundtrack', ['clasica','bandasonora','soundtrack','filmscore','musical','rockopera','rocksinfonico','acappella']),
 ('Jazz',               ['jazz','bop','boogie']),
 ('Hip Hop',            ['hiphop','rap','trap','neoperreo']),
 ('Latino y Tropical',  ['bolero','salsa','mariachi','ranchera','soncubano','cumbia','merengue','bachata','danzon','balada','reggaeton','sonjarocho','guajira','mambo','afrocubano','cancionmelodica','caribena','tropical','latino','sonlatino','latinpop','ska','reggae']),
 ('Cantautor y Folk',   ['cantautor','folk','trova','nuevacancion','andina','andino','cueca','cancionero','country','blues']),
 ('Soul, Funk y R&B',   ['soul','funk','rb','disco']),
 ('Electrónica',        ['electronica','electronic','ambient','downtempo','indietronica','drone','nudisco','alternativedance','postindustrial']),
 ('Rock',               ['rock','punk','metal','grunge','shoegaze','krautrock','psicodelic','psychedel','newwave','aor']),
 ('Pop',                ['pop']),
]

def categoria(lista):
    for nombre, claves in REGLAS:
        for g in lista:
            n = norm(g)
            if any(k in n for k in claves):
                return nombre
    return 'Otros'

filas = list(csv.DictReader(open('generos.csv', encoding='utf-8-sig')))

for f in filas:
    crudos = [x.strip() for x in f['generos_actuales'].split(',') if x.strip()]
    limpios = []
    for g in crudos:
        canon = CORRECCIONES.get(g.lower(), g)
        if canon not in limpios:      # elimina duplicados dentro del mismo disco
            limpios.append(canon)
    f['generos_limpios'] = ', '.join(limpios)
    f['categoria_propuesta'] = categoria(limpios)

with open('generos_revisar.csv', 'w', newline='', encoding='utf-8-sig') as out:
    w = csv.DictWriter(out, fieldnames=filas[0].keys())
    w.writeheader()
    w.writerows(filas)

import collections
print(collections.Counter(f['categoria_propuesta'] for f in filas).most_common())
print('-> generos_revisar.csv listo para revisión manual')