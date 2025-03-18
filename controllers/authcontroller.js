import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
import {sendEmail} from "../utils/mailer.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { create } from "domain";





dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "secreto_super_seguro";

export const register = async (req, res) => {
    try {
        const { name, email, role, phone, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        // Crear usuario
        const newUser = await User.create({ name, email, role, phone, password });

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Usuario o Contraseña incorrectos" });
        }

        // Generar token
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name,  role: user.role }, SECRET_KEY, { expiresIn: "2h" });

        res.json({ message: "Login exitoso", name:user.name,email, phone:user.phone, role:user.role, createdAt:user.createdAt,  token });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
};

export const sendPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Generar token aleatorio
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Establecer token y expiración (ej: 1 hora)
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    await user.save();

    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // o el servicio que uses
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enlace para el frontend
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Enviar el correo
    await transporter.sendMail({
      from: '"Orbit Task Manager" <tucorreo@gmail.com>',
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <h3>Hola ${user.name || "usuario"},</h3>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    return res.json({ message: "Correo enviado con el enlace para recuperar la contraseña." });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error al enviar el correo." });
  }
  };
