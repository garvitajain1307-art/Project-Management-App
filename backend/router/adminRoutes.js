import express from 'express';
import {createUser,updateStudent,deleteStudent,updateTeacher,deleteTeacher} from "../controllers/adminController.js";

import multer from "multer";
const router=express.Router();

router.post("/create-user",createUser);
router.put("/update-student/:id",updateStudent);
router.delete("/delete-student/:id",deleteStudent);
router.put("/update-teacher/:id",updateTeacher);
router.delete("/delete-teacher/:id",deleteTeacher);



export default router;