import express from "express";
import userRoutes from "./routes/userrouter.js";
import taskRoutes from "./routes/taskrouter.js";
import authRoutes from "./routes/authrouter.js";
import routeradmin from "./routes/routeradmin.js";
import sequelize from "./models/db.js";
import cors from "cors";
import { adminMiddleware } from "./middlewares/adminmiddleware.js";


const app = express();

app.use(express.json());

const allowedOrigins = [
    'https://task-manager-ten-rose-74.vercel.app', // tu dominio real
  ];

  app.use(cors({
    origin: function (origin, callback) {
     
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true,
  }));




app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/admin', routeradmin);







export default app;
