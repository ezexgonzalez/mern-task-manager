import { useState, useRef, useEffect } from "react";
import { MoreVertical, CheckCircle2, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const STATUS_DOT_COLOR = {
  pending: "bg-warning",
  "in-progress": "bg-progress",
  completed: "bg-success",
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const dotClass = STATUS_DOT_COLOR[task.status] || "bg-warning";
  const isCompleted = task.status === "completed";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef(null);

  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit?.(task);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete?.(task._id);
  };

  const handleToggleComplete = () => {
    setIsMenuOpen(false);

    const nextStatus = isCompleted ? "pending" : "completed";
    onStatusChange?.(task._id, nextStatus);
  };

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
        bg-glassLight backdrop-blur-md
        rounded-bubble border border-borderGlass
        shadow-bubble px-5 py-4
        transition flex justify-between items-start gap-3
        hover:bg-glassMedium hover:border-glassMedium
        ${
          isCompleted
            ? "opacity-60"
            : "hover:-translate-y-[1px] hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)]"
        }
        ${isMenuOpen ? "z-20" : "z-0"}
        group
      `}
    >
      {/* Izquierda: dot + textos */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span
          className={`
            w-2.5 h-2.5 rounded-full mt-1 shrink-0
            ${dotClass}
          `}
        />

        <div className="flex flex-col min-w-0">
          <h3
            className={`
              text-gray-100 font-semibold text-base leading-snug
              ${isCompleted ? "line-through text-gray-200/80" : ""}
            `}
          >
            {task.title}
          </h3>

          <p
            className={`
              text-sm mt-1 break-words
              ${isCompleted ? "text-slate-500" : "text-slate-400"}
            `}
          >
            {task.description || "Descripción opcional"}
          </p>
        </div>
      </div>

      {/* Botón 3 puntos */}
      <button
        onClick={handleToggleMenu}
        className="
          shrink-0 rounded-full w-7 h-7
          flex items-center justify-center
          hover:bg-white/5 active:scale-95
          transition opacity-80 group-hover:opacity-100
        "
        aria-label="Abrir menú de tarea"
      >
        <MoreVertical className="w-4 h-4 text-slate-400" />
      </button>

      {/* Menú flotante */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="
              absolute right-3 top-10
              bg-black/60 backdrop-blur-md border border-borderGlass
              rounded-xl shadow-bubble
              py-1 text-sm min-w-[160px]
              origin-top-right
            "
          >
            {/* ✅ Nueva opción */}
            <button
              className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-gray-100 flex items-center gap-2"
              onClick={handleToggleComplete}
            >
              {isCompleted ? (
                <>
                  <RotateCcw className="w-4 h-4 text-slate-300" />
                  Reabrir
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-300" />
                  Completar
                </>
              )}
            </button>
            <button
              className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-gray-100"
              onClick={handleEdit}
            >
              Editar
            </button>
            <button
              className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-red-500/10"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskCard;
