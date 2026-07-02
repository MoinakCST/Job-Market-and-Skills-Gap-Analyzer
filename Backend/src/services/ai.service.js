const { GoogleGenAI } = require("@google/genai")
const {z} = require("zod")
const { zodToJsonSchema } = require ("zod-to-json-schema")



const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY 
})

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().min(1).describe("The technical question to be asked in the interview"),
      intention: z.string().min(1).describe("The intention of interviewer behind asking this question"),
      answer: z.string().min(1).describe("How to answer this question, what points to cover, what approach to take"),
    })
  ).min(5).describe("Technical questions (5-7) that can be asked in the interview along with their intention and answer"),

  behavioralQuestions: z.array(z.object({
    question: z.string().min(1).describe("The behavioral question to be asked in the interview"),
    intention: z.string().min(1).describe("The intention of interviewer behind asking this question"),
    answer: z.string().min(1).describe("How to answer this question, what points to cover, what approach to take"),
  })
  ).min(4).describe("Behavioral questions (4-5) that can be asked in the interview along with their intention and answer"),

  skillGaps: z.array(
    z.object({
      skill: z.string().min(1).describe("The skill which the candidate is lacking"),
      severity: z.enum(["low", "medium", "high"])
        .describe("The severity of this skill gap: low (nice to have), medium (important), or high (critical)"),
    })
  ).min(3).describe("List of skill gaps (3-5) in the candidate's profile along with their severity"),

  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The day number in the preparation plan, starting from 1"),
      focus: z.string().min(1).describe("The main focus of this day in the preparation plan"),
      tasks: z.array(z.string().min(1))
        .min(3).describe("List of 3-4 specific, actionable tasks to be done on this day"),
    })
  ).min(7).describe("A 7-10 day preparation plan for the candidate to follow"),
  title: z.string().describe("The title of the job for which it is generated"),
  
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }){

const prompt = `You are an expert career counselor and interview coach. Analyze the following candidate profile against the job description and generate a comprehensive interview report.

CANDIDATE PROFILE:
Resume:
${resume}

Self Description:
${selfDescription}

TARGET JOB:
${jobDescription}

TASK: Generate a detailed interview preparation report with the following components:

1. MATCH SCORE: Calculate a score (0-100) indicating how well the candidate's profile matches the job requirements.

2. TECHNICAL QUESTIONS: Generate 5-7 specific technical interview questions that are highly relevant to this job. For each question:
   - Ask questions that test key skills mentioned in the job description
   - Consider the candidate's experience level from their resume
   - Focus on real-world problem-solving scenarios

3. BEHAVIORAL QUESTIONS: Generate 4-5 behavioral interview questions designed to assess:
   - How the candidate has handled past situations
   - Relevant to the job role and company culture
   - Examples: teamwork, conflict resolution, learning from failure, etc.

4. SKILL GAPS: Identify 3-5 skill gaps where the candidate's profile differs from job requirements:
   - skill: The specific skill the candidate needs to develop
   - severity: "low" (nice to have), "medium" (important), or "high" (critical for the role)

5. PREPARATION PLAN: Create a 7-10 day preparation plan:
   - day: Sequential day number (1, 2, 3, etc.)
   - focus: The main topic/skill to focus on that day
   - tasks: 3-4 specific, actionable tasks to complete that day (learn, practice, review, build, etc.)

Ensure the preparation plan is realistic, progressive (easier to harder), and directly addresses skill gaps.

Return the report as JSON matching the specified schema.`;

const response = await ai.models.generateContent({
  model:"gemini-2.5-flash",
  contents: prompt,
config: {
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      matchScore: { type: "number" },
      technicalQuestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            intention: { type: "string" },
            answer: { type: "string" }
          },
          required: ["question", "intention", "answer"]
        }
      },
      behavioralQuestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            intention: { type: "string" },
            answer: { type: "string" }
          },
          required: ["question", "intention", "answer"]
        }
      },
      skillGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            severity: { type: "string", enum: ["low", "medium", "high"] }
          },
          required: ["skill", "severity"]
        }
      },
      preparationPlan: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "number" },
            focus: { type: "string" },
            tasks: { type: "array", items: { type: "string" } }
          },
          required: ["day", "focus", "tasks"]
        }
      }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
  }
}
})

try {
  let responseText = response.text
  
  // Extract from nested candidates structure (Google GenAI format)
  if (!responseText && response.candidates && response.candidates[0]) {
    responseText = response.candidates[0].content?.parts?.[0]?.text
  }
  
  if (!responseText) {
    console.error("Response structure:", JSON.stringify(response, null, 2))
    throw new Error("No text content found in API response")
  }
  
  const parsedResponse = JSON.parse(responseText)
  console.log("AI Report Generated Successfully:", {
    matchScore: parsedResponse.matchScore,
    technicalQuestionsCount: parsedResponse.technicalQuestions?.length || 0,
    behavioralQuestionsCount: parsedResponse.behavioralQuestions?.length || 0,
    skillGapsCount: parsedResponse.skillGaps?.length || 0,
    preparationDays: parsedResponse.preparationPlan?.length || 0
  })
  return parsedResponse
} catch (err) {
  console.error("Failed to parse AI response:", err)
  throw new Error("AI response parsing failed: " + err.message)
}

}

module.exports = generateInterviewReport
