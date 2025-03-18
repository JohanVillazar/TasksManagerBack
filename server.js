import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./models/db.js";
import app from "./app.js";
import tasksRoutes from "./routes/taskrouter.js";




const port = process.env.PORT || 3001;

dotenv.config();

app.use(cors());
app.use("/tasks",tasksRoutes);



const startServer = async () => {
    try{


  
        await sequelize.authenticate();
        console.log("✅ Conexión con la base de datos establecida correctamente.");

        await sequelize.sync({ alter: true }); 
        console.log(sequelize.models);


    sequelize.sync({ alter: true }) // ⚠️ Esto actualiza la DB sin perder datos
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch(err => console.error("❌ Error al sincronizar DB:", err));

       //iniciar el servidor
        app.listen(port, () => {
            console.log(`El servidor está arriba en el puerto:  ${port}`);
        });
        

    } catch (error) {
        console.error("❌ Error al establecer la conexión con la base de datos:", error);
    }
};

startServer();
