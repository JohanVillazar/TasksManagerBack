import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import User from "./User.js";



const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pendiente", "Asignada", "en progreso", "completada"),
        defaultValue: "pendiente",
    },
    priority: {
        type: DataTypes.ENUM("Alta", "Media", "Baja"),
        allowNull: false,
        defaultValue: "Media",
    },
    note:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Sin notas",
        
    },

    parentTaskId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser NULL si no es una subtarea
        references: {
            model: "Tasks", // Asegúrate de que el nombre coincide con la tabla
            key: "id",
        },
    },
    dueDate: {  
        type: DataTypes.DATE,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, { timestamps: true });


User.hasMany(Task, { foreignKey: "userId", as: "tasks" });
Task.belongsTo(User, { foreignKey: "userId", as: "assignedUser" });
Task.belongsTo(User, { foreignKey: 'userId', as: 'User' });



export default Task;



