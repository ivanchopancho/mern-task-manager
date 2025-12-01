import Task from "./components/Tasks";
import React, { useEffect, useState } from "react";



const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");



  


  //fecthes tasks on load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
    
    
  }, []);

  const addTask = async () => {
  if (!newTask.trim()) return;

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTask })
  });

  const created = await res.json();
  setTasks(prev => [created, ...prev]);
  
  setNewTask(""); // clear input
};

  //toggleTask CHANGES the tasks STATE from COMPLETED to UNCOMPLETED
  const toggleTask = async (id, completed) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed })
    
  });

  const updated = await res.json();

  setTasks(prev =>
    prev.map(task => (task._id === id ? updated : task))
  );
};

  const deleteTask = async (id) => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });

  setTasks(prev => prev.filter(task => task._id !== id));
};

  

  

  if (loading) return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-700 animate-pulse">
          Loading tasks...
        </h1>
      </div>
      );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Tasks</h1>
      <div className="flex gap-2 mb-6">
  <input
    type="text"
    placeholder="New task..."
    className="flex-grow border rounded px-3 py-2"
    value={newTask}
    onChange={(e) => setNewTask(e.target.value)}
    onKeyDown={(e) => {
    if (e.key === "Enter") addTask();
  }}
  />

  <button
    onClick={addTask}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  >
    Add
  </button>
</div>
      <div className="w-full max-w-md">
        {tasks.map(task => (<Task key={task._id} task={task} onToggle={toggleTask} onDelete={deleteTask}/>))}
      </div>
    </div>
  );



};



export default App;

