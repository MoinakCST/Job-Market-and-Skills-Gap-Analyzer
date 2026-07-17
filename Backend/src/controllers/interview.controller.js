const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const pdfparse = require("pdf-parse");

/**
 * @description  controller to generate interview report based on user self description ,resume and job description
 */



async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required."
            });
        }

        const { selfDescription, jobDescription, title } = req.body;
        const normalizedSelfDescription = typeof selfDescription === "string" ? selfDescription.trim() : "";
        const normalizedJobDescription = typeof jobDescription === "string" ? jobDescription.trim() : "";

        if (!normalizedSelfDescription || !normalizedJobDescription) {
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
        console.log(normalizedSelfDescription);

        console.log("JOB DESCRIPTION:");
        console.log(normalizedJobDescription.substring(0, 300));

        console.log("========== PDF TEXT PREVIEW ==========");
        console.log(resumeData.text.substring(0, 500));
        console.log("=====================================");

        const resumeContent = {
            text: resumeData.text
        };

        console.log("Resume parsed, calling AI service...");

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription: normalizedSelfDescription,
            jobDescription: normalizedJobDescription
        });

        console.log("AI Report Generated Successfully");

        console.log("Saving interview report to database...");

        const normalizedRequestedTitle = typeof title === "string" ? title.trim() : "";
        const normalizedGeneratedTitle = typeof interviewReportByAi.title === "string" ? interviewReportByAi.title.trim() : "";
        const normalizedJobDescriptionTitle = normalizedJobDescription
            .split("\n")
            .map((line) => line.trim())
            .find((line) => line.length > 0)
            ?.slice(0, 150) || "";

        const finalReportTitle = normalizedRequestedTitle || normalizedGeneratedTitle || normalizedJobDescriptionTitle;

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription: normalizedSelfDescription,
            jobDescription: normalizedJobDescription,
            ...interviewReportByAi,
            title: finalReportTitle
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

/**
 * @description  controller to generate interview report by interview id
 */


async function generateInterviewReportByIdController(req,res){
    
}

/**
 * @description Controller to get all interview reports of logged in user
 */

async function getAllInterviewReportController(req,res){
    const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt: -1 }).
    select("-resume -selfDescription -jobDescription -__v -technicalQuestions.answer -technicalQuestions.explanation -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message:"Interview reports fetched succcessfully.",
        interviewReports
    })
}


module.exports = {
    generateInterviewReportController
};
