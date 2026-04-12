import mongoose from "mongoose";

const deadlineSchema=new mongoose.Schema({
    //kis user ke liye ye notification aayi hai
    name:{
        type:String,
        required:[true,"Deadline name is required"],
        trim:true,
        maxLength:[100,"Deadline name cannot exceed 100 characters"]
    },
    dueDate:{
        type:Date,
        required:[true,"Due date is required"]
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Created By is required"]
    },
    //deadline kis project ke liye hai
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:[true,"Project is required"]
    },
    
},{
    timestamps:true
}
)

deadlineSchema.index({dueDate:1});
deadlineSchema.index({project:1});
deadlineSchema.index({createdBy:1});

const Deadline=mongoose.model('Deadline',deadlineSchema);

export default Deadline;