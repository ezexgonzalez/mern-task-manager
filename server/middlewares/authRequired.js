import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) =>{

    try {
        //Obtenemos el header "Autorization" del request
        const authHeader = req.headers.authorization;

        //Verificamos si existe y tiene el formato correcto
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "No autorizado. Token faltante o invalido"});
        }

        //Extraemos el token despues de la palabra "Bearer "
        const token = authHeader.split(" ")[1];

        //Verificamos el token con la clave secreta del .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Guardamos los datos del usuario decodificado
        req.user = decoded;

        //Continuamos al siguiente middleware o controlador
        next(); 

    } catch (error) {
        console.error("Error verificando token:", error);
        res.status(401).json({message: "Token invalido o expirado."});   
    }
}