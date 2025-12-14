import Task from "../models/Task.js";


//handlers for interactions with api/tasks. 
//(these only run when middleware authorizes)

//getting the content of api/tasks 
export const getTasks = async (req, res) => {
  try {
    // Only return tasks that belong to the logged-in user
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// posting into api/tasks
export const createTask = async (req, res) => {

  //checking for shape of req
  console.log("BODY:", req.body);
  console.log("REQ.USER:", req.user);
  console.log("USER ID TYPE:", typeof req.user?.id);

  try {
    const newTask = await Task.create({
      title: req.body.title,
      description: req.body.description,
      userId: req.user.id,
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// modify the content of api/tasks
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// delete something from api/tasks
export const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};