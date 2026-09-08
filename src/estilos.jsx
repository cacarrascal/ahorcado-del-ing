/* ═══ ESTILOS ═════════════════════════
   Pizarrón, tiza y animaciones. Se inyecta como una sola etiqueta <style>.
   ════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@600;700;800&family=Caveat:wght@700&display=swap');

  /* Todo cuelga de .ahorcado: así el componente no repinta el <body>
     del proyecto que lo hospede. */
  .ahorcado{
    --pizarron:#0F1F19;
    --pizarron-alto:#18332B;
    --pizarron-hondo:#0A1611;
    --tiza:#F2EDDC;
    --tiza-tenue:#9DB3A9;
    --amarillo:#FFD028;
    --verde:#2FD46E;
    --rojo:#FF3B4E;
    --linea:#2C4A3F;
    background:var(--pizarron-hondo);
    color:var(--tiza);
    font-family:'Archivo','Segoe UI',system-ui,sans-serif;
    font-weight:700;
    overflow:hidden;
  }
  .display{font-family:'Archivo Black','Archivo Black Fallback','Segoe UI',system-ui,sans-serif;font-weight:400;letter-spacing:.01em;}
  .tiza-mano{font-family:'Caveat','Segoe Script',cursive;font-weight:700;}
  .num{font-variant-numeric:tabular-nums;}

  /* Textura de pizarrón: polvo de tiza, no un degradado plano */
  .pizarron{
    background:
      radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.07), rgba(255,255,255,0) 60%),
      radial-gradient(90% 60% at 15% 85%, rgba(255,255,255,.05), rgba(255,255,255,0) 70%),
      var(--pizarron);
  }
  /* Dos llaves: el verde que pediste, y magenta por si el verde de la interfaz
     (vidas, nota, aciertos) se recorta junto con el fondo en OBS. */
  .chroma-verde{background:#00B140 !important;}
  .chroma-magenta{background:#FF00FF !important;}

  .marco{border:3px solid var(--linea);}
  .panel{background:var(--pizarron-alto);border:3px solid var(--linea);}

  /* ---- animaciones del show ---- */
  @keyframes pop{0%{transform:scale(.3);opacity:0}55%{transform:scale(1.18);opacity:1}100%{transform:scale(1);opacity:1}}
  @keyframes revelar{0%{transform:rotateX(90deg) scale(.4);opacity:0}55%{transform:rotateX(0) scale(1.35)}100%{transform:rotateX(0) scale(1);opacity:1}}
  @keyframes sacudir{0%,100%{transform:translateX(0)}15%{transform:translateX(-14px)}30%{transform:translateX(13px)}45%{transform:translateX(-9px)}60%{transform:translateX(8px)}80%{transform:translateX(-4px)}}
  @keyframes banner{0%{transform:translateY(26px) scale(.7);opacity:0}12%{transform:translateY(0) scale(1.12);opacity:1}20%{transform:scale(1)}86%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.94)}}
  @keyframes latido{0%,100%{transform:scale(1)}50%{transform:scale(1.28)}}
  @keyframes sello{0%{transform:rotate(-14deg) scale(3.4);opacity:0}55%{transform:rotate(-14deg) scale(.86);opacity:1}100%{transform:rotate(-14deg) scale(1);opacity:1}}
  @keyframes caer{0%{transform:translateY(-60px) rotate(0deg);opacity:1}100%{transform:translateY(700px) rotate(680deg);opacity:0}}
  @keyframes brillo{0%,100%{filter:drop-shadow(0 0 0 rgba(47,212,110,0))}50%{filter:drop-shadow(0 0 22px rgba(47,212,110,.95))}}
  @keyframes subir{0%{transform:translateY(18px);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes flash{0%{opacity:.55}100%{opacity:0}}

  .a-pop{animation:pop .34s cubic-bezier(.2,1.5,.4,1) both}
  .a-revelar{animation:revelar .5s cubic-bezier(.2,1.4,.4,1) both}
  .a-sacudir{animation:sacudir .5s ease both}
  .a-banner{animation:banner 3.6s ease-out both}
  .a-latido{animation:latido .45s ease both}
  .a-sello{animation:sello .55s cubic-bezier(.2,1.3,.4,1) both}
  .a-brillo{animation:brillo 1.1s ease-in-out infinite}
  .a-subir{animation:subir .35s ease both}
  .a-flash{animation:flash .45s ease-out both}

  .confeti{position:absolute;top:-40px;border-radius:2px;animation-name:caer;animation-timing-function:linear;animation-fill-mode:both}

  .ahorcado input,.ahorcado select,.ahorcado button{font-family:inherit;font-weight:700}
  .ahorcado input,.ahorcado select{background:var(--pizarron-hondo);border:2px solid var(--linea);color:var(--tiza);border-radius:10px;outline:none}
  .ahorcado input:focus,.ahorcado select:focus,.ahorcado button:focus-visible{border-color:var(--amarillo);box-shadow:0 0 0 3px rgba(255,208,40,.35)}
  .ahorcado input::placeholder{color:#6E877D}
  .btn{border-radius:12px;border:2px solid var(--linea);background:var(--pizarron-alto);color:var(--tiza);padding:10px 12px;text-align:left;line-height:1.15;transition:transform .08s ease,background .12s ease}
  .btn:hover{background:#204036}
  .btn:active{transform:translateY(2px)}
  .btn kbd{display:inline-block;font-family:'Archivo',monospace;font-size:11px;background:var(--pizarron-hondo);border:1px solid var(--linea);border-radius:5px;padding:1px 5px;color:var(--tiza-tenue)}
  .btn-oro{background:var(--amarillo);color:#241B00;border-color:#B8920F}
  .btn-oro:hover{background:#FFDD5C}
  .btn-oro kbd{background:rgba(0,0,0,.18);border-color:rgba(0,0,0,.25);color:#241B00}
  .btn-rojo{border-color:#7A2028;color:#FF8C97}
  .btn-rojo:hover{background:#33161A}

  .scroll::-webkit-scrollbar{width:10px}
  .scroll::-webkit-scrollbar-thumb{background:var(--linea);border-radius:8px}
  .scroll::-webkit-scrollbar-track{background:transparent}

  @media (prefers-reduced-motion: reduce){
    .a-pop,.a-revelar,.a-sacudir,.a-banner,.a-latido,.a-sello,.a-brillo,.a-subir,.a-flash,.confeti{animation-duration:.01ms !important;animation-iteration-count:1 !important}
  }
`;
