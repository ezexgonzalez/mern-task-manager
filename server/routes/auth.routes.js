import express from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { loginUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//rutas publicas
router.post("/register", registerUser);
router.post("/login", loginUser);

//rutas privadas
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message : "Acceso permitido: token valido",
    user: req.user, //usuario decodificado
  });
});

//Verificacion de Token
router.get("/verify", verifyToken, (req,res)=>{
  res.json({
    message: "Acceso permitido: token valido",
    user: req.user
  });
});

const authRoutes = router;
export default authRoutes;
