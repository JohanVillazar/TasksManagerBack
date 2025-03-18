import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Op from "sequelize";

export const createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const newUser = await User.create({ name, email, phone, password });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: "Error al crear usuario", error });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};


 export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
  
    try {
      // Verificar usuario por token y que no esté expirado
      const user = await User.findOne({
        where: {
          resetToken: token }});
  
      if (!user) {
        return res.status(400).json({ message: "Token inválido o expirado." });
      }

        const now = new Date();
        const expiresAt = new Date(user.resetTokenExpires);

        if (expiresAt < now) {
            return res.status(400).json({ message: "Token expirado." });
        }
  
      // Hash de la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Actualizar contraseña y limpia token
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
  
      await user.save();
  
      return res.status(200).json({ message: "Contraseña actualizada correctamente." });
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      return res.status(500).json({ message: "Error del servidor." });
    }
  };


  export const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phone, currentPassword, newPassword } = req.body;
      let photoUrl;
  
      // Buscar al usuario
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  
      // Actualizar campos básicos
      if (name) user.name = name;
      if (phone) user.phone = phone;
  
      // Si se desea cambiar la contraseña
      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          return res.status(400).json({ message: "Debes completar ambas contraseñas" });
        }
  
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: "La contraseña actual es incorrecta" });
        }
  
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
      }
  
      // Actualizar foto si se subió
      if (req.file) {
        photoUrl = `/uploads/${req.file.filename}`;
        user.photo = photoUrl;
      }
  
      await user.save();
  
      res.status(200).json({ message: "Perfil actualizado correctamente", user });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al actualizar el perfil" });
    }
  };


  

  export const createUserbyAdmin = async (req, res) => {
    try {
      const { name, email, phone, password, role } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "El correo ya está registrado" });
      }
  
      
      const newUser = await User.create({
        name,
        email,
        phone,
        password, 
        role: role || "user",
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      console.log("Error al crear usuario por admin:", error);
      res.status(400).json({ message: "Error al crear usuario", error: error.message });
    }
  };
  

