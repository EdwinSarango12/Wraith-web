import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import useFetch from '../hooks/useFetch';
import { ToastContainer } from 'react-toastify';
import storeAuth from '../context/storeAuth';
import { ENDPOINTS } from '../config/api';
import AuthShell from '../components/auth/AuthShell';

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const { fetchDataBackend } = useFetch();
    const { setToken, setRol } = storeAuth();

    const loginUser = async (data) => {
        const endpoint = data.password.includes("My.DeltaStudio")
            ? ENDPOINTS.auth.loginAdministrador
            : ENDPOINTS.auth.loginJugador;
        const response = await fetchDataBackend(endpoint, data, 'POST', null);

        setToken(response.token);

        const rol = response?.rol ?? (endpoint === ENDPOINTS.auth.loginAdministrador ? "Administrador" : "Jugador");
        setRol(rol);
        setToken(response.token);

        if (response) {
            navigate('/dashboard');
        }
    };

    return (
        <AuthShell
            title="Iniciar sesión"
            subtitle="Bienvenido de vuelta"
            sideTitle="FORJA TU LEYENDA"
            sideText="Entra al mundo de Wraith. Tu aventura pixel de acción te espera del otro lado."
            sideImage="/images/whraite.png"
        >
            <ToastContainer theme="dark" />

            <form onSubmit={handleSubmit(loginUser)} className="wr-stagger flex flex-col gap-4">
                {/* Correo electrónico */}
                <div>
                    <input
                        type="email"
                        placeholder="Correo"
                        autoComplete="email"
                        className="wr-field"
                        {...register("email", { required: "El correo es obligatorio" })}
                    />
                    {errors.email && <p className="wr-field-error">{errors.email.message}</p>}
                </div>

                {/* Contraseña */}
                <div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            autoComplete="current-password"
                            className="wr-field pr-11"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            className="wr-eye"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2m.5 3.5l3.8 3.8m-3.8-3.8L5.5 5.5" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.95 0a9.96 9.96 0 0119.9 0m-19.9 0a9.96 9.96 0 0119.9 0M3 3l18 18" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="wr-field-error">{errors.password.message}</p>}
                </div>

                {/* Botón de iniciar sesión */}
                <button type="submit" disabled={isSubmitting} className="wr-auth-btn wr-auth-btn-primary">
                    {isSubmitting ? <span className="wr-spin" aria-hidden="true" /> : 'Entrar'}
                </button>


            </form>

            {/* Enlaces */}
            <div className="mt-6 flex flex-col gap-3 text-center">
                <Link to="/forgot/id" className="wr-auth-link">¿Olvidaste tu contraseña?</Link>
                <div className="flex items-center justify-between">
                    <Link to="/" className="wr-auth-link">← Regresar</Link>
                    <Link to="/register" className="wr-auth-link">Crear cuenta →</Link>
                </div>
            </div>
        </AuthShell>
    );
};

export default Login;
