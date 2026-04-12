import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';
import pkg from '../models/user.js';
const User = pkg;

//-------------------
//Add Student by Admin
//-------------------

export const createUser=async(req,res)=>{
    try{
        const {name,email,password,role}=req.body;
        if(!name||!email||!password||!role){
            return res.status(400).json({message:"All fields are required"});
        }
        if(!['student','teacher'].includes(role)){
            return res.status(400).json({ message: "Invalid role" });

        }
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,12);
        let user;
        if(role==="student"){
            const {department}=req.body;
            if(!department){
                return res.status(400).json({message:"Department field is required"});
            }
            user=await User.create({name,email,password:hashedPassword,role,department});
            
        }
        else if(role==="teacher"){
            const {department,expertise,maxStudents}=req.body;
            if(!department||!expertise||!maxStudents){
                return res.status(400).json({message:"All the fields are required"});
            }
            const parsedMaxStudents = Number(maxStudents);
            if (!parsedMaxStudents || parsedMaxStudents <= 0){
                return res.status(400).json({message:"maxStudents must be a number"});
            }
            user=await User.create({name,email,password:hashedPassword,role,department,expertise,maxStudents:parsedMaxStudents});
            
        }
        user.password=undefined;
        
        
        res.status(201).json({message:"User created by admin",user});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error: Unable to create user"});
    }

}

//-------------------
//Edit Student by Admin
//-------------------

export const updateStudent=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {name,email,department}=req.body;
        if(!name||!email||!department){
            return res.status(400).json({message:"All fields are required"});
        }
        if(req.body.role || req.body.password){
            return res.status(400).json({message:"Role and password cannot be updated"});
        }
        const student=await User.findById(id);
        if(!student){
            return res.status(404).json({message:"Student not found"});
        }
        if(student.role!=="student"){
            return res.status(400).json({message:"This API is only for student"});
        }

        if(email!==student.email){
            const existingUser=await User.findOne({email});
            if(existingUser){
                return res.status(400).json({message:"Email already in use"});
            }
        }
        student.name=name;
        student.email=email;
        student.department=department;
        await student.save();
        const studentResponse = student.toObject();
        delete studentResponse.password;
        return res.status(200).json({message:"Student updated successfully",student:studentResponse});

        
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error: Unable to update student"});
    }
}

//-------------------
//Delete Student by Admin
//-------------------

export const deleteStudent=async(req,res)=>{
    try{
        const {id}=req.params;
        const student=await User.findById(id);

        if(!student){
            return res.status(404).json({message:"Student not found for deletion"});
        }
        if(student.role!=="student"){
            return res.status(400).json({message:"This API is only for student deletion"});
        }
        await student.deleteOne();
        return res.status(200).json({message:"Student deleted successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error: Unable to delete student"});
    }
}

//-------------------
//Edit Teacher by Admin
//-------------------

export const updateTeacher=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {name,email,department,expertise,maxStudents}=req.body;
        if(!name||!email||!department||!expertise||!maxStudents){
            return res.status(400).json({message:"All fields are required"});
        }
        if(req.body.role || req.body.password){
            return res.status(400).json({message:"Role and password cannot be updated"});
        }
        const teacher=await User.findById(id);
        if(!teacher){
            return res.status(404).json({message:"Teacher not found"});
        }
        if(teacher.role!=="teacher"){
            return res.status(400).json({message:"This API is only for teacher"});
        }

        if(email!==teacher.email){
            const existingUser=await User.findOne({email});
            if(existingUser){
                return res.status(400).json({message:"Email already in use"});
            }
        }
        const parsedMax = parseInt(maxStudents);
        if (isNaN(parsedMax)) {
            return res.status(400).json({ message: "maxStudents must be a number" });
        }
        
        teacher.name=name;
        teacher.email=email;
        teacher.department=department;
        teacher.expertise=expertise;
        teacher.maxStudents = parsedMax;
        await teacher.save();
        const teacherResponse = teacher.toObject();
        delete teacherResponse.password;
        return res.status(200).json({message:"Teacher updated successfully",teacher:teacherResponse});

        
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error: Unable to update teacher"});
    }
}

//------------------------
//Delete Teacher by Admin
//-------------------------

export const deleteTeacher=async(req,res)=>{
    try{
        const {id}=req.params;
        const teacher=await User.findById(id);

        if(!teacher){
            return res.status(404).json({message:"Teacher not found for deletion"});
        }
        if(teacher.role!=="teacher"){
            return res.status(400).json({message:"This API is only for teacher deletion"});
        }
        await teacher.deleteOne();
        return res.status(200).json({message:"Teacher deleted successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error: Unable to delete teacher"});
    }
}

//-------------------
//Get All Users (Admin)
//-------------------

export const getAllUsers=async(req,res)=>{
    try{
        const {role,page=1,limit=20}=req.query;

        const filter={role:role ? role:{$ne:"admin"}};
        if(role==="admin"){
            return res.status(403).json({message:"Access to admin users is forbidden"});
        }
        const skip=(parseInt(page)-1)*parseInt(limit);
        //-1:newest to oldest 
        const users=await User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
        const total=await User.countDocuments(filter);
        return res.status(200).json({total,page:parseInt(page),limit:parseInt(limit),users,message:"Users fetched successfully"});

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error: Unable to fetch users"});
    }
}
