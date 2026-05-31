require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const invokeGeminiAi = require("./src/services/ai.service");

async function startServer(){

  await connectToDB();  // this line is must(fn call)
  await invokeGeminiAi();
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}

startServer();