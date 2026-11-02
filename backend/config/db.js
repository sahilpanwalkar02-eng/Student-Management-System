const mongoose = require("mongoose");
/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits process on failure to prevent silent errors.
 */

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;