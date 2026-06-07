import { useEffect, useRef } from 'react';
import { FaTriangleExclamation, FaXmark } from 'react-icons/fa6';

/**
 * Card de confirmación para eliminar un jugador del sistema (admin).
 */
const ConfirmDeletePlayerModal = ({ open, playerName, loading = false, onCancel, onConfirm }) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && !loading && onCancel();
    document.addEventListener('keydown', onKey);
    confirmRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="del-player-title"
      aria-describedby="del-player-desc"
    >
      <button
        type="button"
        aria-label="Cancelar"
        onClick={() => !loading && onCancel()}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-default"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-red-900/60 bg-[#111] p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-[wrPop_.25s_ease]">
        <style>{`@keyframes wrPop{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        <button
          type="button"
          onClick={() => !loading && onCancel()}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-neutral-400 hover:text-white rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-500"
        >
          <FaXmark className="text-lg" aria-hidden="true" />
        </button>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-950 border border-red-800">
          <FaTriangleExclamation className="text-2xl text-red-500" aria-hidden="true" />
        </div>

        <h2 id="del-player-title" className="text-center text-white text-sm md:text-base mb-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          ELIMINAR JUGADOR
        </h2>
        <p id="del-player-desc" className="text-center text-sm text-neutral-300 leading-relaxed mb-6">
          Vas a eliminar a{' '}
          <strong className="text-red-400">{playerName || 'este jugador'}</strong>{' '}
          del sistema. Esta acción es <strong className="text-red-400">permanente</strong> y no se puede deshacer.
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-white/15 bg-[#1a1a1a] py-3 text-sm font-semibold text-neutral-200 hover:bg-[#222] disabled:opacity-50 transition-colors min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-800 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700 disabled:opacity-60 transition-colors min-h-[44px]"
          >
            {loading ? 'Eliminando…' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePlayerModal;
