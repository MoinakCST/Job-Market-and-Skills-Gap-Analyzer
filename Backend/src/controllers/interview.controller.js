const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const pdfparse = require("pdf-parse");

function escapePdfText(value) {
    return value
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");
}

function wrapTextToLines(text, maxCharsPerLine) {
    const rawLines = text.split("\n");
    const wrappedLines = [];

    for (const rawLine of rawLines) {
        const normalized = rawLine.trimEnd();
        if (!normalized) {
            wrappedLines.push("");
            continue;
        }

        const words = normalized.split(/\s+/);
        let currentLine = "";

        for (const word of words) {
            if (!currentLine) {
                if (word.length <= maxCharsPerLine) {
                    currentLine = word;
                } else {
                    for (let index = 0; index < word.length; index += maxCharsPerLine) {
                        wrappedLines.push(word.slice(index, index + maxCharsPerLine));
                    }
                }
                continue;
            }

            const candidate = `${currentLine} ${word}`;
            if (candidate.length <= maxCharsPerLine) {
                currentLine = candidate;
                continue;
            }

            wrappedLines.push(currentLine);
            if (word.length <= maxCharsPerLine) {
                currentLine = word;
            } else {
                currentLine = "";
                for (let index = 0; index < word.length; index += maxCharsPerLine) {
                    wrappedLines.push(word.slice(index, index + maxCharsPerLine));
                }
            }
        }

        if (currentLine) {
            wrappedLines.push(currentLine);
        }
    }

    return wrappedLines;
}

function buildSimplePdfBuffer(text) {
    const normalizedText = (typeof text === "string" ? text : "")
        .replace(/\r\n/g, "\n")
        .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");

    const lines = wrapTextToLines(normalizedText, 92);
    const linesPerPage = 48;
    const pages = [];

    for (let index = 0; index < lines.length; index += linesPerPage) {
        pages.push(lines.slice(index, index + linesPerPage));
    }

    if (pages.length === 0) {
        pages.push([ "No resume text available." ]);
    }

    const objects = [];
    const catalogObjectId = 1;
    const pagesObjectId = 2;
    const fontObjectId = 3;

    const pageObjectIds = [];
    const contentObjectIds = [];

    let nextObjectId = 4;
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
        contentObjectIds.push(nextObjectId);
        pageObjectIds.push(nextObjectId + 1);
        nextObjectId += 2;
    }

    objects.push({
        id: catalogObjectId,
        content: `<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`
    });

    objects.push({
        id: pagesObjectId,
        content: `<< /Type /Pages /Count ${pages.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] >>`
    });

    objects.push({
        id: fontObjectId,
        content: "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
    });

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
        const pageLines = pages[pageIndex];
        const streamLines = [
            "BT",
            "/F1 11 Tf",
            "14 TL",
            "50 790 Td"
        ];

        pageLines.forEach((line, lineIndex) => {
            const safeLine = escapePdfText(line);
            if (lineIndex === 0) {
                streamLines.push(`(${safeLine}) Tj`);
                return;
            }
            streamLines.push("T*");
            streamLines.push(`(${safeLine}) Tj`);
        });

        streamLines.push("ET");
        const streamContent = `${streamLines.join("\n")}\n`;

        objects.push({
            id: contentObjectIds[pageIndex],
            content: `<< /Length ${Buffer.byteLength(streamContent, "utf8")} >>\nstream\n${streamContent}endstream`
        });

        objects.push({
            id: pageObjectIds[pageIndex],
            content: `<< /Type /Page /Parent ${pagesObjectId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectIds[pageIndex]} 0 R >>`
        });
    }

    let pdf = "%PDF-1.4\n";
    const offsets = [ 0 ];

    for (const object of objects) {
        offsets.push(Buffer.byteLength(pdf, "utf8"));
        pdf += `${object.id} 0 obj\n${object.content}\nendobj\n`;
    }

    const xrefStart = Buffer.byteLength(pdf, "utf8");
    const totalObjects = objects.length + 1;

    pdf += `xref\n0 ${totalObjects}\n`;
    pdf += "0000000000 65535 f \n";
    for (let index = 1; index < offsets.length; index += 1) {
        pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${totalObjects} /Root ${catalogObjectId} 0 R >>\n`;
    pdf += `startxref\n${xrefStart}\n%%EOF`;

    return Buffer.from(pdf, "utf8");
}

function sanitizeFilename(value) {
    return value
        .replace(/[^\w.\- ]+/g, " ")
        .trim()
        .replace(/\s+/g, "_");
}

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
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch interview report.",
            error: err.message
        });
    }
}

/**
 * @description Controller to get all interview reports of logged in user
 */

async function getAllInterviewReportController(req,res){
    try {
        const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt: -1 }).
        select("-resume -selfDescription -jobDescription -__v -technicalQuestions.answer -technicalQuestions.explanation -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(200).json({
            message:"Interview reports fetched succcessfully.",
            interviewReports
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch interview reports.",
            error: err.message
        });
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        }).select("resume title");

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        if (!interviewReport.resume || !interviewReport.resume.trim()) {
            return res.status(400).json({
                message: "Resume text is not available for this report."
            });
        }

        const pdfBuffer = buildSimplePdfBuffer(interviewReport.resume);
        const safeTitle = sanitizeFilename(interviewReport.title || "resume");
        const fileName = `${safeTitle}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        return res.status(200).send(pdfBuffer);
    } catch (err) {
        return res.status(500).json({
            message: "Failed to generate resume PDF.",
            error: err.message
        });
    }
}


module.exports = {
    generateInterviewReportController,
    getAllInterviewReportController,
    generateInterviewReportByIdController,
    generateResumePdfController
};
