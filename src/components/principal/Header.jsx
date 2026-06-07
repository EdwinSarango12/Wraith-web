import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import logo from '../../assets/w.jpg';
import { NavLink } from "react-router-dom";
import storeProfile from '../../context/storeProfile'
import GooeyNav from './GooeyNav'


export const Header = () => {
  const user = storeProfile(state => state.user);
  const clearUser = storeProfile(state => state.clearUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  

  const isLoggedIn = !!user;
  
  const handleLogin = () => { navigate('/login'); window.location.reload(); };
  const handleRegister = () => { navigate('/register'); window.location.reload(); };
  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("auth-token");
    localStorage.removeItem("chatMessages");
    navigate('/')
    window.location.reload();
  };
  const toggleMenu = () => { setMenuOpen(!menuOpen); };

  // Botones de sesión como GooeyNav (pills curvilíneos + efecto gooey), conservando colores
  const authItems = isLoggedIn
    ? [
        { label: 'Descarga ahora!', onClick: () => navigate('/dashboard/juego') },
        { label: 'Salir', onClick: handleLogout },
      ]
    : [
        { label: 'Iniciar Sesión', onClick: handleLogin },
        { label: 'Registrarse', onClick: handleRegister },
      ];

  // Keyframes para animación fadeIn
  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  // Header encogido + glass al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=Bungee&family=Lato:wght@400;900&family=Press+Start+2P&family=Roboto:wght@400;700;900&family=Metal+Mania&family=VT323&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
  
      return () => {
          document.head.removeChild(link);
      };
  }, []);

  return (
    <>
      <style>{keyframes}</style>
      <style>{`
        /* Reset UL */
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* Header base */
        header {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          background-color: black;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          border: 1px solid transparent;
          border-radius: 0;
          transition: max-width .4s ease, height .4s ease, top .4s ease,
                      background-color .4s ease, border-color .4s ease,
                      border-radius .4s ease, box-shadow .4s ease, padding .4s ease;
        }

        /* Estado encogido + glass al hacer scroll */
        header.scrolled {
          top: 10px;
          max-width: 1080px;
          height: 52px;
          padding: 0 1.5rem;
          background-color: rgba(20,20,20,0.55);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          backdrop-filter: blur(14px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 9999px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        @media (prefers-reduced-motion: reduce) {
          header { transition: none; }
        }

        /* Logo */
        .logo img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        /* Botón hamburguesa móvil */
        .menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          width: 30px;
          height: 24px; /* altura ajustada para que quepan 3 líneas de 3px con espacios */
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          box-sizing: border-box;
          z-index: 20;
        }

        .menu-toggle span {
          display: block;
          position: relative;  /* esto es clave */
          width: 100%;
          height: 3px;
          background-color: #ddd;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .menu-toggle span::before,
        .menu-toggle span::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 3px;
          background-color: #ddd;
          border-radius: 2px;
          transition: all 0.3s ease;
          left: 0;
        }

        .menu-toggle span::before {
          top: -8px; /* 8px arriba de la barra central */
        }

        .menu-toggle span::after {
          top: 8px; /* 8px abajo de la barra central */
        }

        .menu-toggle.open span {
          background-color: transparent;
        }

        .menu-toggle.open span::before {
          transform: rotate(45deg);
          top: 0;
        }

        .menu-toggle.open span::after {
          transform: rotate(-45deg);
          top: 0;
}




        /* Cuando está abierto, animamos la X */
        .menu-toggle.open span {
          background-color: transparent;
        }
        .menu-toggle.open span::before {
          transform: rotate(45deg);
          top: 0;
        }
        .menu-toggle.open span::after {
          transform: rotate(-45deg);
          top: 0;
        }

        /* Menú navegación móvil - oculto por defecto */
        nav.mobile-nav {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background-color: #1a1a1a;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          z-index: 10;
        }

        nav.mobile-nav.open {
          max-height: 300px; /* Ajusta según cantidad de items */
        }

        nav.mobile-nav ul {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem 1.5rem;
        }

        nav.mobile-nav ul li a {
          color: #ddd;
          text-decoration: none;
          font-family: 'VT323', monospace;
          font-size: 1.5rem;
          letter-spacing: 1px;
          transition: color 0.3s ease;
          position: relative;
        }

        nav.mobile-nav ul li a:hover,
        nav.mobile-nav ul li a.active {
          color: #fff;
        }

        /* ===== Efecto skew + translate (split reveal) — SIEMPRE VISIBLE ===== */
        .skew-link {
          position: relative;
          display: inline-flex;
          overflow: hidden;
          line-height: 1.1;
        }
        .skew-link .skew-front,
        .skew-link .skew-back {
          display: inline-block;
          transition: transform 0.5s cubic-bezier(.16,1,.3,1);
        }
        .skew-link .skew-front { color: #d8d8d8; }
        .skew-link .skew-back {
          position: absolute;
          left: 0;
          transform: translateY(110%) skewY(12deg);
          color: #ffffff;
        }
        .skew-link:hover .skew-front {
          transform: translateY(-110%) skewY(12deg);
        }
        .skew-link:hover .skew-back {
          transform: translateY(0) skewY(0);
        }
        .skew-link.active .skew-front { color: #ffffff; }

        /* Desktop styles - a partir de 768px */
        @media(min-width: 768px) {
          header {
            padding: 0 2rem;
          }

          .menu-toggle {
            display: none;
          }

          /* El nav skew se muestra inline (siempre visible) en escritorio */
          nav.mobile-nav {
            position: static;
            max-height: none;
            background: none;
            overflow: visible;
          }
          nav.mobile-nav ul {
            flex-direction: row;
            gap: 2rem;
            padding: 0;
          }
          nav.mobile-nav ul li a {
            font-size: 1.35rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skew-link .skew-front,
          .skew-link .skew-back { transition: none; }
        }

        /* Contenedor de los botones GooeyNav: transparente, integrado al header */
        .buttons {
          position: relative;
          display: flex;
          align-items: center;
        }

        .btn {
          background-color: #2C2B38;
          color: white;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
          font-size: 0.9rem;
        }
        .btn:hover {
          background-color: rgba(138, 43, 226, 0.1);
          color: #8a2be2;
        }
        .btn.logout {
          background-color: #333;
        }
        .btn.logout:hover {
          background-color: #444;
        }

        .btn-red {
          background-color: red;
          color: white;
        }
      `}</style>

      <header className={scrolled ? 'scrolled' : ''}>
        <div className="logo">
          <NavLink to={isLoggedIn ? "/dashboard/home" : "/"} >
                <img src={logo} alt="Logo" className="w-20 h-auto" />
          </NavLink>

        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
        </button>

        {/* Menú navegación con efecto skew (siempre visible en escritorio, dropdown en móvil) */}
        <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
      <ul>
        <li>
          <NavLink
            to={isLoggedIn ? "/dashboard/juego" : "/juego"}
            className={({ isActive }) => 'skew-link' + (isActive ? ' active' : '')}
          >
            <span className="skew-front">Juego</span>
            <span className="skew-back">Juego</span>
          </NavLink>
        </li>

        <li>
        <NavLink
            to={isLoggedIn ? "/dashboard/ambiente" : "/ambiente"}
            className={({ isActive }) => 'skew-link' + (isActive ? ' active' : '')}
          >
            <span className="skew-front">Ambiente</span>
            <span className="skew-back">Ambiente</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to={isLoggedIn ? "/dashboard/noticias" : "/noticias"}
            className={({ isActive }) => 'skew-link' + (isActive ? ' active' : '')}>
            <span className="skew-front">Noticias</span>
            <span className="skew-back">Noticias</span>
          </NavLink>
        </li>

        {isLoggedIn && (
          <li>
            <NavLink
            to={isLoggedIn ? "/dashboard" : "/dashboard"}
            className={({ isActive }) => 'skew-link' + (isActive ? ' active' : '')}
            >
              <span className="skew-front">Perfil</span>
              <span className="skew-back">Perfil</span>
            </NavLink>
          </li>
        )}

        <li>
          <NavLink
            to={isLoggedIn ? "/dashboard/asistencia" : "/asistencia"}
            className={({ isActive }) => 'skew-link' + (isActive ? ' active' : '')}
          >
            <span className="skew-front">Asistencia</span>
            <span className="skew-back">Asistencia</span>
          </NavLink>
        </li>
        {isLoggedIn && (
          <li>
            <NavLink
            to={isLoggedIn ? "/dashboard/donaciones" : "/donaciones"}
            className={({ isActive }) => 'skew-link' + (isActive ? ' active' : '')}
            >
              <span className="skew-front">Donaciones</span>
              <span className="skew-back">Donaciones</span>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>

        {/* Botones de sesión: GooeyNav (pills curvilíneos + efecto gooey) */}
        <div className="buttons">
          <GooeyNav
            key={isLoggedIn ? 'auth-in' : 'auth-out'}
            items={authItems}
            particleCount={14}
            particleDistances={[42, 6]}
            particleR={70}
            animationTime={520}
            timeVariance={220}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            initialActiveIndex={0}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
