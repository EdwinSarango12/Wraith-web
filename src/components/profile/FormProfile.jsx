import storeProfile from "../../context/storeProfile"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

const FormularioPerfil = () => {
    const { user, updateProfile} = storeProfile()
    const { register, handleSubmit, reset,  formState: { errors } } = useForm()
    const storedUser = JSON.parse(localStorage.getItem("auth-token"));

    useEffect(() => {
        if (user) {
        reset({
            nombre: user.nombre || "",
            apellido: user.apellido || "",
            email: user.email || "",
            username: user.username || "",
            area: storedUser.state.rol == "Administrador" ? user.area || "" : "none",
        })
        console.log(reset);
        

        }
    }, [user, reset])

    const onSubmit = async (data) => {

        console.log(data);
        
        try {
        const { ...basicData } = data


        await updateProfile( basicData, user._id)
        
        } catch (error) {
        console.error("Error actualizando perfil:", error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-300" style={inputStyle}>Nombre</label>
            <input
            type="text"
            placeholder={user?.nombre || ""}
            className="block w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 mb-4 text-white placeholder:text-neutral-500 focus:border-red-600 focus:outline-none transition-colors" style={inputStyle}
            {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            {errors.nombre && <p className="text-red-800" style={errorStyle}>{errors.nombre.message}</p>}
        </div>

        <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-300" style={inputStyle}>Apellido</label>
            <input
            type="text"
            placeholder={user?.apellido || ""}
            className="block w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 mb-4 text-white placeholder:text-neutral-500 focus:border-red-600 focus:outline-none transition-colors"
            style={inputStyle}
            {...register("apellido", { required: "El apellido es obligatorio" })}
            />
            {errors.apellido && <p className="text-red-800" style={errorStyle}>{errors.apellido.message}</p>}
        </div>

        <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-300" style={inputStyle}>Nombre de usuario</label>
            <input
            type="text"
            placeholder={user?.username || ""}
            className="block w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 mb-4 text-white placeholder:text-neutral-500 focus:border-red-600 focus:outline-none transition-colors"
            style={inputStyle}
            {...register("username", { required: "El usuario es obligatorio" })}
            />
            {errors.username && <p className="text-red-800" style={errorStyle}>{errors.username.message}</p>}
        </div>

        <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-300" style={inputStyle}>Email</label>
            <input
            type="email"
            placeholder={user?.email || ""}
            className="block w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2.5 mb-4 text-white placeholder:text-neutral-500 focus:border-red-600 focus:outline-none transition-colors"
            style={inputStyle}
            {...register("email", { required: "El email es obligatorio" })}
            />
            {errors.email && <p className="text-red-800" style={errorStyle}>{errors.email.message}</p>}
        </div>

        {storedUser?.state?.rol === "Administrador" && (
            <div>
            <label className="mb-1.5 block text-sm font-semibold text-neutral-300" style={inputStyle}>Área</label>
            <input
                type="text"
                placeholder={user?.area || ""}
                className="block w-full border py-1 px-2 border-[#434343] bg-[#434343] mb-5 text-white"
                style={inputStyle}
                {...register("area", { required: "El área es obligatoria" })}
            />
            {errors.area && <p className="text-red-800 " style={errorStyle}>{errors.area.message}</p>}
            </div>
        )}

        <input
            type="submit"
            className="w-full rounded-lg bg-red-800 hover:bg-red-700 py-2.5 mt-2 text-white uppercase font-bold tracking-wide cursor-pointer transition-colors" style={inputStyle}
            value="Actualizar"
        />
        </form>
    )
}
const inputStyle = {
  fontFamily: 'monospace'
};

const errorStyle = {
  color: 'red',
  fontSize: '0.7rem',
  marginTop: '1px',
  marginBottom: '1px',
  marginLeft: '20px',
  fontFamily: 'monospace'
};
export default FormularioPerfil
