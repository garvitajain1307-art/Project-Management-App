import express from 'express';
import {createUser,updateStudent,deleteStudent,updateTeacher,deleteTeacher} from "../controllers/adminController.js";

import multer from "multer";
import { isAuthenticated } from "../middlewares/authMiddleware.js"; 
import { isAdmin } from "../middlewares/adminMiddleware.js";
const router=express.Router();

router.post("/create-user",isAuthenticated,isAdmin,createUser);
router.put("/update-student/:id",isAuthenticated,isAdmin,updateStudent);
router.delete("/delete-student/:id",isAuthenticated,isAdmin,deleteStudent);
router.put("/update-teacher/:id",isAuthenticated,isAdmin,updateTeacher);
router.delete("/delete-teacher/:id",isAuthenticated,isAdmin,deleteTeacher);



export default router;