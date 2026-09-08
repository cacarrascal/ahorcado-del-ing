# -*- coding: utf-8 -*-
"""Arma los entregables de Ahorcado del Ing a partir de src/.

    py build.py

Junta los archivos de src/ en el orden de MODULOS, incrusta el logo de
assets/ y escribe tres versiones en dist/:

  AhorcadoDelIng.jsx     componente para un proyecto React + Tailwind
  ahorcado_del_ing.html  página suelta: doble clic y corre, sin instalar nada
  artifact.html          el mismo cuerpo sin <html>/<head>/<body>, para publicar

Los archivos de dist/ se regeneran completos en cada corrida: no los edites
a mano, edita src/.
"""
import io, os
from urllib.parse import quote

AQUI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(AQUI, 'src')
DIST = os.path.join(AQUI, 'dist')

# El orden importa: cada archivo puede usar lo que declararon los anteriores.
MODULOS = [
    'contenido.jsx',   # categorías, frases del profe, crédito del pie
    'logica.jsx',      # baraja, estado inicial y reducer
    'estilos.jsx',     # pizarrón, tiza y animaciones
    'escenario.jsx',   # lo que sale en cámara
    'panel.jsx',       # controles del operador
    'juego.jsx',       # el componente principal
]

def leer(*partes):
    return io.open(os.path.join(*partes), encoding='utf-8').read()

def escribir(nombre, contenido):
    destino = os.path.join(DIST, nombre)
    tmp = destino + '.tmp'
    with io.open(tmp, 'w', encoding='utf-8', newline='') as f:
        f.write(contenido)
    os.replace(tmp, destino)
    return destino

if not os.path.isdir(DIST):
    os.makedirs(DIST)

CUERPO = u'\n\n'.join(leer(SRC, m).rstrip() for m in MODULOS) + u'\n'

# El logo va incrustado como data URI para que los entregables no dependan de
# ningún archivo suelto: OBS, el artifact y el doble clic funcionan igual.
LOGO = leer(AQUI, 'assets', 'logo.datauri.txt').strip()
if '__LOGO_DATA_URI__' not in CUERPO:
    raise SystemExit('No se encontró el marcador __LOGO_DATA_URI__ en src/contenido.jsx')
CUERPO = CUERPO.replace('__LOGO_DATA_URI__', LOGO)

# El componente suelto trae las fuentes por @import para ser autocontenido; en
# las páginas web ya vienen por <link>, así que se quita para no pedirlas dos
# veces (y porque un @import no admite referrerpolicy y filtraría la URL).
IMPORT_FUENTES = (u"@import url('https://fonts.googleapis.com/css2?"
                  u"family=Archivo+Black&family=Archivo:wght@600;700;800&family=Caveat:wght@700&display=swap');\n")
if IMPORT_FUENTES not in CUERPO:
    raise SystemExit('No se encontró el @import de fuentes en src/estilos.jsx')
CUERPO_WEB = CUERPO.replace(IMPORT_FUENTES, u'')

# Versiones fijas + hash SRI: si alguien altera el archivo en el CDN, el
# navegador se niega a ejecutarlo. referrerpolicy evita mandarle la URL de esta
# página al CDN. (cdn.tailwindcss.com no publica versión fija: no admite SRI.)
CDN = u"""<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"
  integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z"
  crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"
  integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1"
  crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/babel.min.js"
  integrity="sha384-x/ilTFv/u/eu6YSmkFDZl5V5Mm/pkxxcVv2cVJOrr1J0rvILhMvRBCy6yA75wYBj"
  crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdn.tailwindcss.com" referrerpolicy="no-referrer"></script>"""

FUENTES = (u'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
           u'<link rel="stylesheet" referrerpolicy="no-referrer" href="https://fonts.googleapis.com/css2?'
           u'family=Archivo+Black&family=Archivo:wght@600;700;800&family=Caveat:wght@700&display=swap">')

# El ícono de la pestaña: pizarrón con una letra de tiza sobre el guión amarillo
# del ahorcado. Es del juego, no de la marca. Va como SVG incrustado para no
# depender de ningún .ico suelto.
ICONO_SVG = (u'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
             u'<rect width="64" height="64" rx="14" fill="#0F1F19"/>'
             u'<rect x="2.5" y="2.5" width="59" height="59" rx="12" fill="none" '
             u'stroke="#2C4A3F" stroke-width="3"/>'
             u'<text x="32" y="42" text-anchor="middle" fill="#F2EDDC" '
             u'font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="42" '
             u'font-weight="900">A</text>'
             u'<rect x="11" y="48" width="42" height="9" rx="4.5" fill="#FFD028"/>'
             u'</svg>')
ICONO = u'<link rel="icon" href="data:image/svg+xml,%s">' % quote(ICONO_SVG, safe='')

# Lo único que las páginas sueltas pintan fuera del componente. El .jsx no lleva
# esto: no debe tocar el <body> del proyecto que lo hospede.
BASE_CSS = u"""<style>
  :root{ color-scheme: dark; }
  html,body{ margin:0; height:100%; background:#0A1611; overflow:hidden; }
</style>"""

# React reemplaza este contenido al montar. Si sigue en pantalla, algo no cargó:
# es el aviso que hay que ver ANTES de salir en vivo, no en medio.
ROOT = u"""<div id="root">
  <div style="height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;
              font-family:'Archivo',system-ui,sans-serif;color:#9DB3A9">
    <div>
      <div style="font-family:'Archivo Black',system-ui,sans-serif;font-size:26px;color:#FFD028">CARGANDO EL TABLERO…</div>
      <div style="font-size:15px;margin-top:10px;max-width:420px;line-height:1.5">
        Si este mensaje no desaparece en unos segundos, no cargaron las librerías.
        Revisa tu conexión y recarga antes de salir en vivo.
      </div>
    </div>
  </div>
</div>"""

ABRE_BABEL = (u'\n<script type="text/babel" data-presets="react">\n'
              u'const { useState, useReducer, useEffect, useRef, useMemo, useCallback } = React;\n\n')
ARRANQUE = u'\nReactDOM.createRoot(document.getElementById("root")).render(<JuegoAhorcadoDelIng />);\n</script>\n'

AVISO = u"""/* ARCHIVO GENERADO POR build.py — NO EDITAR A MANO.
   Las fuentes están en src/; corre  py build.py  para regenerarlo. */
"""

# ── 1. componente para un proyecto React ─────────────────────────────
escribir('AhorcadoDelIng.jsx', AVISO + u"""/**
 * AHORCADO DEL ING — juego para LIVE de TikTok
 * Un solo archivo React + Tailwind. Sin dependencias externas más allá de React.
 * Todo el estado vive en useReducer/useState: no se usa localStorage ni sessionStorage.
 *
 * Uso: <JuegoAhorcadoDelIng /> a pantalla completa. La tecla O muestra u oculta
 * el panel del operador; el panel lista todos los atajos.
 */
import React, { useState, useReducer, useEffect, useRef, useMemo, useCallback } from "react";

""" + CUERPO + u"\nexport default JuegoAhorcadoDelIng;\n")

# ── 2. página suelta ─────────────────────────────────────────────────
escribir('ahorcado_del_ing.html',
    u'<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
    u'<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    u'<meta name="referrer" content="no-referrer">\n'
    u'<title>Ahorcado del Ing</title>\n' + ICONO + u'\n'
    u'<link rel="preconnect" href="https://fonts.googleapis.com">\n' + FUENTES + u'\n'
    + CDN + u'\n' + BASE_CSS + u'\n</head>\n<body>\n'
    + ROOT + ABRE_BABEL + CUERPO_WEB + ARRANQUE + u'</body>\n</html>\n')

# ── 3. cuerpo para publicar como Artifact ────────────────────────────
escribir('artifact.html',
    u'<meta charset="utf-8">\n<title>Ahorcado del Ing</title>\n' + ICONO + u'\n' + FUENTES + u'\n' + BASE_CSS + u'\n'
    + CDN + u'\n' + ROOT + ABRE_BABEL + CUERPO_WEB + ARRANQUE)

print(u'src/ -> %d módulos, %d líneas' % (len(MODULOS), CUERPO.count(u'\n')))
for n in ('AhorcadoDelIng.jsx', 'ahorcado_del_ing.html', 'artifact.html'):
    print(u'  dist/%-24s %7d bytes' % (n, os.path.getsize(os.path.join(DIST, n))))
