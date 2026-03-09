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

    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <h1 className="text-lg font-medium text-zinc-400 animate-pulse">
        Loading tasks...
      </h1>
    </div>
  );


  return (


    <div className="
    min-h-screen bg-zinc-950 flex justify-center px-4 py-12 text-zinc-100
    ">

      <div className="relative w-full max-w-xl
      bg-zinc-900 border border-zinc-800
      rounded-xl
      shadow-lg shadow-black/40
      p-6">
        <button
          onClick={handleLogout}
          className="
    absolute top-4 right-4
    bg-zinc-800 text-zinc-300
    px-3 py-1.5 rounded-md
    text-xs font-medium
    hover:bg-red-600
    hover:text-white
    transition
  "
        >
          Logout
        </button>

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-2xl font-semibold tracking-wide text-zinc-100">
            My Tasks
          </h1>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <input
            type="text"
            placeholder="New task title"
            className="
    bg-zinc-800
    border border-zinc-700
    rounded-md
    px-3 py-2
    text-sm
    placeholder-zinc-500
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
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
    bg-zinc-800
    border border-zinc-700
    rounded-md
    text-sm
    px-3 py-2
    resize-none
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
  "
            rows={3}
          />

          <button
            onClick={addTask}
            className="
    bg-indigo-600
    text-white
    px-4 py-2
    rounded-md
    hover:bg-indigo-500
    active:scale-95
    transition
  "          >
            Add
          </button>
        </div>
        <div className="w-full max-w-md">
          {tasks.length === 0 && (
            <div className="text-center text-zinc-400 mt-10">
              <p className="text-base font-medium">No tasks yet</p>
              <p className="text-xs text-zinc-500 mt-1">
                Add your first task above 👆
              </p>
            </div>
          )}
          {tasks.map(task => (<Task key={task._id} task={task} onToggle={toggleTask} onDelete={deleteTask} />))}
        </div>
      </div>
    </div>

  );



};



export default App;



