import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../services/authService.js";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Validaciones con yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "Debe tener al menos 2 caracteres"),
  email: yup
    .string()
    .email("El email no es valido")
    .required("El email es obligatorio"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres")
    .matches(/\d/, "Debe contener al menos un numero"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

const RegisterForm = () => {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log("datos enviados", data);
    setIsSubmitting(true);
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const successText = response?.message || "Usuario creado con éxito.";
      setSuccessMessage(
        `${successText} Serás redirigido al login en unos segundos...`
      );
      reset();
      setServerError("");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      setServerError(error);
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        w-full
        flex justify-center items-center
        text-gray-200
      "
    >
      <div className="w-full max-w-md space-y-4">
        {/* Título */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Crear cuenta
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Registrate para empezar a organizar tus tareas.
          </p>
        </div>

        {/* Wrapper gradient + card glass */}
        <div className="rounded-bubble p-[1px] bg-gradient-to-br from-white/15 via-white/5 to-transparent">
          <div
            className="
              bg-glassLight backdrop-blur-lg
              rounded-bubble border border-borderGlass
              shadow-bubble
              px-6 py-6
              space-y-4
            "
          >
            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-300">
                Nombre
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={16} />
                </span>

                <input
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-glassLight backdrop-blur-md
                    rounded-bubble border border-borderGlass
                    text-gray-200 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-glassMedium
                    transition shadow-bubble text-sm
                  "
                  type="text"
                  placeholder="Tu nombre"
                  {...register("name")}
                />
              </div>

              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-300">
                Email
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail size={16} />
                </span>

                <input
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-glassLight backdrop-blur-md
                    rounded-bubble border border-borderGlass
                    text-gray-200 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-glassMedium
                    transition shadow-bubble text-sm
                  "
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-300">
                Contraseña
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={16} />
                </span>

                <input
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-glassLight backdrop-blur-md
                    rounded-bubble border border-borderGlass
                    text-gray-200 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-glassMedium
                    transition shadow-bubble text-sm
                  "
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-300">
                Confirmar contraseña
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={16} />
                </span>

                <input
                  className="
                    w-full pl-10 pr-4 py-3
                    bg-glassLight backdrop-blur-md
                    rounded-bubble border border-borderGlass
                    text-gray-200 placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-glassMedium
                    transition shadow-bubble text-sm
                  "
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Separador */}
            <div className="h-px bg-borderGlass my-1" />

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full mt-2
                px-5 py-2.5
                rounded-bubble
                bg-gradient-to-r from-success/90 to-success/70
                text-white
                border border-success/60
                shadow-[0_8px_25px_rgba(34,197,94,0.35)]
                hover:shadow-[0_10px_30px_rgba(34,197,94,0.5)]
                hover:brightness-105
                active:scale-[0.98]
                transition text-sm font-medium
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </div>

        {/* Mensajes de error / éxito */}
        {serverError && (
          <p className="text-red-400 text-xs text-center">{serverError}</p>
        )}
        {successMessage && (
          <p
            className="text-green-400 text-xs text-center flex items-center justify-center gap-2"
            aria-live="polite"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-success animate-ping" />
            <span>{successMessage}</span>
          </p>
        )}

        {/* Navegación: ya tengo cuenta / volver al inicio */}
        <div className="mt-3 flex flex-col items-center gap-1 text-xs">
          <p className="text-slate-400">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="text-gray-100 font-medium hover:text-white hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>

          <Link
            to="/"
            className="text-slate-500 hover:text-slate-300 transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;



