import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getDueDateInfo,
  getTaskPriorityOption,
  getTaskStatusOption,
} from "../constants/taskOptions.js";
import TaskActionsMenu from "./task/TaskActionsMenu.jsx";
import TaskMeta from "./task/TaskMeta.jsx";
import TaskStatusIndicator from "./task/TaskStatusIndicator.jsx";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const status = getTaskStatusOption(task.status);
  const priority = getTaskPriorityOption(task.priority);

  const isCompleted = task.status === "completed";
  const isPending = task.isPending === true;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef(null);

  const handleToggleMenu = () => {
    if (isPending) return;
    setIsMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit?.(task);
  };

  const handleDelete = () => {
    if (isPending) return;
    setIsMenuOpen(false);
    onDelete?.(task._id);
  };

  const handleToggleComplete = () => {
    if (isPending) return;

    setIsMenuOpen(false);
    const nextStatus = isCompleted ? "pending" : "completed";

    onStatusChange?.(task._id, nextStatus);
  };

  const dueDateInfo = getDueDateInfo(task.dueDate);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div
      ref={cardRef}
      className={`
        relative w-full
        rounded-bubble 
        shadow-bubble px-5 py-4
        transition-all duration-300 ease-out
        flex justify-between items-start gap-3

        ${isMenuOpen ? "z-50" : "z-0"}

        ${
          isPending
            ? "bg-glassLight border border-white/30 cursor-wait shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            : isCompleted
              ? "bg-white/[0.03] border border-white/10"
              : "bg-white/[0.05] border border-white/10 backdrop-blur-md hover:bg-white/[0.075] hover:border-white/15 hover:-translate-y-[1px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
        }

        group
      `}
    >
      {isPending && (
        <motion.div
          layoutId={`pulse-${task._id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-bubble border border-white/40 pointer-events-none"
        />
      )}

      <div className="flex items-start gap-3 flex-1 min-w-0 z-10 relative">
        <TaskStatusIndicator isPending={isPending} dotClass={status.dotClass} />

        <div className="flex flex-col min-w-0 flex-1">
          <div className="min-w-0">
            <h3
              className={`
                text-gray-100 font-semibold text-base leading-snug transition-colors truncate
                ${isCompleted ? "line-through text-slate-400" : ""}
              `}
            >
              {task.title}
            </h3>
          </div>

          {task.description?.trim() && (
            <p
              className={`
                text-sm mt-1 break-words transition-colors
                ${isCompleted ? "text-slate-600" : "text-slate-400"}
              `}
            >
              {task.description}
            </p>
          )}

          <TaskMeta
            priority={priority}
            dueDateInfo={dueDateInfo}
            isCompleted={isCompleted}
          />
        </div>
      </div>

      {!isPending && (
        <button
          onClick={handleToggleMenu}
          className="
            shrink-0 rounded-full w-7 h-7
            flex items-center justify-center
            hover:bg-white/5 active:scale-95
            transition opacity-80 group-hover:opacity-100
            z-10 relative
          "
        >
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </button>
      )}

      <AnimatePresence>
        {isMenuOpen && !isPending && (
          <TaskActionsMenu
            isCompleted={isCompleted}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskCard;
