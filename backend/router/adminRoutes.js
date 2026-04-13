import express from 'express';
import {createUser,updateStudent,deleteStudent,updateTeacher,deleteTeacher, getAllUsers} from "../controllers/adminController.js";

import multer from "multer";
import { isAuthenticated } from "../middlewares/authMiddleware.js"; 
import { isAuthorized } from '../middlewares/authRolesMiddleware.js';
const router=express.Router();

router.post("/create-user",isAuthenticated,isAuthorized("admin"),createUser);
router.put("/update-student/:id",isAuthenticated,isAuthorized("admin"),updateStudent);
router.delete("/delete-student/:id",isAuthenticated,isAuthorized("admin"),deleteStudent);
router.put("/update-teacher/:id",isAuthenticated,isAuthorized("admin"),updateTeacher);
router.delete("/delete-teacher/:id",isAuthenticated,isAuthorized("admin"),deleteTeacher);
router.get("/users",isAuthenticated,isAuthorized("admin"),getAllUsers);



export default router;