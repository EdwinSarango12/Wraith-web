import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import API_BASE_URL, { ENDPOINTS } from "../config/api";
import AuthShell from "../components/auth/AuthShell";

export const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}${ENDPOINTS.auth.registro}`, {
        nombre: data.nombre,
        apellido: data.apellido,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if (res.data?.emailFailed) {
        // Cuenta creada pero el correo no salió: dirige al reenvío.
        toast.info(res.data?.msg ?? "Cuenta creada, pero no se pudo enviar el correo. Usa \"Reenviar confirmación\".");
      } else {
        toast.success(res.data?.msg ?? "Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      const msg = error?.response?.data?.msg;
      if (error.response) {
        console.error("Respuesta del backend:", error.response.data);
      }
      // Cuenta ya existe (probablemente sin confirmar): sugiere reenviar el correo.
      if (msg?.toLowerCase().includes("registrado")) {
        toast.error(`${msg}. Si no confirmaste tu cuenta, usa "Reenviar confirmación".`);
      } else {
        toast.error(msg ?? "Error en el registro");
      }
    }
  };

  return (
    <AuthShell
      title="Registrar"
      subtitle="Únete a la batalla"
      sideTitle="CREA TU HÉROE"
      sideText="Regístrate y empuña tu arsenal. Hordas, jefes épicos y un mundo pixel 8-bit te aguardan."
      sideImage="/images/register2.png"
    >
      <ToastContainer theme="dark" />

      <form onSubmit={handleSubmit(onSubmit)} className="wr-stagger flex flex-col gap-3">
        <div>
          <input
            type="text"
            placeholder="Nombre"
            autoComplete="given-name"
            {...register("nombre", { required: true })}
            className="wr-field"
          />
          {errors.nombre && <p className="wr-field-error">Nombre requerido</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Apellido"
            autoComplete="family-name"
            {...register("apellido", { required: true })}
            className="wr-field"
          />
          {errors.apellido && <p className="wr-field-error">Apellido requerido</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Usuario"
            autoComplete="username"
            {...register("username", { required: true })}
            className="wr-field"
          />
          {errors.username && <p className="wr-field-error">Usuario requerido</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", { required: true })}
            className="wr-field"
          />
          {errors.email && <p className="wr-field-error">Email requerido</p>}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              autoComplete="new-password"
              {...register("password", { required: true })}
              className="wr-field pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="wr-eye"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.05 10.05 0 0112 20c-6 0-10-8-10-8a18.92 18.92 0 014.05-5.48" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88a3 3 0 014.24 4.24" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="wr-field-error">Contraseña requerida</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="wr-auth-btn wr-auth-btn-primary mt-2">
          {isSubmitting ? <span className="wr-spin" aria-hidden="true" /> : 'Registrarse'}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-center">
        <Link to="/reenviar-confirmacion" className="wr-auth-link">¿No te llegó el correo de confirmación? Reenviar</Link>
        <div className="flex items-center justify-between">
          <Link to="/" className="wr-auth-link">← Regresar</Link>
          <p className="wr-auth-link">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="wr-auth-link font-bold underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};

export default Register;
