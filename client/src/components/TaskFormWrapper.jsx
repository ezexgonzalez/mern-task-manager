import { useState, useRef, useEffect } from "react";
import TaskForm from "./TaskForm.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const TaskFormWrapper = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  // Para pasar el valor del título al form
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <motion.div
      ref={drawerRef}
      className="
        w-full  mt-4
        bg-glassLight backdrop-blur-md
        rounded-bubble border border-borderGlass shadow-bubble
        px-5 py-4
      "
    >
      {/* Input fijo */}
      <div
        className="flex items-center gap-3 cursor-text"
        onClick={() => setOpen(true)}
      >
        <Plus className="text-success" size={22} />

        <input
          type="text"
          placeholder="¿Alguna idea nueva?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            flex-1 bg-transparent 
            text-gray-200 placeholder-gray-500
            focus:outline-none
          "
        />
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            // 👇 sin overflow-hidden
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-px bg-borderGlass/60 mt-4 mb-4"></div>

            <TaskForm
              titleValue={title}
              onSubmit={(data) => {
                onSubmit(data);
                setTitle("");
                setOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskFormWrapper;
