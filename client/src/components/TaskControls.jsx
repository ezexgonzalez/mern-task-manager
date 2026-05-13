import { useRef, useLayoutEffect, useEffect, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Flag,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DUE_FILTERS,
  FILTERS,
  PRIORITY_FILTERS,
  SORT_OPTIONS,
} from "../hooks/useTaskFilters";
import { getTaskStatusOption } from "../constants/taskOptions.js";

const CONTROL_ICONS = {
  priority: Flag,
  due: CalendarDays,
  sort: ArrowUpDown,
};

const FilterMenu = ({ id, label, value, onChange, options, open, onToggle }) => {
  const Icon = CONTROL_ICONS[id];
  const selected = options.find((option) => option.key === value) || options[0];
  const active = value !== "all" && value !== "smart";

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={onToggle}
        className={`
          group flex h-10 w-full min-w-0 items-center gap-2 rounded-bubble border px-3 text-left
          text-xs shadow-bubble backdrop-blur-xl transition active:scale-[0.99]
          ${
            active
              ? "border-white/20 bg-white/[0.085] text-white"
              : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/15 hover:bg-white/[0.055]"
          }
        `}
        aria-expanded={open}
      >
        <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-200" />
        <span className="shrink-0 text-slate-500">{label}</span>
        <span className="min-w-0 flex-1 truncate font-medium text-slate-100">
          {selected.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition ${
            open ? "rotate-180 text-slate-200" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="
              absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-bubble border border-borderGlass
              bg-[rgba(22,24,29,0.96)] p-1.5 shadow-bubble backdrop-blur-2xl
              ring-1 ring-white/[0.035]
            "
          >
            {options.map((option) => {
              const selectedOption = option.key === value;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    onChange(option.key);
                    onToggle();
                  }}
                  className={`
                    group flex w-full items-center gap-2 rounded-[14px] px-3 py-2 text-left text-xs transition
                    ${
                      selectedOption
                        ? "bg-white/[0.07] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                        : "text-slate-300 hover:bg-white/[0.075] hover:text-white"
                    }
                  `}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                  </span>
                  {selectedOption && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskControls = ({
  statusFilter,
  setStatusFilter,
  showCompleted,
  setShowCompleted,
  priorityFilter,
  setPriorityFilter,
  dueFilter,
  setDueFilter,
  sortMode,
  setSortMode,
  query,
  setQuery,
  counts,
  hasActiveFilters,
  resetFilters,
}) => {
  const chipsScrollRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const advancedRef = useRef(null);
  const snapRef = useRef(null);
  const prevShowRef = useRef(showCompleted);
  const [openMenu, setOpenMenu] = useState(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (advancedRef.current && !advancedRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

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

        <div
          ref={advancedRef}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <FilterMenu
            id="priority"
            label="Prioridad"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={PRIORITY_FILTERS}
            open={openMenu === "priority"}
            onToggle={() => toggleMenu("priority")}
          />
          <FilterMenu
            id="due"
            label="Fecha"
            value={dueFilter}
            onChange={setDueFilter}
            options={DUE_FILTERS}
            open={openMenu === "due"}
            onToggle={() => toggleMenu("due")}
          />
          <FilterMenu
            id="sort"
            label="Orden"
            value={sortMode}
            onChange={setSortMode}
            options={SORT_OPTIONS}
            open={openMenu === "sort"}
            onToggle={() => toggleMenu("sort")}
          />
          <button
            type="button"
            onClick={() => {
              resetFilters();
              setOpenMenu(null);
            }}
            disabled={!hasActiveFilters}
            className="
              inline-flex h-10 items-center justify-center gap-2 rounded-bubble border border-white/10
              bg-white/[0.035] px-3 text-xs font-medium text-slate-300 shadow-bubble
              backdrop-blur-xl transition hover:border-white/15 hover:bg-white/[0.055] hover:text-slate-100
              disabled:cursor-not-allowed disabled:opacity-40
            "
            title="Limpiar filtros"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TaskControls;
