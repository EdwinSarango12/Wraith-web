import { useEffect } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/principal/Header'
import Footer from '../components/principal/Footer'
import storeProfile from '../context/storeProfile'
import { AdminForumPanel } from '../components/noticias/admin-forum-panel'
import { ShuffleNoticiasTitle } from '../components/noticias/shuffle-noticias-title'

export default function Noticias({ userRole }) {
  const user = storeProfile((s) => s.user)
  const effectiveRole = user?.rol ?? userRole
  const isAdmin = effectiveRole === 'administrador'

  /* Pixel fonts — mismo set que Home/Ambiente */
  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Roboto:wght@400;500;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <>
      <Header />

      <style>{pageStyles}</style>

      <div className="wr-home wr-news-page text-white">
        {/* Decorativos: rejilla + scanlines (igual que Home) */}
        <div className="wr-auth-grid pointer-events-none absolute inset-0 z-[1]" />
        <div className="wr-auth-scan pointer-events-none absolute inset-0 z-[2]" />

        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <ShuffleNoticiasTitle text="NOTICIAS" className="mb-10" />
          <AdminForumPanel isAdmin={isAdmin} />
        </div>
      </div>

      <Footer />
    </>
  )
}

Noticias.propTypes = { userRole: PropTypes.string }
Noticias.defaultProps = { userRole: 'jugador' }

/* Estilos de página — reutiliza tokens wr-* de Home */
const pageStyles = `
  .wr-home {
    --line: rgba(255,255,255,0.10);
    min-height: 100dvh;
    background:
      radial-gradient(1100px 560px at 50% -12%, rgba(60,60,60,0.5), transparent 62%),
      linear-gradient(180deg, #050505 0%, #101010 55%, #050505 100%);
    font-family: 'Roboto', sans-serif;
    position: relative;
    overflow-x: hidden;
    padding-bottom: 3rem;
  }
  .wr-news-page { padding-top: 4rem; }

  .wr-pixel  { font-family: 'Press Start 2P', monospace; letter-spacing: 0.02em; }
  .wr-pixel-sm { font-family: 'VT323', monospace; }

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

  /* ── Forum cards (Reddit layout) ── */
  .wr-forum-card {
    display: flex;
    gap: 0;
    background: linear-gradient(180deg, rgba(22,22,22,0.90), rgba(10,10,10,0.92));
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color .25s ease, box-shadow .25s ease;
  }
  .wr-forum-card:hover {
    border-color: rgba(255,255,255,0.22);
    box-shadow: 0 8px 28px rgba(0,0,0,0.55);
  }

  /* Columna de votos (izquierda — Reddit style) */
  .wr-forum-vote {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    padding: 14px 10px;
    background: rgba(255,255,255,0.025);
    border-right: 1px solid rgba(255,255,255,0.07);
    min-width: 48px;
    flex-shrink: 0;
  }
  .wr-vote-btn {
    background: none; border: none; cursor: pointer; padding: 4px;
    color: #6b6b6b; font-size: 1rem;
    transition: color .15s ease, transform .1s ease;
    line-height: 1;
    min-height: 32px; min-width: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 4px;
  }
  .wr-vote-btn:hover { background: rgba(255,255,255,0.06); color: #f2f2f2; }
  .wr-vote-btn:active { transform: scale(0.9); }
  .wr-vote-btn.up-active { color: #a3a3a3; }
  .wr-vote-btn.down-active { color: #7a7a7a; }
  .wr-vote-score {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.52rem;
    color: #c0c0c0;
    line-height: 1;
    text-align: center;
    min-height: 14px;
  }

  /* Columna de contenido (derecha) */
  .wr-forum-body { flex: 1; padding: 14px 16px; min-width: 0; }

  .wr-forum-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 6px;
  }
  .wr-forum-tag {
    font-family: 'VT323', monospace;
    font-size: 1rem;
    color: #8a8a8a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .wr-forum-time {
    font-family: 'Roboto', sans-serif;
    font-size: 0.72rem;
    color: #5a5a5a;
  }
  .wr-forum-title {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.72rem;
    color: #f2f2f2;
    line-height: 1.6;
    margin-bottom: 10px;
    text-shadow: 2px 2px 0 #000;
  }
  .wr-forum-content {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: #c8c8c8;
    line-height: 1.65;
  }
  .wr-forum-content h2 { font-family: 'Press Start 2P', monospace; font-size: 0.75rem; color: #f2f2f2; margin: 12px 0 6px; }
  .wr-forum-content h3 { font-family: 'VT323', monospace; font-size: 1.3rem; color: #d0d0d0; margin: 10px 0 4px; letter-spacing: 0.05em; }
  .wr-forum-content p  { margin-bottom: 8px; }
  .wr-forum-content blockquote { border-left: 3px solid rgba(255,255,255,0.3); padding-left: 12px; color: #8a8a8a; margin: 8px 0; }
  .wr-forum-content ul { list-style: disc; padding-left: 20px; margin-bottom: 8px; }
  .wr-forum-content a  { color: #b0b0b0; text-decoration: underline; }

  /* Editor (admin) */
  .wr-forum-editor {
    background: rgba(8,8,8,0.88);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    color: #f2f2f2;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    min-height: 140px;
    padding: 12px 14px;
    line-height: 1.65;
    outline: none;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .wr-forum-editor:focus {
    border-color: rgba(255,255,255,0.45);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.07);
  }
  .wr-forum-editor h2 { font-family: 'Press Start 2P', monospace; font-size: 0.75rem; color: #f2f2f2; margin-bottom: 6px; }
  .wr-forum-editor h3 { font-family: 'VT323', monospace; font-size: 1.3rem; color: #d0d0d0; }
  .wr-forum-editor blockquote { border-left: 3px solid rgba(255,255,255,0.3); padding-left: 12px; color: #8a8a8a; }
  .wr-forum-editor ul { list-style: disc; padding-left: 20px; }

  /* Pixel buttons para el foro (heredan de Home) */
  .wr-forum-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.52rem; line-height: 1; text-transform: uppercase;
    padding: 0.65rem 1rem; border-radius: 5px;
    min-height: 38px; cursor: pointer;
    background: #141414; color: #d0d0d0;
    border: 2px solid rgba(255,255,255,0.18); box-shadow: 3px 3px 0 #000;
    transition: transform .1s ease, box-shadow .15s ease, border-color .15s ease;
  }
  .wr-forum-btn:hover { background: #1c1c1c; border-color: rgba(255,255,255,0.38); transform: translate(-1px,-1px); box-shadow: 5px 5px 0 #000; }
  .wr-forum-btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #000; }
  .wr-forum-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .wr-forum-btn-danger {
    background: rgba(40,5,5,0.85); color: #fca5a5;
    border: 2px solid rgba(220,38,38,0.45); box-shadow: 3px 3px 0 #000;
  }
  .wr-forum-btn-danger:hover { background: rgba(60,10,10,0.90); border-color: rgba(220,38,38,0.7); transform: translate(-1px,-1px); box-shadow: 5px 5px 0 #000; }

  /* Panel del editor (admin) */
  .wr-forum-compose {
    background: linear-gradient(180deg, rgba(22,22,22,0.90), rgba(10,10,10,0.92));
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 18px;
    margin-bottom: 28px;
  }

  /* Emoji row */
  .wr-emoji-btn {
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 1.15rem;
    cursor: pointer;
    background: none;
    transition: background .15s ease, border-color .15s ease;
  }
  .wr-emoji-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.20); }

  /* Adjunto draft */
  .wr-attach-chip {
    display: flex; align-items: center; gap: 6px;
    background: rgba(15,15,15,0.90);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 0.72rem;
    color: #9a9a9a;
  }

  /* Loading / empty */
  .wr-forum-empty {
    border: 1px dashed rgba(255,255,255,0.14);
    border-radius: 12px;
    background: rgba(14,14,14,0.80);
    padding: 40px 24px;
    text-align: center;
    color: #6b6b6b;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    line-height: 1.7;
  }

  /* Animación rise */
  .wr-rise { opacity: 0; transform: translateY(16px); animation: wrRise .55s ease forwards; }
  @keyframes wrRise { to { opacity: 1; transform: translateY(0); } }

  /* Modal confirm delete */
  @keyframes forum-modal-in {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .wr-rise, .wr-forum-card, .wr-vote-btn { animation: none; opacity: 1; transform: none; transition: none; }
  }
`
