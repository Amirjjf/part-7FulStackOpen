require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const BlogRouter = require("./controllers/Blogs");
const UserRouter = require("./controllers/Users");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

// Import the testing router
const TestingRouter = require("./controllers/testing");

app.use(express.json());
app.use(cors());

// Select the correct MongoDB URL based on NODE_ENV
const MONGO_URL = process.env.NODE_ENV === "test" ? process.env.TEST_MONGODB_URL : process.env.MONGODB_URL;

logger.info(`Connecting to ${process.env.NODE_ENV === "test" ? "TEST" : "NORMAL"} database:`, MONGO_URL);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    logger.info(`Connected to ${process.env.NODE_ENV === "test" ? "TEST" : "NORMAL"} MongoDB`);
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error.message);
  });

// Apply tokenExtractor globally
app.use(middleware.tokenExtractor);

// Apply userExtractor only to /api/blogs routes
app.use("/api/blogs", middleware.userExtractor, BlogRouter);
app.use("/api/users", UserRouter);

// Conditionally use the testing router in test environment
if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", TestingRouter);
}

// Error handler middleware
app.use((error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Invalid token" });
  }

  next(error);
});

module.exports = app;
