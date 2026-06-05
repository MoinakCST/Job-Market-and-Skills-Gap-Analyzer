const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")

async function generateInterviewReportController(req,res){
    const resumeFile = req.file    

    const resumeContent = pdfParse(req.file.buffer)
    const {selfDescription,jobDescription} = req.body
    
    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    })  

}


module.exports = { generateInterviewReportController }