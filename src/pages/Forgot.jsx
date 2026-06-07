import { Link, useLocation } from 'react-router';
import useFetch from '../hooks/useFetch';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import AuthShell from '../components/auth/AuthShell';

export const Forgot = () => {
    const location = useLocation();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { fetchDataBackend } = useFetch();

    const isAdminRoute = location.pathname.includes("recuperarpasswordAdmin");

    const sendMail = (data) => {
        const url = isAdminRoute
            ? `${import.meta.env.VITE_BACKEND_URL}/recuperarpasswordAdmin`
            : `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`;

        fetchDataBackend(url, data, 'POST');
    };

    return (
        <AuthShell
            title={isAdminRoute ? "Recuperar (Admin)" : "Recuperar acceso"}
            subtitle="¿Olvidaste tu contraseña?"
            sideTitle="RECUPERA TU LEYENDA"
            sideText="Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña. Vuelve al mundo de Wraith."
            sideImage="/images/wraith3.png"
        >
            <ToastContainer theme="dark" />

            <form onSubmit={handleSubmit(sendMail)} className="wr-stagger flex flex-col gap-4">
                <p className="wr-body text-sm leading-relaxed text-slate-400 text-center">
                    Te enviaremos un enlace de recuperación al correo registrado.
                </p>

                {/* Correo electrónico */}
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

                {/* Botón enviar */}
                <button type="submit" disabled={isSubmitting} className="wr-auth-btn wr-auth-btn-primary">
                    {isSubmitting ? <span className="wr-spin" aria-hidden="true" /> : 'Enviar correo'}
                </button>
            </form>

            {/* Enlaces */}
            <div className="mt-6 flex flex-col gap-3 text-center">
                <p className="wr-pixel-sm text-base tracking-widest text-slate-400 uppercase">
                    ¿Ya posees una cuenta?
                </p>
                <div className="flex items-center justify-between">
                    <Link to="/" className="wr-auth-link">← Regresar</Link>
                    <Link to="/login" className="wr-auth-link">Iniciar sesión →</Link>
                </div>
            </div>
        </AuthShell>
    );
};

export default Forgot;
