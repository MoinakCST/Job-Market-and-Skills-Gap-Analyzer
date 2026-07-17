require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

async function startServer() {
  try {
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

startServer();