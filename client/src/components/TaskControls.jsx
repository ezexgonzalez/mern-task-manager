import { useRef, useLayoutEffect } from "react";
import { Search, X, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FILTERS } from "../hooks/useTaskFilters";
import { getTaskStatusOption } from "../constants/taskOptions.js";

const TaskControls = ({
  statusFilter,
  setStatusFilter,
  showCompleted,
  setShowCompleted,
  query,
  setQuery,
  counts,
}) => {
  const chipsScrollRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const snapRef = useRef(null);
  const prevShowRef = useRef(showCompleted);

  const handleToggleShowCompleted = () => {
    const c = chipsScrollRef.current;
    const t = toggleBtnRef.current;
    const isScrollable = c && c.scrollWidth > c.clientWidth;

    if (!showCompleted && isScrollable && c && t) {
      snapRef.current = {
        scrollLeft: c.scrollLeft,
        toggleOffsetLeft: t.offsetLeft,
      };
    }

    if (showCompleted && statusFilter === "completed") {
      setStatusFilter("all");
    }

    setShowCompleted((v) => !v);
  };

  useLayoutEffect(() => {
    const c = chipsScrollRef.current;
    const t = toggleBtnRef.current;
    const isScrollable = c && c.scrollWidth > c.clientWidth;
    const wasHidden = prevShowRef.current === false;
    const nowShown = showCompleted === true;

    if (wasHidden && nowShown && isScrollable && snapRef.current && c && t) {
      const { scrollLeft, toggleOffsetLeft } = snapRef.current;
      const newToggleOffsetLeft = t.offsetLeft;
      const delta = newToggleOffsetLeft - toggleOffsetLeft;
      c.scrollLeft = scrollLeft + delta;
      snapRef.current = null;
    }
    prevShowRef.current = showCompleted;
  }, [showCompleted]);

  return (
    <section className="flex flex-col gap-3">
      <div className="w-full max-w-[900px] mx-auto flex flex-col gap-3">
        <div
          ref={chipsScrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <AnimatePresence initial={false}>
            {FILTERS.filter((f) =>
              showCompleted ? true : f.key !== "completed",
            ).map((f) => {
              const active = statusFilter === f.key;
              const status = f.key === "all" ? null : getTaskStatusOption(f.key);

              return (
                <motion.button
                  key={f.key}
                  layout
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  onClick={() => setStatusFilter(f.key)}
                  className={`
                    relative overflow-hidden transform-gpu shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition backdrop-blur-md
                    ${
                      active
                        ? "bg-white/[0.09] border-white/15 text-white"
                        : "bg-white/[0.035] border-white/10 text-slate-300 hover:bg-white/[0.055]"
                    }
                  `}
                  aria-pressed={active}
                >
                  <span className="flex items-center gap-2">
                    {status && (
                      <span
                        className={`w-2 h-2 rounded-full ${status.dotClass}`}
                      />
                    )}
                    {f.label}
                    <span
                      className={`pl-1 text-[11px] ${
                        active ? "text-white/75" : "text-slate-500"
                      }`}
                    >
                      {counts[f.key]}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>

          <button
            ref={toggleBtnRef}
            type="button"
            onClick={handleToggleShowCompleted}
            className={`
              relative overflow-hidden transform-gpu shrink-0 border transition backdrop-blur-md flex items-center
              w-10 h-9 justify-center rounded-full px-0
              sm:w-auto sm:h-auto sm:justify-start sm:rounded-full sm:px-3 sm:py-1.5 sm:text-xs sm:font-medium
              ${
                showCompleted
                  ? "bg-white/[0.035] border-white/10 text-slate-300 hover:bg-white/[0.055]"
                  : "bg-white/[0.09] border-white/20 text-white"
              }
              active:scale-95
            `}
            title={showCompleted ? "Ocultar completadas" : "Mostrar completadas"}
          >
            <span className="flex items-center gap-2">
              {showCompleted ? (
                <EyeOff className="w-4 h-4 text-slate-300" />
              ) : (
                <Eye className="w-4 h-4 text-slate-200" />
              )}
              <span className="hidden sm:inline leading-none">
                {showCompleted ? "Ocultar" : "Mostrar"} completadas
              </span>
              {!showCompleted && (
                <span className="hidden sm:inline text-[11px] text-white/75">
                  {counts.completed}
                </span>
              )}
            </span>
          </button>
        </div>

        <div className="w-full">
          <div className="w-full rounded-bubble border border-white/10 bg-white/[0.035] backdrop-blur-xl px-4 py-2.5 flex items-center gap-3 shadow-bubble transition duration-200 focus-within:border-white/20 focus-within:bg-white/[0.055] focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_10px_rgba(99,102,241,0.12)]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar tareas..."
              className="flex-1 min-w-0 bg-transparent outline-none appearance-none text-sm text-slate-100 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setQuery("")}
              className={`shrink-0 rounded-full w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/5 transition ${
                query.trim().length > 0
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskControls;
