/* ══════════════════════════════════════════════════════════════════
   UTILIDADES
   ══════════════════════════════════════════════════════════════════ */

// Quita tildes pero conserva la Ñ como letra propia.
function norm(s) {
  return String(s)
    .toUpperCase()
    .replace(/Ñ/g, "¤")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/¤/g, "Ñ");
}
const esLetra = (c) => ABC.indexOf(norm(c)) >= 0;
const soloLetras = (s) => norm(s).replace(/[^A-ZÑ]/g, "");

function barajar(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
}
const elegir = (a) => a[Math.floor(Math.random() * a.length)];

const limpiarNombre = (n) =>
  String(n || "").trim().replace(/^@+/, "").replace(/\s+/g, " ").slice(0, 18);

function contarEn(palabra, L) {
  let n = 0;
  for (const c of palabra) if (norm(c) === L) n++;
  return n;
}
function resuelto(palabra, acertadas) {
  for (const c of palabra) {
    if (esLetra(c) && acertadas.indexOf(norm(c)) < 0) return false;
  }
  return true;
}
function todasLasLetras(palabra) {
  const s = [];
  for (const c of palabra) {
    const n = norm(c);
    if (esLetra(c) && s.indexOf(n) < 0) s.push(n);
  }
  return s;
}

/* ══════════════════════════════════════════════════════════════════
   ESTADO DEL JUEGO
   ══════════════════════════════════════════════════════════════════ */

function siguientePalabra(st) {
  const colas = st.colas.map((q) => q.slice());
  let q = colas[st.ci];
  if (!q.length) q = barajar(st.cats[st.ci].palabras.map((_, i) => i));
  const idx = q.shift();
  colas[st.ci] = q;
  return {
    ...st,
    colas,
    palabra: st.cats[st.ci].palabras[idx],
    acertadas: [],
    falladas: [],
    vidas: VIDAS_MAX,
    estado: "jugando",
    frase: "",
    cerro: null,
    evento: null,
    aviso: null
  };
}

function inicial() {
  const cats = CATEGORIAS.map((c) => ({ ...c, palabras: c.palabras.slice() }));
  return siguientePalabra({
    cats,
    colas: cats.map((c) => barajar(c.palabras.map((_, i) => i))),
    ci: 0,
    palabra: "",
    acertadas: [],
    falladas: [],
    vidas: VIDAS_MAX,
    estado: "jugando",
    marcador: { chat: 0, profe: 0 },
    lideres: {},
    evento: null,
    aviso: null,
    frase: "",
    cerro: null,
    n: 0
  });
}

function premiar(lideres, nombre, pts, tipo) {
  const disp = limpiarNombre(nombre) || "El chat";
  const clave = disp.toLowerCase();
  const prev = lideres[clave] || { nombre: disp, pts: 0, letras: 0, palabras: 0 };
  return {
    ...lideres,
    [clave]: {
      nombre: disp,
      pts: prev.pts + pts,
      letras: prev.letras + (tipo === "L" ? 1 : 0),
      palabras: prev.palabras + (tipo === "P" ? 1 : 0)
    }
  };
}

function reducer(st, act) {
  const n = st.n + 1;

  switch (act.type) {

    case "LETRA": {
      if (st.estado !== "jugando") return st;
      const L = norm(act.letra || "").charAt(0);
      if (!L || ABC.indexOf(L) < 0) return st;
      if (st.acertadas.indexOf(L) >= 0 || st.falladas.indexOf(L) >= 0) {
        return { ...st, n, aviso: { texto: "La " + L + " ya salió", id: n } };
      }
      const veces = contarEn(st.palabra, L);
      const quien = limpiarNombre(act.nombre) || "El chat";

      if (veces > 0) {
        const acertadas = st.acertadas.concat([L]);
        const lideres = premiar(st.lideres, quien, 10, "L");
        const gano = resuelto(st.palabra, acertadas);
        return {
          ...st, n, acertadas, lideres, aviso: null,
          evento: { tipo: "acierto", letra: L, nombre: quien, veces, id: n },
          estado: gano ? "ganada" : "jugando",
          cerro: gano ? quien : null,
          frase: gano ? elegir(FRASES.ganar) : "",
          marcador: gano ? { ...st.marcador, chat: st.marcador.chat + 1 } : st.marcador
        };
      }

      const falladas = st.falladas.concat([L]);
      const vidas = st.vidas - 1;
      const perdio = vidas <= 0;
      return {
        ...st, n, falladas, vidas, aviso: null,
        evento: {
          tipo: "fallo", letra: L, nombre: quien, id: n,
          frase: perdio ? "" : elegir(FRASES.fallo)
        },
        estado: perdio ? "perdida" : "jugando",
        frase: perdio ? elegir(FRASES.perder) : "",
        marcador: perdio ? { ...st.marcador, profe: st.marcador.profe + 1 } : st.marcador
      };
    }

    case "REGALO": {
      if (st.estado !== "jugando") return st;
      const faltan = todasLasLetras(st.palabra).filter((L) => st.acertadas.indexOf(L) < 0);
      if (!faltan.length) return st;
      const L = elegir(faltan);
      const acertadas = st.acertadas.concat([L]);
      const gano = resuelto(st.palabra, acertadas);
      const quien = limpiarNombre(act.nombre);
      return {
        ...st, n, acertadas, aviso: null,
        evento: { tipo: "regalo", letra: L, nombre: quien, id: n },
        estado: gano ? "ganada" : "jugando",
        cerro: gano ? (quien || "El chat") : null,
        frase: gano ? elegir(FRASES.ganar) : "",
        marcador: gano ? { ...st.marcador, chat: st.marcador.chat + 1 } : st.marcador
      };
    }

    case "PALABRA": {
      if (st.estado !== "jugando") return st;
      const intento = soloLetras(act.palabra || "");
      if (!intento) return st;
      const quien = limpiarNombre(act.nombre) || "El chat";

      if (intento === soloLetras(st.palabra)) {
        return {
          ...st, n,
          acertadas: todasLasLetras(st.palabra),
          lideres: premiar(st.lideres, quien, 50, "P"),
          estado: "ganada",
          cerro: quien,
          frase: elegir(FRASES.ganar),
          marcador: { ...st.marcador, chat: st.marcador.chat + 1 },
          evento: { tipo: "palabra", nombre: quien, id: n },
          aviso: null
        };
      }
      const vidas = st.vidas - 1;
      const perdio = vidas <= 0;
      return {
        ...st, n, vidas,
        evento: {
          tipo: "fallo-palabra", nombre: quien, texto: act.palabra, id: n,
          frase: perdio ? "" : elegir(FRASES.fallo)
        },
        estado: perdio ? "perdida" : "jugando",
        frase: perdio ? elegir(FRASES.perder) : "",
        marcador: perdio ? { ...st.marcador, profe: st.marcador.profe + 1 } : st.marcador,
        aviso: null
      };
    }

    case "NUEVA":
      return siguientePalabra({ ...st, n });

    case "CATEGORIA": {
      const ci = ((act.ci % st.cats.length) + st.cats.length) % st.cats.length;
      return siguientePalabra({ ...st, n, ci });
    }

    case "REINICIAR_RONDA":
      return {
        ...st, n, acertadas: [], falladas: [], vidas: VIDAS_MAX,
        estado: "jugando", frase: "", cerro: null, evento: null,
        aviso: { texto: "Ronda reiniciada", id: n }
      };

    case "REINICIAR_PARTIDA": {
      // Las palabras agregadas en vivo se conservan; el marcador y la tabla se van a cero.
      const base = {
        ...st, n,
        colas: st.cats.map((c) => barajar(c.palabras.map((_, i) => i))),
        marcador: { chat: 0, profe: 0 },
        lideres: {}
      };
      const ns = siguientePalabra(base);
      return { ...ns, aviso: { texto: "Partida nueva: marcador en 0", id: n } };
    }

    case "AGREGAR": {
      // Tope de largo: una frase enorme rompería el encuadre en vivo.
      const texto = String(act.palabra || "").trim().replace(/\s+/g, " ").slice(0, 44);
      if (!soloLetras(texto)) return st;
      const ci = act.ci;
      const cats = st.cats.map((c, i) =>
        i === ci ? { ...c, palabras: c.palabras.concat([texto]) } : c
      );
      const colas = st.colas.map((q, i) =>
        i === ci ? [cats[ci].palabras.length - 1].concat(q) : q
      );
      return {
        ...st, n, cats, colas,
        aviso: { texto: "«" + texto + "» entra en la próxima", id: n }
      };
    }

    case "LIMPIAR_EVENTO":
      return st.evento && st.evento.id === act.id ? { ...st, evento: null } : st;

    case "LIMPIAR_AVISO":
      return st.aviso && st.aviso.id === act.id ? { ...st, aviso: null } : st;

    default:
      return st;
  }
}
