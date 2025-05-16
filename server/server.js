/*const express = require('express');
const mongoose = require('mongoose');
const AddProject = require('./models/project');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Fullstack", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// GET route - Get all projects
app.get('/api/services', async (req, res) => {
  try {
    const projects = await AddProject.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// POST route - Add a new project
app.post('/api/services', async (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    return res.status(400).json({ error: 'Name and status are required' });
  }

  const prjDetails = new AddProject({ id: Date.now(), name, status });

  try {
    await prjDetails.save();
    res.status(200).json({ message: 'Project added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving project' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});*/
import mongoose from "mongoose";
import express from "express";
import AddProject from "./server/models/project.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/api/services", async (req, res) => {
  try {
    const projects = await AddProject.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/api/services", async (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    return res.status(400).json({ error: "Name and status are required" });
  }

  const prjDetails = new AddProject({
    id: Date.now(),
    name,
    status,
  });

  try {
    await prjDetails.save();
    res.status(200).json({ message: "Project added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save project" });
  }
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error("❌ MONGODB_URI is not defined in environment variables.");

    await mongoose.connect(mongoURI, {
      tls: true, // Required for Atlas
    });

    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

startServer();
