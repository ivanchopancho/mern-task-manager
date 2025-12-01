import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors";


dotenv.config()

const app = express();
app.use(cors());

//parse json
app.use(express.json())
import taskRoutes from "./routes/tasks.js";
//mounting the routes
app.use("/api/tasks", taskRoutes);


//connect to mongo
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Mongo is connected")).catch(err => console.log("Mongo error connection", err))


//ROUTES
app.get("/",(req, res) => {
    res.send("API is running...")
});
app.get("/api/info", (req, res) => {
    res.json({ author: "Ivan Puentes", stack: "MERN"})
});


app.listen(5000, () => console.log("Server running on host 5000"))