import { useRef, useEffect, useState } from 'react';

/**
 * ScrollPergamino
 * Pergamino (scroll) en pixel-art que se "desenrolla" cuando entra en el viewport,
 * revelando el mensaje "¿Qué es Wraith?" con tipografia pixel estilo periodico.
 * Paleta acorde al sitio: negro #111 de fondo, acento purpura #8a2be2, pergamino sepia.
 */
const ScrollPergamino = ({ embedded = false }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  // Carga de fuentes pixel (Press Start 2P para titulares, VT323 para cuerpo periodico)
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Abrir el pergamino cuando entra en pantalla
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setOpen(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={embedded ? 'w-full px-5 overflow-visible' : 'bg-[#111] py-16 px-4 overflow-hidden'}
    >
      <style>{`
        .pergamino-wrap {
          --paper: #e9d8a6;
          --paper-dark: #d8c389;
          --ink: #2b2118;
          --rod: #6b4a2b;
          --rod-light: #8a6238;
          --rod-dark: #4a3119;
          image-rendering: pixelated;
        }

        /* Varilla superior e inferior del rollo (madera en pixel) */
        .pergamino-rod {
          position: relative;
          height: 26px;
          width: 100%;
          background:
            linear-gradient(180deg,
              var(--rod-light) 0 8px,
              var(--rod) 6px 18px,
              var(--rod-dark) 18px 26px);
          box-shadow:
            0 0 0 4px var(--rod-dark),
            6px 6px 0 0 rgba(0,0,0,0.45);
          z-index: 3;
        }
        .pergamino-rod::before,
        .pergamino-rod::after {
          content: "";
          position: absolute;
          top: -5px;
          width: 32px;
          height: 36px;
          background:
            linear-gradient(180deg, var(--rod-light) 0 8px, var(--rod) 8px 26px, var(--rod-dark) 26px 36px);
          box-shadow: 0 0 0 4px var(--rod-dark);
        }
        .pergamino-rod::before { left: -14px; }
        .pergamino-rod::after  { right: -14px; }

        /* Cuerpo del pergamino: se despliega de altura 0 a auto via grid-rows */
        .pergamino-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 1100ms cubic-bezier(.16,1,.3,1);
        }
        .pergamino-body.open { grid-template-rows: 1fr; }
        .pergamino-body > .pergamino-inner { overflow: hidden; }

        .pergamino-paper {
          position: relative;
          background:
            repeating-linear-gradient(0deg,
              transparent 0 30px,
              rgba(43,33,24,0.06) 27px 28px),
            linear-gradient(180deg, var(--paper) 0%, var(--paper-dark) 100%);
          color: var(--ink);
          border-left: 6px solid var(--rod-dark);
          border-right: 6px solid var(--rod-dark);
          padding: 2.5rem 1.75rem;
          box-shadow: inset 0 0 60px rgba(107,74,43,0.35);
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity 700ms ease 350ms, transform 700ms ease 350ms;
        }
        .pergamino-body.open .pergamino-paper {
          opacity: 1;
          transform: translateY(0);
        }
        /* Esquinas quemadas / textura sutil */
        .pergamino-paper::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(120px 60px at 0% 0%, rgba(74,49,25,0.45), transparent 70%),
            radial-gradient(120px 60px at 100% 100%, rgba(74,49,25,0.45), transparent 70%);
          mix-blend-mode: multiply;
        }

        .pergamino-title {
          font-family: 'Press Start 2P', monospace;
          font-size: clamp(0.95rem, 2.6vw, 1.6rem);
          line-height: 1.6;
          text-align: center;
          color:rgb(0, 0, 0);
          text-shadow: 2px 2px 0rgb(0, 0, 0), 4px 4px 0 rgba(0,0,0,0.15);
          margin: 0 auto 0.5rem;
        }
        .pergamino-masthead {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.5rem;
          letter-spacing: 8px;
          text-align: center;
          color: var(--rod-dark);
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }
        .pergamino-rule {
          border: none;
          border-top: 3px double var(--rod-dark);
          margin: 0.75rem auto 1.5rem;
          max-width: 220px;
        }
        .pergamino-text {
          font-family: 'VT323', monospace;
          font-size: clamp(1.15rem, 2.4vw, 1.55rem);
          line-height: 1.35;
          column-gap: 2.5rem;
          text-align: justify;
          hyphens: auto;
        }
        .pergamino-text .dropcap::first-letter {
          font-family: 'Press Start 2P', monospace;
          font-size: 1.6rem;
          float: left;
          line-height: 1;
          padding: 4px 8px 4px 0;
          color: #8a2be2;
        }
        @media (min-width: 768px) {
          .pergamino-text { columns: 2; }
        }
        /* Embebido en columna estrecha: una sola columna y menos relleno */
        .pergamino-embedded .pergamino-text { columns: 1 !important; }
        .pergamino-embedded .pergamino-paper { padding: 1.75rem 1.25rem; }

        @media (prefers-reduced-motion: reduce) {
          .pergamino-body,
          .pergamino-paper { transition: none; }
        }
      `}</style>

      <div className={`pergamino-wrap mx-auto ${embedded ? 'pergamino-embedded max-w-full' : 'max-w-3xl'}`}>
        {/* Varilla superior */}
        <div className="pergamino-rod" />

        {/* Cuerpo desplegable */}
        <div className={`pergamino-body ${open ? 'open' : ''}`}>
          <div className="pergamino-inner">
            <article className="pergamino-paper">
              <p className="pergamino-masthead">~ Crónicas de Wraith · Edición Especial ~</p>
              <h2 className="pergamino-title">¿QUÉ ES WRAITH?</h2>
              <hr className="pergamino-rule" />
              <p className="pergamino-text">
                <span className="dropcap">
                  Wraith es una nueva experiencia de juego: explora una gran variedad de
                  armas, enemigos y jefes. Se garantiza una aventura completa, llena de
                  desafíos y dificultad, envuelta en un efecto pixel art que evoca la
                  sensación de los videojuegos antiguos.
                </span>{' '}
                Cada rincón esconde secretos, criaturas legendarias y batallas que pondrán
                a prueba tu destreza. Adéntrate en el mundo de Wraith y forja tu propia
                leyenda entre las ruinas.
              </p>
            </article>
          </div>
        </div>

        {/* Varilla inferior */}
        <div className="pergamino-rod" />
      </div>
    </section>
  );
};

export default ScrollPergamino;
