import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


connectDB();

app.use("/api/auth", authRoutes);


app.get("/", (req,res)=>{
    res.send("API funcionando correctamente 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});


