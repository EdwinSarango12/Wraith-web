import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import API_BASE_URL from '../config/api'
import FaultyTerminal from '../components/backgrounds/FaultyTerminal'

export const Confirm = () => {
  const { token } = useParams()

  const verifyToken = async () => {
    try {
      const url = `${API_BASE_URL}/confirmar/${token}`
      const response = await axios.get(url)
      toast.success(response?.data?.msg)
    } catch (error) {
      toast.error(error?.response?.data?.msg ?? 'No se pudo confirmar tu cuenta')
    }
  }

  useEffect(() => {
    if (!token) return
    verifyToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070d] text-white">
      <div className="absolute inset-0">
        <FaultyTerminal
          scale={2.4}
          gridMul={[2, 1]}
          digitSize={1.3}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.03}
          tint="#b61c1c"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.6}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.68)_100%)]" />

      <ToastContainer theme="dark" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-[1100px] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[760px] rounded-3xl border border-[#35254a] bg-[rgba(9,8,16,0.62)] px-6 py-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-[2px] sm:px-10">
          <span className="mb-4 inline-flex items-center rounded-full border border-[#4f3457] bg-[rgba(59,31,57,0.55)] px-3 py-1 text-xs font-semibold tracking-wide text-white/90">
            CUENTA ACTIVADA
          </span>

          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Felicidades por el registro exitoso
          </h1>

          <p className="mx-auto mt-4 max-w-[46ch] text-sm text-white/75 sm:text-base">
            Tu cuenta fue confirmada correctamente a traves del correo. Ya puedes iniciar sesion.
          </p>

          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              aria-label="Ir a iniciar sesion"
            >
              Ir al login
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Confirm