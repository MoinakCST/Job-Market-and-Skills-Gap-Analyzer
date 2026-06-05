const { GoogleGenAI } = require("@google/genai")
const {z} = require("zod")
const { zodToJsonSchema } = require ("zod-to-json-schema")



const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY 
})

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matche the job description"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take"),
    })
  ).describe("Technical questions that can be asked in the interview along with their intention and answer"),

  behavioralQuestions: z.array(z.object({question: z.string().describe
    ("The technical question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take"),
    })
  ).describe(
    "Behavioral questions that can be asked in the interview along with their intention and answer"
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill which the candidate is lacking"),
      severity: z.enum(["low", "medium", "high"])
        .describe("The severity of this skill gap, i.e. low, medium or high"),
    })
  ).describe(
    "List of skill gaps in the candidate's profile along with their severity"
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The day number in the preparation plan, starting from 1"),
      focus: z.string().describe("The main focus of this day in the preparation plan"),
      tasks: z.array(z.string())
        .describe("List of tasks to be done on this day"),
    })
  ).describe(
    "A day-wise preparation plan for the candidate to follow"
  ),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }){

  const prompt = `Generate an interview report for a candidate  with the following details: 
                    Resume:${resume}
                    Self Description:${description}
                    Job description:${jobDescription}
`

const response = await ai.models.generateContent({
  model:"gemini-2.5-flash",
  contents:"",
  config:{
    responseMimeType:"application/json",
    jsonSchema: zodToJsonSchema(interviewReportSchema,"InterviewReport")
  }
})

return JSON.parse(response.text)

}

module.exports = generateInterviewReport