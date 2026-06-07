import { Link } from 'react-router-dom'
import PixelSnow from '../components/backgrounds/PixelSnow'

export const NotFound = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08080f] text-white">
      <PixelSnow
        color="#b61c1c"
        flakeSize={0.019}
        minFlakeSize={1.25}
        pixelResolution={200}
        speed={1.25}
        depthFade={10}
        farPlane={23}
        brightness={2.9}
        gamma={0.4545}
        density={0.5}
        variant="square"
        direction={125}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.62)_100%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[840px] rounded-3xl border border-[#2a2743] bg-[rgba(7,7,15,0.56)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-[1.5px] sm:p-8">
         
            

          <div className="mx-auto max-w-[580px] text-center">
            

            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Oops, esta pagina no esta disponible
            </h1>

            <p className="mx-auto mt-4 max-w-[48ch] text-sm text-white/70 sm:text-base">
              El enlace puede estar roto o la seccion no existe. Puedes volver al inicio o continuar en el login.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="pointer-events-auto rounded-xl bg-white px-7 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="pointer-events-auto rounded-xl border border-[#3f344f] bg-[rgba(37,28,45,0.72)] px-7 py-3 text-sm font-semibold text-white/85 transition hover:-translate-y-0.5 hover:bg-[rgba(62,42,76,0.82)]"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default NotFound
