require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database"); 

connectToDB();  // this line is must(fn call)

//invokeGeminiAi();
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });

