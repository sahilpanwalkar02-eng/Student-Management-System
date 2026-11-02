const mongoose = require('mongoose');

/**
 * Student schema — defines the shape of student documents in MongoDB.
 */

const studentSchema = new mongoose.Schema(
        {
            name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        course: {
            type: String,
            required: [true, "Course is required"],
            trim: true,
        },
        age: {
            type: Number,
            required: [true, "Age is required"],
            min: [10, "Age must be at least 10"],
            max: [100, "Age must be at most 100"],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Student', studentSchema);