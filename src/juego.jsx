/* ══════════════════════════════════════════════════════════════════
   APP
   ══════════════════════════════════════════════════════════════════ */

function JuegoAhorcadoDelIng() {
  const [st, dispatch] = useReducer(reducer, undefined, inicial);
  const [panel, setPanel] = useState(true);
  const [chroma, setChroma] = useState("");   // "" | "verde" | "magenta"
  const [guias, setGuias] = useState(false);
  const [nombre, setNombre] = useState("");
  const [armado, setArmado] = useState(false);
  const [escala, setEscala] = useState(1);

  const cajaRef = useRef(null);
  const refs = {
    letra: useRef(null),
    palabra: useRef(null),
    nomPalabra: useRef(null),
    agregar: useRef(null)
  };
  const nombreRef = useRef("");
  nombreRef.current = nombre;
  const stRef = useRef(st);
  stRef.current = st;

  // Escalar el escenario 9:16 al espacio disponible
  useEffect(() => {
    const medir = () => {
      const c = cajaRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      setEscala(Math.max(0.1, Math.min(r.width / 540, r.height / 960)));
    };
    medir();
    window.addEventListener("resize", medir);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(medir) : null;
    if (ro && cajaRef.current) ro.observe(cajaRef.current);
    return () => { window.removeEventListener("resize", medir); if (ro) ro.disconnect(); };
  }, [panel]);

  // Los banners y avisos se apagan solos
  useEffect(() => {
    if (!st.evento) return;
    const id = st.evento.id;
    const t = setTimeout(() => dispatch({ type: "LIMPIAR_EVENTO", id }), 3600);
    return () => clearTimeout(t);
  }, [st.evento]);

  useEffect(() => {
    if (!st.aviso) return;
    const id = st.aviso.id;
    const t = setTimeout(() => dispatch({ type: "LIMPIAR_AVISO", id }), 2200);
    return () => clearTimeout(t);
  }, [st.aviso]);

  const ciclarChroma = useCallback(() => {
    setChroma((v) => LLAVES[(LLAVES.indexOf(v) + 1) % LLAVES.length]);
  }, []);

  const foco = useCallback(() => {
    if (refs.letra.current) refs.letra.current.focus();
  }, []);

  const enviarLetra = useCallback((letra, quien) => {
    dispatch({ type: "LETRA", letra, nombre: quien || nombreRef.current });
    foco();
  }, [foco]);

  // "a juan99" o "juan99 a" o solo "a"
  const onCombo = useCallback((crudo) => {
    const t = String(crudo || "").trim().replace(/\s+/g, " ");
    if (!t) return;
    const partes = t.split(" ");
    let letra = null, quien = null;
    if (partes.length === 1) {
      if (partes[0].length === 1) letra = partes[0];
    } else {
      const pri = partes[0], ult = partes[partes.length - 1];
      if (pri.length === 1) { letra = pri; quien = partes.slice(1).join(" "); }
      else if (ult.length === 1) { letra = ult; quien = partes.slice(0, -1).join(" "); }
    }
    if (!letra || !esLetra(letra)) { foco(); return; }
    if (quien) setNombre(limpiarNombre(quien));
    enviarLetra(letra, quien);
  }, [enviarLetra, foco]);

  const onRegalo = useCallback(() => {
    dispatch({ type: "REGALO", nombre: nombreRef.current });
    foco();
  }, [foco]);

  const onAdivinar = useCallback((palabra, quien) => {
    if (!String(palabra || "").trim()) return;
    dispatch({ type: "PALABRA", palabra, nombre: quien || nombreRef.current });
    foco();
  }, [foco]);

  const onAgregar = useCallback((ci, palabra) => {
    if (!String(palabra || "").trim()) return;
    dispatch({ type: "AGREGAR", ci, palabra });
  }, []);

  // Atajos globales
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName || "").toLowerCase();
      const escribiendo = tag === "input" || tag === "textarea" || tag === "select";
      const k = e.key;

      if (e.altKey && (k === "r" || k === "R")) {
        e.preventDefault();
        if (armado) { dispatch({ type: "REINICIAR_PARTIDA" }); setArmado(false); }
        else { setArmado(true); setTimeout(() => setArmado(false), 3000); }
        return;
      }

      switch (k) {
        case "F1": e.preventDefault(); onRegalo(); break;
        case "F2": e.preventDefault(); dispatch({ type: "NUEVA" }); foco(); break;
        case "F3": e.preventDefault(); dispatch({ type: "NUEVA" }); foco(); break;
        case "F4": e.preventDefault(); dispatch({ type: "CATEGORIA", ci: stRef.current.ci + 1 }); foco(); break;
        case "F6": e.preventDefault(); setPanel(true); setTimeout(() => refs.palabra.current && refs.palabra.current.focus(), 30); break;
        case "F7": e.preventDefault(); setPanel(true); setTimeout(() => refs.agregar.current && refs.agregar.current.focus(), 30); break;
        case "F8": e.preventDefault(); ciclarChroma(); break;
        case "F9": e.preventDefault(); dispatch({ type: "REINICIAR_RONDA" }); foco(); break;
        case "F10": e.preventDefault(); setPanel((v) => !v); break;
        case "Escape": e.preventDefault(); setPanel(true); setTimeout(foco, 30); break;
        default:
          if (!escribiendo) {
            if (k === "o" || k === "O") { e.preventDefault(); setPanel((v) => !v); }
            else if (k === "g" || k === "G") { e.preventDefault(); setGuias((v) => !v); }
            else if (esLetra(k) && k.length === 1) { e.preventDefault(); enviarLetra(k); }
          }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [armado, onRegalo, foco, enviarLetra, ciclarChroma]);

  useEffect(() => { foco(); }, [foco]);

  return (
    <div className="ahorcado w-screen h-screen flex">
      <style>{CSS}</style>

      {/* Escenario: esto es lo único que se captura en OBS */}
      <div ref={cajaRef} className="flex-1 relative overflow-hidden">
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%) scale(" + escala + ")",
          transformOrigin: "center center"
        }}>
          <Escenario st={st} onLetra={(L) => enviarLetra(L)} chroma={chroma} guias={guias} />
        </div>

        {!panel && (
          <button onClick={() => setPanel(true)}
                  className="btn absolute bottom-3 right-3 text-[12px] px-3 py-2 opacity-40 hover:opacity-100">
            Panel <kbd>O</kbd>
          </button>
        )}
      </div>

      {/* Panel del operador: fuera del escenario */}
      {panel && (
        <div className="shrink-0" style={{ width: 400, maxWidth: "92vw" }}>
          <Panel
            st={st} dispatch={dispatch} nombre={nombre} setNombre={setNombre} refs={refs}
            chroma={chroma} ciclarChroma={ciclarChroma} guias={guias} setGuias={setGuias}
            onCombo={onCombo} onRegalo={onRegalo} onAdivinar={onAdivinar} onAgregar={onAgregar}
            cerrar={() => setPanel(false)} armado={armado}
          />
        </div>
      )}
    </div>
  );
}
