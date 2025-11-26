import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const STATUS_DOT_COLOR = {
  pending: "bg-warning",        // naranja
  "in-progress": "bg-progress", // amarillo
  completed: "bg-success",      // verde
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const dotClass = STATUS_DOT_COLOR[task.status] || "bg-warning";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef(null);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    if (onEdit) onEdit(task);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (onDelete) onDelete(task._id);
  };

  // cerrar menú al clickear fuera
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div
      ref={cardRef}
      className={`
        relative
        w-full
        bg-glassLight backdrop-blur-md
        rounded-bubble border border-borderGlass
        shadow-bubble
        px-5 py-4
        transition
        flex justify-between items-center
        hover:bg-glassMedium
        hover:border-glassMedium  
        hover:-translate-y-[1px]  
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)]
        ${isMenuOpen ? "z-20" : "z-0"}
        group
      `}
    >
      {/* Izquierda: dot + textos */}
      <div className="flex items-start gap-3">
        <span className={`w-2.5 h-2.5 rounded-full mt-1 ${dotClass}`} />

        <div className="flex flex-col">
          <h3 className="text-gray-100 font-semibold text-base leading-snug">
            {task.title}
          </h3>

          <p className="text-slate-400 text-sm mt-1">
            {task.description || "Descripción opcional"}
          </p>
        </div>
      </div>

      {/* Botón 3 puntos */}
      <button
        onClick={handleToggleMenu}
        className="
          rounded-full
          w-7 h-7
          flex items-center justify-center
          hover:bg-white/5
          active:scale-95
          transition
          opacity-80
          group-hover:opacity-100
        "
      >
        <MoreVertical className="w-4 h-4 text-slate-400" />
      </button>

      {/* Menú flotante alineado al botón + animación */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="
              absolute right-7 top-[56px]
              -translate-y-1/2
              bg-black/50 backdrop-blur-md  border border-borderGlass
              rounded-xl shadow-bubble
              py-1
              text-sm
              min-w-[140px]
            "
          >
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




