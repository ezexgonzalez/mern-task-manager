import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
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

  // ✅ filtro por estado
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ búsqueda + debounce
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => clearTimeout(id);
  }, [query]);

  // ✅ Ordenamos las tareas (estado + fecha)
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

  // ✅ Contadores por filtro
  const counts = useMemo(() => {
    const c = { all: tasks.length, pending: 0, "in-progress": 0, completed: 0 };

    for (const t of tasks) {
      if (c[t.status] !== undefined) c[t.status] += 1;
    }

    return c;
  }, [tasks]);

  // ✅ Lista final visible: orden -> filtro -> búsqueda (con debounce)
  const visibleTasks = useMemo(() => {
    const byStatus =
      statusFilter === "all"
        ? sortedTasks
        : sortedTasks.filter((t) => t.status === statusFilter);

    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return byStatus;

    return byStatus.filter((t) => {
      const title = (t.title || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [sortedTasks, statusFilter, debouncedQuery]);

  // estado genérico para cualquier toast
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    setToast({ visible: true, message });

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 2500);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    showToast("Tarea eliminada");
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
  };

  const handleCloseEditModal = () => {
    setTaskToEdit(null);
  };

  const handleUpdateTask = async (id, data) => {
    await updateTask(id, data);
    setTaskToEdit(null);
    showToast("Tarea actualizada");
  };

  // ✅ completar / reabrir rápido
  const handleStatusChange = async (id, nextStatus) => {
    await updateTask(id, { status: nextStatus });

    if (nextStatus === "completed") showToast("Tarea completada ✅");
    else showToast("Tarea reabierta");
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const hasQuery = debouncedQuery.trim().length > 0;

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

        <section>
          <TaskFormWrapper onSubmit={createTask} />
        </section>

        {/* ✅ Chips + Search (integrado y dark/glass) */}
        {!loading && !error && tasks.length > 0 && (
          <section className="flex flex-col gap-3">
            {/* Chips primero */}
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FILTERS.map((f) => {
                const active = statusFilter === f.key;

                return (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`
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
                  </button>
                );
              })}
            </div>

            {/* Search abajo (más chico y sin “blanco”) */}
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
      transition
      focus-within:border-white/20
      focus-within:bg-black/25
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

                {/* SIEMPRE renderizado para que no cambie el layout */}
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
          </section>
        )}

        <section className="flex flex-col gap-4">
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
                    <span className="font-medium">“¿Alguna idea nueva?”</span> y
                    presioná Enter para crear tu primera tarea.
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
                        Probá con <span className="font-medium">“Todas”</span> o
                        creá una nueva tarea.
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
