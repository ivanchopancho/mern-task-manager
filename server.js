import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";




dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
}));

//parse json
app.use(express.json());

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

//routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//connect to mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo is connected"))
  .catch(err => console.log("Mongo error connection", err));

// ROUTES
app.get("/api/info", (req, res) => {
  res.json({ author: "Ivan Puentes", stack: "MERN" });
});

app.get("/", (req, res) => {
  res.send("API is working");
});


import path from "path";
import { fileURLToPath } from "url";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build
app.use(express.static(path.join(__dirname, "mern-frontend", "dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "mern-frontend", "dist", "index.html"));
});


// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));