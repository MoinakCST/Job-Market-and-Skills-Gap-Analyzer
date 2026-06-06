const pdfparse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required." })
        }

        const { selfDescription, jobDescription } = req.body

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({ message: "Self description and job description are required." })
        }

        console.log("🔄 Generating interview report for user:", req.user.id)
        
        const resumeContent = await (new pdfparse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

        console.log("📄 Resume parsed, calling AI service...")
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        console.log("💾 Saving interview report to database...")
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        console.log("✅ Interview report generated and saved successfully!")
        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("❌ Error generating interview report:", err)
        res.status(500).json({ 
            message: "Failed to generate interview report.", 
            error: err.message 
        })
    }
}

module.exports = { generateInterviewReportController }