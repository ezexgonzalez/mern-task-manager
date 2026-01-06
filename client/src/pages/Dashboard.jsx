import { useState, useRef, useEffect, useMemo } from "react";
import NavBar from "../components/layout/Navbar.jsx";
import { useTasks } from "../hooks/useTasks.js";
import TaskFormWrapper from "../components/TaskFormWrapper.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskListSkeleton from "../components/TaskListSkeleton.jsx";
import Toast from "../components/Toast.jsx";
import TaskEditModal from "../components/TaskEditModal.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

const Dashboard = () => {
  const { tasks, loading, error, createTask, deleteTask, updateTask } =
    useTasks();

  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(" ")[0] || "Usuario";

  const [taskToEdit, setTaskToEdit] = useState(null);
  //Ordenamos las tareas
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

  // ✅ Nuevo: completar / reabrir rápido
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
              ) : (
                <div className="flex flex-col gap-4">
                  {sortedTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditClick}
                      onStatusChange={handleStatusChange} // ✅ acá
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
