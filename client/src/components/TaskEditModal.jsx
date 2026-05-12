// TaskEditModal.jsx
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import TaskForm from "./TaskForm.jsx";

const TaskEditModal = ({ isOpen, task, onClose, onSubmit }) => {
  return (
    <AnimatePresence>
      {isOpen && task && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div
              className="
                bg-dark/90 backdrop-blur-xl border border-borderGlass
                rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.65)]
                px-5 py-5
                max-w-lg w-full
                text-gray-100
              "
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-semibold">Editar tarea</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Ajustá contenido, estado, prioridad o fecha.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="
                    shrink-0 w-8 h-8 rounded-full
                    flex items-center justify-center
                    text-slate-400 hover:text-slate-200 hover:bg-white/5
                    transition active:scale-95
                  "
                  aria-label="Cerrar modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <TaskForm
                onSubmit={(data) => onSubmit(task._id, data)}
                initialTask={task}
                submitLabel="Guardar cambios"
                showTitleInput={true}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskEditModal;
