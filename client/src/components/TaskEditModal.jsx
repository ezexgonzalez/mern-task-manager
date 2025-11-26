// TaskEditModal.jsx
import { AnimatePresence, motion } from "framer-motion";
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
                bg-glassLight border border-borderGlass
                rounded-2xl shadow-bubble
                px-5 py-4
                max-w-lg w-full
                text-gray-100
              "
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold">Editar tarea</h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 text-sm"
                >
                  Cerrar
                </button>
              </div>

              <TaskForm
                onSubmit={(data) => onSubmit(task._id, data)}
                initialTask={task}
                submitLabel="Guardar cambios"
                showTitleInput={true}   // 👈 ahora sí mostramos el título
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskEditModal;

