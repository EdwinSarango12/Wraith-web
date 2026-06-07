import { useState, useRef } from "react";
import { FaCamera, FaUpload, FaWandMagicSparkles } from "react-icons/fa6";
import storeProfile from "../../context/storeProfile";
import storeAuth from "../../context/storeAuth";
import { generateAvatar, convertBlobToBase64 } from "../../helpers/consultarIA";
import ConfirmDeleteAccountModal from "./ConfirmDeleteAccountModal";

export const CardProfile = () => {
    const { user, uploadAvatar, deleteAccount } = storeProfile();
    const { clearToken } = storeAuth();

    const [showMenu, setShowMenu] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [, setIaImage] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const fileInputRef = useRef(null);

    const toggleMenu = () => setShowMenu((prev) => !prev);
    const handleUploadImageClick = () => fileInputRef.current.click();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await uploadAvatar(file, user._id);
            setShowMenu(false);
        } catch (error) {
            console.error("Error subiendo imagen:", error);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            const response = await deleteAccount(user._id);
            if (response) {
                setTimeout(() => clearToken(), 2000);
            }
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    };

    const handleGenerateIA = async () => {
        const description = window.prompt("Escribe una descripción para generar tu avatar:");
        if (!description) return;

        setGenerating(true);
        try {
            const blob = await generateAvatar(description);
            const base64img = await convertBlobToBase64(blob);
            setIaImage(base64img);

            if (window.confirm("Imagen generada. ¿Quieres usarla como avatar y subirla?")) {
                const res = await fetch(base64img);
                const file = await res.blob();
                const imageFile = new File([file], "avatarIA.png", { type: "image/png" });
                await uploadAvatar(imageFile, user._id);
                setIaImage(null);
                setShowMenu(false);
            }
        } catch (error) {
            console.error("Error generando imagen IA:", error);
            alert("Error al generar la imagen, intenta de nuevo.");
        } finally {
            setGenerating(false);
        }
    };

    function getHDImage(url) {
        if (!url) return url;
        if (url.includes("googleusercontent.com") || url.includes("gstatic.com")) {
            return url.replace(/=s\d+/, "=s1024");
        }
        return url;
    }

    if (!user) return <p className="text-white text-center">Cargando perfil...</p>;

    return (
        <div className="rounded-2xl border border-white/10 bg-[#111] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col items-center">
            {/* Avatar */}
            <div className="relative">
                <img
                    src={
                        getHDImage(user?.avatarJugador) ||
                        getHDImage(user?.avatarJugadorIA) ||
                        "src/assets/usuarioSinfoto.jpg"
                    }
                    alt={`Avatar de ${user?.nombre || "Usuario"}`}
                    className="h-40 w-40 rounded-full object-cover ring-2 ring-white/10"
                />
                <button
                    type="button"
                    onClick={toggleMenu}
                    aria-label="Opciones de imagen de perfil"
                    aria-expanded={showMenu}
                    className="absolute bottom-1 right-1 grid place-items-center h-11 w-11 rounded-full bg-red-800 text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 transition-colors"
                >
                    <FaCamera aria-hidden="true" />
                </button>

                {showMenu && (
                    <div className="absolute bottom-14 right-0 z-50 w-52 rounded-xl border border-white/10 bg-[#1a1a1a] p-2 shadow-xl">
                        <button
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
                            onClick={handleUploadImageClick}
                            disabled={generating}
                        >
                            <FaUpload aria-hidden="true" /> Subir imagen
                        </button>
                        <button
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
                            onClick={handleGenerateIA}
                            disabled={generating}
                        >
                            <FaWandMagicSparkles aria-hidden="true" />
                            {generating ? "Generando…" : "Generar por IA"}
                        </button>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Identidad */}
            <h2 className="mt-6 text-xl font-bold text-white">{user?.nombre} {user?.apellido}</h2>
            <p className="text-sm text-neutral-400">{user?.email}</p>

            {/* Rol + estado */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-800/50 bg-red-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
                    Rol: {user?.rol}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
                    <span className={`h-2 w-2 rounded-full ${user?.status ? "bg-green-500" : "bg-neutral-500"}`} />
                    {user?.status ? "Activo" : "Inactivo"}
                </span>
            </div>

            {/* Zona peligrosa */}
            <div className="mt-8 w-full rounded-xl border border-red-900/40 bg-red-950/10 p-4">
                <p className="text-sm font-semibold text-red-300 mb-1">Zona de peligro</p>
                <p className="text-xs text-neutral-400 mb-3">
                    Eliminar tu cuenta borra todos tus datos de forma permanente.
                </p>
                <button
                    type="button"
                    onClick={() => setShowDelete(true)}
                    className="w-full rounded-lg bg-red-800 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 transition-colors min-h-[44px]"
                >
                    Eliminar cuenta
                </button>
            </div>

            <ConfirmDeleteAccountModal
                open={showDelete}
                loading={deleting}
                onCancel={() => setShowDelete(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default CardProfile;
