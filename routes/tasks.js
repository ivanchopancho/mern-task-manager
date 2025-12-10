import express from "express"
import Task from "../models/Task.js"
import auth from "../middleware/auth.js";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";


var router = express.Router();


// GETS all tasks
//this next line uses an asynchronous promise(?)
router.get("/", auth, getTasks);

//CREATES a new task
//same as the one above, this makes a request to create a task to the server through a promise
router.post("/", auth, createTask);

// UPDATES a task (toggle completed, edit title, etc.)
router.put("/:id", auth, updateTask);

//DELETES a task. 
router.delete("/:id", auth, deleteTask);



export default router;
