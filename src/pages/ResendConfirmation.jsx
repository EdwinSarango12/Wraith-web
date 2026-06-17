import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import API_BASE_URL, { ENDPOINTS } from "../config/api";
import AuthShell from "../components/auth/AuthShell";

export const ResendConfirmation = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.auth.reenviarConfirmacion}`,
        { email: data.email }
      );
      toast.success(res?.data?.msg ?? "Correo de confirmación reenviado");
      reset();
    } catch (error) {
      toast.error(
        error?.response?.data?.msg ?? "No se pudo reenviar el correo de confirmación"
      );
    }
  };

  return (
    <AuthShell
      title="Reenviar confirmación"
      subtitle="¿No te llegó el correo?"
      sideTitle="ACTIVA TU CUENTA"
      sideText="Te reenviamos el enlace de verificación. Revisa tu bandeja de entrada y la carpeta de spam para acceder al mundo de Wraith."
      sideImage="/images/register2.png"
    >
      <ToastContainer theme="dark" />

      <form onSubmit={handleSubmit(onSubmit)} className="wr-stagger flex flex-col gap-4">
        <p className="wr-body text-sm leading-relaxed text-slate-400 text-center">
          Ingresa el correo con el que te registraste y te enviaremos un nuevo enlace de confirmación.
        </p>

        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            autoComplete="email"
            className="wr-field"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Ingresa un correo válido",
              },
            })}
          />
          {errors.email && <p className="wr-field-error">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="wr-auth-btn wr-auth-btn-primary">
          {isSubmitting ? <span className="wr-spin" aria-hidden="true" /> : "Reenviar correo"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-center">
        <Link to="/login" className="wr-auth-link">← Iniciar sesión</Link>
        <Link to="/register" className="wr-auth-link">Crear cuenta →</Link>
      </div>
    </AuthShell>
  );
};

export default ResendConfirmation;
