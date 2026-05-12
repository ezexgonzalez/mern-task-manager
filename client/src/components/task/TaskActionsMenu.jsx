import { CheckCircle2, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const TaskActionsMenu = ({ isCompleted, onToggleComplete, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -5 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="
        absolute right-3 top-10
        bg-dark/90 backdrop-blur-xl border border-glassMedium
        rounded-xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.7)]
        py-1 text-sm min-w-[160px]
        origin-top-right
        z-50
      "
    >
      <button
        className="w-full text-left px-3 py-2 hover:bg-white/5 text-gray-100 flex items-center gap-2 transition-colors"
        onClick={onToggleComplete}
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
        className="w-full text-left px-3 py-2 hover:bg-white/5 text-gray-100 flex items-center gap-2 transition-colors"
        onClick={onEdit}
      >
        <Pencil className="w-4 h-4 text-slate-300" />
        Editar
      </button>

      <button
        className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
        Eliminar
      </button>
    </motion.div>
  );
};

export default TaskActionsMenu;
