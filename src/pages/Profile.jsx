import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import storeProfile from '../context/storeProfile'
import { FaUser, FaShieldHalved } from 'react-icons/fa6'
import MagicBento, { BentoCard } from '../components/principal/MagicBento'

const Profile = () => {
    const { user } = storeProfile()

    if (!user) return <p className='text-white text-center'>Cargando perfil...</p>

    return (
        <div className="max-w-6xl mx-auto">
            {/* Encabezado */}
            <div className="mb-8">
                <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase mb-2">Tu cuenta</p>
                <h1
                    className="text-white text-base md:text-xl"
                    style={{ fontFamily: "'Press Start 2P', monospace", textShadow: '3px 3px 0 #000' }}
                >
                    PERFIL
                </h1>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-red-800/60 via-white/10 to-transparent" />
                <p className="mt-3 text-sm text-neutral-400">Gestiona tu información, seguridad y avatar.</p>
            </div>

            {/* Contenido — efecto Magic Bento en los cards */}
            <MagicBento>
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
                    {/* Columna izquierda: datos + seguridad */}
                    <div className="space-y-6">
                        <BentoCard className="rounded-2xl border border-white/10 bg-[#111] p-6 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                            <h2 className="flex items-center gap-2 text-white font-bold mb-5">
                                <FaUser className="text-red-500" aria-hidden="true" /> Información de la cuenta
                            </h2>
                            <FormProfile />
                        </BentoCard>

                        <BentoCard className="rounded-2xl border border-white/10 bg-[#111] p-6 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                            <h2 className="flex items-center gap-2 text-white font-bold mb-1">
                                <FaShieldHalved className="text-red-500" aria-hidden="true" /> Seguridad
                            </h2>
                            <p className="text-xs text-neutral-400 mb-4">Cambia tu contraseña periódicamente.</p>
                            <CardPassword />
                        </BentoCard>
                    </div>

                    {/* Columna derecha: tarjeta de perfil */}
                    <div className="lg:sticky lg:top-24">
                        <BentoCard className="rounded-2xl">
                            <CardProfile />
                        </BentoCard>
                    </div>
                </div>
            </MagicBento>
        </div>
    )
}

export default Profile
