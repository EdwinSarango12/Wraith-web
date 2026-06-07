import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { FaChevronDown, FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaEnvelope, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { GiSparkles } from 'react-icons/gi';
import Header from '../components/principal/Header';
import Footer from '../components/principal/Footer';
import WraithLogo from '../assets/wraith.png';
import ScrollToTopButton from './ScrollToTopButton';

const EMAILJS_SERVICE  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const faqs = [
  {
    q: '¿En qué motor fue desarrollado Wraith?',
    a: 'Wraith fue construido sobre Godot 4.5, motor de código abierto multiplataforma. Elegimos Godot por su pipeline 2D nativo, su lenguaje GDScript de curva de aprendizaje baja y su exportación sin royalties.',
  },
  {
    q: '¿Qué tipo de juego es Wraith?',
    a: 'Es un juego de acción y plataformas 2D con estética pixel art retro. El jugador atraviesa ruinas, enfrenta hordas de enemigos y se mide contra jefes épicos, eligiendo entre tres personajes con estilos de combate distintos: Trevor (melee), Flush (arquera) y Rob (soporte tecnológico).',
  },
  {
    q: '¿Qué integraciones técnicas incluye el proyecto?',
    a: 'El ecosistema Wraith integra: autenticación OAuth / JWT con Supabase, pagos y donaciones procesados via Stripe, chat con IA conectado a la API de Claude (Anthropic), sistema de noticias con moderación de contenido, perfiles de usuario con avatar y estadísticas, y descarga del ejecutable del juego protegida por sesión.',
  },
  {
    q: '¿Cómo funciona el multijugador?',
    a: 'El multijugador usa ENet sobre el puerto 7777 en una arquitectura host-authoritative. El host descubre jugadores en la LAN mediante broadcast UDP en el puerto 4243. Los cambios de nivel en sesión multijugador pasan siempre por NetworkManager.change_level() para mantener la sincronía. UPnP gestiona el reenvío de puertos de forma automática.',
  },
  {
    q: '¿Se puede jugar en modo individual?',
    a: 'Sí. El modo singleplayer es el predeterminado (Global.is_multiplayer = false). Toda la experiencia narrativa y de combate está diseñada para un jugador. El multijugador LAN es una capa adicional opcional para partidas cooperativas locales.',
  },
  {
    q: '¿Cómo descargo el juego?',
    a: 'Crea una cuenta o inicia sesión, luego navega a la página /juego y presiona el botón "Descargar Wraith". El archivo se protege con tu sesión activa para que solo jugadores registrados accedan a la descarga.',
  },
];

const socialLinks = [
  { icon: FaGithub,    href: 'https://github.com/MyDeltaStudio',                            label: 'GitHub' },
  { icon: FaLinkedin,  href: 'https://www.linkedin.com/in/edwin-sarango-53a1b1277/',        label: 'LinkedIn' },
  { icon: FaInstagram, href: 'https://www.instagram.com/lost.aeden/',                       label: 'Instagram' },
  { icon: FaYoutube,   href: 'https://www.youtube.com/@MyDeltaStudio',                      label: 'YouTube' },
  { icon: FaFacebook,  href: 'https://www.facebook.com/profile.php?id=61590446619520',      label: 'Facebook' },
  { icon: FaXTwitter,  href: 'https://x.com/MyDeltaStudio',                                label: 'X' },
  { icon: FaEnvelope,  href: 'mailto:my.delta.studio@gmail.com',                            label: 'Email' },
];

const Asistencia = () => {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const [openFaq, setOpenFaq] = useState(0);
  const formRef               = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    if (status === 'sending') return;

    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          from_name:  form.name,
          from_email: form.email,
          message:    form.message,
          to_email:   'my.delta.studio@gmail.com',
        },
        EMAILJS_KEY,
      );
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const toggleFaq = (i) => setOpenFaq((prev) => (prev === i ? null : i));

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <>
      <ScrollToTopButton />
      <Header />

      <style>{`
        .as-root {
          --line: rgba(255,255,255,0.10);
          background:
            radial-gradient(1100px 560px at 50% -10%, rgba(60,60,60,0.45), transparent 62%),
            linear-gradient(180deg, #050505 0%, #101010 55%, #050505 100%);
          font-family: 'Roboto', sans-serif;
        }
        .as-pixel  { font-family: 'Press Start 2P', monospace; letter-spacing: .02em; }
        .as-pixel-sm { font-family: 'VT323', monospace; }
        .as-pixel-shadow { color: #f2f2f2; text-shadow: 3px 3px 0 #000, 5px 5px 0 rgba(40,40,40,0.8); }

        .as-grid::before {
          content: "";
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse at 50% 20%, black 35%, transparent 80%);
          pointer-events: none;
        }
        .as-panel {
          background: linear-gradient(180deg, rgba(26,26,26,0.88), rgba(10,10,10,0.92));
          border: 1px solid var(--line);
          box-shadow: inset 0 0 40px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.5);
        }

        /* Input / Textarea */
        .as-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 6px;
          color: #f2f2f2;
          font-family: 'Roboto', sans-serif;
          font-size: 0.95rem;
          padding: 0.75rem 1rem;
          outline: none;
          transition: border-color .2s ease, background .2s ease;
          min-height: 48px;
        }
        .as-input::placeholder { color: rgba(255,255,255,0.25); }
        .as-input:focus {
          border-color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.07);
        }
        .as-textarea { resize: vertical; min-height: 120px; }

        /* Submit button */
        .as-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.58rem; line-height: 1; text-transform: uppercase;
          padding: 1rem 1.8rem; border-radius: 6px; min-height: 48px;
          transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
          cursor: pointer;
        }
        .as-btn-primary {
          background: #141414; color: #f2f2f2;
          border: 2px solid #2b2b2b; box-shadow: 4px 4px 0 #000;
        }
        .as-btn-primary:hover { background:#1c1c1c; border-color:#4a4a4a; transform:translate(-2px,-2px); box-shadow:6px 6px 0 #000; }
        .as-btn-primary:active { transform:translate(2px,2px); box-shadow:1px 1px 0 #000; }
        .as-btn:focus-visible { outline: 3px solid #888; outline-offset: 3px; }
        .as-btn-success {
          background: #14532d; color: #bbf7d0;
          border: 2px solid #166534; box-shadow: 4px 4px 0 #000;
          cursor: default;
        }
        .as-btn-error {
          background: #7f1d1d; color: #fecaca;
          border: 2px solid #b91c1c; box-shadow: 4px 4px 0 #000;
          cursor: default;
        }
        .as-btn-sending {
          background: #1a1a1a; color: #6b7280;
          border: 2px solid #2b2b2b; box-shadow: 4px 4px 0 #000;
          cursor: wait;
        }

        /* Badge */
        .as-badge {
          display: inline-flex; align-items: center; gap: .4rem;
          background: rgba(20,83,45,0.45);
          border: 1px solid rgba(74,222,128,0.3);
          border-radius: 9999px;
          padding: .3rem .8rem;
          font-size: 0.82rem; color: #4ade80;
        }
        .as-badge-dot {
          width: 7px; height: 7px; border-radius: 9999px; background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: asBlink 2s ease-in-out infinite;
        }
        @keyframes asBlink { 0%,100%{ opacity:1; } 50%{ opacity:.35; } }

        /* Social icon btn */
        .as-social {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #9ca3af;
          transition: background .2s ease, color .2s ease, border-color .2s ease, transform .15s ease;
        }
        .as-social:hover { background: rgba(255,255,255,0.12); color: #f2f2f2; border-color: rgba(255,255,255,0.3); transform: translateY(-2px); }
        .as-social:focus-visible { outline: 3px solid #888; outline-offset: 3px; }

        /* FAQ accordion */
        .as-faq-item {
          background: rgba(20,20,20,0.7);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color .2s ease;
        }
        .as-faq-item:hover { border-color: rgba(255,255,255,0.2); }
        .as-faq-item.open { border-color: rgba(255,255,255,0.22); }
        .as-faq-trigger {
          width: 100%; text-align: left; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1.2rem 1.4rem;
          background: none;
          transition: background .2s ease;
        }
        .as-faq-trigger:hover { background: rgba(255,255,255,0.03); }
        .as-faq-body {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows .35s ease;
        }
        .as-faq-body.open { grid-template-rows: 1fr; }
        .as-faq-body > div { overflow: hidden; }

        /* Rise animation */
        .as-rise { opacity: 0; transform: translateY(18px); animation: asRise .6s ease forwards; }
        @keyframes asRise { to { opacity: 1; transform: translateY(0); } }

        /* Divider title */
        .as-section-label {
          display: inline-flex; align-items: center; gap: .5rem;
          font-family: 'VT323', monospace;
          letter-spacing: .3em; text-transform: uppercase;
          font-size: 1rem; color: #4ade80;
        }

        @media (prefers-reduced-motion: reduce) {
          .as-rise { animation: none; opacity: 1; transform: none; }
          .as-btn:hover { transform: none; }
          .as-social:hover { transform: none; }
          .as-faq-body { transition: none; }
          .as-badge-dot { animation: none; }
        }
      `}</style>

      <main className="as-root text-white overflow-hidden">

        {/* ===== CONTACT SECTION ===== */}
        <section className="as-grid relative px-4 pt-12 pb-20">
          <div className="relative max-w-6xl mx-auto">

            {/* Section label */}
            <p className="as-section-label mb-4 as-rise" style={{ animationDelay: '0ms' }}>
              <GiSparkles aria-hidden="true" />
              Soporte y Contacto
            </p>
            <h1 className="as-pixel as-pixel-shadow text-sm sm:text-lg md:text-xl leading-relaxed mb-12 as-rise" style={{ animationDelay: '60ms' }}>
              ENVÍANOS TU MENSAJE
            </h1>

            <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

              {/* ---- FORM ---- */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="as-rise flex flex-col gap-5"
                style={{ animationDelay: '120ms' }}
                aria-label="Formulario de contacto"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="as-name" className="as-pixel-sm text-base tracking-wider text-slate-400 uppercase">
                    Nombre Completo <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="as-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="as-input"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="as-email" className="as-pixel-sm text-base tracking-wider text-slate-400 uppercase">
                    Correo Electrónico <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="as-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="as-input"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="as-message" className="as-pixel-sm text-base tracking-wider text-slate-400 uppercase">
                    Mensaje <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="as-message"
                    name="message"
                    required
                    className="as-input as-textarea"
                    placeholder="Escribe tu consulta, reporte de error o sugerencia..."
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className={`as-btn self-start ${
                    status === 'success' ? 'as-btn-success'
                    : status === 'error'   ? 'as-btn-error'
                    : status === 'sending' ? 'as-btn-sending'
                    : 'as-btn-primary'
                  }`}
                  disabled={status === 'sending' || status === 'success'}
                >
                  {status === 'sending' && 'Enviando...'}
                  {status === 'success' && '¡Mensaje Enviado!'}
                  {status === 'error'   && 'Error — Intenta de nuevo'}
                  {status === 'idle'    && 'Enviar Mensaje'}
                </button>
              </form>

              {/* ---- INFO CARD ---- */}
              <div
                className="as-panel rounded-2xl p-6 flex flex-col gap-5 as-rise"
                style={{ animationDelay: '200ms' }}
              >
                {/* Status badge */}
                <div className="as-badge self-start">
                  <span className="as-badge-dot" aria-hidden="true" />
                  En desarrollo activo
                </div>

                {/* Logo avatar */}
                <div className="flex items-center gap-4">
                  <img
                    src={WraithLogo}
                    alt="Foto perfil de Equipo Wraith"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                    loading="lazy"
                  />
                  <div>
                    <p className="as-pixel text-[0.6rem] text-white leading-snug">Equipo Wraith</p>
                    <p className="as-pixel-sm text-base tracking-widest text-slate-400 uppercase mt-0.5">Godot · 2D · Pixel Art</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed">
                  Nuestro equipo está disponible para resolver dudas técnicas, reportes de errores
                  y sugerencias. Respondemos en un plazo de 24–48 horas. ¡Gracias por jugar Wraith!
                </p>

                {/* Social links */}
                <div className="flex flex-wrap gap-2 pt-1" role="list" aria-label="Redes sociales">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="as-social"
                      aria-label={label}
                      role="listitem"
                    >
                      <Icon size={18} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="px-4 pb-24" aria-labelledby="faq-heading">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_1fr] gap-12 items-start">

            {/* Left label */}
            <div className="as-rise" style={{ animationDelay: '0ms' }}>
              <p className="as-section-label mb-4">
                <GiSparkles aria-hidden="true" />
                FAQs
              </p>
              <h2
                id="faq-heading"
                className="as-pixel as-pixel-shadow text-sm md:text-xl leading-relaxed"
              >
                ¿Tienes<br />Preguntas?
              </h2>
            </div>

            {/* Right accordion */}
            <div className="flex flex-col gap-3" role="list">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                const num = String(i + 1).padStart(2, '0');
                return (
                  <div
                    key={faq.q}
                    className={`as-faq-item as-rise ${isOpen ? 'open' : ''}`}
                    style={{ animationDelay: `${i * 70}ms` }}
                    role="listitem"
                  >
                    <button
                      type="button"
                      className="as-faq-trigger"
                      onClick={() => toggleFaq(i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-body-${i}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="as-pixel-sm text-lg text-slate-500 shrink-0 leading-none">
                          {num}.
                        </span>
                        <span
                          className="as-pixel text-[0.58rem] md:text-[0.65rem] text-white text-left leading-relaxed"
                        >
                          {faq.q}
                        </span>
                      </span>
                      <FaChevronDown
                        aria-hidden="true"
                        className={`text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        size={14}
                      />
                    </button>

                    <div
                      id={`faq-body-${i}`}
                      className={`as-faq-body ${isOpen ? 'open' : ''}`}
                      role="region"
                      aria-hidden={!isOpen}
                    >
                      <div>
                        <p className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Asistencia;
