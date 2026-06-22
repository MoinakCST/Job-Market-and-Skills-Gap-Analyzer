const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const pdfparse = require("pdf-parse");

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required."
            });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "Self description and job description are required."
            });
        }

        console.log("Generating interview report for user:", req.user.id);

        const resumeData = await pdfparse(req.file.buffer);

        console.log("========== FILE INFO ==========");
        console.log("FILE NAME:", req.file.originalname);
        console.log("FILE SIZE:", req.file.size);
        console.log("MIME TYPE:", req.file.mimetype);

        console.log("========== REQUEST BODY ==========");
        console.log("SELF DESCRIPTION:");
        console.log(selfDescription);

        console.log("JOB DESCRIPTION:");
        console.log(jobDescription.substring(0, 300));

        console.log("========== PDF TEXT PREVIEW ==========");
        console.log(resumeData.text.substring(0, 500));
        console.log("=====================================");

        const resumeContent = {
            text: resumeData.text
        };

        console.log("Resume parsed, calling AI service...");

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        console.log("AI Report Generated Successfully");

        console.log("Saving interview report to database...");

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        console.log("Interview report generated and saved successfully!");

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (err) {
        console.error("Error generating interview report:", err);

        return res.status(500).json({
            message: "Failed to generate interview report.",
            error: err.message
        });
    }
}

module.exports = {
    generateInterviewReportController
};
