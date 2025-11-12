import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../services/authService.js";
import { useState } from "react";

//Validaciones con yup
const schema = yup.object().shape({
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

  //Manejo de formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // conecta el esquema de validacion
  });

  //Submit
  const onSubmit = async (data) => {
    console.log("datos enviados", data);
    // fetch al backend
    setIsSubmitting(true);
    try {
      const response = await registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setSuccessMessage(response.message);
      reset();
      setServerError("");
    } catch (error) {
      setServerError(error);
      setSuccessMessage("");
    }finally{
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 justify-center items-center"
    >
      <div className="flex flex-col items-center justify-center">
        <label>Email</label>
        <input className="bg-gray-500" type="email" {...register("email")} />
        <p className="text-red-800">{errors.email?.message}</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <label>Contraseña</label>
        <input
          className="bg-gray-500"
          type="password"
          {...register("password")}
        />
        <p className="text-red-800">{errors.password?.message}</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <label>Confirmar contraseña</label>
        <input
          className="bg-gray-500"
          type="password"
          {...register("confirmPassword")}
        />
        <p className="text-red-800">{errors.confirmPassword?.message}</p>
      </div>

      <button type="submit" className="cursor-pointer" disabled={isSubmitting}>{isSubmitting? "Registrando..." : "Registrarse"}</button>

      {serverError && <p className="text-red-800">{serverError}</p>}
      {successMessage && <p className="text-green-800">{successMessage}</p>}
    </form>
  );
};

export default RegisterForm;
