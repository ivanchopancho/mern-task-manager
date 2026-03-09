import React from "react";
export default function Task({ task, onToggle, onDelete }) {
  return (
    <div
      onClick={() => onToggle(task._id, task.completed)}
      className={`
    group flex items-start gap-4
    bg-zinc-900
    border border-zinc-800
    rounded-xl
    p-4
    mb-3
    cursor-pointer
    transition
    hover:border-zinc-700
    hover:bg-zinc-800/70
    ${task.completed ? "opacity-50" : ""}
  `}
    >
      <div className="flex-">
        <h3
          className={`
            text-sm font-medium
            text-zinc-100
            ${task.completed ? "line-through text-zinc-500" : ""}
            `}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-zinc-400 mt-1">
            {task.description}
          </p>
        )}
      </div>
      <span
        className={`
          mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 transition
          ${task.completed
            ? "border-emerald-500 bg-emerald-500"
            : "border-zinc-500 group-hover:border-zinc-400"}
        `}
      />


    </div>
  );
}