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
app.use(cors());


app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/admin', routeradmin);







export default app;
