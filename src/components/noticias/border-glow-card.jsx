/**
 * BorderGlowCard — ahora usa el panel oscuro monocromo del sistema wr-*
 * (sustituye el glow purple anterior para armonizar con Home/Ambiente).
 */
export const BorderGlowCard = ({ children, className = '' }) => (
  <div
    className={`wr-forum-card wr-rise ${className}`}
  >
    {children}
  </div>
)
