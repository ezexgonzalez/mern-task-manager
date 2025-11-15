import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../services/authService.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

//Validaciones
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

  //Manejo de formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  //Submit fetch al backend
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });
      //guardamos el token jwt en localstorage
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
      className="flex flex-col justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col justify-center items-center">
        <label>Email</label>
        <input
          className="border-amber-50 border-2 rounded-md"
          type="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-red-800">{errors.email.message}</p>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col justify-center items-center">
        <label>Contraseña</label>
        <input
          className="border-amber-50 border-2 rounded-md"
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-red-800">{errors.password.message}</p>
        ) : (
          ""
        )}
      </div>
      <button className="cursor-pointer" disabled={isSubmitting} type="submit">
        Login
      </button>
      {serverError && <p className="text-red-800">{serverError}</p>}
      {successMessage && <p className="text-green-800">{successMessage}</p>}
    </form>
  );
};

export default LoginForm;
