// routes/adminRoutes.js
import express from 'express';
import { getTaskSummary,getUserSummary, getTasksByUser,getAllTasksAdmin} from '../controllers/admincontroller.js';
import { authMiddleware} from '../middlewares/authmiddleware.js';
import { adminMiddleware } from '../middlewares/adminmiddleware.js';
const router = express.Router();

router.get('/summary/tasks', authMiddleware, adminMiddleware, getTaskSummary);
router.get('/summary/users', authMiddleware, adminMiddleware, getUserSummary);
router.get('/tasks-by-user',authMiddleware, adminMiddleware, getTasksByUser);
router.get('/tasks', authMiddleware, adminMiddleware,  getAllTasksAdmin);

export default router;
