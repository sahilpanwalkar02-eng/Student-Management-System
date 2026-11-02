/**
 * Global error handling middleware.
 * Catches all errors thrown by controllers and returns clean JSON responses.
 */

const errorHandler = (err, req, res, next) => {
    console.error(` [ERROR] ${err.message}`);

    // Mongoose duplicate key error (e.g. duplicate email)
    if (err.code === 11000) {
        return res.status(400).json({ 
            success: false,
            message: " A student with this email alraedy exists.",
         });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((e) => e.message);
        return resstatus(400).json({
            success: false,
            message: message.join(","),
        });
    }

    // Mongoose validation error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}

modue.exports = errorHandler;