import express from 'express';
import cors from 'cors';
import {config} from "dotenv";
import { connectDb } from './config/db.js';
import cookieParser from "cookie-parser";
import authRouter from "./router/userRoutes.js";
import adminRouter from "./router/adminRoutes.js";
import studentRouter from "./router/studentRoutes.js"
import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";

config(); //so that al the files in backend folder can access variables defined in env file. 

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();


//middleware ko app.use() ke andr likhte hai
app.use(cors({
    origin:[process.env.FRONTEND_URL], //all the url written here can access backend
    methods:["GET","POST","PUT","DELETE"],
    credentials:true 
}));

const uploadsDir=path.join(__dirname,"uploads");
const tempDir=path.join(__dirname,"temp");

if(!fs.existsSync(uploadsDir))fs.mkdirSync(uploadsDir,{recursive:true});
if(!fs.existsSync(tempDir))fs.mkdirSync(tempDir,{recursive:true});

app.use(cookieParser());
//express.json use: if name ki field hai which accepts String and we sent image in that field, it will not accept it
app.use(express.json());
app.use(express.urlencoded({extended:true})); //if we want to send form data, we need to use this middleware
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/student",studentRouter);

export default app;