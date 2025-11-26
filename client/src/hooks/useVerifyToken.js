import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const useVerifyToken = () => {
  const navigate = useNavigate();
  const userState = useAuthStore((state) => state);

  useEffect(() => {
    const verify = async () => {
      await userState.checkAuth();
      if (userState.isAuthenticated) {
        navigate("/dashboard");
      }
    };
    verify();
  }, [userState.isAuthenticated, navigate]);
};