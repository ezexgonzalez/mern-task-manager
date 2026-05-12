import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const TaskSelect = ({
  value,
  options,
  currentOption,
  open,
  onToggle,
  onChange,
  labelPrefix = "",
}) => {
  const visibleOptions = options.filter((option) => option.value !== value);

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <button
        type="button"
        onClick={onToggle}
        className="
          w-full px-3 py-2.5
          bg-white/[0.035] backdrop-blur-md
          rounded-bubble border border-white/10
          text-gray-200 text-sm
          flex items-center justify-between gap-3
          shadow-bubble
          focus:outline-none focus:ring-2 focus:ring-glassMedium
          transition hover:bg-white/[0.055]
        "
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${currentOption.dotClass}`}
          />
          <span className="truncate">
            {labelPrefix}
            {currentOption.label}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0, y: -4 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="
              bg-dark/90 backdrop-blur-xl
              rounded-bubble border border-white/10
              shadow-bubble overflow-hidden
            "
          >
            {visibleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className="
                  w-full px-3 py-2.5
                  flex items-center justify-between gap-3
                  text-gray-200 text-sm
                  hover:bg-white/[0.055]
                  transition
                "
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${option.dotClass}`}
                  />
                  <span className="truncate">{option.label}</span>
                </div>

                {value === option.value && (
                  <Check size={15} className="text-success" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskSelect;
