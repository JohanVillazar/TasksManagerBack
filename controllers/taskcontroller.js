import Task from "../models/Task.js";
import User from "../models/User.js";



export const createTask = async (req, res) => {
  try {
    const { title, description, priority, note, parentTaskId, dueDate, user_id } = req.body;

   
    if (!title || !description || !priority) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    
    const userId = req.user.role === "admin" && user_id ? user_id : req.user.id;

    const newTask = await Task.create({
      title,
      description,
      priority,
      userId,
      note,
      parentTaskId: parentTaskId || null,
      dueDate: dueDate || null,
    });

    res.status(201).json(newTask);

  } catch (error) {
    console.log("Error al crear tarea:", error);
    res.status(500).json({ message: "Error interno al crear tarea", error: error.message });
  }
};


export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { userId: req.user.id },
            attributes: ["id", "title", "description", "status", "priority", "note", "createdAt", "dueDate"], // 📌 Incluir dueDate
            include: [{ model: User, as: "assignedUser", attributes: ["id", "name", "email"] }]
        });

        res.json(tasks);
    } catch (error) {
        console.error("Error al obtener tareas del usuario:", error);
        res.status(500).json({ message: "Error al obtener tareas", error });
    }
};

export const getAllTasks = async (req, res) => {
    try {
      const { priority } = req.query; // Captura el filtro desde la URL
  
      const whereClause = {}; // Filtro dinámico
      if (priority) whereClause.priority = priority; // Agrega filtro si se pasa en la URL
  
      const tasks = await Task.findAll({
        where: whereClause,
        attributes: ["id", "title", "description", "status", "priority", "note"], // 📌 Asegúrate de incluir `priority`
        include: [{ model: User, as: "assignedUser" }],
      });
  
      res.json(tasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      res.status(500).json({ message: "Error al obtener tareas", error });
    }
  };

  export const getUserTasks = async (req, res) => {
    try {

       
      const userId = req.user.id; // Obtiene el ID del usuario logueado
  
      const tasks = await Task.findAll({
        where: { userId }, // Filtra por el usuario autenticado
        attributes: ["id", "title", "description", "status", "priority","note","createdAt","dueDate"],
        include: [{ model: User, as: "assignedUser", attributes: ["id", "name", "email"] }], 
      });
      if (tasks.length === 0) {
        return res.status(404).json({ message: "No tienes tareas asignadas" });
    }
  
      res.json(tasks);
    } catch (error) {
      console.error("Error al obtener tareas del usuario:", error);
      res.status(500).json({ message: "Error al obtener tareas del usuario", error });
    }
  };


  export const updateTaskStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }
  
      task.status = status;
      await task.save();
  
      res.json({ message: "Estado de tarea actualizado", task });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      res.status(500).json({ message: "Error al actualizar estado", error });
    }
  };
  
export const updateTaskNote = async (req, res) => {
    try{
        const { id } = req.params;
        const { note } = req.body;


        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        task.note = note;
        
        await task.save();

        res.json({ message: "Nota de la tarea actualizada", task });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar nota", error });
    }
};







export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        await task.destroy();
        res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar tarea", error });
    }
};

export const reassignTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { newUserId } = req.body;

        // Verificar si la tarea existe
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        // Verificar si el nuevo usuario existe
        const newUser = await User.findByPk(newUserId);
        if (!newUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar la tarea con el nuevo usuario asignado
        task.userId = newUserId;
        await task.save();

        res.json({ message: "Tarea reasignada exitosamente", task });
    } catch (error) {
        console.error("Error al reasignar tarea:", error);
        res.status(500).json({ message: "Error al reasignar tarea", error });
    }
};


