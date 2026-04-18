import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';
import pkg from '../models/user.js';
const User = pkg;
import Project from '../models/project.js';


export const getStudentProject =async(req,res)=>{
    try{
        const studentId=req.user._id;
        const project=await Project.findOne({student:studentId}).sort({ createdAt: -1 });;
        if(!project){
            return res.status(404).json({message:"Project not found",project:null});
        }
        return res.status(200).json({message:"Project found",project});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error while fetching the project",project:null })

    }
}

export const submitProposal=async(req,res)=>{
    try{
        const {title,description}=req.body;
        const studentId=req.user._id;

        if(!title || !description){
            return res.status(400).json({message:"Title and Descrption are required"});
        }

        const existingProject=await Project.findOne({student:studentId});
        if(existingProject && existingProject.status!=="rejected"){
            return res.status(400).json({message:"You already have an active project and can submit again only when the previous one is rejected"});
        }
        const project=await Project.create({
            student:studentId,title,description
        });
        await User.findByIdAndUpdate(studentId,{project:project._id});
        return res.status(201).json({message:"Prject proposal submitted sucessfully",project});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error while submitting the proposal"});
    }
}

export const uploadFiles=async(req,res)=>{
    try{
        const {projectId}=req.params;
        //from JWT who is making request
        const studentId=req.user._id;
        const project= await Project.findById(projectId);
        if(!project){
            return res.status(404).json({message:"Project not found"});

        }
        //mongoDB stores objectId which cannot be compared directly
        //it checks that the same user who is requesting to submit the proposal (from JWT) submits the proposal of his own project (student of project)
        if(project.student.toString()!==studentId.toString()){
            return res.status(403).json({message:"Not authorized to upload files to this project"})
        }
        if(!req.files||req.files.length===0){
            return res.status(400).json({message:"No Files uploaded"});
        }

        //refer notes for explanation

        const fileMetaData=req.files.map((file)=>{
            fileType=file.mimetype,
            fileUrl=file.path,
            originalName=file.originalname,
            uploadedAt=new Date()


        })
        project.file=project.file || [];
        project.file.push(...fileMetaData);
        await project.save();
        res.status(200).json({
            message: "File uploaded successfully",
            project
        });

    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getAvailableSupervisors=async(req,res)=>{
    try{
        //w/o lean you get heavy mongoose documents but with lean you get plain javascript objects
        const supervisors=await User.find({role:"teacher"}).select("name email department expertise").lean();
        return res.status(200).json({message:"Avaiable supervisors fetched successfully",supervisors});
    }catch(err){
        return res.status(500).json({message:"Server error occured while fetching supervisors"});
    }
}

