import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "secreto_super_seguro";

export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extraer el token del header

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Guardar datos del usuario en la request
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado" });
    }
};
