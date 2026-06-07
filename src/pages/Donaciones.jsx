import { useState, useEffect } from "react";
import Header from '../components/principal/Header';
import Footer from '../components/principal/Footer';
import storeDonations from "../context/storeDonations";
import ModalPayment from "../components/donaciones/ModalPayment";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShapeGrid from '../components/backgrounds/ShapeGrid';
import Cubes from '../components/backgrounds/Cubes';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRAPI_KEY
);

// Dollar sign pixel pattern for 11×11 Cubes grid
const DOLLAR_COLOR = '#15803d';
const DOLLAR_MAP = {};
[
  [0,5],
  [1,3],[1,4],[1,5],[1,6],[1,7],
  [2,2],[2,5],[2,8],
  [3,2],[3,5],
  [4,2],[4,3],[4,4],[4,5],[4,6],
  [5,4],[5,5],[5,6],[5,7],[5,8],
  [6,5],[6,8],
  [7,5],[7,8],
  [8,2],[8,5],[8,8],
  [9,3],[9,4],[9,5],[9,6],[9,7],
  [10,5]
].forEach(([r, c]) => { DOLLAR_MAP[`${r}-${c}`] = DOLLAR_COLOR; });

const Donaciones = () => {
    const { modal, toggleModal } = storeDonations();
    const [selectedDonation, setSelectedDonation] = useState(null);

    const handleOpenDonationModal = (donacionData) => {
        setSelectedDonation(donacionData);
        toggleModal("payment");
    };

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Roboto:wght@400;500;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    return (
        <Elements stripe={stripePromise}>
            <Header
                style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100, backgroundColor: "#1a1a28" }}
            />

            <style>{`
                .don-root {
                    --line: rgba(255,255,255,0.10);
                    min-height: 100dvh;
                    background: #120F17;
                    font-family: 'Roboto', sans-serif;
                    position: relative;
                    overflow: hidden;
                }
                .don-pixel { font-family: 'Press Start 2P', monospace; letter-spacing: 0.02em; }
                .don-pixel-sm { font-family: 'VT323', monospace; }
                .don-pixel-shadow { color: #f2f2f2; text-shadow: 3px 3px 0 #000, 5px 5px 0 rgba(40,40,40,0.8); }

                .don-grid::before {
                    content: "";
                    position: absolute; inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 40px 40px;
                    mask-image: radial-gradient(ellipse at 50% 25%, black 40%, transparent 82%);
                    pointer-events: none;
                }
                .don-scan::after {
                    content: "";
                    position: absolute; inset: 0;
                    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px);
                    pointer-events: none; z-index: 2;
                }

                .don-panel {
                    background: linear-gradient(180deg, rgba(26,26,26,0.85), rgba(10,10,10,0.85));
                    border: 1px solid var(--line);
                    box-shadow: inset 0 0 40px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.5);
                }

                .don-btn {
                    display: inline-flex; align-items: center; justify-content: center;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.6rem; line-height: 1; text-transform: uppercase;
                    padding: 0.95rem 1.6rem; border-radius: 4px;
                    transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
                    min-height: 48px; cursor: pointer;
                }
                .don-btn-ghost {
                    background: #0d0d0d; color: #cfcfcf;
                    border: 2px solid rgba(255,255,255,0.18);
                    box-shadow: 4px 4px 0 #000;
                }
                .don-btn-ghost:hover {
                    background: #161616; color: #fff;
                    border-color: rgba(255,255,255,0.4);
                    transform: translate(-2px,-2px);
                    box-shadow: 6px 6px 0 #000;
                }
                .don-btn-ghost:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #000; }
                .don-btn:focus-visible { outline: 3px solid #888; outline-offset: 3px; }

                .don-rise { opacity: 0; transform: translateY(18px); animation: donRise .6s ease forwards; }
                @keyframes donRise { to { opacity: 1; transform: translateY(0); } }

                @media (prefers-reduced-motion: reduce) {
                    .don-btn:hover { transform: none; }
                    .don-rise { animation: none; opacity: 1; transform: none; }
                }
            `}</style>

            <div className="don-root text-white">
                {/* ShapeGrid full-page background — z-0, below grid/scan overlays */}
                <div className="absolute inset-0 z-0">
                    <ShapeGrid
                        direction="diagonal"
                        speed={0.3}
                        squareSize={44}
                        borderColor="rgba(255,255,255,0.04)"
                        hoverFillColor="#1c1c1c"
                        shape="square"
                        hoverTrailAmount={4}
                    />
                </div>

                {/* Grid overlay */}
                {/* Scanlines overlay */}
                <div className="don-scan pointer-events-none absolute inset-0 z-[2]" />

                <main className="relative z-10 flex flex-col items-center justify-center min-h-dvh text-white px-6 pt-28 pb-28">
                    <ToastContainer />

                    {/* Title */}
                    <p className="don-pixel-sm text-base md:text-lg tracking-[0.35em] text-slate-400 uppercase mb-3 don-rise" style={{ animationDelay: '0ms' }}>
                        Apoya el Proyecto
                    </p>
                    <h1
                        className="don-pixel don-pixel-shadow text-center leading-relaxed mb-6 text-sm sm:text-base md:text-xl don-rise"
                        style={{ animationDelay: '80ms' }}
                    >
                        AYÚDANOS A CRECER
                    </h1>

                    <p
                        className="text-center max-w-lg mb-14 leading-relaxed text-slate-400 don-rise"
                        style={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.95rem', animationDelay: '160ms' }}
                    >
                        De parte de todo el grupo de desarrollo valoramos el tiempo que tomaste en jugar nuestro juego,
                        por ello agradecemos una recompensa de nuestro esfuerzo...
                    </p>

                    {/* Two-column layout */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-5xl don-rise" style={{ animationDelay: '240ms' }}>

                        {/* Cubes interactive card — 11×11 grid with $ dollar sign in green */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex justify-center items-center" style={{ width: '520px', maxWidth: '100%' }}>
                                <Cubes
                                    gridSize={11}
                                    cubeSize={44}
                                    maxAngle={50}
                                    radius={3}
                                    borderStyle="1px solid rgba(255,255,255,0.07)"
                                    faceColor="#0a0a0a"
                                    rippleColor="#4ade80"
                                    rippleSpeed={1.5}
                                    autoAnimate={true}
                                    rippleOnClick={true}
                                    shadow="0 2px 8px rgba(0,0,0,0.6)"
                                    cellGap={0}
                                    colorMap={DOLLAR_MAP}
                                />
                            </div>
                        </div>

                        {/* Info + button */}
                        <div className="flex flex-col items-stretch gap-5 w-full max-w-sm">
                            <div className="don-panel rounded-xl p-6">
                                <h2 className="don-pixel don-pixel-shadow text-[0.65rem] mb-5">
                                    ¿POR QUÉ DONAR?
                                </h2>
                                <ul className="text-slate-300 space-y-3" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.9rem' }}>
                                    <li className="flex items-start gap-3">
                                        <span className="don-pixel-sm text-lg text-slate-500 mt-0.5 leading-none">▸</span>
                                        Mantener los servidores activos
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="don-pixel-sm text-lg text-slate-500 mt-0.5 leading-none">▸</span>
                                        Financiar nuevas actualizaciones
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="don-pixel-sm text-lg text-slate-500 mt-0.5 leading-none">▸</span>
                                        Apoyar al equipo de desarrollo
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="don-pixel-sm text-lg text-slate-500 mt-0.5 leading-none">▸</span>
                                        Mejorar la experiencia de juego
                                    </li>
                                </ul>
                            </div>

                            <button
                                className="don-btn don-btn-ghost w-full"
                                onClick={() =>
                                    handleOpenDonationModal({
                                        _id: "123",
                                        descripcion: "Apoyo a desarrollo",
                                        monto: 10,
                                    })
                                }
                            >
                                Realizar Donación
                            </button>

                            <p className="don-pixel-sm text-base text-slate-600 text-center tracking-wider">
                                Procesado de forma segura vía Stripe
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            <Footer
                style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, backgroundColor: "#1a1a28", zIndex: 1100 }}
            />

            {modal === "payment" && selectedDonation && (
                <ModalPayment
                    monto={selectedDonation.monto}
                    descripcion={selectedDonation.descripcion}
                />
            )}
        </Elements>
    );
};

export default Donaciones;
