import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';
import pkg from '../models/user.js';
const User = pkg;
import Project from '../models/project.js';
import Notification from "../models/notification.js";
import SupervisorRequest from "../models/supervisorRequest.js";


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

export const getSupervisor=async(req,res)=>{
    try{
        const studentId=req.params._id;
        //supervisor as a field in User model stores ObjectId, .populate replaces the id with actual data (name,email,dept,expertise)
        const student=await User.findById(studentId).populate("supervisor","name email department expertise");

        if(!student.supervisor){
            return res.status(200).json({message:"No supervisor assigned yet"})
        };
        return res.status(200).json({message:"There is a supervisor",supervisor:student.supervisor});
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error. Can't get supervisor"});
    }
}

export const requestSupervisor=async(req,res)=>{
    try{
        const {teacherId,message}=req.body;
        const studentId=req.params._id;

        const student=await User.findById(studentId);
        if(student.supervisor){
            return res.status(400).json({message:"You have been already assigned a supervisor"});
        }
        const supervisor=await User.findById(teacherId);
        if(!supervisor||supervisor.role!=="teacher"){
            return res.status(400).json({message:"Invalid supervisor selected"});
        }
        if(supervisor.maxStudents===supervisor.assignedStudents.length){
            return res.status(400).json({message:"Assigned Students have reached maximum capacity"});
        }
        const existingRequest=await SupervisorRequest.findOne({student:studentId,teacher:teacherId,status:"pending"});
        if(existingRequest){
            return res.status(400).json({message:"You already have a pending request sent to this supervisor"});
        }
        const request=await SupervisorRequest.create({
            student:studentId,teacher:teacherId,message
        });
        await Notification.create({
            user:teacherId,
            message:`${student.name} has requested you as a supervisor`,
            type:"request",
            priority:"medium",
            link: `/supervisor-requests/${request._id}`

        });
        return res.status(200).json({message:"Request sent successfully",request});

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error. Can't get supervisor"});


    }
}


