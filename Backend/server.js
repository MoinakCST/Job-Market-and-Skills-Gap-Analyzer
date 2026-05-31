require("dotenv").config();
const app = require("./src/app");

const connectToDB = require("./src/config/database");

async function startServer(){

  await connectToDB();  // this line is must(fn call)

  app.listen(3000, () => {
    console.log("server is runnning on port 3000");
  });
}

startServer();