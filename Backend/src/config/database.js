
const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to database successfully");

        console.log(
            "MongoDB connection state:",
            mongoose.connection.readyState
        );

    } catch (err) {
        console.error("Database connection error:", err.message);
        throw err;
    }
}

module.exports = connectToDB;
