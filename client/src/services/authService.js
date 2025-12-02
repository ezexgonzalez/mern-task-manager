import api from "./api.js";

//Registro de usuario

export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error(error);
    // ❌ El servidor ni responde (Render dormido / red caída)
    if (!error.response) {
      throw "El servidor está despertando (servicio gratuito). Probá de nuevo en unos segundos.";
    }
    // ✅ Error con respuesta del backend
    throw error.response?.data?.message || "Error al registrar al usuario";
  }
};

export const loginUser = async (data) =>{
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error(error);
    // ❌ El servidor ni responde (Render dormido / red caída)
    if (!error.response) {
      throw "El servidor está despertando (servicio gratuito). Probá de nuevo en unos segundos.";
    }
    // ✅ Error con respuesta del backend
    const msg =
      error.response.data?.message || "Error al iniciar sesión. Intentá de nuevo.";
    throw msg;
  }
}

export const verifyToken = async ()=>{
  const token = localStorage.getItem("token");
  return api.get("/auth/verify", {
    headers:{
      Authorization:`Bearer ${token}`,
    }
  });
};
