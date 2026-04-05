

import { connectDb } from "./config/db.js";
import app from "./app.js";

//--------------------------------------
// DATABASE CONNECTION
//--------------------------------------


connectDb()

//--------------------------------------
// START SERVER
//--------------------------------------

const PORT=process.env.PORT || 4000;
const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

//--------------------------------------
// EXCEPTION HANDLING
//--------------------------------------


//if koi try block mai error aajaye and uske corresponding koi catch block nah ho 
process.on("UnhandledRejection",(err)=>{
    console.error(`UnhandledRejection:${err.message} `);
    server.close(()=>process.exit(1));

}); //yha current requests pehle complete hogi uske baad server close hoga

//jab humne try catch block use hi ni kra hoga
process.on("UncaughtException",(err)=>{
    console.error(`UncaughtException:${err.message} `);
    process.exit(1);

}); //server ekdum se hi bnd ho jaaega 

export default server;