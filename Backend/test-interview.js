require("dotenv").config();
const generateInterviewReport = require("./src/services/ai.service");

// Mock data for testing
const testData = {
  resume: `
    Senior Full Stack Developer with 5+ years of experience
    - Expert in Node.js, React, MongoDB
    - Led team of 3 developers
    - Shipped 2 major products
    - Strong in REST APIs and microservices
  `,
  selfDescription: "I'm a passionate developer who loves solving complex problems and mentoring junior developers. I have experience building scalable web applications.",
  jobDescription: `
    We're looking for a Senior Full Stack Developer
    Requirements:
    - 5+ years of web development experience
    - Node.js and React expertise
    - MongoDB experience
    - Leadership/mentoring skills
    - Experience with Docker and AWS
    Responsibilities:
    - Lead development of new features
    - Mentor junior developers
    - Design and implement scalable solutions
  `
};

async function testInterviewReport() {
  try {
    console.log("🧪 Starting interview report generation test...\n");
    
    const report = await generateInterviewReport(testData);
    
    console.log("\n✅ TEST RESULTS:\n");
    console.log("1. matchScore:", report.matchScore, typeof report.matchScore);
    console.log("2. technicalQuestions count:", report.technicalQuestions?.length);
    if (report.technicalQuestions?.[0]) {
      console.log("   - First question exists:", !!report.technicalQuestions[0].question);
      console.log("   - First answer exists:", !!report.technicalQuestions[0].answer);
      console.log("   - First answer length:", report.technicalQuestions[0].answer?.length);
    }
    
    console.log("3. behavioralQuestions count:", report.behavioralQuestions?.length);
    if (report.behavioralQuestions?.[0]) {
      console.log("   - First question exists:", !!report.behavioralQuestions[0].question);
      console.log("   - First answer exists:", !!report.behavioralQuestions[0].answer);
    }
    
    console.log("4. skillGaps count:", report.skillGaps?.length);
    console.log("5. preparationPlan days:", report.preparationPlan?.length);
    
    // Validate all required fields
    console.log("\n📋 VALIDATION CHECKS:");
    let allPassed = true;
    
    if (typeof report.matchScore !== 'number' || report.matchScore < 0 || report.matchScore > 100) {
      console.log("❌ matchScore invalid:", report.matchScore);
      allPassed = false;
    } else {
      console.log("✅ matchScore valid:", report.matchScore);
    }
    
    const techQValid = report.technicalQuestions?.every(q => q.question && q.intention && q.answer && q.answer.length > 0);
    console.log(techQValid ? "✅ All technical questions have answers" : "❌ Some technical questions missing answers");
    allPassed = allPassed && techQValid;
    
    const behavQValid = report.behavioralQuestions?.every(q => q.question && q.intention && q.answer && q.answer.length > 0);
    console.log(behavQValid ? "✅ All behavioral questions have answers" : "❌ Some behavioral questions missing answers");
    allPassed = allPassed && behavQValid;
    
    const skillsValid = report.skillGaps?.every(s => s.skill && s.severity);
    console.log(skillsValid ? "✅ All skill gaps valid" : "❌ Some skill gaps invalid");
    allPassed = allPassed && skillsValid;
    
    const planValid = report.preparationPlan?.every(p => p.day && p.focus && p.tasks?.length > 0);
    console.log(planValid ? "✅ Preparation plan valid" : "❌ Preparation plan invalid");
    allPassed = allPassed && planValid;
    
    console.log("\n" + (allPassed ? "🎉 ALL TESTS PASSED!" : "⚠️ SOME TESTS FAILED"));
    
  } catch (error) {
    console.error("❌ Test failed with error:");
    console.error(error.message);
    console.error(error.stack);
  }
  
  process.exit(0);
}

testInterviewReport();
