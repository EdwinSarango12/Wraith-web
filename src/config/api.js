const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://tesis-juego.onrender.com/api";

export const ENDPOINTS = {
  auth: {
    loginJugador: "/login",
    loginAdministrador: "/login/administrador",
    registro: "/registro",
    reenviarConfirmacion: "/reenviar-confirmacion",
    google: "/auth/google",
  },
  profile: {
    jugador: "/perfil",
    administrador: "/perfil/administrador",
  },
  users: {
    jugador: "/jugador",
    administrador: "/administrador",
  },
  noticias: {
    publicar: "/administrador/publicar",
    listarJugador: "/jugador/publicaciones",
    listarAdmin: "/administrador/publicaciones",
    /** DELETE — ruta del backend */
    eliminar: (id) => `/administrador/publicaciones/eliminar/${id}`,
    /** Nombres de partes multipart (coinciden con el JSON: titulo + informacion) */
    mpTitulo: import.meta.env.VITE_NOTICIAS_MP_TITULO || "titulo",
    mpInformacion: import.meta.env.VITE_NOTICIAS_MP_INFORMACION || "informacion",
    mpArchivos: import.meta.env.VITE_NOTICIAS_MP_ARCHIVOS || "archivos",
    /**
     * Opcional: VITE_NOTICIAS_JSON_ALIASES=true añade descripcion/mensaje duplicando el texto.
     * VITE_NOTICIAS_JSON_INCLUDE_ADMIN_ID=true añade idAdministrador si el JWT trae id.
     */
  },
};

export default API_BASE_URL;
