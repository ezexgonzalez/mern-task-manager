import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect } from "react";
import Layout from "../components/layout/Layout.jsx";
import NotFoundRedirect from "./NotFoundRedirect.jsx";

function AppRouter() {
  const userState = useAuthStore((state) => state);

  useEffect(() => {
    userState.checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
