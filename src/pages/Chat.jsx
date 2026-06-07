import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import storeProfile from "../context/storeProfile";

function Chat() {
  const { user } = storeProfile();
  const userId = user?._id || "";
  const [usuarios, setUsuarios] = useState([]);
  const [destinatario, setDestinatario] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [notificaciones, setNotificaciones] = useState({});
  const roomRef = useRef("");
  const mensajesRef = useRef(null);
  const socketRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("auth-token"));

  // Conectar socket solo una vez
  useEffect(() => {
    socketRef.current = io("https://wraith-24zv.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket conectado con id:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Error de conexión socket:", error);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Cargar usuarios al inicio
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/usuarios`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedUser.state.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Usuarios recibidos del backend:", data);
        setUsuarios(data);

        const primerDestinatario = data.find((u) => u._id !== userId);
        setDestinatario(primerDestinatario?._id || "");
      })
      .catch((error) => {
        console.error("Error cargando usuarios:", error);
      });
  }, [userId]);

  // Unirse a la sala y cargar mensajes cuando cambie el destinatario
  useEffect(() => {
    if (userId && destinatario) {
      const room = getRoomName(userId, destinatario);
      roomRef.current = room;
      socketRef.current.emit("joinRoom", room);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/mensajes/${userId}/${destinatario}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.state.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setMensajes(data));

      setNotificaciones((prev) => {
        const copy = { ...prev };
        delete copy[destinatario];
        return copy;
      });
    } else {
      setMensajes([]);
      roomRef.current = "";
    }
  }, [userId, destinatario, storedUser.state.token]);

  // Escuchar mensajes entrantes
  useEffect(() => {
    const handler = (nuevoMensaje) => {
      const room = getRoomName(nuevoMensaje.remitenteId, nuevoMensaje.destinatarioId);

      if (room === roomRef.current) {
        setMensajes((prev) => [...prev, nuevoMensaje]);
      } else {
        const senderId = nuevoMensaje.remitenteId;
        if (senderId !== userId) {
          setNotificaciones((prev) => ({
            ...prev,
            [senderId]: (prev[senderId] || 0) + 1,
          }));
        }
      }
    };

    socketRef.current.on("receiveMessage", handler);

    return () => {
      socketRef.current.off("receiveMessage", handler);
    };
  }, [userId]);

  // Mantener scroll al final
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;

    const data = {
      remitenteId: userId,
      destinatarioId: destinatario,
      mensaje,
    };

    socketRef.current.emit("sendMessage", data);
    setMensaje("");
  };

  function getRoomName(u1, u2) {
    return [u1, u2].sort().join("_");
  }

  useEffect(() => {
            const link = document.createElement("link");
            link.href = "https://fonts.googleapis.com/css2?family=Bungee&family=Lato:wght@400;900&family=Roboto:wght@400;700;900&family=Metal+Mania&display=swap";
            link.rel = "stylesheet";
            document.head.appendChild(link);
            return () => {
            document.head.removeChild(link);
        };
        }, []);
  return (
    <>
      {/* Encabezado */}
      <div className="px-4">
        <h1 className="font-black text-3xl sm:text-4xl text-white"style={ {fontFamily: 'Metal Mania, cursive'}}>Chat</h1>
        <hr className="my-4 border-t-2 border-gray-300" />
        <p className="mb-8 text-white"style={inputStyle}>Habla con tus aliados</p>
      </div>

      {/* Contenedor principal */}
      <div className=" flex flex-col items-center justify-center text-white "style={inputStyle}>
      <div className="w-full bg-black p-4  shadow-lg mx-auto h-full mt-4 lg:mt-10">

        {/* Lista de contactos + chat */}
        <div className="flex flex-col gap-4 mb-4 lg:flex-row">

          {/* Lista de contactos */}
          <div className="w-full bg-black p-3  overflow-y-auto max-h-60 lg:max-h-[45vh] lg:w-1/4 dashboard-scroll">
            <h3 className="font-bol text-white mb-2">Contactos</h3>
            {usuarios.length === 0 ? (
              <p className="text-black">No hay contactos</p>
            ) : (
              usuarios
                .filter((u) => u._id !== userId)
                .map((u) => (
                  <div
                    key={u._id}
                    onClick={() => setDestinatario(u._id)}
                    className={`cursor-pointer p-2 rounded mb-2 ${
                      destinatario === u._id
                        ? "bg-red-700 text-white"
                        : "bg-[#1a1a1a] text-white"
                    }`}
                  >
                    {u.nombre}
                    {notificaciones[u._id] > 0 && (
                      <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 ">
                        {notificaciones[u._id]}
                      </span>
                    )}
                  </div>
                ))
            )}
          </div>

          {/* Área de chat */}
          <div className="flex-1 flex flex-col">
            <div
              className="bg-[#1a1a1a] flex-1 p-3 mb-3  overflow-y-auto h-64 lg:h-[70vh]"
              ref={mensajesRef}
            >
              {mensajes.length > 0 ? (
                mensajes.map((m, i) => {
                  const esYo = m.remitenteId.toString() === userId.toString();
                  return (
                    <div
                      key={i}
                      className={`text-sm mb-2 ${
                        esYo ? "text-right text-white" : "text-left text-white"
                      }`}
                    >
                      <strong>{esYo ? "Yo" : "El" }:</strong> {m.mensaje}
                    </div>
                  );
                })
              ) : (
                <p className="text-black text-center">
                  {destinatario
                    ? "No hay mensajes para mostrar."
                    : "Selecciona un contacto para chatear."}
                </p>
              )}
            </div>

            {/* Input + botón */}
            {destinatario && (
              <div className="flex">
                <input
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                  className="flex-1 px-2 py-1  border border-gray-300 focus:outline-none text-white"
                />
                <button
                  onClick={enviarMensaje}
                  className="bg-red-700 text-white px-4 py-1 rounded-r hover:bg-pink-800"
                >
                  Enviar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
</div>
      {/* Footer */}
      <div className="mt-8 border-t-3 border-red-900 pt-4 text-white text-sm flex justify-center px-4 mt-20" style={inputStyle}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <span className="font-medium">Contactos</span>
          <div className="border-l-0 sm:border-l-4 border-red-900 pl-0 sm:pl-4 text-center sm:text-left">
            <p className="font-semibold mb-2">Correo de Asistencia</p>
            <p>asistencia.delta@gmail.com</p>
            <p>asistencia.delta@hotmail.com</p>
          </div>
        </div>
      </div>
    </>
  );
}


const inputStyle = {
  fontFamily: 'monospace'
};

export default Chat;
