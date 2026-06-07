import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PixelSnow from '../backgrounds/PixelSnow';
import Wraith from '../../assets/wraithB.png';

/**
 * AuthShell — contenedor compartido para /login y /register.
 *
 * Garantiza armonía visual y de animaciones entre ambas páginas:
 * misma paleta monocroma que Home, mismo fondo animado (PixelSnow),
 * mismas rejillas/scanlines, mismas tipografías pixel y las mismas
 * curvas/tiempos de entrada. Las páginas solo aportan su formulario.
 *
 * Props:
 *  - title        Título pixel del panel (ej. "Iniciar sesión")
 *  - subtitle     Texto VT323 bajo el título
 *  - children     Formulario / contenido de la página
 *  - sideTitle    Titular grande del panel lateral (hero)
 *  - sideText     Texto descriptivo del panel lateral
 *  - sideImage    Imagen de fondo del panel lateral (tratada en monocromo)
 */
const AuthShell = ({ title, subtitle, children, sideTitle, sideText, sideImage }) => {
  // Tipografías pixel (compartidas con Home → armonía).
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="wr-auth relative min-h-dvh w-full overflow-hidden text-white">
      {/* ===== Sistema de animaciones compartido ===== */}
      <style>{authStyles}</style>

      {/* Fondo animado: nieve de píxeles monocroma (igual en ambas páginas) */}
      <PixelSnow
        color="#ffffff"
        density={0.18}
        speed={0.9}
        brightness={0.55}
        flakeSize={0.012}
        pixelResolution={260}
        className="wr-auth-snow"
      />

      {/* Capas decorativas: rejilla + scanlines (tema retro 8-bit) */}
      <div className="wr-auth-grid pointer-events-none absolute inset-0 z-[1]" />
      <div className="wr-auth-scan pointer-events-none absolute inset-0 z-[2]" />

      {/* ===== Contenido ===== */}
      <div className="relative z-10 grid min-h-dvh grid-cols-1 lg:grid-cols-2">
        {/* Panel lateral (hero) — solo en escritorio */}
        <aside className="relative hidden items-center justify-center overflow-hidden px-10 lg:flex">
          {/* Imagen de fondo (tratada en monocromo para armonizar con el tema) */}
          {sideImage && (
            <>
              <img
                src={sideImage}
                alt=""
                aria-hidden="true"
                className="wr-auth-sideimg absolute inset-0 h-full w-full object-cover"
              />
              <div className="wr-auth-sideveil pointer-events-none absolute inset-0" />
              <div className="wr-auth-scan pointer-events-none absolute inset-0" />
            </>
          )}

          <div className="wr-auth-hero relative z-10 max-w-md text-center">
            <img
              src={Wraith}
              alt="Logo de Wraith"
              className="wr-auth-float mx-auto mb-8 w-52 drop-shadow-[0_6px_18px_rgba(0,0,0,0.7)]"
            />
            <p className="wr-pixel-sm mb-4 text-base uppercase tracking-[0.35em] text-slate-300">
              Aventura · Pixel · Acción
            </p>
            <h2 className="wr-pixel wr-pixel-shadow mb-5 text-base leading-relaxed md:text-xl">
              {sideTitle}
            </h2>
            <p className="wr-body mx-auto max-w-xs text-sm leading-relaxed text-slate-300">
              {sideText}
            </p>
          </div>
        </aside>

        {/* Panel del formulario */}
        <main className="flex items-center justify-center px-4 py-10 sm:px-8">
          <section className="wr-auth-panel wr-auth-enter w-full max-w-[440px] rounded-2xl p-6 sm:p-8">
            {/* Logo compacto (visible en móvil donde no hay panel lateral) */}
            <Link
              to="/"
              className="wr-auth-logo mx-auto mb-6 block w-32 lg:hidden"
              aria-label="Volver al inicio"
            >
              <img src={Wraith} alt="Wraith" className="wr-auth-float mx-auto w-full" />
            </Link>

            <header className="mb-7 text-center">
              <h1 className="wr-pixel wr-pixel-shadow text-lg uppercase sm:text-xl">{title}</h1>
              {subtitle && (
                <p className="wr-pixel-sm mt-3 text-base tracking-widest text-slate-400 uppercase">
                  {subtitle}
                </p>
              )}
            </header>

            {children}
          </section>
        </main>
      </div>
    </div>
  );
};

/* Estilos compartidos: misma paleta y mismo lenguaje de animación que Home. */
const authStyles = `
  .wr-auth {
    --line: rgba(255,255,255,0.10);
    background:
      radial-gradient(1100px 560px at 50% -12%, rgba(60,60,60,0.5), transparent 62%),
      linear-gradient(180deg, #050505 0%, #101010 55%, #050505 100%);
    font-family: 'Roboto', sans-serif;
  }
  .wr-auth-snow { z-index: 0; opacity: 0.7; }

  .wr-pixel { font-family: 'Press Start 2P', monospace; letter-spacing: 0.02em; }
  .wr-pixel-sm { font-family: 'VT323', monospace; }
  .wr-body { font-family: 'Roboto', sans-serif; }

  .wr-pixel-shadow {
    color: #f2f2f2;
    text-shadow: 3px 3px 0 #000, 5px 5px 0 rgba(40,40,40,0.8);
  }

  /* Rejilla 8-bit con desvanecido radial */
  .wr-auth-grid {
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    -webkit-mask-image: radial-gradient(ellipse at 50% 30%, black 35%, transparent 80%);
    mask-image: radial-gradient(ellipse at 50% 30%, black 35%, transparent 80%);
  }
  .wr-auth-scan {
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px);
  }

  /* Panel oscuro tipo cristal (igual a wr-panel de Home) */
  .wr-auth-panel {
    background: linear-gradient(180deg, rgba(26,26,26,0.88), rgba(10,10,10,0.92));
    border: 1px solid var(--line);
    box-shadow: inset 0 0 40px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.55);
    backdrop-filter: blur(6px);
  }

  /* ===== Sistema de animaciones (idéntico en ambas páginas) ===== */
  .wr-auth-float { animation: wrAuthFloat 5s ease-in-out infinite; }
  @keyframes wrAuthFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

  /* Entrada del panel */
  .wr-auth-enter { opacity: 0; transform: translateY(22px) scale(0.985); animation: wrAuthEnter .55s cubic-bezier(.16,.84,.44,1) forwards; }
  @keyframes wrAuthEnter { to { opacity: 1; transform: translateY(0) scale(1); } }

  /* Entrada del hero lateral */
  .wr-auth-hero { opacity: 0; transform: translateX(-18px); animation: wrAuthHero .7s ease forwards .1s; }
  @keyframes wrAuthHero { to { opacity: 1; transform: translateX(0); } }

  /* Imagen lateral: monocromo + zoom lento (Ken Burns) para armonía */
  .wr-auth-sideimg {
    filter: grayscale(80%) contrast(1.05) brightness(0.55);
    transform: scale(1.06);
    animation: wrAuthKen 22s ease-in-out infinite alternate;
  }
  @keyframes wrAuthKen { 0% { transform: scale(1.06); } 100% { transform: scale(1.16) translateY(-2%); } }
  /* Velo oscuro: integra la imagen con el fondo monocromo */
  .wr-auth-sideveil {
    background:
      linear-gradient(180deg, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.25) 45%, rgba(5,5,5,0.85) 100%),
      linear-gradient(90deg, rgba(5,5,5,0.10), rgba(5,5,5,0.65) 100%);
  }

  /* Aparición escalonada de cada campo del formulario */
  .wr-stagger > * { opacity: 0; transform: translateY(14px); animation: wrAuthRise .5s ease forwards; }
  .wr-stagger > *:nth-child(1) { animation-delay: .15s; }
  .wr-stagger > *:nth-child(2) { animation-delay: .22s; }
  .wr-stagger > *:nth-child(3) { animation-delay: .29s; }
  .wr-stagger > *:nth-child(4) { animation-delay: .36s; }
  .wr-stagger > *:nth-child(5) { animation-delay: .43s; }
  .wr-stagger > *:nth-child(6) { animation-delay: .50s; }
  .wr-stagger > *:nth-child(7) { animation-delay: .57s; }
  @keyframes wrAuthRise { to { opacity: 1; transform: translateY(0); } }

  /* ===== Campos ===== */
  .wr-field {
    width: 100%;
    background: rgba(8,8,8,0.85);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    color: #f2f2f2;
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    padding: 12px 14px;
    transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
  }
  .wr-field::placeholder { color: #6b6b6b; }
  .wr-field:focus {
    outline: none;
    border-color: rgba(255,255,255,0.55);
    background: rgba(14,14,14,0.95);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.10);
  }
  .wr-field-error { color: #ff6b6b; font-size: 0.72rem; margin: 4px 0 0 6px; font-family: 'Roboto', sans-serif; }

  .wr-eye {
    position: absolute; top: 50%; right: 12px; transform: translateY(-50%);
    color: #8a8a8a; background: none; border: none; cursor: pointer; padding: 4px;
    transition: color .2s ease;
  }
  .wr-eye:hover { color: #f2f2f2; }

  /* ===== Botones pixel (igual a Home) ===== */
  .wr-auth-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.55rem;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.62rem; line-height: 1; text-transform: uppercase;
    padding: 0.95rem 1.4rem; border-radius: 6px; width: 100%;
    min-height: 50px; cursor: pointer;
    transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
  }
  .wr-auth-btn-primary {
    background: #141414; color: #f2f2f2;
    border: 2px solid #2b2b2b; box-shadow: 4px 4px 0 #000;
  }
  .wr-auth-btn-primary:hover { background: #1c1c1c; border-color: #4a4a4a; transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #000; }
  .wr-auth-btn-primary:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #000; }
  .wr-auth-btn-ghost {
    background: #0d0d0d; color: #cfcfcf;
    border: 2px solid rgba(255,255,255,0.18); box-shadow: 4px 4px 0 #000;
  }
  .wr-auth-btn-ghost:hover { background: #161616; color: #fff; border-color: rgba(255,255,255,0.4); transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #000; }
  .wr-auth-btn-ghost:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #000; }
  .wr-auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: 4px 4px 0 #000; }

  .wr-auth-btn:focus-visible, .wr-field:focus-visible, .wr-auth-link:focus-visible {
    outline: 3px solid #888; outline-offset: 3px;
  }

  /* Separador "O" */
  .wr-auth-sep { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 14px; color: #6b6b6b; }
  .wr-auth-sep hr { border: none; border-top: 1px solid rgba(255,255,255,0.12); }
  .wr-auth-sep span { font-family: 'VT323', monospace; font-size: 1.1rem; }

  .wr-auth-link { color: #cfcfcf; font-family: 'VT323', monospace; font-size: 1.05rem; transition: color .2s ease; }
  .wr-auth-link:hover { color: #fff; }

  /* Spinner de carga */
  .wr-spin { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: wrSpin .7s linear infinite; }
  @keyframes wrSpin { to { transform: rotate(360deg); } }

  @media (prefers-reduced-motion: reduce) {
    .wr-auth-float, .wr-auth-enter, .wr-auth-hero, .wr-stagger > *, .wr-spin { animation: none; opacity: 1; transform: none; }
    .wr-auth-sideimg { animation: none; transform: scale(1.06); }
    .wr-auth-btn:hover, .wr-auth-btn-primary:hover, .wr-auth-btn-ghost:hover { transform: none; }
  }
`;

export default AuthShell;
