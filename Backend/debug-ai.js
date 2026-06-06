require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod");
const { zodToJsonSchema } = require ("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY 
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().min(1).describe("The technical question to be asked in the interview"),
      intention: z.string().min(1).describe("The intention of interviewer behind asking this question"),
      answer: z.string().min(1).describe("How to answer this question, what points to cover, what approach to take"),
    })
  ).min(2).describe("Technical questions (2-3) that can be asked in the interview along with their intention and answer"),

  behavioralQuestions: z.array(z.object({
    question: z.string().min(1).describe("The behavioral question to be asked in the interview"),
    intention: z.string().min(1).describe("The intention of interviewer behind asking this question"),
    answer: z.string().min(1).describe("How to answer this question, what points to cover, what approach to take"),
  })
  ).min(2).describe("Behavioral questions (2-3) that can be asked in the interview along with their intention and answer"),

  skillGaps: z.array(
    z.object({
      skill: z.string().min(1).describe("The skill which the candidate is lacking"),
      severity: z.enum(["low", "medium", "high"])
        .describe("The severity of this skill gap: low (nice to have), medium (important), or high (critical)"),
    })
  ).min(1).describe("List of skill gaps (1-2) in the candidate's profile along with their severity"),

  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The day number in the preparation plan, starting from 1"),
      focus: z.string().min(1).describe("The main focus of this day in the preparation plan"),
      tasks: z.array(z.string().min(1))
        .min(2).describe("List of 2-3 specific, actionable tasks to be done on this day"),
    })
  ).min(2).describe("A 2-3 day preparation plan for the candidate to follow"),
});

async function debugAIResponse() {
  try {
    console.log("🔍 Debugging AI response...\n");
    
    const prompt = `You are an expert career counselor. Analyze this profile:

CANDIDATE:
- Senior Full Stack Developer with 5+ years experience
- Expert in Node.js, React, MongoDB
- Led team of 3 developers

JOB:
- Senior Full Stack Developer role
- Requires 5+ years, Node.js, React, MongoDB

Generate exactly 2 technical questions with complete answers, 2 behavioral questions with complete answers.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        jsonSchema: zodToJsonSchema(interviewReportSchema, "InterviewReport")
      }
    });

    // Extract text
    let responseText = response.text;
    if (!responseText && response.candidates?.[0]) {
      responseText = response.candidates[0].content?.parts?.[0]?.text;
    }
    
    if (responseText) {
      console.log("Raw JSON (first 1000 chars):");
      console.log(responseText.substring(0, 1000));
      console.log("\n---\n");
      
      const parsed = JSON.parse(responseText);
      console.log("Full keys in parsed object:", Object.keys(parsed));
      console.log("\nFull parsed object:");
      console.log(JSON.stringify(parsed, null, 2));
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
  
  process.exit(0);
}

debugAIResponse();
