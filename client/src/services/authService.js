import api from "./api.js";

//Registro de usuario

export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al registrar al usuario";
  }
};

export const loginUser = async (data) =>{
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al iniciar sesión"
  }
}
