import React from "react";
export default function Task({ task, onToggle, onDelete }) {
  return (
    <div
      onClick={() => onToggle(task._id, task.completed)}
      className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow cursor-pointer transition-all duration-200
        ${task.completed ? "bg-green-100 hover:bg-green-200" : "bg-white hover:bg-gray-100"}
      `}
    >
      <h3
        className={`text-gray-800 font-medium ${task.completed ? "line-through text-green-700" : ""}`}
      >
        {task.title}
      </h3>
      <span
        className={`ml-4 w-4 h-4 rounded-full border-2 flex-shrink-0
          ${task.completed ? "border-green-700 bg-green-500" : "border-gray-400"}
        `}
      />
       <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering toggle
          onDelete(task._id);
        }}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        ✕
      </button>
    </div>
  );
}