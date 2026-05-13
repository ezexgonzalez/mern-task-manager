import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuthStore((state) => state);

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
