const mongoose = require("mongoose");


async function connectToDB(){
try{
    await mongoose.connect(process.env.MONGO_URI)

    console.log("Connected to database")
    }
    catch(err){
      console.error("Database connection error:", err.message)
    }
 }


 module.exports = connectToDB