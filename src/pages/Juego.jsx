import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { GiGamepad, GiCompass, GiCrossedSwords, GiTwoCoins, GiBossKey } from 'react-icons/gi';
import { FaPlay, FaDownload } from 'react-icons/fa';
import VideoInicio from '../assets/video1-2-3.mp4';
import ScrollToTopButton from './ScrollToTopButton';
import Header from '../components/principal/Header';
import Footer from '../components/principal/Footer';
import CardSwap, { Card } from '../components/principal/CardSwap';
import TargetCursor from '../components/principal/TargetCursor';
import storeProfile from '../context/storeProfile';

const guideCards = [
  {
    icon: GiGamepad,
    title: 'Controles Básicos',
    text: 'Muévete con W A S D, salta con Espacio y ataca con Click Izquierdo. Habilidades con Click Derecho y corre con Shift.',
    keys: ['W', 'A', 'S', 'D', 'Space', 'Shift'],
  },
  {
    icon: GiCompass,
    title: 'Exploración',
    text: 'Familiarízate con el entorno: conoce el mapa, anticipa la posición de los enemigos y domina los desplazamientos.',
  },
  {
    icon: GiCrossedSwords,
    title: 'Combate',
    text: 'Mejora tu puntería, encadena habilidades y anticipa los movimientos enemigos para reaccionar rápido y preciso.',
  },
  {
    icon: GiTwoCoins,
    title: 'Recompensas',
    text: 'Administra tus recursos: energía, enfriamientos y objetos recogidos para mantener siempre la ventaja táctica.',
  },
  {
    icon: GiBossKey,
    title: 'Bosses',
    text: 'Sé cauteloso. Estudia los patrones, elige bien tus armas y aprovecha cada apertura para derribar a los jefes.',
  },
];

const Juego = () => {
  const navigate = useNavigate();
  const user = storeProfile((state) => state.user);
  const isLoggedIn = !!user;

  const handleClick = () => {
    if (isLoggedIn) {
      const link = document.createElement('a');
      link.href = '/downloads/Wraith-Installer.exe';
      link.download = 'Wraith Installer.exe';
      link.click();
    } else {
      navigate('/login');
    }
  };

  // Fuentes pixel cargadas globalmente en index.css
  useEffect(() => {}, []);

  return (
    <>
      <ScrollToTopButton />
      {/* Cursor de puntería (React Bits) — solo /juego, solo el botón de descarga */}
      <TargetCursor targetSelector=".cursor-target" spinDuration={2} hideDefaultCursor parallaxOn />
      <Header />

      <style>{`
        .jg-root {
          --line: rgba(255,255,255,0.10);
          background:
            radial-gradient(1100px 560px at 50% -12%, rgba(60,60,60,0.5), transparent 62%),
            linear-gradient(180deg, #050505 0%, #101010 55%, #050505 100%);
          font-family: 'Roboto', sans-serif;
        }
        .jg-pixel { font-family: 'Press Start 2P', monospace; letter-spacing: .02em; }
        .jg-pixel-sm { font-family: 'VT323', monospace; }
        .jg-pixel-shadow { color:#f2f2f2; text-shadow: 3px 3px 0 #000, 5px 5px 0 rgba(40,40,40,0.8); }
        .jg-grid::before {
          content:""; position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse at 50% 25%, black 40%, transparent 82%);
          pointer-events:none;
        }
        .jg-panel {
          background: linear-gradient(180deg, rgba(26,26,26,0.85), rgba(10,10,10,0.85));
          border: 1px solid var(--line);
          box-shadow: inset 0 0 40px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.5);
        }
        .jg-video-fade {
          -webkit-mask-image: radial-gradient(ellipse 70% 66% at 50% 50%, #000 24%, rgba(0,0,0,0.35) 62%, transparent 92%);
          mask-image: radial-gradient(ellipse 70% 66% at 50% 50%, #000 24%, rgba(0,0,0,0.35) 62%, transparent 92%);
        }
        .jg-btn {
          display:inline-flex; align-items:center; gap:.55rem;
          font-family:'Press Start 2P', monospace; font-size:.62rem; text-transform:uppercase;
          padding:.95rem 1.5rem; border-radius:4px; min-height:48px;
          transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
        }
        .jg-btn-red {
          background:#7f1d1d; color:#fff; border:2px solid #b91c1c; box-shadow:4px 4px 0 #000;
        }
        .jg-btn-red:hover { background:#991b1b; transform:translate(-2px,-2px); box-shadow:6px 6px 0 #000; }
        .jg-btn-red:active { transform:translate(2px,2px); box-shadow:1px 1px 0 #000; }
        .jg-btn:focus-visible { outline:3px solid #888; outline-offset:3px; }
        .jg-kbd {
          font-family:'VT323', monospace; font-size:1rem; line-height:1;
          padding:4px 8px; border-radius:4px;
          background:#1a1a1a; border:1px solid rgba(255,255,255,0.18);
          color:#e5e5e5; box-shadow:0 2px 0 #000;
        }
        @media (prefers-reduced-motion: reduce) {
          .jg-btn:hover { transform:none; }
        }
      `}</style>

      <main className="jg-root text-white overflow-hidden">
        {/* ===== HERO ===== */}
        <section className="jg-grid relative px-4 pt-12 pb-16">
          <div className="max-w-7xl mx-auto text-center">
            <p className="jg-pixel-sm text-base md:text-lg tracking-[0.35em] text-slate-400 uppercase mb-3">
              Guía del Jugador
            </p>
            <h1 className="jg-pixel jg-pixel-shadow text-base sm:text-xl md:text-2xl leading-relaxed mb-10">
              SUMÉRGETE EN WRAITH
            </h1>

            {/* Video con bordes desvanecidos + botón centrado encima */}
            <div className="relative mx-auto w-full max-w-3xl aspect-video mb-4">
              <div className="jg-video-fade absolute inset-0 overflow-hidden">
                <video autoPlay loop muted playsInline aria-label="Gameplay de Wraith" className="w-full h-full object-cover">
                  <source src={VideoInicio} type="video/mp4" />
                </video>
              </div>
              <button
                onClick={handleClick}
                className="cursor-target jg-btn jg-btn-red absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                aria-label={isLoggedIn ? 'Descargar Wraith' : 'Jugar ahora'}
              >
                {isLoggedIn ? <FaDownload aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
                {isLoggedIn ? 'Descargar Wraith' : 'Jugar Ahora'}
              </button>
            </div>
          </div>
        </section>

        {/* ===== ¿QUÉ ES WRAITH? ===== */}
        <section className="px-4 py-12">
          <div className="max-w-5xl mx-auto jg-panel rounded-2xl p-8 md:p-10">
            <h2 className="jg-pixel jg-pixel-shadow text-sm md:text-lg mb-5">¿QUÉ ES WRAITH?</h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-3xl">
              Wraith es una nueva experiencia de juego con gran variedad de armas, enemigos y jefes.
              Una aventura completa, llena de desafíos y dificultad, envuelta en un efecto pixel art
              que evoca la sensación de los videojuegos antiguos.
            </p>
          </div>
        </section>

        {/* ===== GUÍA (CardSwap) ===== */}
        <section className="px-4 py-14 md:py-20">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            {/* Texto */}
            <div>
              <p className="jg-pixel-sm text-base tracking-[0.3em] text-slate-400 uppercase mb-3">
                Domina el juego
              </p>
              <h2 className="jg-pixel jg-pixel-shadow text-sm md:text-xl leading-relaxed mb-5">
                FUNDAMENTOS DE WRAITH
              </h2>
              <p className="text-slate-300 text-base leading-relaxed max-w-md mb-6">
                Desde los controles básicos hasta los jefes finales. Recorre las tarjetas para aprender
                todo lo que necesitas antes de adentrarte en las ruinas.
              </p>
              <ul className="flex flex-wrap gap-2">
                {guideCards.map((c) => (
                  <li key={c.title} className="jg-pixel-sm text-base text-slate-400 border border-white/10 rounded-full px-3 py-1">
                    {c.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* CardSwap */}
            <div className="relative h-[460px] md:h-[420px]">
              <CardSwap width={420} height={300} cardDistance={56} verticalDistance={64} delay={3800} pauseOnHover skewAmount={5}>
                {guideCards.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Card key={c.title}>
                      <div className="flex flex-col h-full p-6">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                          <Icon aria-hidden="true" className="text-3xl text-slate-200" />
                          <h3 className="jg-pixel text-[0.7rem] md:text-xs text-white">{c.title}</h3>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed flex-1">{c.text}</p>
                        {c.keys && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {c.keys.map((k) => (
                              <span key={k} className="jg-kbd">{k}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </CardSwap>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Juego;
