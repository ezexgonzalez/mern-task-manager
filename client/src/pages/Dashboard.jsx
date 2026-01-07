import { useState, useRef, useEffect, useMemo, useLayoutEffect } from "react";
import { Search, X, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import NavBar from "../components/layout/Navbar.jsx";
import { useTasks } from "../hooks/useTasks.js";
import TaskFormWrapper from "../components/TaskFormWrapper.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskListSkeleton from "../components/TaskListSkeleton.jsx";
import Toast from "../components/Toast.jsx";
import TaskEditModal from "../components/TaskEditModal.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "in-progress", label: "En progreso" },
  { key: "completed", label: "Completadas" },
];

const Dashboard = () => {
  const { tasks, loading, error, createTask, deleteTask, updateTask } =
    useTasks();

  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(" ")[0] || "Usuario";

  const [taskToEdit, setTaskToEdit] = useState(null);

  // ✅ filtros
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCompleted, setShowCompleted] = useState(true);

  // ✅ búsqueda + debounce
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  // ✅ Ordenamos tareas (estado primero + más recientes arriba)
  const sortedTasks = useMemo(() => {
    const rank = {
      "in-progress": 0,
      pending: 1,
      completed: 2,
    };

    const getTime = (t) => {
      const v = t.updatedAt || t.createdAt;
      const ms = v ? new Date(v).getTime() : 0;
      return Number.isFinite(ms) ? ms : 0;
    };

    return [...tasks].sort((a, b) => {
      const ra = rank[a.status] ?? 99;
      const rb = rank[b.status] ?? 99;

      if (ra !== rb) return ra - rb;
      return getTime(b) - getTime(a);
    });
  }, [tasks]);

  // ✅ Contadores para chips
  const counts = useMemo(() => {
    const c = { all: tasks.length, pending: 0, "in-progress": 0, completed: 0 };

    for (const t of tasks) {
      if (c[t.status] !== undefined) c[t.status] += 1;
    }

    return c;
  }, [tasks]);

  // ✅ Lista visible: orden -> filtro -> ocultar completadas -> búsqueda
  const visibleTasks = useMemo(() => {
    // 1) filtro por status
    const byStatus =
      statusFilter === "all"
        ? sortedTasks
        : sortedTasks.filter((t) => t.status === statusFilter);

    // 2) ocultar completadas (si NO estoy en filtro "completed")
    const byCompleted =
      showCompleted || statusFilter === "completed"
        ? byStatus
        : byStatus.filter((t) => t.status !== "completed");

    // 3) búsqueda
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return byCompleted;

    return byCompleted.filter((t) => {
      const title = (t.title || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [sortedTasks, statusFilter, showCompleted, debouncedQuery]);

  // ✅ Toast genérico
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    setToast({ visible: true, message });

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // ✅ CRUD handlers
  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    showToast("Tarea eliminada");
  };

  const handleEditClick = (task) => setTaskToEdit(task);
  const handleCloseEditModal = () => setTaskToEdit(null);

  const handleUpdateTask = async (id, data) => {
    await updateTask(id, data);
    setTaskToEdit(null);
    showToast("Tarea actualizada");
  };

  const handleStatusChange = async (id, nextStatus) => {
    await updateTask(id, { status: nextStatus });

    if (nextStatus === "completed") showToast("Tarea completada ✅");
    else showToast("Tarea reabierta");
  };

  // ✅ Si oculto completadas y estaba en filtro "completed", vuelvo a "all"
  useEffect(() => {
    if (!showCompleted && statusFilter === "completed") {
      setStatusFilter("all");
    }
  }, [showCompleted, statusFilter]);

  const hasQuery = debouncedQuery.trim().length > 0;

  /**
   * ✅ Mantener el scroll estable cuando "Completadas" reaparece
   * - Guardamos la posición del scroll + la posición del toggle antes del cambio
   * - Cuando el chip vuelve, compensamos scrollLeft para que el toggle no "se vaya"
   */
  const chipsScrollRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const snapRef = useRef(null);
  const prevShowRef = useRef(showCompleted);

  const handleToggleShowCompleted = () => {
    const c = chipsScrollRef.current;
    const t = toggleBtnRef.current;
    const isScrollable = c && c.scrollWidth > c.clientWidth;

    // Si estamos por "mostrar" completadas (viene el chip) y la fila es scrolleable,
    // guardamos el estado actual para compensar luego.
    if (!showCompleted && isScrollable && c && t) {
      snapRef.current = {
        scrollLeft: c.scrollLeft,
        toggleOffsetLeft: t.offsetLeft,
      };
    }

    // Si estamos por "ocultar" completadas y estaba seleccionado "completed",
    // evitamos flicker cambiando filtro primero.
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

    // Cuando reaparece el chip: compensamos scroll para mantener "estable" la vista
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
    <>
      <NavBar />

      <main className="pt-10 flex flex-col gap-6">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-white">
            Hola, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-400">
            Esto es lo que tenés para hoy.
          </p>
        </section>

        {/* ✅ Form centrado */}
        <section>
          <div className="w-full max-w-[900px] mx-auto">
            <TaskFormWrapper onSubmit={createTask} />
          </div>
        </section>

        {/* ✅ Chips + Search centrado */}
        {!loading && !error && tasks.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="w-full max-w-[900px] mx-auto flex flex-col gap-3">
              {/* ✅ Chips (scroll horizontal en mobile) */}
              <div
                ref={chipsScrollRef}
                className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <AnimatePresence initial={false}>
                  {FILTERS.filter((f) =>
                    showCompleted ? true : f.key !== "completed"
                  ).map((f) => {
                    const active = statusFilter === f.key;

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
                          relative overflow-hidden transform-gpu
                          shrink-0 rounded-full border px-3 py-1.5
                          text-xs font-medium transition backdrop-blur-md
                          ${
                            active
                              ? "bg-white/10 border-white/15 text-white"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/8"
                          }
                        `}
                        aria-pressed={active}
                      >
                        <span className="flex items-center gap-2">
                          {f.label}
                          <span
                            className={`
                              rounded-full px-2 py-0.5 text-[11px]
                              ${
                                active
                                  ? "bg-white/10 text-white/90"
                                  : "bg-white/5 text-slate-400"
                              }
                            `}
                          >
                            {counts[f.key]}
                          </span>
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>

                {/* ✅ Toggle (misma fila, NO pinned) */}
                <button
                  ref={toggleBtnRef}
                  type="button"
                  onClick={handleToggleShowCompleted}
                  className={`
                    relative overflow-hidden transform-gpu
                    shrink-0
                    border
                    transition
                    backdrop-blur-md
                    flex items-center

                    /* Mobile: estable */
                    w-10 h-9 justify-center rounded-full px-0

                    /* Desktop: igual a chips */
                    sm:w-auto sm:h-auto sm:justify-start
                    sm:rounded-full sm:px-3 sm:py-1.5
                    sm:text-xs sm:font-medium

                    ${
                      showCompleted
                        ? "bg-black/30 border-white/10 text-slate-300 hover:bg-black/35"
                        : "bg-white/10 border-white/20 text-white"
                    }
                    active:scale-95
                  `}
                  aria-pressed={!showCompleted}
                  title={
                    showCompleted ? "Ocultar completadas" : "Mostrar completadas"
                  }
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
                      <span
                        className="
                          hidden sm:inline
                          rounded-full px-2 py-0.5 text-[11px]
                          bg-white/10 text-white/90
                        "
                      >
                        {counts.completed}
                      </span>
                    )}
                  </span>
                </button>
              </div>

              {/* ✅ Search */}
              <div className="w-full">
                <div
                  className="
                    w-full
                    rounded-bubble
                    border border-white/10
                    bg-black/20
                    backdrop-blur-xl
                    px-4 py-2.5
                    flex items-center gap-3
                    shadow-bubble
                    transition duration-200
                    focus-within:border-white/20
                    focus-within:bg-black/25
                    focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_10px_rgba(99,102,241,0.12)]
                  "
                >
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar tareas..."
                    className="
                      flex-1 min-w-0
                      bg-transparent outline-none appearance-none
                      text-sm text-slate-100
                      placeholder:text-slate-500
                    "
                  />

                  {/* ✅ Siempre renderizado para no mover layout */}
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className={`
                      shrink-0
                      rounded-full
                      w-7 h-7
                      flex items-center justify-center
                      text-slate-400 hover:text-slate-200
                      hover:bg-white/5 transition
                      ${
                        query.trim().length > 0
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }
                    `}
                    aria-label="Limpiar búsqueda"
                    tabIndex={query.trim().length > 0 ? 0 : -1}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ✅ Lista centrada */}
        <section className="flex flex-col gap-4">
          <div className="w-full max-w-[900px] mx-auto flex flex-col gap-4">
            {error && (
              <p className="text-red-400 text-sm">
                Error:{" "}
                {error.message || "Ocurrió un problema al cargar las tareas."}
              </p>
            )}

            {loading && !error && <TaskListSkeleton />}

            {!loading && !error && (
              <>
                {tasks.length === 0 ? (
                  <div>
                    <p className="text-gray-400 font-medium">
                      Todavía no tenés tareas.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Escribí una idea arriba en{" "}
                      <span className="font-medium">“¿Alguna idea nueva?”</span>{" "}
                      y presioná Enter para crear tu primera tarea.
                    </p>
                  </div>
                ) : visibleTasks.length === 0 ? (
                  <div>
                    <p className="text-gray-400 font-medium">
                      {hasQuery
                        ? "No hay tareas que coincidan con tu búsqueda."
                        : "No hay tareas para este filtro."}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {hasQuery ? (
                        <>Probá con otra palabra o limpiá la búsqueda.</>
                      ) : (
                        <>
                          Probá con <span className="font-medium">“Todas”</span>{" "}
                          o creá una nueva tarea.
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {visibleTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditClick}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Toast show={toast.visible} message={toast.message} />

      <TaskEditModal
        isOpen={!!taskToEdit}
        task={taskToEdit}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateTask}
      />
    </>
  );
};

export default Dashboard;

