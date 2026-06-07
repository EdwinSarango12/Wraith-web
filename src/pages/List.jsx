import Table from "../components/list/Table"
import { useEffect } from 'react';

const List = () => {

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
        <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase mb-2">Comunidad</p>
            <h1 className="text-white text-base md:text-xl" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: '3px 3px 0 #000' }}>
                JUGADORES
            </h1>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-red-800/60 via-white/10 to-transparent" />
            <Table />
        </div>
    )
}

export default List