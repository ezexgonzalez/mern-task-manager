import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

const NotFoundRedirect = () => {
  // Ajustá esta línea a cómo guardás el auth:
  const userState = useAuthStore((state) => state);

  if (userState.isAuthenticated) {
    // Usuario logueado → lo mandamos al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Usuario NO logueado → lo mandamos a la landing
  return <Navigate to="/" replace />;
};

export default NotFoundRedirect;
