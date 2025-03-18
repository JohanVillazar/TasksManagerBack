import Task from "../models/Task.js";
import User from "../models/User.js";
import sequelize from "../models/db.js";


export const getTaskSummary = async (req, res) => {
  try {
    const totalTasks = await Task.count();

    const taskStatusCounts = await Task.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status'],
    });

    const statusSummary = taskStatusCounts.map((item) => ({
      status: item.status,
      count: parseInt(item.dataValues.count),
    }));

    res.json({
      totalTasks,
      statusSummary,
    });
  } catch (error) {
    console.error("Error en resumen de tareas:", error);
    res.status(500).json({ message: 'Error al obtener resumen de tareas' });
  }
};


export const getTasksByUser = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Task,
          as: 'tasks'
        }
      ]
    });

    const result = users.map(user => ({
      userId: user.id,
      name: user.name,
      email: user.email,
      tasks: user.tasks
    }));

    res.json(result);
  } catch (error) {
    console.error('Error al obtener tareas por usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const getUserSummary = async (req, res) => {
  try {
    const totalUsers = await User.count();

    const roles = await User.findAll({
      attributes: ['role'],
    });

    const roleSummary = roles.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalUsers,
      roleSummary,
    });
  } catch (error) {
    console.error('Error al obtener resumen de usuarios:', error);
    res.status(500).json({ message: 'Error al obtener resumen de usuarios' });
  }
};

export const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: {
        model: User,
         as: 'User',
        attributes: ['email']
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
};

