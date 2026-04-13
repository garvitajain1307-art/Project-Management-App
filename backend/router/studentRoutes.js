import express from 'express';
import {getStudentProject,submitProposal,uploadFiles,getAvailableSupervisors} from "../controllers/studentController"

import multer from "multer";
import { isAuthenticated } from "../middlewares/authMiddleware.js"; 
import { isAuthorized } from '../middlewares/authRolesMiddleware.js';
const router=express.Router();

router.post()
router.post("/project",isAuthenticated,isAuthorized("student"),getStudentProject);
router.post("/proposal",isAuthenticated,isAuthorized("student"),submitProposal);
router.post("/upload/:projectId",isAuthenticated,isAuthorized("student"),uploadFiles);
router.get("/fetch-supervisors",isAuthenticated,isAuthorized("student"),getAvailableSupervisors);







export default router;