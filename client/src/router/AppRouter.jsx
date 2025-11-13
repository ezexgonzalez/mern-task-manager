import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect } from "react";

function AppRouter() {

  const userState = useAuthStore((state) => state);

  useEffect(()=>{
    userState.checkAuth();
  },[]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        {/*Private Routes*/}
        <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;