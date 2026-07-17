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
 * @routes GET/api/interview
 * @description get all interview reports for current user
 * @access private
 */
interviewRouter.get("/",authMiddleware.authUser, interviewController.getAllInterviewReportController)


/**
 * @routes GET/api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser, interviewController.generateInterviewReportByIdController)


/**
 * @routes POST/api/interview/resume/pdf/:interviewReportId
 * @description download parsed resume as PDF
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId",authMiddleware.authUser, interviewController.generateResumePdfController)







module.exports = interviewRouter