import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

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
        const url = `${import.meta.env.VITE_BACKEND_URL}/donaciones/registro`;
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
        console.log(storedUser); 
        const url = `${import.meta.env.VITE_BACKEND_URL}/jugador/donar`;
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
        }
    },
}));

export default storeDonations;
