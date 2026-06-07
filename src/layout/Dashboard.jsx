import { Link, Outlet, useLocation } from 'react-router'
import storeProfile from '../context/storeProfile'
import Header from '../components/principal/Header'
import Footer from '../components/principal/Footer'

const Dashboard = () => {
    const location = useLocation()
    const urlActual = location.pathname
    
    const{user} = storeProfile()

    function getHDImage(url) {
        if (!url) return url;
        if (url.includes("googleusercontent.com") || url.includes("gstatic.com")) {
            return url.replace(/=s\d+/, "=s1024");
        }
        return url; 
        }


    return (
        <>
        <Header/>
        <div className='md:flex md:min-h-screen'>

            <div className='md:w-1/5 bg-[#111111] px-5 py-4'>
                <img
                src={
                    getHDImage(user?.avatarJugador) ||
                    getHDImage(user?.avatarJugadorIA) ||
                    "src/assets/usuarioSinfoto.jpg"
                }
                alt={`Avatar de ${user?.nombre || "Jugador"}`} 
               style={{ imageRendering: "high-quality" }}
                className="h-50 w-50 rounded-full object-cover mx-auto"/>
                <p className='text-white text-center my-4 text-sm'style={inputStyle}> <span className='bg-green-600 w-3 h-3 inline-block rounded-full'> </span>  ¡Bienvenido!{" "}
                    <span className="uppercase font-semibold text-red-400 ">
                        {user?.nombre}
                    </span></p>
                <p className='text-white text-center my-4 text-sm'style={inputStyle}> Rol:{" "}
                    <span className="uppercase font-semibold text-red-400 ">
                        {user?.rol}
                    </span></p>
                <hr className="mt-5 border-white" />

                <ul className="mt-5 space-y-2" style={inputStyle}>
                    <li>
                        <Link
                            to='/dashboard'
                            className={`block rounded-lg px-4 py-2.5 text-center text-lg transition-colors ${
                                urlActual === '/dashboard'
                                    ? 'bg-red-800 text-white'
                                    : 'text-neutral-200 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            Avatar
                        </Link>
                    </li>

                    <li>
                        <Link
                            to='/dashboard/listar'
                            className={`block rounded-lg px-4 py-2.5 text-center text-lg transition-colors ${
                                urlActual === '/dashboard/listar'
                                    ? 'bg-red-800 text-white'
                                    : 'text-neutral-200 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            Jugadores
                        </Link>
                    </li>
                </ul>

            </div>

            <div className='flex-1 flex flex-col justify-between h-screen bg-[#0a0a0a]'>
                <div className='overflow-y-scroll p-8 dashboard-scroll'>
                    <Outlet />
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}
const inputStyle = {
  fontFamily: 'monospace'
};
export default Dashboard