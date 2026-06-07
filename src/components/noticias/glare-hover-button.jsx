/**
 * GlareHoverButton — pixel button estilo Home (monocromo oscuro).
 * Reemplaza la variante purple anterior.
 */
export const GlareHoverButton = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ariaLabel,
  title: titleProp,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={titleProp}
      className={`wr-forum-btn ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
