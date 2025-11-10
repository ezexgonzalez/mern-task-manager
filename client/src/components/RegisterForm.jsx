import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  .oneOf([yup.ref("password", null)], "Las contraseñas no coinciden")
  .required("Confirma tu contraseña")
});

const RegisterForm = () => {

  //Manejo de formulario
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema), // conecta el esquema de validacion
  });

  //Submit
  const onSubmit = (data) =>{
    console.log("datos enviados", data);
    // fetch al backend
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)} class="flex flex-col gap-10 w-300px">
      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        <p class="text-red-800">{errors.email?.message}</p>
      </div>
      <div>
        <label>Contraseña</label>
        <input type="password" {...register("password")} />
        <p class="text-red-800">{errors.password?.message}</p>
      </div>
      <div>
        <label>Confirmar contraseña</label>
        <input type="password" {...register("confirmPassword")} />
        <p class="text-red-800">{errors.confirmPassword?.message}</p>
      </div>

      <button type="submit">Registrarse</button>
    </form>
  );


};

export default RegisterForm;
