import Task from "./components/Tasks";
import LoginPage from "./components/LoginPage";
import React, { useEffect, useState } from "react";



const App = () => {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  console.log("Token: ", token);
  console.log("isLoggedIn: ", Boolean(token));


  const authHeader = {
    Authorization: `Bearer ${token}`
  };


  //fecthes tasks on load
  useEffect(() => {

    const fetchTasks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
          headers: authHeader
        });




        //FOR DEBUGGING ONLY, DELETE AFTER DEPLOY
        const text = await res.text();
        console.log("RAW RESPONSE TEXT:", text);
        console.log("STATUS:", res.status);

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("FAILED TO PARSE JSON", err)
          data = null
        }

        console.log("PARSED JSON: ", data);


        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.warn("TASKS RESPONSE NOT ARRAY: ", data);
          setTasks([]);
        }



      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();


  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
  };


  const addTask = async () => {
    if (!newTask.trim()) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        title: newTask,
        description
      })
    });

    const created = await res.json();
    setTasks(prev => [created, ...prev]);

    //clear inputs
    setNewTask("");
    setDescription("");
  };


  const toggleTask = async (id, completed) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader },
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
      headers: authHeader
    });



    setTasks(prev => prev.filter(task => task._id !== id));
  };


  //this ensures tasks are not rendered until loading is done AND token exists
  if (!token) return <LoginPage setToken={setToken} />


  if (loading) return (

    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold text-gray-700 animate-pulse">
        Loading tasks...
      </h1>
    </div>
  );


  return (


    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center px-4 py-10">

      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
        <button
          onClick={handleLogout}
          className="
    absolute top-4 right-4
    bg-red-500 text-white
    px-4 py-2 rounded-md
    text-sm font-medium
    hover:bg-red-600
    active:scale-95
    transition
  "
        >
          Logout
        </button>

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-3xl font-semibold text-gray-800">
            My Tasks
          </h1>
        </div>

        <div className="flex flex-col gap-2 mb-6 w-full max-w-md">
          <input
            type="text"
            placeholder="New task title"
            className="
    border border-gray-300
    rounded-md
    px-3 py-2
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  "
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
    border border-gray-300
    rounded-md
    px-3 py-2
    resize-none
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  "
            rows={3}
          />

          <button
            onClick={addTask}
            className="
    bg-blue-600 text-white
    px-4 py-2 rounded
    hover:bg-blue-700
    active:scale-95
    transition
  "          >
            Add
          </button>
        </div>
        <div className="w-full max-w-md">
          {tasks.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg">No tasks yet</p>
              <p className="text-sm">Add your first task above 👆</p>
            </div>
          )}
          {tasks.map(task => (<Task key={task._id} task={task} onToggle={toggleTask} onDelete={deleteTask} />))}
        </div>
      </div>
    </div>

  );



};



export default App;



