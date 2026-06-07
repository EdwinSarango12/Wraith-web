import { useDonations } from '../context/storeDonations'; 
import ModalPayment from './ModalPayment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRAPI_KEY
);

function DonationTable() {
    const { modal, toggleModal, selectedDonation, setSelectedDonation } = useDonations(); 
    const [donaciones, setDonaciones] = useState([]);

    useEffect(() => {
        const fetchDonaciones = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("auth-token"));
                const url = `${import.meta.env.VITE_BACKEND_URL}/donar`;
                const options = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedUser.state.token}`,
                    },
                };
                const res = await fetch(url, options);
                const data = await res.json();
                setDonaciones(data);
            } catch (error) {
                console.error("Error al obtener donaciones", error);
            }
        };

        fetchDonaciones();
    }, []);

    const handleOpenPayment = (donacion) => {
        setSelectedDonation(donacion); 
        toggleModal("payment"); 
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-black text-white border border-#1a1a1a]">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="px-4 py-2 border-b border-[#434343]">Descripción</th>
                        <th className="px-4 py-2 border-b border-gray-700">Monto</th>
                        <th className="px-4 py-2 border-b border-gray-700">Jugador</th>
                        <th className="px-4 py-2 border-b border-gray-700">Administrador</th>
                        <th className="px-4 py-2 border-b border-gray-700">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {donaciones.length > 0 ? (
                        donaciones.map((donacion) => (
                            <tr key={donacion._id} className="hover:bg-gray-800">
                                <td className="px-4 py-2 border-b border-gray-700">{donacion.descripcion}</td>
                                <td className="px-4 py-2 border-b border-gray-700">${donacion.monto}</td>
                                <td className="px-4 py-2 border-b border-gray-700">{donacion.jugador?.nombre || "Sin asignar"}</td>
                                <td className="px-4 py-2 border-b border-gray-700">{donacion.administrador?.nombre || "Sin asignar"}</td>
                                <td className="px-4 py-2 border-b border-gray-700 flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-green-600 hover:bg-green-800 rounded text-white"
                                        onClick={() => handleOpenPayment(donacion)}
                                    >
                                        Pagar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
                                className="text-center py-4 text-gray-400 border-b border-gray-700"
                            >
                                No hay donaciones registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal de Pago */}
            {modal === "payment" && selectedDonation && (
                <Elements stripe={stripePromise}>
                    <ModalPayment 
                        monto={selectedDonation.monto} 
                        descripcion={selectedDonation.descripcion} 
                    />
                </Elements>
            )}
        </div>
    );
}

export default DonationTable;
