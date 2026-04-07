import express from "express";
import {registerUser,loginUser, getUser} from "../controllers/authController.js";

import multer from "multer";

const router=express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/get-user/:id",getUser);

export default router;