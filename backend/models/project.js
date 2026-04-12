import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Student ID is required"],
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    //initially koi supervisor assign nhi hoga, isiliye default null hoga
  },
  title: {
    type: String,
    required: [true, "Project title is required"],
    trim: true,
    //if title is "  project1" it will be trimmed to "project1"
    maxLength: [200, "Project Title cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Project description is required"],
    trim: true,
    maxLength: [2000, "Project Description cannot exceed 2000 characters"],
  },

  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected", "completed"],
  },
  //files ka array isiliye bnaya because ek project mai multiple files ho skti h
  file: [
    {
      fileType: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: String,
        default: Date.now(),
      },
    },
  ],
  //supervisor apne student ko ek project ke liye multiple feedbacks de skta hai
  feedback: [
    {
        supervisorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
           required:true
        },
        type:{
            type:String,
            enum:["positive","negative","general"],
            default:"general"
        },
        title:{
            type:String,
            required:true
        },
        message:{
            type:String,
            maxLength: [2000, "Feedback message cannot exceed 2000 characters"],
        },
        
    },
  ],
  deadline:{
    type:Date,


  }
},{
    timestamps: true,
});

//Indexing for better query performance
// Indexing is a technique used to improve the speed of data retrieval by creating a separate 
// data structure that stores field values and references to documents.
//example:
// status → document references
// pending  → [doc1, doc5]
// approved → [doc2, doc7]
projectSchema.index({student:1});
projectSchema.index({supervisor:1});
projectSchema.index({status:1});

const Project=mongoose.model('Project',projectSchema);

export default Project;