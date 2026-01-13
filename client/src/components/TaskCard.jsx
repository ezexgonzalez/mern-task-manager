import { useState, useRef, useEffect } from "react";
import { MoreVertical, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const STATUS_DOT_COLOR = {
  pending: "bg-warning",
  "in-progress": "bg-progress",
  completed: "bg-success",
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const dotClass = STATUS_DOT_COLOR[task.status] || "bg-warning";

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

    // 🔴 ANTES (El error):
    // const idToUpdate = task.serverId ?? task._id;

    // 🟢 AHORA (La solución):
    // Enviamos siempre el _id local. El hook useTasks ya sabe qué hacer con él.
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
        /* Estilos base Glass */
        rounded-bubble 
        shadow-bubble px-5 py-4
        transition-all duration-300 ease-out
        flex justify-between items-start gap-3
        
        /* 🔥 Z-INDEX HANDLING:
           Si el menú está abierto, z-50.
           Si no, z-0.
           Esto asegura que el menú flote sobre las otras cards.
        */
        ${isMenuOpen ? "z-50" : "z-0"}

        /* 🎨 ESTADOS VISUALES */
        ${
          isPending
            ? "bg-glassLight border border-white/30 cursor-wait shadow-[0_0_15px_rgba(255,255,255,0.05)]" // Pending: Borde más claro y brillo sutil
            : isCompleted
            ? "opacity-60 bg-glassLight border border-borderGlass" // Completed: Apagado
            : "bg-glassLight border border-borderGlass backdrop-blur-md hover:bg-glassMedium hover:border-glassMedium hover:-translate-y-[1px] hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)]" // Normal
        }
        
        group
      `}
    >
      {/* ✨ ANIMACIÓN "BREATHING" (Respiración)
         Solo si está pending. Usamos un div absoluto inset para animar el borde/fondo 
         sin afectar el layout, pero SIN overflow-hidden para no matar el menú.
      */}
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

      {/* Contenido (z-10 para asegurar clickabilidad sobre cualquier efecto) */}
      <div className="flex items-start gap-3 flex-1 min-w-0 z-10 relative">
        {/* ICONO: Si está pending mostramos un Spinner, si no, el punto de color */}
        <div className="mt-1 shrink-0 w-3 h-3 flex items-center justify-center">
          {isPending ? (
            <Loader2 className="w-3 h-3 text-white/50 animate-spin" />
          ) : (
            <span
              className={`block w-2.5 h-2.5 rounded-full transition-colors duration-300 ${dotClass}`}
            />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <h3
            className={`
              text-gray-100 font-semibold text-base leading-snug transition-colors
              ${isCompleted ? "line-through text-gray-200/80" : ""}
              /* Si es pending, el texto es solido (no opaco) */
            `}
          >
            {task.title}
          </h3>

          <p
            className={`
              text-sm mt-1 break-words transition-colors
              ${isCompleted ? "text-slate-500" : "text-slate-400"}
            `}
          >
            {task.description || "Descripción opcional"}
          </p>
        </div>
      </div>

      {/* Botón 3 puntos */}
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

      {/* Menú flotante */}
      <AnimatePresence>
        {isMenuOpen && !isPending && (
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
              className="w-full text-left px-3 py-2 hover:bg-white/5 text-gray-100 transition-colors"
              onClick={handleEdit}
            >
              Editar
            </button>

            <button
              className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
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
