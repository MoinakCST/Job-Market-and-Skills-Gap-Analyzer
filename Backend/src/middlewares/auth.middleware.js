const { json } = require("express")
const jwt = require("jsonwebtoken")
const tokenBlackListModels = require("../models/blacklist.model")
const tokenBlacklistModels = require("../models/blacklist.model")

async function authUser(req,res,next){
    const token =  req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Token not provided"
        })
    }

    const isTokenBlackListed = await tokenBlacklistModels.findOne({token})

    if(isTokenBlackListed){
        return res.status(400).json({
            message:"Token is blacklisted.Please login again."
        })
    }

    try{  
    
    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    req.user = decoded
    next()

}
    catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}


module.exports = {authUser}