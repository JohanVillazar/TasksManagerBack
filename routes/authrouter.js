import express from "express";
import { register, login, sendPasswordReset } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", sendPasswordReset);

export default router;
