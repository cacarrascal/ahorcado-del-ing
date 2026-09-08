# Ahorcado del Ing

Tablero en vivo para jugar **ahorcado** en un LIVE de TikTok. Sale una palabra oculta, el
chat grita letras por los comentarios, el profe las ingresa, y se juega **el chat contra
el profe**.

Diseñado en vertical **9:16** con todo el contenido en los **dos tercios superiores**,
porque el tercio inferior lo tapa el chat de TikTok.

No se conecta a ninguna API de TikTok: el operador lee los comentarios y mete las letras
a mano con el teclado.

---

## Estructura

```
ahorcado-del-ing/
├── README.md
├── build.py                     arma dist/ a partir de src/
│
├── src/                         ← aquí se edita
│   ├── contenido.jsx            categorías, frases del profe, crédito del pie
│   ├── logica.jsx               baraja, estado inicial y reducer
│   ├── estilos.jsx              pizarrón, tiza y animaciones
│   ├── escenario.jsx            lo que sale en cámara
│   ├── panel.jsx                controles del operador
│   └── juego.jsx                el componente principal
│
├── assets/
│   └── logo.datauri.txt         el logo del pie, se incrusta al construir
│
└── dist/                        ← generado, no editar
    ├── AhorcadoDelIng.jsx       componente para un proyecto React + Tailwind
    ├── ahorcado_del_ing.html    página suelta, doble clic
    └── artifact.html            el mismo cuerpo sin <html>/<head>/<body>
```

`build.py` concatena los seis archivos de `src/` en el orden declarado en `MODULOS`,
incrusta el logo y escribe las tres versiones. **Todo lo de `dist/` se regenera completo
en cada corrida**, así que nunca lo edites a mano.

```bash
py build.py
```

### Dónde tocar qué

| Quiero… | Archivo |
|---|---|
| Agregar o cambiar palabras | `src/contenido.jsx` → `CATEGORIAS` |
| Cambiar las frases del profe | `src/contenido.jsx` → `FRASES` (`fallo` / `perder` / `ganar`) |
| Cambiar el texto del pie | `src/contenido.jsx` → `CREDITO` |
| Cambiar el logo | `assets/logo.datauri.txt` (ver *Personalizar*) |
| Cambiar cuántas vidas hay | `src/contenido.jsx` → `VIDAS_MAX`, y deja `NOTAS` con `VIDAS_MAX + 1` valores |
| Mover dónde corta el chat | `src/contenido.jsx` → `ZONA_SEGURA` |
| Cambiar colores, tamaños o animaciones | `src/estilos.jsx` |
| Cambiar cómo se reparte el puntaje | `src/logica.jsx` → `reducer`, casos `LETRA` y `PALABRA` |
| Mover o rediseñar algo de la pantalla | `src/escenario.jsx` |
| Agregar un botón al panel | `src/panel.jsx` |
| Cambiar o agregar un atajo | `src/juego.jsx` (el `useEffect` de teclado) y la tabla de atajos de `src/panel.jsx` |

---

## Cómo abrirlo

**1. Como página web publicada** (lo más cómodo para OBS)

<https://claude.ai/code/artifact/978fec85-3e22-4aa2-a894-d5f11333a0e5>

Es un enlace privado y sin contraseña: quien lo tenga, entra. No lo muestres en cámara.

**2. Con doble clic**, sin instalar nada

Abre [`dist/ahorcado_del_ing.html`](dist/ahorcado_del_ing.html). Trae React, Babel y
Tailwind desde CDN, así que **necesita internet**.

**3. Dentro de un proyecto React + Tailwind**

```jsx
import JuegoAhorcadoDelIng from "./AhorcadoDelIng";

export default function App() {
  return <JuegoAhorcadoDelIng />;
}
```

[`dist/AhorcadoDelIng.jsx`](dist/AhorcadoDelIng.jsx) es un solo archivo autocontenido: sin
dependencias más allá de React, sin `localStorage` ni `sessionStorage`, con el logo y los
estilos incrustados. Todo cuelga de la clase `.ahorcado`, así que no repinta el `<body>`
del proyecto que lo hospede.

> Antes de salir en vivo, confirma que el tablero apareció. Si se queda el cartel
> *«CARGANDO EL TABLERO…»*, no cargaron las librerías: revisa la conexión y recarga.
> Babel pesa 3 MB y compila en el navegador en cada carga.

---

## Cómo se opera

El panel de la derecha vive **fuera** del escenario 9:16, así que una captura de ventana
o región en OBS nunca lo ve. Con `O` lo escondes de todos modos.

El campo de arriba acepta **la letra y el usuario juntos, en cualquier orden**:

```
a juan99     →  letra A, crédito para @juan99
juan99 a     →  lo mismo
a            →  letra A, crédito para el usuario fijo
```

El foco vuelve solo a ese campo después de cada acción, así que puedes encadenar letras
sin tocar el mouse. El usuario que escribas queda fijo hasta que lo cambies.

El panel también te muestra **la palabra actual** y cuántas quedan en la baraja.

---

## Atajos de teclado

Las teclas de función andan siempre, incluso escribiendo. Las letras sueltas solo cuando
no estás en un campo; `Esc` te devuelve al campo de letra.

| Tecla | Qué hace |
|---|---|
| `Enter` | Envía la letra del campo rápido |
| `F1` | 🎁 Nuevo seguidor: revela una letra al azar |
| `F2` | Nueva palabra |
| `F3` | Salta la palabra actual |
| `F4` | Cambia a la siguiente categoría |
| `F6` | Salta al campo de «palabra completa» |
| `F7` | Salta al campo de «agregar palabra» |
| `F8` | Fondo chroma: apagado → verde → magenta |
| `F9` | Reinicia la ronda (misma palabra, vidas llenas) |
| `F10` / `O` | Muestra u oculta el panel del operador |
| `G` | Guía de encuadre (dónde cae el chat) |
| `Alt+R` ×2 | Reinicia la partida completa |
| `Esc` | Vuelve al campo de letra |

`Alt+R` pide confirmación: el botón cambia a «¿Seguro?» y tienes 3 segundos para
volver a pulsarlo.

---

## Puntos y marcador

| Qué pasa | Consecuencia |
|---|---|
| Letra acertada | **+10** para quien la dijo |
| Palabra completa de una | **+50** para quien la dijo |
| Letra fallada | sin castigo de puntos, pero **−1 vida** |
| Palabra completa fallada | también **−1 vida** |
| Se completa la palabra | punto para el **CHAT** |
| Se acaban las vidas | punto para el **PROFE** |

El regalo de nuevo seguidor (`F1`) no da puntos ni cuesta vida: solo revela.

Son **6 vidas**, dibujadas de tres maneras a la vez para que se lean de un vistazo en un
celular: el número grande, los seis puntos, y la nota bajando de `5.0` a `0.0` en escala
colombiana, con la raya del `3.0` marcada en el medidor. El muñequito del pupitre se va
armando por partes y al sexto error le cae el sello rojo de `0.0`.

**El marcador, la tabla de líderes y las palabras que agregues en vivo se mantienen toda
la sesión.** Reiniciar la partida borra marcador y tabla, pero **conserva** las palabras
agregadas.

---

## Montaje en OBS

1. Abre el juego a pantalla completa (`F11`) o usa una **fuente de navegador** apuntando
   al enlace publicado.
2. Resolución sugerida de la fuente: **1080 × 1920**.
3. Captura por **ventana o región**, nunca escritorio completo. En pantallas anchas el
   panel del operador queda fuera del escenario 9:16, pero si capturas todo saldría en
   cámara. Con `O` lo ocultas.
4. `G` dibuja la línea roja de «aquí empieza el chat de TikTok» para encuadrar. Nada
   importante del juego cae debajo de esa línea.
5. Para recortar el fondo, `F8`.

> **Ojo con el chroma verde.** El verde de la interfaz (vidas, nota, aciertos) es
> `#2FD46E` y la llave verde es `#00B140`: están tan cerca en tono que, según la
> tolerancia que le pongas al *Chroma Key* en OBS, te puede recortar el contador de
> vidas junto con el fondo. Si te pasa, pulsa `F8` otra vez y usa **magenta**: ningún
> color de la paleta compite con él.

---

## Personalizar

### El logo

Vive en `assets/logo.datauri.txt` y `build.py` lo incrusta como data URI en la constante
`LOGO`, así que los entregables no dependen de ningún archivo suelto y se ven igual sin
conexión o dentro de OBS. Para cambiarlo, regenera el archivo y reconstruye:

```bash
py -c "import base64;print('data:image/png;base64,'+base64.b64encode(open('logo.png','rb').read()).decode())" > assets/logo.datauri.txt
```

Conviene reducirlo antes a unos 160 × 160 px: el actual pesa 5,7 KB. Después corre
`py build.py`.

### El ícono de la pestaña

Es un SVG incrustado que arma `build.py` en la constante `ICONO_SVG`: pizarrón con una
letra de tiza sobre el guión amarillo del ahorcado. Es del **juego**, no de la marca,
y se lee hasta a 16 px. Cambia ese SVG y reconstruye.

El artifact publicado no usa este SVG: su ícono de pestaña es el emoji 🎓 que se
fijó al publicarlo.

### El pie de autoría

El componente `Credito` (en `src/escenario.jsx`) está dentro de la zona segura, como
última fila, para que **sí salga en cámara** durante el live. Si prefieres que no ocupe
espacio del juego, muévelo a la banda de abajo del `Escenario`: quedará detrás del chat.

### Las palabras

Las que agregues **en vivo** desde el panel entran de primeras en la baraja de su
categoría y se conservan durante toda la sesión. Para que queden fijas, agrégalas a
`CATEGORIAS` en `src/contenido.jsx` y reconstruye.

Cada categoría se baraja aparte y **no repite palabra hasta agotarla**; cuando se acaba,
se vuelve a barajar completa.

---

## Seguridad

- **Nada sale del navegador.** No hay `fetch`, `XMLHttpRequest`, `WebSocket` ni
  `sendBeacon`, ni formularios que envíen a ningún lado. Las únicas peticiones son las
  librerías y las fuentes.
- **No hay tokens, credenciales ni sesiones**, y no se toca `localStorage`,
  `sessionStorage`, cookies ni la URL.
- **No se puede inyectar HTML.** No hay `innerHTML`, `dangerouslySetInnerHTML`, `eval`
  ni `new Function`: los nombres del chat y las palabras nuevas se pintan como texto de
  React, escapado.
- **Las librerías van firmadas.** Los tres scripts de cdnjs llevan `integrity` SHA-384:
  si alguien altera esos archivos en el CDN, el navegador se niega a ejecutarlos.

Queda un hueco que no se puede cerrar así: **`cdn.tailwindcss.com` es una URL sin versión
que sirve siempre lo último**, y por eso no admite firma. Es la única dependencia sin
verificar.

---

## Estado de las pruebas

No hay suite automatizada. El juego se verificó a mano en el navegador: letra acertada
con crédito y puntaje, letra fallada con pérdida de vida y frase del profe, regalo de
seguidor, palabra completa acertada, derrota a los seis fallos, cambio de palabra y de
categoría, ambas llaves de chroma, y persistencia del marcador y la tabla entre rondas.
