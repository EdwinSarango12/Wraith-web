import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight, FaTimes } from 'react-icons/fa';
import Header from '../components/principal/Header';
import Footer from '../components/principal/Footer';
import PixelCard from '../components/backgrounds/PixelCard';

/* ─── Datos ─────────────────────────────────────── */
const ambientes = [
  { id: 1, image: '/images/ambiente1.jpg' },
  { id: 2, image: '/images/ambiente2.jpg' },
];

const personajes = [
  {
    id: 1,
    name: 'TREVOR',
    role: 'Caballero Desalmado',
    description:
      "Tras la muerte de su esposa, Trevor —un veterano retirado del escuadrón de batalla— asesina sin piedad a todo el pueblo buscando al culpable. Cae luego en una profunda depresión y, sin propósito, es reclutado por un nuevo escuadrón de héroes sedientos de justicia. ¡Cuidado con la locura de este hombre: es sumamente letal!",
    image: '/images/Caballero.png',
  },
  {
    id: 2,
    name: 'FLUSH',
    role: 'Arquera Solitaria',
    description:
      'Criada como arquera del reino desde los 5 años y educada con gran firmeza, se vuelve la mejor. Subestimada por sencilla, usa una máscara para ocultar su rostro y pasar desapercibida en el batallón. Su puntería es impresionante: el arco es su especialidad y no duda un segundo en disparar.',
    image: '/images/register3.png',
  },
  {
    id: 3,
    name: 'ROB',
    role: 'Robot Ingeniero',
    description:
      'La unidad más completa de robots cuidadores de humanos, abandonado tras una persecución inesperada de ladrones. Sobrevive en el caos de la naturaleza y aprende del ambiente y la tecnología del lugar. Siempre lo acompaña "Robotín", su pequeño asistente, mientras protege la aldea que lo acogió.',
    image: '/images/robot.png',
  },
];

const escenarios = [
  {
    id: 1,
    name: 'Desierto',
    description:
      'Un árido escenario desértico que desafía a los personajes con su clima extremo y vastas extensiones de arena.',
    image: '/images/desierto.jpg',
  },
  {
    id: 2,
    name: 'Castillo',
    description:
      'Un antiguo castillo lleno de misterios y secretos, escenario ideal para batallas épicas y aventuras oscuras.',
    image: '/images/castillo.jpg',
  },
  {
    id: 3,
    name: 'Pradera',
    description:
      'Una pradera verde y extensa que ofrece un paisaje natural para exploración y encuentros inesperados.',
    image: '/images/pradera.jpg',
  },
];

/* ─── Componente ─────────────────────────────────── */
export const Ambiente = () => {
  const [activeChar, setActiveChar] = useState(null);
  const [currentAmbiente, setCurrentAmbiente] = useState(0); // hero carousel (0-1)
  const [currentCharImg, setCurrentCharImg] = useState(0);   // character viewer (0-2)
  const [autoPlay, setAutoPlay] = useState(true);
  const [modal, setModal] = useState(null);

  /* Tipografías pixel (igual que Home) */
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  /* Carrusel de ambientes — independiente del visor de personajes */
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(
      () => setCurrentAmbiente((p) => (p + 1) % ambientes.length),
      3000
    );
    return () => clearInterval(id);
  }, [autoPlay]);

  const toggleChar = (id, idx) => {
    if (activeChar === id) {
      setActiveChar(null);
      setAutoPlay(true);
    } else {
      setActiveChar(id);
      setCurrentCharImg(idx); // solo afecta el visor de personajes
      setAutoPlay(false);
    }
  };

  /* Cierre modal con Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    if (modal) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  return (
    <>
      <Header />

      {/* ── Estilos (misma paleta y clases que Home) ── */}
      <style>{ambStyles}</style>

      <main className="wr-home text-white overflow-x-hidden">

        {/* ════ HERO — carrusel de ambientes ════ */}
        <section className="wr-grid relative w-full overflow-hidden" style={{ minHeight: '55vh' }} aria-label="Ambientes del mundo de Wraith">
          {ambientes.map((a, i) => (
            <img
              key={a.id}
              src={a.image}
              alt={`Ambiente ${a.id}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className={`wr-amb-heroimg absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === currentAmbiente ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          {/* Velo + scanlines */}
          <div className="wr-amb-heroveil absolute inset-0 pointer-events-none" />
          <div className="wr-auth-scan absolute inset-0 pointer-events-none" />

          {/* Texto hero */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4" style={{ minHeight: '55vh' }}>
            <h1 className="wr-pixel wr-pixel-shadow text-base sm:text-xl md:text-2xl leading-relaxed uppercase mb-5">
              El Mundo de Wraith
            </h1>
            <p className="wr-body text-slate-300 text-sm max-w-lg leading-relaxed">
              Explora los escenarios y conoce a los héroes que habitan este universo 8-bit.
            </p>
          </div>

          {/* Indicadores carrusel */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {ambientes.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentAmbiente(i); setAutoPlay(false); }}
                aria-label={`Ambiente ${i + 1}`}
                className={`wr-amb-dot ${i === currentAmbiente ? 'wr-amb-dot-active' : ''}`}
              />
            ))}
          </div>
        </section>

        {/* ════ PERSONAJES ════ */}
        <section className="px-4 py-14 md:py-20" aria-label="Personajes de Wraith">
          {/* Título con divisor */}
          <div className="relative max-w-6xl mx-auto mb-12 text-center">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-500/40 to-transparent" />
            <h2 className="wr-pixel wr-pixel-shadow relative inline-block px-6 text-sm md:text-lg" style={{ background: '#070707' }}>
              PERSONAJES
            </h2>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Visor de imagen */}
            <div className="wr-panel wr-scanlines relative rounded-2xl overflow-hidden min-h-[340px] md:min-h-[440px]">
              {personajes.map((c, i) => (
                <img
                  key={c.id}
                  src={c.image}
                  alt={`${c.name}, ${c.role}`}
                  loading="lazy"
                  className={`w-full h-full object-cover absolute inset-0 transition-all duration-700 ${i === currentCharImg ? 'opacity-100' : 'opacity-0'}`}
                  style={{ filter: activeChar === c.id ? 'grayscale(0%)' : 'grayscale(85%)' }}
                />
              ))}
              <div className="absolute bottom-0 left-0 right-0 z-[3] p-5 bg-gradient-to-t from-black/90 to-transparent">
                <p className="wr-pixel wr-pixel-shadow text-sm md:text-base mb-2">
                  {personajes[currentCharImg].name}
                </p>
                <p className="wr-pixel-sm text-base tracking-widest text-slate-300 uppercase">
                  {personajes[currentCharImg].role}
                </p>
              </div>
            </div>

            {/* Lista seleccionable */}
            <div className="wr-panel rounded-2xl p-3 md:p-5 flex flex-col justify-center divide-y divide-slate-500/10">
              {personajes.map((c, i) => {
                const open = activeChar === c.id;
                return (
                  <div key={c.id} className="py-1">
                    <button
                      type="button"
                      className="wr-charbtn flex items-center justify-between gap-3 px-4 py-4 rounded-md w-full text-left"
                      onClick={() => toggleChar(c.id, i)}
                      aria-expanded={open}
                      aria-controls={`char-desc-${c.id}`}
                    >
                      <span className="flex flex-col gap-1.5">
                        <span className="wr-pixel text-[0.7rem] md:text-xs text-white">{c.name}</span>
                        <span className="wr-pixel-sm text-base tracking-wider text-slate-400 uppercase">{c.role}</span>
                      </span>
                      <FaChevronDown
                        aria-hidden="true"
                        className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div id={`char-desc-${c.id}`} className={`wr-desc ${open ? 'open' : ''}`}>
                      <div>
                        <p className="wr-body px-4 pt-2 pb-4 text-sm leading-relaxed text-slate-300">{c.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════ ESCENARIOS ════ */}
        <section className="px-4 pb-20" aria-label="Escenarios del juego">
          {/* Título con divisor */}
          <div className="relative max-w-6xl mx-auto mb-12 text-center">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-500/40 to-transparent" />
            <h2 className="wr-pixel wr-pixel-shadow relative inline-block px-6 text-sm md:text-lg" style={{ background: '#070707' }}>
              ESCENARIOS
            </h2>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {escenarios.map((e, i) => (
              <PixelCard
                key={e.id}
                variant="mono"
                className="wr-rise w-full aspect-[3/4] cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Imagen de fondo de la card */}
                <img
                  src={e.image}
                  alt={e.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'grayscale(60%) brightness(0.55)' }}
                />
                {/* Overlay degradado */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                {/* Contenido */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-30">
                  <p className="wr-pixel text-[0.65rem] text-white mb-2 leading-relaxed">{e.name}</p>
                  <p className="wr-body text-slate-300 text-xs leading-relaxed line-clamp-3">{e.description}</p>
                  <button
                    type="button"
                    onClick={() => setModal(e)}
                    aria-label={`Ver detalles de ${e.name}`}
                    className="wr-amb-readmore mt-3 inline-flex items-center gap-1.5"
                  >
                    <span>Ver más</span>
                    <FaChevronRight aria-hidden="true" className="w-2.5 h-2.5" />
                  </button>
                </div>
              </PixelCard>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* ════ MODAL ════ */}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modal.name}
          className="wr-amb-modal-bg"
          onClick={() => setModal(null)}
        >
          <div
            className="wr-auth-panel wr-amb-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="wr-pixel text-[0.75rem] text-white leading-snug">{modal.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Cerrar"
                className="wr-amb-close"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            {/* Imagen */}
            {modal.image && (
              <div className="wr-scanlines relative w-full rounded-xl overflow-hidden mb-5" style={{ maxHeight: 280 }}>
                <img
                  src={modal.image}
                  alt={modal.name}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: 280, filter: 'grayscale(30%) brightness(0.75)' }}
                />
              </div>
            )}

            {/* Descripción */}
            <p className="wr-body text-slate-300 text-sm leading-relaxed mb-6">{modal.description}</p>

            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setModal(null)}
              className="wr-auth-btn wr-auth-btn-ghost w-full"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.62rem',
                minHeight: 48,
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── Estilos: extiende el sistema wr-* de Home ────────────────── */
const ambStyles = `
  /* Fondo y tipografías — igual que Home */
  .wr-home {
    --line: rgba(255,255,255,0.10);
    background:
      radial-gradient(1100px 560px at 50% -12%, rgba(60,60,60,0.5), transparent 62%),
      linear-gradient(180deg, #050505 0%, #101010 55%, #050505 100%);
    font-family: 'Roboto', sans-serif;
  }
  .wr-pixel  { font-family: 'Press Start 2P', monospace; letter-spacing: 0.02em; }
  .wr-pixel-sm { font-family: 'VT323', monospace; }
  .wr-body   { font-family: 'Roboto', sans-serif; }

  .wr-pixel-shadow {
    color: #f2f2f2;
    text-shadow: 3px 3px 0 #000, 5px 5px 0 rgba(40,40,40,0.8);
  }
  .wr-panel {
    background: linear-gradient(180deg, rgba(26,26,26,0.85), rgba(10,10,10,0.85));
    border: 1px solid var(--line);
    box-shadow: inset 0 0 40px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.5);
  }
  .wr-scanlines::after {
    content: "";
    position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px);
    pointer-events: none; z-index: 2;
  }
  .wr-auth-scan {
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px);
  }
  .wr-grid::before {
    content: "";
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse at 50% 25%, black 40%, transparent 82%);
    pointer-events: none;
  }
  .wr-rise { opacity: 0; transform: translateY(18px); animation: wrRise .6s ease forwards; }
  @keyframes wrRise { to { opacity: 1; transform: translateY(0); } }

  .wr-charbtn {
    width: 100%; text-align: left; cursor: pointer;
    border-left: 3px solid transparent;
    transition: background-color .2s ease, border-color .2s ease, color .2s ease;
  }
  .wr-charbtn:hover { background: rgba(255,255,255,0.05); border-left-color: rgba(255,255,255,0.35); }
  .wr-charbtn[aria-expanded="true"] {
    background: rgba(255,255,255,0.09);
    border-left-color: #aaa;
  }
  .wr-desc {
    display: grid; grid-template-rows: 0fr;
    transition: grid-template-rows .4s ease;
  }
  .wr-desc.open { grid-template-rows: 1fr; }
  .wr-desc > div { overflow: hidden; }

  /* Reutilizamos clases de AuthShell para el modal */
  .wr-auth-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.55rem;
    padding: 0.95rem 1.4rem; border-radius: 6px;
    min-height: 50px; cursor: pointer;
    transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
  }
  .wr-auth-btn-ghost {
    background: #0d0d0d; color: #cfcfcf;
    border: 2px solid rgba(255,255,255,0.18); box-shadow: 4px 4px 0 #000;
  }
  .wr-auth-btn-ghost:hover { background: #161616; color: #fff; border-color: rgba(255,255,255,0.4); transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #000; }
  .wr-auth-btn-ghost:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #000; }
  .wr-auth-panel {
    background: linear-gradient(180deg, rgba(26,26,26,0.96), rgba(10,10,10,0.98));
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: inset 0 0 40px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.55);
    backdrop-filter: blur(8px);
  }

  /* ── Específicos de Ambiente ── */

  /* Hero image */
  .wr-amb-heroimg { object-position: center center; }
  .wr-amb-heroveil {
    background:
      linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.20) 45%, rgba(5,5,5,0.80) 100%);
  }

  /* Dots del carrusel */
  .wr-amb-dot {
    width: 8px; height: 8px; border-radius: 9999px;
    background: rgba(255,255,255,0.30); border: none; cursor: pointer;
    transition: background .25s ease, transform .25s ease;
  }
  .wr-amb-dot-active { background: #f2f2f2; transform: scale(1.4); }

  /* Botón "Ver más" de cada escenario */
  .wr-amb-readmore {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.55rem; color: #cfcfcf;
    background: none; border: none; cursor: pointer;
    text-transform: uppercase; letter-spacing: 0.04em;
    transition: color .2s ease;
  }
  .wr-amb-readmore:hover { color: #fff; }

  /* Modal overlay */
  .wr-amb-modal-bg {
    position: fixed; inset: 0; z-index: 1200;
    background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: wrAmbFadeIn .2s ease;
  }
  @keyframes wrAmbFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .wr-amb-modal-box {
    width: 100%; max-width: 600px; border-radius: 16px; padding: 24px;
    animation: wrAmbSlideUp .3s cubic-bezier(.16,.84,.44,1);
  }
  @keyframes wrAmbSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

  /* Botón X del modal */
  .wr-amb-close {
    color: #6b6b6b; background: none; border: none; cursor: pointer; padding: 4px;
    font-size: 1.1rem; transition: color .2s ease; flex-shrink: 0;
  }
  .wr-amb-close:hover { color: #f2f2f2; }

  @media (prefers-reduced-motion: reduce) {
    .wr-rise, .wr-amb-modal-bg, .wr-amb-modal-box, .wr-desc { animation: none; opacity: 1; transform: none; }
    .wr-auth-btn-ghost:hover { transform: none; }
    .wr-desc { transition: none; }
  }
`;

export default Ambiente;
