import { Link } from 'react-router';
import { Mail, MapPin } from 'lucide-react';
import {
  FaGithub,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
} from 'react-icons/fa6';
import LogoLoop from './LogoLoop';
import Delta from '../../assets/delta.png';
import useAppLink from '../../helpers/useAppLink';

const FOOTER_BG = '#0a0a0a';

const explorar = [
  { label: 'Inicio', to: '/' },
  { label: 'Juego', to: '/juego' },
  { label: 'Ambiente', to: '/ambiente' },
  { label: 'Noticias', to: '/noticias' },
];

const soporte = [
  { label: 'Asistencia', to: '/asistencia' },
  { label: 'Donaciones', to: '/donaciones' },
  { label: 'Descarga ahora', to: '/juego' },
];

const legal = [
  { label: 'Términos', to: '#' },
  { label: 'Privacidad', to: '#' },
  { label: 'Ayúdanos a mejorar', to: '/asistencia' },
];

const socialLogos = [
  { node: <FaGithub size={26} />, href: 'https://github.com/MyDeltaStudio', title: 'GitHub', ariaLabel: 'GitHub' },
  { node: <FaXTwitter size={26} />, href: 'https://x.com/MyDeltaStudio', title: 'X', ariaLabel: 'X / Twitter' },
  { node: <FaYoutube size={26} />, href: 'https://www.youtube.com/@MyDeltaStudio', title: 'YouTube', ariaLabel: 'YouTube' },
  { node: <FaInstagram size={26} />, href: 'https://www.instagram.com/lost.aeden/', title: 'Instagram', ariaLabel: 'Instagram' },
  { node: <FaFacebookF size={26} />, href: 'https://www.facebook.com/profile.php?id=61590446619520', title: 'Facebook', ariaLabel: 'Facebook' },
  { node: <FaLinkedinIn size={26} />, href: 'https://www.linkedin.com/in/edwin-sarango-53a1b1277/', title: 'LinkedIn', ariaLabel: 'LinkedIn' },
];

const team = [
  { name: 'Elkin Díaz', email: 'elkin.diaz@epn.edu.ec' },
  { name: 'Edwin Sarango', email: 'edwin.sarango@epn.edu.ec' },
  { name: 'Santiago Cumbal', email: 'santiago.cumbal@epn.edu.ec' },
];

const FooterColumn = ({ title, links, appLink }) => (
  <nav aria-label={title}>
    <h3 className="wr-foot-title text-white text-sm font-bold tracking-wide mb-4 uppercase">{title}</h3>
    <ul className="flex flex-col gap-3">
      {links.map((l) => (
        <li key={l.label}>
          <Link to={appLink(l.to)} className="wr-foot-link text-sm text-neutral-400 hover:text-white">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const Footer = () => {
  const appLink = useAppLink();
  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/10">
      <style>{`
        .wr-foot-link { position: relative; transition: color .2s ease; width: fit-content; }
        .wr-foot-link::after {
          content: ""; position: absolute; left: 0; bottom: -2px;
          width: 100%; height: 1px; background: currentColor;
          transform: scaleX(0); transform-origin: left;
          transition: transform .25s ease;
        }
        .wr-foot-link:hover::after { transform: scaleX(1); }
        .wr-foot-link:focus-visible { outline: 2px solid #888; outline-offset: 3px; border-radius: 2px; }
        .wr-status-dot {
          width: 9px; height: 9px; border-radius: 9999px; background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.6);
          animation: wrPulse 2s infinite;
        }
        @keyframes wrPulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @media (prefers-reduced-motion: reduce) { .wr-status-dot { animation: none; } }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Bloque principal */}
        <div className="grid gap-10 lg:gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={Delta}
                alt="Logo de Delta Studio"
                className="w-10 h-10"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span className="leading-none">
                <span className="block text-lg font-extrabold tracking-wide" style={{ fontFamily: "'Bungee', cursive" }}>
                  DELTA STUDIO
                </span>
                <span className="block text-xs text-neutral-500 tracking-[0.3em] uppercase mt-1">
                  Game: Wraith
                </span>
              </span>
            </div>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs mb-5">
              Todos los derechos reservados por Delta Studio como marca registrada.
            </p>

            <a
              href="mailto:my.delta.studio@gmail.com"
              className="wr-foot-link inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white mb-2"
            >
              <Mail size={16} aria-hidden="true" /> my.delta.studio@gmail.com
            </a>
            <p className="inline-flex items-center gap-2 text-sm text-neutral-400">
              <MapPin size={16} aria-hidden="true" /> Quito, Ecuador
            </p>

            {/* Estado */}
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="wr-status-dot" aria-hidden="true" />
              <span className="text-xs text-neutral-300">Servidores en línea</span>
            </div>
          </div>

          {/* Columnas de enlaces */}
          <FooterColumn title="Explorar" links={explorar} appLink={appLink} />
          <FooterColumn title="Soporte" links={soporte} appLink={appLink} />
          <FooterColumn title="Legal" links={legal} appLink={appLink} />
        </div>

        {/* Redes sociales — LogoLoop (React Bits) */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-neutral-500 uppercase tracking-[0.25em] mb-4">Síguenos</p>
          <div className="text-neutral-400 hover:text-white transition-colors">
            <LogoLoop
              logos={socialLogos}
              speed={70}
              direction="left"
              logoHeight={26}
              gap={48}
              pauseOnHover
              scaleOnHover
              fadeOut
              fadeOutColor={FOOTER_BG}
              ariaLabel="Redes sociales de Delta Studio"
            />
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Delta Studio. Wraith es una marca registrada de Delta Studio.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {team.map((p) => (
              <a
                key={p.name}
                href={`mailto:${p.email}`}
                className="wr-foot-link text-xs text-neutral-500 hover:text-neutral-200"
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
