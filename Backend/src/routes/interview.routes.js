const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")


const interviewRouter = express.Router()

/**
 * @routes POST/api/interview
 * @description generate new interview report on the basis of user self  description and job description  
 * @access private
 */

interviewRouter.post("/",authMiddleware.authUser, upload.single("resume"),interviewController.generateInterviewReportController)


/**
 * @routes GET/api/interview/report/:interviewId
 * @description generate interview report by interviewId,  
 * @access private
 */

interviewRouter.get("/report/:interviewId",authMiddleware.authUser, upload.single("resume"),interviewController.generateInterviewReportController)







module.exports = interviewRouter