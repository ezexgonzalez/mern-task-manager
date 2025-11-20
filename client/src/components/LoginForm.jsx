import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../services/authService.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Mail, Lock } from "lucide-react";

// Validaciones
const schema = yup.object().shape({
  email: yup.string().email().required("El email es obligatorio"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres"),
});

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Manejo de formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Submit fetch al backend
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });
      // guardamos el token jwt en localstorage
      login(response.token, response.user);

      setSuccessMessage(response.message);
      reset();
      setServerError("");
      navigate("/dashboard");
    } catch (error) {
      setServerError(error);
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="
        w-full
        flex justify-center items-center
        text-gray-200
      "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full max-w-md space-y-4">
        {/* Título */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Accedé a tu panel de tareas.
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

            {/* Separador */}
            <div className="h-px bg-borderGlass my-1" />

            {/* Botón */}
            <button
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
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Ingresando..." : "Login"}
            </button>
          </div>
        </div>

        {/* Mensajes de error / éxito */}
        {serverError && (
          <p className="text-red-400 text-xs text-center">{serverError}</p>
        )}
        {successMessage && (
          <p className="text-green-400 text-xs text-center">
            {successMessage}
          </p>
        )}
      </div>
    </form>
  );
};

export default LoginForm;

