import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { GiCrossedSwords, GiDeathSkull, GiBossKey } from 'react-icons/gi';
import { FaGhost, FaPlay, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import Wraith from '../assets/wraithB.png';
import VideoInicio from '../assets/video1-2-3.mp4';
import Header from '../components/principal/Header';
import Footer from '../components/principal/Footer';
import ScrollPergamino from '../components/principal/ScrollPergamino';
import useAppLink from '../helpers/useAppLink';

export const Home = () => {
  const appLink = useAppLink();
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const characters = [
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

  const features = [
    { icon: GiCrossedSwords, title: 'Arsenal Variado', text: 'Decenas de armas para forjar tu estilo de combate.' },
    { icon: GiDeathSkull, title: 'Enemigos Letales', text: 'Hordas y criaturas que pondrán a prueba tu destreza.' },
    { icon: GiBossKey, title: 'Jefes Épicos', text: 'Batallas memorables contra bosses imponentes.' },
    { icon: FaGhost, title: 'Pixel Art Retro', text: 'Estética 8-bit que evoca los clásicos de antaño.' },
  ];

  const toggleCharacter = (id, index) => {
    if (activeCharacter === id) {
      setActiveCharacter(null);
      setAutoPlay(true);
    } else {
      setActiveCharacter(id);
      setCurrentImageIndex(index);
      setAutoPlay(false);
    }
  };

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % characters.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [autoPlay, characters.length]);

  // Fuentes pixel art (Press Start 2P para titulares, VT323 para etiquetas)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <>
      <Header />

      {/* ===== Estilos del tema (neón retro-futurista) ===== */}
      <style>{`
        /* Paleta: escala de negro / gris (monocroma) */
        .wr-home {
          --ink: #050505;
          --line: rgba(255,255,255,0.10);
          background:
            radial-gradient(1100px 560px at 50% -12%, rgba(60,60,60,0.5), transparent 62%),
            linear-gradient(180deg, #050505 0%, #101010 55%, #050505 100%);
          font-family: 'Press Start 2P', monospace;
        }
        /* Tipografia pixel */
        .wr-pixel { font-family: 'Press Start 2P', monospace; letter-spacing: 0.02em; }
        .wr-pixel-sm { font-family: 'VT323', monospace; }
        /* Cuerpo legible se mantiene sans para accesibilidad */
        .wr-home p.wr-body, .wr-home .wr-body { font-family: 'Roboto', sans-serif; }

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
        /* Texto pixel con sombra dura (profundidad 8-bit) */
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

        /* Pergamino flotante (sin contenedor) */
        .wr-pergamino-float {
          position: relative; z-index: 20;
          filter: drop-shadow(8px 14px 18px rgba(0,0,0,0.65));
        }

        /* Video con bordes desvanecidos (mask radial) */
        .wr-video-fade {
          -webkit-mask-image: radial-gradient(ellipse 68% 64% at 50% 50%, #000 22%, rgba(0,0,0,0.35) 62%, transparent 92%);
          mask-image: radial-gradient(ellipse 68% 64% at 50% 50%, #000 22%, rgba(0,0,0,0.35) 62%, transparent 92%);
        }

        /* ===== Botones negros estilo pixel (rojo solo el de descarga en Header) ===== */
        .wr-btn {
          display: inline-flex; align-items: center; gap: 0.55rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.62rem; line-height: 1; text-transform: uppercase;
          padding: 0.95rem 1.4rem; border-radius: 4px;
          transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
          min-height: 48px;
        }
        .wr-btn-primary {
          background: #141414; color: #f2f2f2;
          border: 2px solid #2b2b2b;
          box-shadow: 4px 4px 0 #000;
        }
        .wr-btn-primary:hover { background: #1c1c1c; border-color: #4a4a4a; transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #000; }
        .wr-btn-primary:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #000; }
        .wr-btn-ghost {
          background: #0d0d0d; color: #cfcfcf;
          border: 2px solid rgba(255,255,255,0.18);
          box-shadow: 4px 4px 0 #000;
        }
        .wr-btn-ghost:hover { background: #161616; color: #fff; border-color: rgba(255,255,255,0.4); transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #000; }
        .wr-btn-ghost:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #000; }
        .wr-btn:focus-visible, .wr-card:focus-visible, .wr-charbtn:focus-visible {
          outline: 3px solid #888; outline-offset: 3px;
        }

        .wr-float { animation: wrFloat 5s ease-in-out infinite; }
        @keyframes wrFloat { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-10px); } }
        .wr-rise { opacity: 0; transform: translateY(18px); animation: wrRise .6s ease forwards; }
        @keyframes wrRise { to { opacity: 1; transform: translateY(0); } }
        .wr-card {
          background: linear-gradient(180deg, rgba(26,26,26,0.88), rgba(10,10,10,0.92));
          border: 1px solid var(--line);
          transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .wr-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.32);
          box-shadow: 0 12px 30px rgba(0,0,0,0.6);
        }
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
        @media (prefers-reduced-motion: reduce) {
          .wr-float, .wr-rise { animation: none; opacity: 1; transform: none; }
          .wr-card:hover, .wr-btn:hover, .wr-btn-primary:hover, .wr-btn-ghost:hover { transform: none; }
          .wr-desc { transition: none; }
        }
      `}</style>

      <main className="wr-home text-white overflow-hidden">
        {/* ===== HERO ===== */}
        <section className="wr-grid relative px-4 pt-10 pb-16 md:pt-14">
          <div className="relative max-w-7xl mx-auto">
            {/* Logo */}
            <img
              src={Wraith}
              alt="Logo de Wraith"
              className="wr-float mx-auto w-52 md:w-64 h-auto mb-8 md:mb-10 drop-shadow-[0_6px_18px_rgba(0,0,0,0.7)]"
            />

            {/* Subtítulo / eslogan */}
            <p className="wr-pixel-sm text-center text-base md:text-lg tracking-[0.35em] text-slate-400 uppercase mb-4">
              Aventura · Pixel  · Acción
            </p>
            <h1 className="wr-pixel wr-pixel-shadow text-center leading-relaxed mb-12 text-base sm:text-xl md:text-2xl">
              FORJA TU LEYENDA<br className="sm:hidden" /> 
            </h1>

            {/* Grid Hero: pergamino (flotante) + video (bordes desvanecidos) */}
            <div className="grid gap-2 lg:gap-0 lg:grid-cols-2 items-center">
              {/* Pergamino sin contenedor, sobrepuesto a la izquierda */}
              <div className="relative z-20 flex items-center justify-center lg:justify-start lg:-mr-16">
                <div className="wr-pergamino-float w-full max-w-md">
                  <ScrollPergamino embedded />
                </div>
              </div>

              {/* Video con bordes desvanecidos */}
              <div className="relative z-10 group">
                <div className="wr-video-fade wr-scanlines relative mx-auto w-full max-w-xl aspect-video overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Tráiler del videojuego Wraith"
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[1200ms]"
                  >
                    <source src={VideoInicio} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>

            {/* CTA principal */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={appLink('/juego')} className="wr-btn wr-btn-primary" aria-label="Jugar Wraith ahora">
                <FaPlay aria-hidden="true" /> Jugar Ahora
              </Link>
              <Link to={appLink('/ambiente')} className="wr-btn wr-btn-ghost" aria-label="Conocer el mundo de Wraith">
                Conoce el Mundo <FaChevronRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="px-4 py-14 md:py-16" aria-label="Características del juego">
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <article
                  key={f.title}
                  className="wr-card wr-rise rounded-xl p-5 md:p-6 text-center"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Icon aria-hidden="true" className="mx-auto mb-4 text-4xl md:text-5xl text-slate-300 drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]" />
                  <h3 className="wr-pixel text-[0.6rem] md:text-[0.7rem] leading-snug text-slate-100 mb-3">{f.title}</h3>
                  <p className="wr-body text-sm text-slate-400 leading-relaxed">{f.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===== PERSONAJES ===== */}
        <section className="px-4 pb-16" aria-label="Personajes de Wraith">
          {/* Título con divisor brillante */}
          <div className="relative max-w-6xl mx-auto mb-12 text-center">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-500/40 to-transparent" />
            <h2 className="wr-pixel wr-pixel-shadow relative inline-block px-6 text-sm md:text-lg" style={{ background: '#070707' }}>
              PERSONAJES
            </h2>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Escenario de imagen */}
            <div className="wr-panel wr-scanlines relative rounded-2xl overflow-hidden min-h-[340px] md:min-h-[440px]">
              {characters.map((c, index) => (
                <img
                  key={c.id}
                  src={c.image}
                  alt={`${c.name}, ${c.role}`}
                  loading="lazy"
                  className={`w-full h-full object-cover absolute inset-0 transition-all duration-700 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ filter: activeCharacter === c.id ? 'grayscale(0%)' : 'grayscale(85%)' }}
                />
              ))}
              {/* nombre del personaje activo en imagen */}
              <div className="absolute bottom-0 left-0 right-0 z-[3] p-5 bg-gradient-to-t from-black/90 to-transparent">
                <p className="wr-pixel wr-pixel-shadow text-sm md:text-base mb-2">
                  {characters[currentImageIndex].name}
                </p>
                <p className="wr-pixel-sm text-base tracking-widest text-slate-300 uppercase">
                  {characters[currentImageIndex].role}
                </p>
              </div>
            </div>

            {/* Lista seleccionable */}
            <div className="wr-panel rounded-2xl p-3 md:p-5 flex flex-col justify-center divide-y divide-slate-500/10">
              {characters.map((c, index) => {
                const open = activeCharacter === c.id;
                return (
                  <div key={c.id} className="py-1">
                    <button
                      type="button"
                      className="wr-charbtn flex items-center justify-between gap-3 px-4 py-4 rounded-md"
                      onClick={() => toggleCharacter(c.id, index)}
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

          {/* CTA Ver más */}
          <div className="mt-14 flex items-center justify-center gap-4 max-w-4xl mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-neutral-500/30" />
            <Link to={appLink('/juego')} className="wr-btn wr-btn-ghost" aria-label="Ver más sobre el juego">
              Ver Más <FaChevronRight aria-hidden="true" />
            </Link>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-neutral-500/30" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
