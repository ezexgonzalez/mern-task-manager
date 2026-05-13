import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

const AuthSessionHandler = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();

      if (location.pathname !== "/login") {
        navigate("/login", {
          replace: true,
          state: { sessionExpired: true },
        });
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [location.pathname, logout, navigate]);

  return null;
};

export default AuthSessionHandler;
