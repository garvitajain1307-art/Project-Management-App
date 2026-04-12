import pkg from '../models/user.js';
const User = pkg;

export const isAdmin=(req,res,next)=>{
    if(!req.user){
        return res.status(401).json({message:"Not authenticated"});
    }
    if(req.user.role!=="admin"){
        return res.status(403).json({message:"Acess denied. Admin only"});
    }
    next();
}