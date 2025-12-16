import React from "react";
export default function Task({ task, onToggle, onDelete }) {
  return (
    <div
      onClick={() => onToggle(task._id, task.completed)}
      className={`
    bg-white
    border
    rounded-lg
    p-4
    mb-3
    shadow-sm
    hover:shadow-md
    transition
    ${task.completed ? "opacity-60" : ""}
  `}
    >
      <h3
        className="font-medium text-gray-800"
      >
        {task.title}
      </h3>
      {task.description && (
        <p className="text-sm text-gray-500 mt-1">
          {task.description}
        </p>
      )}
      <span
        className={`ml-4 w-4 h-4 rounded-full border-2 flex-shrink-0
          ${task.completed ? "border-green-700 bg-green-500" : "border-gray-400"}
        `}
      />
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task._id, task.completed)}
        className="
    bg-blue-600 text-white
    px-4 py-2 rounded
    hover:bg-blue-700
    active:scale-95
    transition
  "
      />

    </div>
  );
}