/* ══════════════════════════════════════════════════════════════════
   CONTENIDO
   ══════════════════════════════════════════════════════════════════ */

const VIDAS_MAX = 6;
// Alto del escenario que NO tapa el chat de TikTok: todo lo que deba salir
// en cámara vive dentro de esta franja.
const ZONA_SEGURA = 672;
const LLAVES = ["", "verde", "magenta"];   // ciclo del fondo chroma
const ABC = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

// Escala colombiana: 5.0 arriba, 3.0 es la raya de pasar.
const NOTAS = ["5.0", "4.3", "3.6", "3.0", "2.2", "1.1", "0.0"];

/* ── Crédito del pie ──────────────────────────────────────────────── */
const CREDITO = {
  autor: "Desarrollado por Carlos Carrascal"
};
// El logo va incrustado como data URI: la página no depende de ningún archivo
// externo y se ve igual sin conexión o dentro de OBS.
const LOGO = "__LOGO_DATA_URI__";

const CATEGORIAS = [
  {
    nombre: "MATERIAS DEL INFIERNO",
    emoji: "🔥",
    palabras: [
      "cálculo diferencial", "termodinámica", "ecuaciones diferenciales",
      "álgebra lineal", "resistencia de materiales", "mecánica de fluidos",
      "química orgánica", "física de ondas", "cálculo vectorial",
      "métodos numéricos", "circuitos eléctricos", "transferencia de calor",
      "estática", "dibujo técnico", "probabilidad y estadística"
    ]
  },
  {
    nombre: "EXCUSAS DE ESTUDIANTE",
    emoji: "🙃",
    palabras: [
      "se me borró el usb", "no había internet", "se fue la luz",
      "el trancón", "me quedé sin datos", "el archivo se corrompió",
      "pensé que era para mañana", "no me llegó el correo",
      "se me olvidó la clave", "la plataforma no cargó",
      "mi grupo no hizo nada", "el computador se apagó",
      "perdí el bus", "se dañó la impresora", "estaba enfermo"
    ]
  },
  {
    nombre: "JERGA DE INGENIERÍA",
    emoji: "📐",
    palabras: [
      "supletorio", "habilitación", "parcial", "monitoría", "quiz sorpresa",
      "sustentación", "laboratorio", "semillero", "prerrequisito",
      "tercer corte", "cancelar la materia", "trabajo de grado",
      "práctica empresarial", "nivelatorio", "arrastrar la materia"
    ]
  },
  {
    nombre: "PROFES QUE TODOS TUVIMOS",
    emoji: "🎓",
    palabras: [
      "el que no deja entrar tarde", "el que graba la clase",
      "el que nunca sube notas", "el que pone quiz sorpresa",
      "el que llega tarde siempre", "el que borra muy rápido",
      "el que habla de su tesis", "el que no usa diapositivas",
      "el que manda taller el viernes", "el que raja a todos",
      "el que da puntos por asistencia", "el que odia la calculadora",
      "el que cuenta anécdotas", "el que devuelve el parcial tarde",
      "el que se sabe todo de memoria"
    ]
  },
  {
    nombre: "EL MORRAL DEL INGENIERO",
    emoji: "🎒",
    palabras: [
      "calculadora científica", "protoboard", "multímetro", "portaminas",
      "tabla periódica", "bata de laboratorio", "casco", "cautín",
      "cinta métrica", "escuadra", "memoria usb", "termo de café",
      "plano arquitectónico", "regla de cálculo", "papel milimetrado"
    ]
  }
];

const FRASES = {
  fallo: [
    "Eso vale 0.5",
    "Esa letra no aparece ni en el supletorio",
    "Suave, que todavía hay tercer corte",
    "No, señor. Siguiente.",
    "Esa la vimos la clase que faltaste",
    "Con esa respuesta no pasa ni la habilitación",
    "Ojo que la nota va bajando",
    "En el parcial eso es media hoja tachada",
    "Casi. Pero casi no da nota.",
    "Le voy a tener que llamar al acudiente"
  ],
  perder: [
    "Nos vemos en el supletorio",
    "Habilitación el sábado a las 7 de la mañana",
    "La respuesta estaba en la diapositiva 3",
    "Cierro notas hoy, no me escriban",
    "Esto sale en el final, apunten",
    "Le pongo 2.9 para que le duela",
    "Y todavía faltan dos cortes, tranquilos",
    "El chat perdió, pero aprendió. Supuestamente."
  ],
  ganar: [
    "Hoy amanecí de buenas",
    "Cinco limpio, felicitaciones",
    "Eso sí es un chat que estudió",
    "Les subo décimas a todos",
    "Con ese nivel les cancelo el parcial",
    "Y sin calculadora, impresionante",
    "Anoten que hoy el chat me ganó",
    "Eso vale como nota de laboratorio"
  ]
};
