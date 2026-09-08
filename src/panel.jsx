/* ══════════════════════════════════════════════════════════════════
   PANEL DEL OPERADOR
   ══════════════════════════════════════════════════════════════════ */

function Campo({ etiqueta, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[.14em] mb-1" style={{ color: "var(--tiza-tenue)" }}>{etiqueta}</span>
      {children}
    </label>
  );
}

function Boton({ onClick, tecla, children, tono }) {
  const clase = "btn w-full flex items-center justify-between gap-2 text-[14px] " +
    (tono === "oro" ? "btn-oro " : tono === "rojo" ? "btn-rojo " : "");
  return (
    <button className={clase} onClick={onClick}>
      <span>{children}</span>
      {tecla && <kbd>{tecla}</kbd>}
    </button>
  );
}

function Panel(props) {
  const { st, dispatch, nombre, setNombre, refs, chroma, ciclarChroma, guias, setGuias,
          onCombo, onRegalo, onAdivinar, onAgregar, cerrar, armado } = props;

  const [combo, setCombo] = useState("");
  const [intento, setIntento] = useState("");
  const [nomIntento, setNomIntento] = useState("");
  const [nueva, setNueva] = useState("");
  const [catNueva, setCatNueva] = useState(st.ci);

  return (
    <aside className="h-full w-full flex flex-col" style={{ background: "var(--pizarron-hondo)", borderLeft: "3px solid var(--linea)" }}>
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: "3px solid var(--linea)" }}>
        <div>
          <div className="display text-[19px]" style={{ color: "var(--amarillo)" }}>PANEL DEL PROFE</div>
          <div className="text-[11px]" style={{ color: "var(--tiza-tenue)" }}>solo tú ves esto</div>
        </div>
        <button className="btn text-[13px] px-3 py-2" onClick={cerrar}>Ocultar <kbd>O</kbd></button>
      </div>

      <div className="scroll flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">

        {/* La palabra, para el operador */}
        <div className="rounded-xl px-3 py-2" style={{ background: "rgba(255,208,40,.1)", border: "2px solid var(--amarillo)" }}>
          <div className="text-[11px] tracking-[.14em]" style={{ color: "var(--amarillo)" }}>LA PALABRA ES</div>
          <div className="display text-[22px] leading-tight" style={{ color: "var(--tiza)" }}>{st.palabra.toUpperCase()}</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--tiza-tenue)" }}>
            {st.cats[st.ci].nombre} · quedan {st.colas[st.ci].length} en la baraja
          </div>
        </div>

        {/* Entrada rápida */}
        <div className="flex flex-col gap-2">
          <Campo etiqueta="LETRA + USUARIO · ENTER">
            <input ref={refs.letra} value={combo}
                   onChange={(e) => setCombo(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === "Enter") { onCombo(combo); setCombo(""); }
                   }}
                   placeholder="a juan99   ·   juan99 a   ·   a"
                   className="w-full px-3 py-3 text-[22px] display" autoFocus />
          </Campo>
          <div className="text-[11px] leading-snug" style={{ color: "var(--tiza-tenue)" }}>
            Escribe la letra y el usuario en el mismo campo, en cualquier orden. Si solo escribes la letra,
            el crédito va al usuario fijo de abajo.
          </div>
          <Campo etiqueta="USUARIO FIJO (SE RECUERDA)">
            <input value={nombre} onChange={(e) => setNombre(e.target.value)}
                   placeholder="El chat" className="w-full px-3 py-2 text-[16px]" />
          </Campo>
        </div>

        <Boton onClick={onRegalo} tecla="F1" tono="oro">🎁 Nuevo seguidor · Revelar letra</Boton>

        <div className="grid grid-cols-2 gap-2">
          <Boton onClick={() => dispatch({ type: "NUEVA" })} tecla="F2">Nueva palabra</Boton>
          <Boton onClick={() => dispatch({ type: "NUEVA" })} tecla="F3">Saltar palabra</Boton>
          <Boton onClick={() => dispatch({ type: "CATEGORIA", ci: st.ci + 1 })} tecla="F4">Otra categoría</Boton>
          <Boton onClick={() => dispatch({ type: "REINICIAR_RONDA" })} tecla="F9">Reiniciar ronda</Boton>
          <Boton onClick={ciclarChroma} tecla="F8">
            {chroma === "" ? "Fondo chroma" : chroma === "verde" ? "Chroma verde → magenta" : "Chroma magenta → quitar"}
          </Boton>
          <Boton onClick={() => setGuias(!guias)} tecla="G">{guias ? "Ocultar guía" : "Guía de encuadre"}</Boton>
        </div>

        {/* Adivinar la palabra completa */}
        <div className="panel rounded-xl p-3 flex flex-col gap-2">
          <div className="display text-[15px]" style={{ color: "var(--verde)" }}>ALGUIEN LA DIJO COMPLETA (+50)</div>
          <input ref={refs.palabra} value={intento} onChange={(e) => setIntento(e.target.value)}
                 onKeyDown={(e) => { if (e.key === "Enter") refs.nomPalabra.current && refs.nomPalabra.current.focus(); }}
                 placeholder="la palabra completa" className="w-full px-3 py-2 text-[16px]" />
          <div className="flex gap-2">
            <input ref={refs.nomPalabra} value={nomIntento} onChange={(e) => setNomIntento(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === "Enter") { onAdivinar(intento, nomIntento); setIntento(""); setNomIntento(""); }
                   }}
                   placeholder="usuario" className="flex-1 px-3 py-2 text-[16px]" />
            <button className="btn text-[14px] px-4"
                    onClick={() => { onAdivinar(intento, nomIntento); setIntento(""); setNomIntento(""); }}>
              Enviar
            </button>
          </div>
          <div className="text-[11px]" style={{ color: "var(--tiza-tenue)" }}>Si falla, le cuesta una vida al chat.</div>
        </div>

        {/* Categorías */}
        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] tracking-[.14em]" style={{ color: "var(--tiza-tenue)" }}>CATEGORÍAS</div>
          {st.cats.map((c, i) => (
            <button key={c.nombre} onClick={() => dispatch({ type: "CATEGORIA", ci: i })}
                    className="btn text-[13px] flex items-center justify-between"
                    style={i === st.ci ? { borderColor: "var(--amarillo)", color: "var(--amarillo)" } : null}>
              <span>{c.emoji} {c.nombre}</span>
              <span className="num text-[11px]" style={{ color: "var(--tiza-tenue)" }}>{c.palabras.length}</span>
            </button>
          ))}
        </div>

        {/* Agregar palabra en vivo */}
        <div className="panel rounded-xl p-3 flex flex-col gap-2">
          <div className="display text-[15px]" style={{ color: "var(--amarillo)" }}>AGREGAR PALABRA EN VIVO</div>
          <select value={catNueva} onChange={(e) => setCatNueva(Number(e.target.value))}
                  className="w-full px-3 py-2 text-[14px]">
            {st.cats.map((c, i) => <option key={c.nombre} value={i}>{c.nombre}</option>)}
          </select>
          <div className="flex gap-2">
            <input ref={refs.agregar} value={nueva} onChange={(e) => setNueva(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === "Enter") { onAgregar(catNueva, nueva); setNueva(""); }
                   }}
                   placeholder="la nueva palabra o frase" className="flex-1 px-3 py-2 text-[16px]" />
            <button className="btn text-[14px] px-4"
                    onClick={() => { onAgregar(catNueva, nueva); setNueva(""); }}>Añadir</button>
          </div>
          <div className="text-[11px]" style={{ color: "var(--tiza-tenue)" }}>Entra de primera en la baraja de esa categoría.</div>
        </div>

        <Boton onClick={() => dispatch({ type: "REINICIAR_PARTIDA" })} tecla="Alt+R" tono="rojo">
          {armado ? "¿Seguro? Vuelve a pulsar Alt+R" : "Reiniciar partida (borra marcador y tabla)"}
        </Boton>

        {/* Atajos */}
        <div className="panel rounded-xl p-3">
          <div className="text-[11px] tracking-[.14em] mb-2" style={{ color: "var(--tiza-tenue)" }}>ATAJOS</div>
          <div className="grid grid-cols-[64px_1fr] gap-y-1 text-[12px]" style={{ color: "var(--tiza)" }}>
            {[["Enter", "enviar letra"], ["F1", "regalo de seguidor"], ["F2 / F3", "nueva · saltar"],
              ["F4", "otra categoría"], ["F6", "adivinar completa"], ["F7", "agregar palabra"],
              ["F8", "chroma key"], ["F9", "reiniciar ronda"], ["F10 / O", "ocultar panel"],
              ["G", "guía de encuadre"], ["Alt+R ×2", "reiniciar partida"], ["Esc", "volver al campo"]
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <kbd style={{ background: "var(--pizarron-hondo)", border: "1px solid var(--linea)", borderRadius: 5,
                              padding: "1px 5px", fontSize: 11, color: "var(--amarillo)", justifySelf: "start" }}>{k}</kbd>
                <span style={{ color: "var(--tiza-tenue)" }}>{v}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
