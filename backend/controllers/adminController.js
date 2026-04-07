import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';
import pkg from '../models/user.js';
const User = pkg;

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
            user=await User.create({name,email,password:hashedPassword,role,department,expertise,maxStudents});
            
        }
        user.password=undefined;
        
        
        res.status(201).json({message:"User created by admin",user});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error: Unable to create user"});
    }

}

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