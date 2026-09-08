/* ══════════════════════════════════════════════════════════════════
   PIEZAS DE LA VISTA PÚBLICA
   ══════════════════════════════════════════════════════════════════ */

function Marcador({ marcador }) {
  return (
    <div className="flex items-stretch gap-1.5 shrink-0">
      <Lado etiqueta="CHAT" valor={marcador.chat} color="var(--verde)" />
      <div className="display text-[15px] self-center" style={{ color: "var(--tiza-tenue)" }}>vs</div>
      <Lado etiqueta="PROFE" valor={marcador.profe} color="var(--rojo)" />
    </div>
  );
}
function Lado({ etiqueta, valor, color }) {
  return (
    <div className="px-2 py-0.5 rounded-xl text-center" style={{ background: "var(--pizarron-hondo)", border: "2px solid " + color }}>
      <div className="text-[11px] tracking-[.14em]" style={{ color: "var(--tiza-tenue)" }}>{etiqueta}</div>
      <div key={valor} className="display num text-[22px] leading-none a-pop" style={{ color }}>{valor}</div>
    </div>
  );
}

function MedidorNota({ errores }) {
  const pct = Math.max(0, (VIDAS_MAX - errores) / VIDAS_MAX) * 100;
  const nota = NOTAS[Math.min(errores, NOTAS.length - 1)];
  const color = errores <= 1 ? "var(--verde)" : errores <= 3 ? "var(--amarillo)" : "var(--rojo)";
  return (
    <div className="flex flex-col items-center gap-1.5 w-[104px] shrink-0">
      <div className="text-[11px] tracking-[.18em]" style={{ color: "var(--tiza-tenue)" }}>NOTA</div>
      <div className="flex items-end gap-2">
        <div className="relative w-[26px] h-[88px] rounded-full overflow-hidden"
             style={{ background: "var(--pizarron-hondo)", border: "2px solid var(--linea)" }}>
          <div className="absolute bottom-0 left-0 right-0 transition-all duration-500"
               style={{ height: pct + "%", background: color }} />
          {/* La raya de pasar: 3.0 */}
          <div className="absolute left-0 right-0" style={{ bottom: "50%", borderTop: "2px dashed rgba(242,237,220,.75)" }} />
        </div>
        <div className="flex flex-col justify-between h-[88px] py-[2px] text-[10px] num" style={{ color: "var(--tiza-tenue)" }}>
          <span>5.0</span><span>3.0</span><span>0.0</span>
        </div>
      </div>
      <div key={nota} className="display num text-[30px] leading-none a-pop" style={{ color }}>{nota}</div>
    </div>
  );
}

function Estudiante({ errores }) {
  const e = errores;
  const tiza = "#F2EDDC";
  const on = (k) => (e >= k ? 1 : 0.09);
  const trazo = { stroke: tiza, strokeWidth: 7, strokeLinecap: "round", fill: "none" };

  const boca =
    e <= 2 ? "M88 62 Q100 72 112 62" :
    e <= 4 ? "M88 65 H112" :
             "M88 69 Q100 57 112 69";

  return (
    <svg viewBox="0 0 200 206" className="h-[132px] w-[132px]" role="img"
         aria-label={"Estudiante con " + e + " de 6 errores"}>
      {/* 1 · el pupitre */}
      <g opacity={on(1)}>
        <path d="M28 150 H172" {...trazo} strokeWidth="9" stroke="#FFD028" />
        <path d="M44 155 V196" {...trazo} stroke="#FFD028" />
        <path d="M156 155 V196" {...trazo} stroke="#FFD028" />
      </g>
      {/* 2 · la cabeza */}
      <g opacity={on(2)}>
        <circle cx="100" cy="52" r="25" {...trazo} />
        {e >= 6 ? (
          <g stroke={tiza} strokeWidth="5" strokeLinecap="round">
            <path d="M85 43 L95 53" /><path d="M95 43 L85 53" />
            <path d="M105 43 L115 53" /><path d="M115 43 L105 53" />
          </g>
        ) : (
          <g fill={tiza}>
            <circle cx="91" cy="48" r="3.6" /><circle cx="109" cy="48" r="3.6" />
          </g>
        )}
        <path d={boca} stroke={tiza} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </g>
      {/* 3 · el torso */}
      <g opacity={on(3)}><path d="M100 77 V134" {...trazo} strokeWidth="8" /></g>
      {/* 4 · los brazos */}
      <g opacity={on(4)}>
        <path d="M100 93 L66 122" {...trazo} />
        <path d="M100 93 L134 122" {...trazo} />
      </g>
      {/* 5 · el cuaderno y el lápiz */}
      <g opacity={on(5)}>
        <rect x="74" y="132" width="52" height="17" rx="3" fill="#F2EDDC" />
        <path d="M80 140 H120" stroke="#0F1F19" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M132 128 L146 142" stroke="#FFD028" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* 6 · el café volcado */}
      <g opacity={on(6)}>
        <path d="M38 138 q6 -16 20 -16 q14 0 18 16 z" fill="#FF3B4E" />
        <ellipse cx="52" cy="149" rx="30" ry="5" fill="#FF3B4E" opacity=".7" />
        <path d="M118 24 q8 -12 16 0" stroke="#FF3B4E" strokeWidth="4" fill="none" strokeLinecap="round" opacity={e >= 5 ? 1 : 0} />
      </g>
      {/* el sello */}
      {e >= 6 && (
        <g className="a-sello" style={{ transformOrigin: "140px 60px" }}>
          <circle cx="140" cy="60" r="34" fill="none" stroke="#FF3B4E" strokeWidth="6" />
          <text x="140" y="72" textAnchor="middle" className="display num" fontSize="34" fill="#FF3B4E">0.0</text>
        </g>
      )}
    </svg>
  );
}

function Vidas({ vidas }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-[104px] shrink-0">
      <div className="text-[11px] tracking-[.18em]" style={{ color: "var(--tiza-tenue)" }}>VIDAS</div>
      <div key={vidas} className="display num text-[54px] leading-none a-latido"
           style={{ color: vidas <= 2 ? "var(--rojo)" : vidas <= 4 ? "var(--amarillo)" : "var(--verde)" }}>
        {vidas}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: VIDAS_MAX }).map((_, i) => (
          <div key={i} className="w-[22px] h-[9px] rounded-full transition-colors duration-300"
               style={{
                 background: i < vidas ? "var(--verde)" : "transparent",
                 border: "2px solid " + (i < vidas ? "var(--verde)" : "var(--linea)")
               }} />
        ))}
      </div>
    </div>
  );
}

function Palabra({ palabra, acertadas, mostrarTodo }) {
  const totalLetras = soloLetras(palabra).length;
  const tam =
    totalLetras <= 7 ? 72 :
    totalLetras <= 10 ? 60 :
    totalLetras <= 14 ? 50 :
    totalLetras <= 19 ? 40 :
    totalLetras <= 25 ? 33 : 27;

  const grupos = palabra.split(" ").filter(Boolean);

  return (
    <div className="flex flex-wrap justify-center items-end gap-x-4 gap-y-2 px-3">
      {grupos.map((g, gi) => (
        <div key={gi} className="flex items-end" style={{ gap: Math.max(3, tam * 0.09) }}>
          {Array.from(g).map((c, i) => {
            const letra = esLetra(c);
            const visible = !letra || mostrarTodo || acertadas.indexOf(norm(c)) >= 0;
            return (
              <div key={i} className="flex flex-col items-center"
                   style={{ width: tam * 0.72, minWidth: 16 }}>
                <div className="display leading-none flex items-end justify-center"
                     style={{ fontSize: tam, height: tam * 1.05, color: "var(--tiza)" }}>
                  {visible ? (
                    <span key={String(visible)} className={letra ? "a-revelar" : ""}
                          style={{ display: "inline-block" }}>
                      {c.toUpperCase()}
                    </span>
                  ) : <span>&nbsp;</span>}
                </div>
                {letra && (
                  <div style={{
                    width: "100%", height: Math.max(4, tam * 0.09),
                    borderRadius: 99,
                    background: visible ? "var(--verde)" : "var(--tiza-tenue)",
                    marginTop: 4, transition: "background .3s"
                  }} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Teclado({ acertadas, falladas, onLetra }) {
  return (
    <div className="grid gap-[5px] px-2" style={{ gridTemplateColumns: "repeat(9, minmax(0,1fr))" }}>
      {ABC.map((L) => {
        const ok = acertadas.indexOf(L) >= 0;
        const mal = falladas.indexOf(L) >= 0;
        const bg = ok ? "var(--verde)" : mal ? "var(--rojo)" : "var(--pizarron-alto)";
        const fg = ok || mal ? "#0A1611" : "var(--tiza-tenue)";
        return (
          <button key={L} onClick={() => onLetra(L)}
                  className={"display rounded-[7px] h-[26px] text-[17px] leading-none " + (ok || mal ? "a-pop" : "")}
                  style={{ background: bg, color: fg, border: "2px solid " + (ok || mal ? bg : "var(--linea)"),
                           opacity: mal ? 0.85 : 1, textDecoration: mal ? "line-through" : "none" }}>
            {L}
          </button>
        );
      })}
    </div>
  );
}

function Lideres({ lideres }) {
  const top = Object.keys(lideres)
    .map((k) => lideres[k])
    .sort((a, b) => b.pts - a.pts || b.palabras - a.palabras)
    .slice(0, 5);

  const medalla = ["🥇", "🥈", "🥉", "4°", "5°"];
  // Siempre 5 ranuras: el alto no depende de cuánta gente haya puntuado, así
  // el tablero nunca crece hacia la franja que tapa el chat.
  const filas = Array.from({ length: 5 }, (_, i) => top[i] || null);

  return (
    <div className="panel rounded-2xl px-3 py-2 mx-2 flex flex-col" style={{ height: 146 }}>
      <div className="flex items-baseline justify-between mb-1 shrink-0">
        <span className="text-[12px] tracking-[.18em]" style={{ color: "var(--amarillo)" }}>SALÓN DE LA FAMA</span>
        <span className="text-[11px]" style={{ color: "var(--tiza-tenue)" }}>letra 10 · palabra 50</span>
      </div>

      {top.length === 0 ? (
        <div className="tiza-mano text-[24px] flex-1 flex items-center justify-center text-center"
             style={{ color: "var(--tiza-tenue)" }}>
          Nadie ha dicho una letra todavía…
        </div>
      ) : (
        <div className="flex flex-col gap-[1px]">
          {filas.map((p, i) => p ? (
            <div key={p.nombre + i} className="flex items-center gap-2 rounded-lg px-2"
                 style={{ height: 20, background: i === 0 ? "rgba(255,208,40,.14)" : "transparent" }}>
              <span className="w-[22px] text-[14px] text-center">{medalla[i]}</span>
              <span className="display text-[15px] truncate flex-1"
                    style={{ color: i === 0 ? "var(--amarillo)" : "var(--tiza)" }}>@{p.nombre}</span>
              <span className="text-[11px] num" style={{ color: "var(--tiza-tenue)" }}>
                {p.letras}L {p.palabras ? p.palabras + "P" : ""}
              </span>
              <span className="display num text-[18px] w-[48px] text-right" style={{ color: "var(--verde)" }}>{p.pts}</span>
            </div>
          ) : (
            <div key={"vacia" + i} style={{ height: 20 }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Pie de autoría: última fila de la zona segura, así sí sale en cámara. */
function Credito() {
  return (
    <div className="flex items-center self-center gap-3 rounded-2xl"
         style={{ padding: "4px 16px 4px 5px", background: "rgba(3,12,8,.6)",
                  border: "1px solid rgba(242,237,220,.14)" }}>
      <img src={LOGO} alt="" width="160" height="160"
           style={{ width: 30, height: 30, borderRadius: 999, display: "block",
                    border: "1px solid rgba(255,90,80,.55)",
                    boxShadow: "0 0 10px rgba(255,59,48,.5)" }} />
      <span style={{ fontSize: 15, fontWeight: 800, color: "var(--tiza)", whiteSpace: "nowrap" }}>
        {CREDITO.autor}
      </span>
    </div>
  );
}

function Banner({ evento }) {
  if (!evento) return null;

  // El posicionamiento vive en el envoltorio; la animación, adentro.
  // Si van en el mismo nodo, el `transform` del keyframe pisa al del centrado.
  const Caja = ({ fondo, tinta, children }) => (
    <div className="absolute left-0 right-0 top-0 z-20 flex justify-center px-3 pointer-events-none">
      <div className="a-banner w-full rounded-2xl px-4 py-2.5 text-center shadow-2xl overflow-hidden"
           style={{ background: fondo, color: tinta, border: "3px solid #0A1611" }}>
        {children}
      </div>
    </div>
  );

  if (evento.tipo === "acierto") {
    return (
      <Caja fondo="var(--verde)" tinta="#062713">
        <div className="flex items-center justify-center gap-3 min-w-0">
          <span className="display text-[46px] leading-none a-latido shrink-0">{evento.letra}</span>
          <div className="text-left min-w-0">
            <div className="display text-[24px] leading-tight truncate">@{evento.nombre}</div>
            <div className="text-[15px]">
              {evento.veces > 1 ? "¡" + evento.veces + " veces! " : "¡Va! "}+10 puntos
            </div>
          </div>
        </div>
      </Caja>
    );
  }
  if (evento.tipo === "regalo") {
    return (
      <Caja fondo="var(--amarillo)" tinta="#241B00">
        <div className="display text-[19px] leading-tight">🎁 NUEVO SEGUIDOR</div>
        <div className="display text-[26px] leading-tight truncate">
          {evento.nombre ? "@" + evento.nombre + " · " : ""}regalo: {evento.letra}
        </div>
      </Caja>
    );
  }
  if (evento.tipo === "palabra") {
    return (
      <Caja fondo="var(--verde)" tinta="#062713">
        <div className="display text-[19px] leading-tight">¡LA DIJO COMPLETA!</div>
        <div className="display text-[28px] leading-tight truncate">@{evento.nombre} · +50</div>
      </Caja>
    );
  }
  // fallo y fallo-palabra
  return (
    <Caja fondo="var(--rojo)" tinta="#2A0006">
      <div className="flex items-center justify-center gap-3 min-w-0">
        {evento.letra && <span className="display text-[42px] leading-none shrink-0">{evento.letra}</span>}
        <div className="text-left min-w-0">
          <div className="display text-[21px] leading-tight truncate">
            @{evento.nombre} {evento.tipo === "fallo-palabra" ? "falló la palabra" : "falló"}
          </div>
          {evento.frase && (
            <div className="tiza-mano text-[26px] leading-tight" style={{ overflowWrap: "anywhere" }}>
              “{evento.frase}”
            </div>
          )}
        </div>
      </div>
    </Caja>
  );
}

function Confeti({ semilla }) {
  const piezas = useMemo(() => {
    const colores = ["#FFD028", "#2FD46E", "#F2EDDC", "#FF3B4E"];
    return Array.from({ length: 40 }).map((_, i) => ({
      i,
      left: Math.random() * 100,
      delay: Math.random() * 1.4,
      dur: 2.2 + Math.random() * 1.8,
      w: 8 + Math.random() * 10,
      h: 12 + Math.random() * 14,
      color: colores[i % colores.length]
    }));
  }, [semilla]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {piezas.map((p) => (
        <div key={p.i} className="confeti"
             style={{ left: p.left + "%", width: p.w, height: p.h, background: p.color,
                      animationDelay: p.delay + "s", animationDuration: p.dur + "s" }} />
      ))}
    </div>
  );
}

function Final({ st }) {
  const gano = st.estado === "ganada";
  const largo = soloLetras(st.palabra).length;
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center px-5 text-center"
         style={{ background: gano ? "rgba(6,39,19,.94)" : "rgba(42,0,6,.94)" }}>
      {gano && <Confeti semilla={st.n} />}
      {/* La celebración se centra en la zona segura, no en los 960px:
          el tercio de abajo lo tapa el chat de TikTok. */}
      <div className="a-pop relative z-10 w-full flex flex-col justify-center" style={{ height: ZONA_SEGURA }}>
        <div className="display text-[30px] leading-tight" style={{ color: gano ? "var(--verde)" : "var(--rojo)" }}>
          {gano ? "¡GANÓ EL CHAT!" : "GANÓ EL PROFE"}
        </div>
        <div className={"display leading-tight my-3 px-2 " + (gano ? "a-brillo" : "")}
             style={{
               color: "var(--tiza)",
               overflowWrap: "anywhere",
               fontSize: largo <= 10 ? 46 : largo <= 16 ? 38 : largo <= 22 ? 31 : 25
             }}>
          {st.palabra.toUpperCase()}
        </div>
        {gano ? (
          <div className="display text-[24px] truncate" style={{ color: "var(--amarillo)" }}>
            la cerró @{st.cerro}
          </div>
        ) : (
          <div className="display text-[19px]" style={{ color: "var(--tiza-tenue)" }}>
            nadie la sacó
          </div>
        )}
        <div className="tiza-mano text-[40px] leading-tight mt-4 px-2" style={{ color: gano ? "var(--verde)" : "var(--rojo)" }}>
          “{st.frase}”
        </div>
        <div className="text-[13px] mt-4" style={{ color: "var(--tiza-tenue)" }}>— el profe</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   VISTA PÚBLICA (el escenario 9:16)
   ══════════════════════════════════════════════════════════════════ */

function Escenario({ st, onLetra, chroma, guias }) {
  const cat = st.cats[st.ci];
  const errores = VIDAS_MAX - st.vidas;
  const cajaRef = useRef(null);
  const fallo = st.evento && (st.evento.tipo === "fallo" || st.evento.tipo === "fallo-palabra");
  const idFallo = fallo ? st.evento.id : 0;

  // Sacudida por animación directa, no por `key`: con `key` React desmontaba
  // y reconstruía el tablero entero en cada error (y otra vez al apagarse).
  useEffect(() => {
    if (!idFallo) return;
    const el = cajaRef.current;
    if (!el || !el.animate) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-14px)" }, { transform: "translateX(13px)" },
       { transform: "translateX(-9px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }],
      { duration: 480, easing: "ease" }
    );
  }, [idFallo]);

  return (
    <div className={"relative overflow-hidden " + (chroma ? "chroma-" + chroma : "pizarron")}
         style={{ width: 540, height: 960 }}>
      <div ref={cajaRef} className="h-full">

        {/* ZONA SEGURA — todo lo importante vive aquí arriba */}
        <div className="flex flex-col" style={{ height: ZONA_SEGURA }}>

          {/* Encabezado */}
          <div className="flex items-center justify-between gap-2 px-3 pt-2.5">
            <div className="text-[12px] tracking-[.24em]" style={{ color: "var(--tiza-tenue)" }}>
              AHORCADO DEL ING
            </div>
            <Marcador marcador={st.marcador} />
          </div>
          <div className="display leading-none px-3 pt-1 pb-1.5 truncate"
               style={{ color: "var(--amarillo)", fontSize: cat.nombre.length > 21 ? 23 : 27 }}>
            {cat.emoji} {cat.nombre}
          </div>
          <div className="mx-3 mb-1" style={{ height: 3, background: "var(--linea)", borderRadius: 99 }} />

          {/* Nota · estudiante · vidas */}
          <div className="flex items-center justify-between px-3" style={{ height: 146 }}>
            <MedidorNota errores={errores} />
            <Estudiante errores={errores} />
            <Vidas vidas={st.vidas} />
          </div>

          {/* Palabra + banner de evento */}
          <div className="relative flex-1 flex items-center justify-center min-h-[108px]">
            <Palabra palabra={st.palabra} acertadas={st.acertadas} mostrarTodo={st.estado === "perdida"} />
            <Banner evento={st.evento} />
          </div>

          {/* Teclado del chat */}
          <div className="pb-2">
            <div className="text-[11px] tracking-[.2em] text-center mb-1.5" style={{ color: "var(--tiza-tenue)" }}>
              LETRAS QUE YA SALIERON
            </div>
            <Teclado acertadas={st.acertadas} falladas={st.falladas} onLetra={onLetra} />
          </div>

          {/* Tabla de líderes */}
          <div className="pb-1.5"><Lideres lideres={st.lideres} /></div>

          {/* Pie de autoría */}
          <div className="flex justify-center pb-2"><Credito /></div>
        </div>

        {/* BANDA INFERIOR — la tapa el chat de TikTok, va el llamado a comentar */}
        <div className="relative flex flex-col items-center justify-start pt-4 px-4" style={{ height: 960 - ZONA_SEGURA }}>
          {guias && (
            <div className="absolute left-0 right-0 top-0 flex items-center gap-2 px-3">
              <div className="flex-1" style={{ height: 2, background: "var(--rojo)" }} />
              <span className="text-[10px] tracking-[.16em]" style={{ color: "var(--rojo)" }}>
                AQUÍ EMPIEZA EL CHAT DE TIKTOK
              </span>
              <div className="flex-1" style={{ height: 2, background: "var(--rojo)" }} />
            </div>
          )}
          <div className="display text-[34px] leading-tight text-center a-subir" style={{ color: "var(--tiza)" }}>
            GRITA TU LETRA
          </div>
          <div className="display text-[22px] leading-tight text-center" style={{ color: "var(--amarillo)" }}>
            👇 UNA LETRA POR COMENTARIO 👇
          </div>
          <div className="tiza-mano text-[30px] mt-2 text-center" style={{ color: "var(--tiza-tenue)" }}>
            si aciertas sumas 10 · si la dices completa, 50
          </div>
        </div>

        {/* Aviso corto del operador (letra repetida, etc.) */}
        {st.aviso && (
          <div key={st.aviso.id} className="a-pop absolute left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 z-20"
               style={{ top: ZONA_SEGURA - 36, background: "var(--pizarron-hondo)", border: "2px solid var(--amarillo)", color: "var(--amarillo)" }}>
            <span className="display text-[16px]">{st.aviso.texto}</span>
          </div>
        )}

        {/* Fin de ronda */}
        {(st.estado === "ganada" || st.estado === "perdida") && <Final st={st} />}
      </div>
    </div>
  );
}
