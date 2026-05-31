const express = require("express")
const cookieParser = require("cookie-parser") 
const cors=require("cors")

const app = express() // initiates server 

app.use(express.json())  // intance create krnna server ka
app.use(cookieParser())  // middleware to parse cookies
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

/*require all the routes here */
const authRouter = require("./routes/auth.routes")



/* using all the routes here  */
app.use("/api/auth",authRouter)



module.exports = app 