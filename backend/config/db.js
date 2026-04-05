import mongoose from "mongoose";


export const connectDb=async()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"ProjectManagementApp"
    }).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((err)=>{
        console.log("Error connecting to MongoDB",err);
    })

}