const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // For environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://todoapplication-k42d.onrender.com", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Import database connection
const connectDB = require("./db");
connectDB();

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = new Task({ title });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
});

// Server Configuration
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
