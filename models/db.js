import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // Evita que Sequelize muestre las consultas en la consola
});

sequelize.authenticate()
    .then(() => console.log("✅ Conectado a PostgreSQL con Sequelize"))
    .catch((err) => console.error("❌ Error de conexión:", err));

export default sequelize;
