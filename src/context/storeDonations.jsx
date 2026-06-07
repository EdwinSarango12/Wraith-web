import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../config/api";

const storeDonations = create((set) => ({
    modal: "",
    selectedDonation: null, 


    toggleModal: (modalType) =>
        set((state) => ({
            modal: state.modal === modalType ? "" : modalType,
        })),
        
    setSelectedDonation: (donacion) => 
        set({ selectedDonation: donacion }),

    registerDonation: async (data) => {
        try {
        const storedUser = JSON.parse(localStorage.getItem("auth-token"));
        const url = `${API_BASE_URL}/donaciones/registro`;
        const options = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser.state.token}`,
            },
        };
        const res = await axios.post(url, data, options);
        set((state) => ({ modal: !state.modal }));
        toast.success(res.data.msg);
        } catch (error) {
        console.error(error);
        toast.error("Error al registrar la donación");
        }
    },

    payDonation: async (data) => {
        try {
        const storedUser = JSON.parse(localStorage.getItem("auth-token"));
        const token = storedUser?.state?.token;
        if (!token) {
            throw new Error("No se encontró token de autenticación");
        }
        const options = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        };
        const endpoint = `${API_BASE_URL}/jugador/donar`;
        const res = await axios.post(endpoint, data, options);
        set({ modal: "" });
        toast.success(res.data.msg || "Donación procesada correctamente");
        return res.data;
        } catch (error) {
        const body = error?.response?.data;
        const backendMessage =
            body?.msg ||
            body?.detail ||
            body?.error ||
            error?.message ||
            "Error al procesar la donación";
        // El 500 con msg genérico casi siempre es fallo en servidor (Stripe secret en Render, etc.)
        console.error(
            "payDonation error (status:",
            error?.response?.status,
            "):",
            typeof body === "object" ? JSON.stringify(body) : body
        );
        toast.error(backendMessage);
        throw error;
        }
    },
}));

export default storeDonations;
