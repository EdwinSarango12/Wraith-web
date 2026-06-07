import { useForm } from "react-hook-form";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import storeProfile from "../../context/storeProfile";
import storeAuth from "../../context/storeAuth";

const CardPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, updatePasswordProfile } = storeProfile();
    const { clearToken } = storeAuth();

    // Estados independientes para cada campo
    const [showPresentPassword, setShowPresentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const updatePassword = async (data) => {
        const response = await updatePasswordProfile(data, user._id);
        if (response) {
            setTimeout(() => {
                clearToken();
            }, 2000);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="mt-8"></div>

            <form onSubmit={handleSubmit(updatePassword)}>
                {/* Contraseña actual */}
                <div>
                    <label
                        className="mb-1.5 block text-sm font-semibold text-neutral-300"
                        style={inputStyle}
                    >
                        Contraseña actual
                    </label>

                    <div className="relative">
                        <input
                            type={showPresentPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña actual"
                            className="block w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 mb-4 pr-10 text-white placeholder:text-neutral-500 focus:border-red-600 focus:outline-none transition-colors"
                            style={inputStyle}
                            {...register("presentpassword", {
                                required: "La contraseña actual es obligatoria",
                            })}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPresentPassword(!showPresentPassword)}
                            className="absolute top-2 right-3 text-white hover:text-black"
                        >
                            {showPresentPassword ? (
                                // Icono "ver"
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 
                                        0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 
                                        0 9.956 9.956 0 01-1.845 3.35M9.9 
                                        14.32a3 3 0 114.2-4.2"
                                    />
                                </svg>
                            ) : (
                                // Icono "ocultar"
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 
                                        016 0zm-9.95 0a9.96 9.96 0 0119.9 
                                        0M3 3l18 18"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {errors.presentpassword && (
                        <p className="text-red-800" style={errorStyle}>
                            {errors.presentpassword.message}
                        </p>
                    )}
                </div>

                {/* Nueva contraseña */}
                <div>
                    <label
                        className="mb-1.5 block text-sm font-semibold text-neutral-300"
                        style={inputStyle}
                    >
                        Nueva contraseña
                    </label>

                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Ingresa la nueva contraseña"
                            className="block w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 mb-4 pr-10 text-white placeholder:text-neutral-500 focus:border-red-600 focus:outline-none transition-colors"
                            style={inputStyle}
                            {...register("newpassword", {
                                required: "La nueva contraseña es obligatoria",
                            })}
                        />

                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute top-2 right-3 text-white hover:text-black"
                        >
                            {showNewPassword ? (
                                // Icono "ver"
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 
                                        0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 
                                        0 9.956 9.956 0 01-1.845 3.35M9.9 
                                        14.32a3 3 0 114.2-4.2"
                                    />
                                </svg>
                            ) : (
                                // Icono "ocultar"
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 
                                        016 0zm-9.95 0a9.96 9.96 0 0119.9 
                                        0M3 3l18 18"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {errors.newpassword && (
                        <p className="text-red-800" style={errorStyle}>
                            {errors.newpassword.message}
                        </p>
                    )}
                </div>

                <input
                    type="submit"
                    className="w-full rounded-lg bg-red-800 hover:bg-red-700 py-2.5 text-white uppercase font-bold tracking-wide cursor-pointer transition-colors"
                    value="Cambiar contraseña"
                    style={inputStyle}
                />
            </form>
        </>
    );
};

const inputStyle = {
    fontFamily: "monospace",
};

const errorStyle = {
    color: "red",
    fontSize: "0.7rem",
    marginTop: "1px",
    marginBottom: "1px",
    marginLeft: "20px",
    fontFamily: "monospace",
};

export default CardPassword;
