require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ROUTES
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/auth.routes"); // ✅ ADD THIS

const app = express();
const port = process.env.PORT || 5001;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ IMPORTANT

// ROUTES
app.use("/api/auth", authRoutes);   // 🔑 AUTH FIRST
app.use("/api/todos", todoRoutes);  // 🔒 PROTECTED TODOS

// SERVER START
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  } catch (error) {
    console.log("Server failed to start", error);
    process.exit(1);
  }
};

startServer();
