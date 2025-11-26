import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Loader from "../components/Loader.jsx";

const PrivateRoute = () => {
  const userState = useAuthStore((state) => state);

  if (userState.loading) {
    return <Loader />;
  }
  if (!userState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else {
    return <Outlet />;
  }
};

export default PrivateRoute;
