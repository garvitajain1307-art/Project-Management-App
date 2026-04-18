import express from 'express';
import {getStudentProject,submitProposal,uploadFiles,getAvailableSupervisors} from "../controllers/studentController.js"

import multer from "multer";
import { isAuthenticated } from "../middlewares/authMiddleware.js"; 
import { isAuthorized } from '../middlewares/authRolesMiddleware.js';
import { upload,handleUploadError } from '../middlewares/upload.js';
const router=express.Router();


router.post("/project",isAuthenticated,isAuthorized("student"),getStudentProject);
router.post("/project-proposal",isAuthenticated,isAuthorized("student"),submitProposal);
router.post("/upload/:projectId",isAuthenticated,isAuthorized("student"),upload.array("files",10),handleUploadError,uploadFiles);
router.get("/fetch-supervisors",isAuthenticated,isAuthorized("student"),getAvailableSupervisors);



export default router;