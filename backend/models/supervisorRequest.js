import mongoose from "mongoose";

const supervisorRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Student ID is required"],
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Supervisor ID is required"],
    
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    //if title is "  project1" it will be trimmed to "project1"
    maxLength: [250, "Message cannot exceed 250 characters"],
  },
  status: {
    type: String,
    required: [true, "Status is required"],
    default:"pending",
    enum:["pending","approved","rejected"]
  },

  
},{
    timestamps: true,
});


supervisorRequestSchema.index({student:1});
supervisorRequestSchema.index({supervisor:1});
supervisorRequestSchema.index({status:1});

const SupervisorRequest=mongoose.model('SupervisorRequest',supervisorRequestSchema);

export default SupervisorRequest;