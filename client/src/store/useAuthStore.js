import { create } from "zustand";
import { verifyToken } from "../services/authService.js";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  //Verificamos si el token es valido
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }
    try {
      const res = await verifyToken();
      set({
        user: res.data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error("Token invalido o expirado", error);
      localStorage.removeItem("token");
      set({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  },
  //Guardamos token y datos del usuario
  login : (token, userData) =>{
    localStorage.setItem("token", token);
    set({user:userData, isAuthenticated: true});
  },
  //Cerrar sesion
  logout: () =>{
    localStorage.removeItem("token");
    set({user: null, isAuthenticated: false});
  }
}));
