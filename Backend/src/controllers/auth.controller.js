const userModels = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const tokenBlacklistModels  = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user,expects username,email,password in the req body
 * @access Public
 */
async function registerUserController(req,res){
    const{username,email,password}  = req.body

    if(!username || !email ||!password){
        return res.status(400).json({
            message : "please provide username,email,password" 
        })

    }

    const isUserAlreadyExists = await userModels.findOne({
        $or: [{username},{email}] 
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"Account already exists with this email and username"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModels.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign(
    {
        id:user._id,
        username:user.username,
    },
    process.env.JWT_SECRET,
      {expiresIn: "1d"}
    )

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id: user._id,
            username:user.username,
            email:user.email
        }
    })

}
/**
 * @name loginUserController
 * @description login a user ,expects email and password in the request body
 * @access Public
 */
async function loginUserController(req,res){
    
    const { email, password } =req.body

    const user = await userModels.findOne({email})

    if(!user) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const token = jwt.sign(
    {
        id:user._id,
        username:user.username,
    },
    process.env.JWT_SECRET,
      {expiresIn: "1d"}
    )

    res.cookie("token",token)

    res.status(200).json({
        message:"User loggedIn successfully.",
        user:{
            id: user._id,
            username:user.username,
            email:user.email
        }
    })
}

async function  logoutUserController(req,res){
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModels.create({token})
    }
    res.clearCookie("token")

    res.status(200).json({
        message:"User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current login user details
 * @access Private
 */


async function getMeController(req,res){
    const user = await userModels.findById(req.user.id)
    
    res.status(200).json({
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}