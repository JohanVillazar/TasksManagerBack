import express from "express";
import { getTasks, createTask , updateTaskStatus , reassignTask ,deleteTask, getAllTasks , getUserTasks ,  
    updateTaskNote,
} from "../controllers/taskcontroller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js"
import { adminMiddleware } from "../middlewares/adminmiddleware.js";



const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role === "admin" && req.query.all === "true") {
            return getAllTasks(req, res); //obtener todas las tareas
        }
        return getTasks(req, res); // solo tareas de usuario logeado
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tareas", error });
    }
});

router.post("/", authMiddleware,createTask);
router.get("/my-tasks", authMiddleware, getUserTasks);
router.get("/tasks?all=true",  getAllTasks);
router.patch("/:id/status",  authMiddleware, updateTaskStatus, );
router.put("/:id/note",  authMiddleware,updateTaskNote ,);
router.put("/:taskId/reassign", authMiddleware, adminMiddleware, reassignTask);
router.delete("/:id", authMiddleware,adminMiddleware ,deleteTask);

export default router;
