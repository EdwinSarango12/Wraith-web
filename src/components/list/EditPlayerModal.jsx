import { useEffect, useState } from 'react';
import { FaXmark, FaUserPen } from 'react-icons/fa6';

/**
 * Card para editar un jugador (admin). Cambia nombre / username / email.
 * PUT /administrador/:id
 */
const EditPlayerModal = ({ open, player, saving = false, onCancel, onSave }) => {
  const [form, setForm] = useState({ nombre: '', apellido: '', username: '', email: '' });

  useEffect(() => {
    if (player) {
      setForm({
        nombre: player.nombre || '',
        apellido: player.apellido || '',
        username: player.username || '',
        email: player.email || '',
      });
    }
  }, [player]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && !saving && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, saving, onCancel]);

  if (!open) return null;

  const field = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));
  const inputCls =
    'block w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 text-white placeholder:text-neutral-500 focus:border-red-600 focus:outline-none transition-colors';

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-player-title">
      <button type="button" aria-label="Cancelar" onClick={() => !saving && onCancel()} className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-default" />

      <form onSubmit={submit} className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <button type="button" onClick={() => !saving && onCancel()} aria-label="Cerrar" className="absolute right-4 top-4 text-neutral-400 hover:text-white rounded">
          <FaXmark className="text-lg" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <span className="grid place-items-center h-10 w-10 rounded-full bg-red-950 border border-red-800">
            <FaUserPen className="text-red-400" aria-hidden="true" />
          </span>
          <h2 id="edit-player-title" className="text-white font-bold">Editar jugador</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="ep-nombre" className="mb-1.5 block text-sm font-semibold text-neutral-300">Nombre</label>
            <input id="ep-nombre" type="text" value={form.nombre} onChange={field('nombre')} className={inputCls} required />
          </div>
          <div>
            <label htmlFor="ep-apellido" className="mb-1.5 block text-sm font-semibold text-neutral-300">Apellido</label>
            <input id="ep-apellido" type="text" value={form.apellido} onChange={field('apellido')} className={inputCls} />
          </div>
          <div>
            <label htmlFor="ep-username" className="mb-1.5 block text-sm font-semibold text-neutral-300">Username</label>
            <input id="ep-username" type="text" value={form.username} onChange={field('username')} className={inputCls} />
          </div>
          <div>
            <label htmlFor="ep-email" className="mb-1.5 block text-sm font-semibold text-neutral-300">Email</label>
            <input id="ep-email" type="email" value={form.email} onChange={field('email')} className={inputCls} />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
          <button type="button" onClick={onCancel} disabled={saving} className="flex-1 rounded-lg border border-white/15 bg-[#1a1a1a] py-3 text-sm font-semibold text-neutral-200 hover:bg-[#222] disabled:opacity-50 transition-colors min-h-[44px]">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-red-800 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700 disabled:opacity-60 transition-colors min-h-[44px]">
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlayerModal;
