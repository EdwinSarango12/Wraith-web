import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API_BASE_URL from "../../config/api";
import EditPlayerModal from "./EditPlayerModal";
import ConfirmDeletePlayerModal from "./ConfirmDeletePlayerModal";
import MagicBento, { BentoCard } from "../principal/MagicBento";

const Table = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("auth-token"));
  const rol = storedUser?.state?.rol;
  const token = storedUser?.state?.token;
  const isAdmin = String(rol || "").toLowerCase() === "administrador";

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const listPlayers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Admin: /administrador/jugadores | Jugador: /jugador/jugadores (pendiente en backend)
      const endpoint = isAdmin ? "/administrador/jugadores" : "/jugador/jugadores";
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers: authHeaders });
      if (!res.ok) {
        console.warn("Listar jugadores:", res.status);
        setPlayers([]);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.jugadores || data?.data || [];
      setPlayers(list);
    } catch (error) {
      console.error("Error al listar jugadores:", error);
      toast.error("No se pudieron cargar los jugadores");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  // PUT /jugador/:id (actualizar datos del jugador)
  const savePlayer = async (form) => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/jugador/${editing._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        let msg = "";
        try { msg = (await res.json())?.msg; } catch { msg = await res.text(); }
        console.error("Error backend:", msg);
        toast.error(msg || "No se pudo actualizar al jugador");
        return;
      }
      setPlayers((prev) => prev.map((p) => (p._id === editing._id ? { ...p, ...form } : p)));
      toast.success("Jugador actualizado");
      setEditing(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error en la petición");
    } finally {
      setSaving(false);
    }
  };

  // DELETE /administrador/banear/:id
  const confirmRemove = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/administrador/banear/${toDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        let msg = "";
        try { msg = (await res.json())?.msg; } catch { msg = await res.text(); }
        console.error("Error backend:", msg);
        toast.error(msg || "No se pudo eliminar al jugador");
        return;
      }
      setPlayers((prev) => prev.filter((p) => p._id !== toDelete._id));
      toast.success("Jugador eliminado del sistema");
      setToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error en la petición");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (token) listPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return <p className="text-neutral-300 mt-6">Debes iniciar sesión para ver esta tabla.</p>;
  }

  if (loading) {
    return (
      <div className="mt-6 rounded-xl border border-white/10 bg-[#111] p-6 text-center text-neutral-400" role="status">
        Cargando jugadores…
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-white/10 bg-[#111] p-6 text-center text-neutral-400" role="alert">
        No existen jugadores registrados.
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <MagicBento className="mt-6">
        <BentoCard className="rounded-2xl border border-white/10 bg-[#111] shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[640px] text-sm text-neutral-200">
          <caption className="sr-only">Lista de jugadores</caption>
          <thead>
            <tr className="bg-[#1a1a1a] text-left text-xs uppercase tracking-wider text-neutral-400">
              <th scope="col" className="px-4 py-3 font-semibold">N°</th>
              <th scope="col" className="px-4 py-3 font-semibold">Jugador</th>
              <th scope="col" className="px-4 py-3 font-semibold">Username</th>
              <th scope="col" className="px-4 py-3 font-semibold">Email</th>
              <th scope="col" className="px-4 py-3 font-semibold">Estado</th>
              {isAdmin && (
                <th scope="col" className="px-4 py-3 font-semibold text-center">Acciones</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {players.map((player, index) => (
              <tr key={player._id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-neutral-500">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-white">
                  {player.nombre} {player.apellido}
                </td>
                <td className="px-4 py-3 text-neutral-300">{player.username}</td>
                <td className="px-4 py-3 text-neutral-400">{player.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${player.status ? "bg-green-500" : "bg-neutral-500"}`} />
                    <span className="text-xs text-neutral-300">{player.status ? "Activo" : "Inactivo"}</span>
                  </span>
                </td>

                {isAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(player)}
                        aria-label={`Editar a ${player.nombre}`}
                        className="inline-grid place-items-center h-9 w-9 rounded-lg text-blue-300 hover:bg-blue-500/15 hover:text-blue-200 transition-colors"
                      >
                        <MdEdit className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setToDelete(player)}
                        aria-label={`Eliminar a ${player.nombre} del sistema`}
                        className="inline-grid place-items-center h-9 w-9 rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
                      >
                        <MdDeleteForever className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </BentoCard>
      </MagicBento>

      <EditPlayerModal
        open={!!editing}
        player={editing}
        saving={saving}
        onCancel={() => setEditing(null)}
        onSave={savePlayer}
      />

      <ConfirmDeletePlayerModal
        open={!!toDelete}
        playerName={toDelete ? `${toDelete.nombre || ""} ${toDelete.apellido || ""}`.trim() : ""}
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmRemove}
      />
    </>
  );
};

export default Table;
