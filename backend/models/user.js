import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        maxLength:[30,'Length cannot exceed 30 characters']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        maxLength:[50,'Length cannot exceed 50 characters'],
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please enter a valid email address']

    },
    password:{
        type:String,
        required:[true,'Password is required'],
        select:false,
        minLength:[8,'Password must be of atleat 8 characters']

    },
    role:{
        type:String,
        default:"student",
        enum:["student","teacher","admin"],

    },
    department:{
        type:String,
        trim:true,
        default:null
    },
    expertise:{
        type:[String],
        default:[]

    },
    maxStudents:{
        type:Number,
        default:10,
        min:[1,"Min Students should be atleast 1"]
    },
    assignedStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    supervisor:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null
        }
    ],
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        default:null
    }

},{
    timestamps:true,
}
)

userSchema.methods.generateToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    }
    )
}

// userSchema.methods.getResetPasswordToken=function(){
//     const resetToken=crypto.randomBytes(20).toString("hex");
//     this.getResetPasswordToken=crypto
// }

const User=mongoose.model('User',userSchema);

export default User;