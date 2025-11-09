import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validamos campos
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    //Verificamos si el usuario existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya esta registrado" });
    }

    //Hasheo de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creamos el usuario
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    //Enviamos respuesta
    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Verificamos que los campos esten completos
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    //Buscamos el usuario en la base de datos

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }

    //Comparar contraseñas
    const validPassword = bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    
    // Creamos el token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {expiresIn:"1h"}
    );

    //Enviamos el token al front
    res.status(200).json({
      message: "inicio de sesion exitoso",
      token,
      user:{
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Error interno del servidor"});
  }
};
