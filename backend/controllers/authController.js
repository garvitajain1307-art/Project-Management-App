import bcrypt from "bcrypt";
import { check, validationResult } from 'express-validator';
import pkg from '../models/user.js';
const User = pkg;

//--------------------------------
//Register a User
//--------------------------------

export const registerUser=[
    check('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({min:2,max:30})
    .withMessage('Name must be between 2 and 30 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters')
    ,
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()

    ,
    check('password')
    .isLength({min:8})
    .withMessage("Password must be atleast 8 characters long")
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage("Password must contain atleast one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain atleast one digit")
    .matches(/[!@#$%^&*(),.?":{}|<>/]/)
    .withMessage("Password must contain atleast one special character")
    .trim()
    ,
    check('confirmPassword')
             .trim()
             .custom((value,{req})=>{
                if(value!==req.body.password){
                        throw new Error('Passwords do not match')

                }
                return true
                })
    ,
    async(req,res)=>{
        const {name,email,password}=req.body;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array().map(err=>err.msg),
                oldInput:{name,email,password}
            });
        }
        try{
            const existingUser=await User.findOne({email});
            if(existingUser){
                return res.status(400).json({message:'User already exists'});
            }
            const hashedPassword=await bcrypt.hash(password,12);
            const user=await User.create({name,email,password:hashedPassword});
            res.status(201).json({message:"User created successfully",user});

        }catch(err){
            console.log(err);
            res.status(500).json({message:"Server Error: Unable to create a user"});
        }

    }
]

//--------------------------------
//Login a User
//--------------------------------

export const loginUser=[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()

    ,
    check('password')
    .notEmpty()
    .withMessage('Password is required')
    
    ,
    async(req,res)=>{
        const {email,password}=req.body;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
               errors: errors.array().map(err => err.msg),
               oldInput: { email, password }

             })
        }
        try{
            const user=await User.findOne({email}).select('+password');
            if(!user){
                return res.status(400).json({message:"Invalid credentials"});

            }
            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({message:"Invalid credentials"});
            }
            res.status(200).json({message:"Login successfull",user});
        }catch(err){
            console.log(err);
            res.status(500).json({message:"Server error: Unable to Login"});

        }
    }


];


