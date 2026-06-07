import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL, { ENDPOINTS } from "../config/api";

const getAuthHeaders  = () => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"));
    return {
        headers:{
            "Content-Type":"application/json",
            Authorization :`Bearer ${storedUser.state.token}`
        }
    }
};
const getRolFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.rol?.toLowerCase();
  } catch (error) {
    console.log("Error decodificando token:", error);
    return null;
  }
};

const storeProfile = create((set) => ({
  user: null,

  // Función para actualizar el usuario en el estado
  setUser: (userData) => set({ user: userData }),

  clearUser: () => set({ user: null }),

  profile: async () => {
    try {
      const storedAuth = localStorage.getItem("auth-token");
      if (!storedAuth) throw new Error("No hay token almacenado");

      const parsed = JSON.parse(storedAuth);
      const token = parsed?.state?.token;
      if (!token) throw new Error("No hay token en el objeto almacenado");

      const rol = getRolFromToken(token);
      if (!rol) throw new Error("No hay rol definido en el token");

      const endpoint = rol === "administrador" ? ENDPOINTS.profile.administrador : ENDPOINTS.profile.jugador;
      const url = `${API_BASE_URL}${endpoint}`;

      const respuesta = await axios.get(url, getAuthHeaders(token));

      if (respuesta.data?.rol) {
        respuesta.data.rol = respuesta.data.rol.toLowerCase();
      }
      if (rol === "administrador") {
      respuesta.data.avatarJugador = respuesta.data.avatarAdministrador || null;
      respuesta.data.status = true; 
    }

      set({ user: respuesta.data });
    } catch (error) {
      console.log("Error en profile:", error);
      throw error;
    }
  },

  updateProfile: async (data, id) => {
    try {
      const storedAuthStr = localStorage.getItem("auth-token");
      if (!storedAuthStr) throw new Error("No hay token almacenado");
      
      const storedAuth = JSON.parse(storedAuthStr);
    
      const token = storedAuth?.state?.token;
      if (!token) throw new Error("No hay token en el objeto almacenado");

      const rol = storedAuth?.state?.rol;
      if (!rol) throw new Error("No se pudo determinar el rol del usuario");

      const endpoint = rol === "Administrador" ? "administrador" : "jugador";
      const url = `${API_BASE_URL}/${endpoint}/${id}`;

      const respuesta = await axios.put(url, data, getAuthHeaders(token));
      set({ user: respuesta.data });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Error al actualizar perfil");
    }
  },

  updatePasswordProfile: async (data, id) => {
    try {
      const storedAuthStr = localStorage.getItem("auth-token");
      if (!storedAuthStr) throw new Error("No hay token almacenado");

      const storedAuth = JSON.parse(storedAuthStr);
      const token = storedAuth?.state?.token;
      if (!token) throw new Error("No hay token en el objeto almacenado");

      const rol = storedAuth?.state?.rol;
      if (!rol) throw new Error("No se pudo determinar el rol del usuario");

      const endpoint = rol === "Administrador" ? "administrador" : "jugador";
      const url = `${API_BASE_URL}/${endpoint}/actualizarpassword/${id}`;
      const respuesta = await axios.put(url, data, getAuthHeaders(token));
      toast.success("Contraseña actualizada correctamente");
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  deleteAccount: async (id) => {
    try {
      const storedAuth = localStorage.getItem("auth-token");
      if (!storedAuth) throw new Error("No hay token almacenado");

      const parsed = JSON.parse(storedAuth);
      const token = parsed?.state?.token;
      if (!token) throw new Error("No hay token en el objeto almacenado");

      const url = `${API_BASE_URL}/jugador/eliminar/${id}`;
      const respuesta = await axios.delete(url, getAuthHeaders(token));
      toast.success("Tu cuenta ha sido eliminada correctamente");
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg);
    }
  },

  uploadAvatar: async (file, id) => {
    try {
      const storedAuth = localStorage.getItem("auth-token");
      if (!storedAuth) throw new Error("No hay token almacenado");

      const parsed = JSON.parse(storedAuth);
      const token = parsed?.state?.token;
      if (!token) throw new Error("No hay token en el objeto almacenado");

      // Obtener rol desde el token
      const rol = getRolFromToken(token);

      // Definir endpoint según rol
      const endpoint = rol === "administrador" ? "administrador" : "jugador";

      const url = `${API_BASE_URL}/${endpoint}/imagen/${id}`;

      const formData = new FormData();
      formData.append("imagen", file);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const respuesta = await axios.put(url, formData, config);

      set({ user: respuesta.data });
      toast.success("Imagen actualizada correctamente");
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return respuesta;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Error al subir la imagen");
      throw error;
    }
  },
}));

export default storeProfile;
