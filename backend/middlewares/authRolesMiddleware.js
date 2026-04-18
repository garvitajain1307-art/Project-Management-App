import jwt from "jsonwebtoken";
import pkg from '../models/user.js';
const User = pkg;

export const isAuthorized=(role)=>{
    return (req,res,next)=>{
        try{
            if(req.user.role!=role){
                return res.status(403).json({message:`Only ${role} can access this resource`});
            }
            next();
        }
        catch(err){
            console.log(err);
            return res.status(500).json({message: "Internal server error"});
        }

    }
}