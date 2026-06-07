import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { GlareHoverButton } from './glare-hover-button'

export const ConfirmDeleteNoticiaModal = ({
  open,
  tituloPreview,
  loading,
  onCancel,
  onConfirm
}) => {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    const id = requestAnimationFrame(() => {
      panelRef.current?.querySelector('button[aria-label="Cancelar eliminación"]')?.focus()
    })
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      cancelAnimationFrame(id)
    }
  }, [open, onCancel, loading])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      {/* Scrim */}
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="Cerrar"
        disabled={loading}
        onClick={() => { if (!loading) onCancel() }}
      />

      {/* Panel mono dark — igual a los modales de Ambiente */}
      <div
        ref={panelRef}
        className="relative z-[1201] w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-noticia-titulo"
        style={{
          background: 'linear-gradient(180deg, rgba(22,22,22,0.97), rgba(10,10,10,0.99))',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 12px 36px rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          animation: 'forum-modal-in 0.25s cubic-bezier(.16,.84,.44,1)',
        }}
      >
        <h3
          id="confirm-delete-noticia-titulo"
          className="wr-pixel text-[0.75rem] text-[#f2f2f2] leading-relaxed mb-3"
          style={{ fontFamily: "'Press Start 2P', monospace", textShadow: '2px 2px 0 #000' }}
        >
          ¿Eliminar esta noticia?
        </h3>
        <p className="text-sm leading-relaxed text-slate-400" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {tituloPreview ? (
            <>
              Se eliminará del servidor la publicación{' '}
              <span className="font-semibold text-slate-200">«{tituloPreview}»</span>.
              {' '}No podrás recuperarla.
            </>
          ) : (
            <>Esta publicación se borrará del servidor. No podrás recuperarla.</>
          )}
        </p>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <GlareHoverButton
            type="button"
            ariaLabel="Cancelar eliminación"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </GlareHoverButton>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            aria-busy={loading}
            className="wr-forum-btn wr-forum-btn-danger"
          >
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
