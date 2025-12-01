import express from "express"
import Task from "../models/Task.js"


var router = express.Router();


// GETS all tasks
//this next line uses an asynchronous promise(?)
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({createdAt : -1});
    res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
    
});

//CREATES a new task
//same as the one above, this makes a request to create a task to the server through a promise
router.post("/", async (req, res) => {
    try {
        const newTask = await Task.create(req.body)
        res.json(newTask);
    } catch (err) {
        req.status(400).json({ error: err.message })
    }
    
});

// UPDATES a task (toggle completed, edit title, etc.)
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the updated task
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//DELETES a task. 
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
