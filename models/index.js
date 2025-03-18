import sequelize from "./db.js";
import User from "./User.js";
import Task from "./Task.js";

import "./models/Task.js";

User.hasMany(Task, { foreignKey: "userId", as: "tasks" });
Task.belongsTo(User, { foreignKey: "userId", as: "assignedUser" });
const syncDatabase = async () => {
    try {
        console.log("🔄 Sincronizando base de datos...");
        
        await sequelize.sync({ force: true }); // ⚠️ Usar { force: true } solo si quieres borrar y recrear las tablas
        console.log("✅ Tablas creadas correctamente.");
    } catch (error) {
        console.error("❌ Error al sincronizar la base de datos:", error);
    }
};

syncDatabase();

export { User, Task };
