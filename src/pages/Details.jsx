import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import { ToastContainer } from "react-toastify";

const Details = () => {
const { id } = useParams();
const [player, setPlayer] = useState(null);
const [loading, setLoading] = useState(true);
const { fetchDataBackend } = useFetch();

const listPlayer = async () => {
    try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/detalle/${id}`;
        const storedUser = JSON.parse(localStorage.getItem("auth-token"));
        const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedUser.state.token}`,
    };

    const response = await fetchDataBackend(url, null, "GET", headers);
    console.log("Respuesta del backend:", response);
    setPlayer(response); 
    } catch (error) {
        console.error("Error al cargar jugador:", error);
        setPlayer(null);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bungee&family=Lato:wght@400;900&family=Roboto:wght@400;700;900&family=Metal+Mania&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    listPlayer();

    return () => {
        document.head.removeChild(link);
    };
}, []);


if (loading) {
    return (
        <div className="p-6 text-center text-gray-600 text-lg font-semibold">
            Cargando datos del jugador...
        </div>
    );
}

if (!player) {
    return (
        <div className="p-6 text-center text-red-600 text-lg font-semibold">
            No se encontró información del jugador.
        </div>
    );
}

function getHDImage(url) {
        if (!url) return url;
        if (url.includes("googleusercontent.com") || url.includes("gstatic.com")) {
            return url.replace(/=s\d+/, "=s1024");
        }
        return url; 
        }

 
return (
    <>
    <ToastContainer />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-6">
            <h1 className="font-extrabold text-4xl text-white mb-4"style={ {fontFamily: 'Metal Mania, cursive', fontSize:40}}>Visualizar</h1>
            <hr className="mb-8 border-t-2 border-gray-300" />
            <p className="mb-12 text-lg text-white"style={inputStyle}>
            Este módulo te permite visualizar todos los datos
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start gap-14 bg-black p-8 rounded-lg shadow-lg">
            <div className="flex-1">
                <ul className="list-disc pl-8">
                <li className="text-3xl font-extrabold text-white mb-8" style={ {fontFamily: 'Metal Mania, cursive', fontSize:25}}>
                    Datos del jugador
                </li>
                    <ul className="pl-6 space-y-6 text-xl text-white"style={inputStyle}>
                <li>
                    <span className="font-semibold">Nombre: </span>
                    {player?.nombre || "No disponible"}
                </li>
                <li>
                    <span className="font-semibold">Apellido: </span>
                    {player?.apellido || "No disponible"}
                </li>
                <li>
                    <span className="font-semibold">Correo electrónico: </span>
                    {player?.email || "No disponible"}
                </li>
                <li>
                    <span className="font-semibold">Usuario: </span>
                    {player?.username || "No disponible"}
                </li>
                <li>
                    <span className="font-semibold">Estado: </span>
                    <span
                    className={`text-base font-semibold px-4 py-1 rounded-full ${
                        player.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                    {player.status ? "Activo" : "Inactivo"}
                    </span>
                </li>
                </ul>
            </ul>
        </div>

        <div className="flex-shrink-0 self-center md:self-start">
            <img
                src={
                    getHDImage(player?.avatarJugador) ||
                    getHDImage(player?.avatarJugadorIA) ||
                    "../assets/usuarioSinfoto.jpg"
                }
                alt={`Avatar de ${player?.nombre || "jugador"}`}
                className="h-70 w-70 rounded-full object-cover shadow-xl border-4 border-black"
            />
            </div>
            </div>
        </div>
        </>
    );
};

const inputStyle = {
  fontFamily: 'monospace'
};

export default Details;
