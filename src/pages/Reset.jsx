import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import FaultyTerminal from '../components/backgrounds/FaultyTerminal'

const Reset = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const tokenValid = Boolean(token)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasShownEntryToastRef = useRef(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const passwordValue = watch('password', '')

  useEffect(() => {
    if (!token || hasShownEntryToastRef.current) return
    hasShownEntryToastRef.current = true
    toast.success('Token confirmado, ya puedes crear tu nuevo password', {
      toastId: 'reset-token-confirmed'
    })
  }, [token])

  const handleChangePassword = async data => {
    if (data.password !== data.confirmpassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setIsSubmitting(true)

    const payload = {
      password: data.password,
      confirmpassword: data.confirmpassword,
      email: data.email
    }
    const baseUrl = import.meta.env.VITE_BACKEND_URL
    const requestUrl = `${baseUrl}/nuevopassword/${token}`

    let responseData = null
    let requestError = null
    try {
      const response = await axios.post(requestUrl, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
      responseData = response.data
    } catch (error) {
      requestError = error
    }
    setIsSubmitting(false)

    if (!responseData) {
      const statusCode = requestError?.response?.status
      if (statusCode === 404) {
        toast.error('Token invalido o expirado. Solicita nuevamente la recuperacion de contrasena')
      } else {
        toast.error(
          requestError?.response?.data?.msg ??
            'No se pudo actualizar la contrasena. Intenta nuevamente'
        )
      }
      return
    }

    toast.success(responseData?.msg ?? 'Contrasena actualizada correctamente')
    toast.info('Se solicitó el correo de confirmación del cambio de contraseña')
    setTimeout(() => navigate('/login'), 1200)
  }

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
            RECUPERAR CONTRASENA
          </span>

          <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Configura tu nueva contrasena
          </h1>

          <p className="mx-auto mt-3 max-w-[48ch] text-sm text-white/75 sm:text-base">
            Ingresa tu correo y define una nueva contrasena segura para tu cuenta.
          </p>

          {!tokenValid ? (
            <p className="mt-6 text-sm text-red-300">
              No se pudo validar el enlace de recuperacion. Solicita uno nuevo.
            </p>
          ) : (
            <form
              className="mx-auto mt-8 grid max-w-[480px] gap-3 text-left"
              onSubmit={handleSubmit(handleChangePassword)}
            >
              <div>
                <input
                  type="email"
                  placeholder="Correo de la cuenta"
                  className="w-full rounded-xl border border-[#493355] bg-[rgba(22,17,30,0.86)] px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-[#b61c1c]"
                  {...register('email', {
                    required: 'El correo es obligatorio'
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Nueva contrasena"
                  className="w-full rounded-xl border border-[#493355] bg-[rgba(22,17,30,0.86)] px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-[#b61c1c]"
                  {...register('password', {
                    required: 'La nueva contrasena es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contrasena debe tener al menos 6 caracteres'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Repetir nueva contrasena"
                  className="w-full rounded-xl border border-[#493355] bg-[rgba(22,17,30,0.86)] px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-[#b61c1c]"
                  {...register('confirmpassword', {
                    required: 'Debes repetir la nueva contrasena',
                    validate: value =>
                      value === passwordValue || 'Las contrasenas no coinciden'
                  })}
                />
                {errors.confirmpassword && (
                  <p className="mt-1 text-xs text-red-300">{errors.confirmpassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar nueva contrasena'}
              </button>
            </form>
          )}

          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm text-white/80 underline-offset-4 transition hover:text-white hover:underline"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Reset
