import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
}));

//parse json
app.use(express.json());

import taskRoutes from "./routes/tasks.js";
//mounting the routes
app.use("/api/tasks", taskRoutes);

//connect to mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo is connected"))
  .catch(err => console.log("Mongo error connection", err));

// ROUTES
app.get("/api/info", (req, res) => {
  res.json({ author: "Ivan Puentes", stack: "MERN" });
});

// ========== PRODUCTION (Render) ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "mern-frontend", "dist");

// Serve static files
app.use(express.static(frontendPath));

// Serve React frontend for any unknown route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));