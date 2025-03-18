import express from "express";
import { getUsers, createUser, resetPassword , updateUserProfile,createUserbyAdmin} from "../controllers/usercontroller.js";
import {authMiddleware} from "../middlewares/authmiddleware.js";
import {adminMiddleware} from "../middlewares/adminmiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();
router.post("/", createUser);
router.post("/admin", authMiddleware, createUserbyAdmin);
router.get("/", getUsers);
router.post("/reset-password", resetPassword);
router.put("/update-profile", authMiddleware, upload.single("photo"), updateUserProfile);




export default router;
