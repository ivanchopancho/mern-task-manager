import mongoose from "mongoose"

var taskSchema = new mongoose.Schema ({
    title: {type: String, required: true},
    completed: { type: Boolean, default: false}
}, {timestamps: true});

var Task = mongoose.model("Task", taskSchema);


export default Task

