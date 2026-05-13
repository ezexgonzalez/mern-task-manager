import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import NavBar from "../components/layout/Navbar.jsx";
import TaskFormWrapper from "../components/TaskFormWrapper.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskListSkeleton from "../components/TaskListSkeleton.jsx";
import Toast from "../components/Toast.jsx";
import TaskEditModal from "../components/TaskEditModal.jsx";
import TaskControls from "../components/TaskControls.jsx";

import { useAuthStore } from "../store/useAuthStore.js";
import { useTasks } from "../hooks/useTasks.js";
import { useTaskFilters } from "../hooks/useTaskFilters.js";
import { useToast } from "../hooks/useToast.js"; // ✅ Nuevo
import { useUndoDelete } from "../hooks/useUndoDelete.js"; // ✅ Nuevo

import { getErrorMessage } from "../utils/getErrorMessage.js";

const Dashboard = () => {
  // 1. Datos del usuario y tareas
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(" ")[0] || "Usuario";

  const {
    tasks,
    isFetching,
    error,
    createTask,
    updateTask,
    removeTaskLocal,
    restoreTaskLocal,
    deleteTaskServer,
  } = useTasks();

  // 2. Estado de UI (Filtros y Toast)
  const {
    statusFilter,
    setStatusFilter,
    showCompleted,
    setShowCompleted,
    query,
    setQuery,
    debouncedQuery,
    visibleTasks,
    counts,
  } = useTaskFilters(tasks);

  const { toast, showToast, hideToast } = useToast();
  const [taskToEdit, setTaskToEdit] = useState(null);

  // 3. Lógica de Negocio (Undo Delete)
  const { handleDeleteTask } = useUndoDelete({
    tasks,
    removeTaskLocal,
    restoreTaskLocal,
    deleteTaskServer,
    showToast,
    hideToast,
  });

  // 4. Handlers UI
  const handleEditClick = (task) => setTaskToEdit(task);
  const handleCloseEditModal = () => setTaskToEdit(null);

  const handleUpdateTask = async (id, data) => {
    try {
      await updateTask(id, data);
      setTaskToEdit(null);
      showToast("Tarea actualizada");
    } catch (err) {
      showToast(getErrorMessage(err, "Error al actualizar la tarea"));
      throw err;
    }
  };

  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updateTask(id, { status: nextStatus });
      showToast(
        nextStatus === "completed" ? "Tarea completada ✅" : "Tarea reabierta",
      );
    } catch (err) {
      showToast(getErrorMessage(err, "Error al actualizar la tarea"));
    }
  };

  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <>
      <NavBar />

      <main className="pt-10 pb-10 flex flex-col gap-6">
        {/* Header */}
        <section className="flex flex-col gap-1 w-full max-w-[900px] mx-auto px-4 sm:px-0">
          <h1 className="text-xl font-semibold text-white">
            Hola, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-400">
            Esto es lo que tenés para hoy.
          </p>
        </section>

        {/* Formulario */}
        <section className="w-full max-w-[900px] mx-auto px-4 sm:px-0">
          <TaskFormWrapper onSubmit={createTask} />
        </section>

        {/* Controles de Filtro */}
        {!isFetching && !error && tasks.length > 0 && (
          <div className="w-full max-w-[900px] mx-auto px-4 sm:px-0">
            <TaskControls
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              showCompleted={showCompleted}
              setShowCompleted={setShowCompleted}
              query={query}
              setQuery={setQuery}
              counts={counts}
            />
          </div>
        )}

        {/* Lista de Tareas */}
        <section className="flex flex-col gap-4 w-full max-w-[900px] mx-auto px-4 sm:px-0">
          {error && <p className="text-red-400 text-sm">Error: {error}</p>}
          {isFetching && !error && <TaskListSkeleton />}

          {!isFetching && !error && (
            <>
              {tasks.length === 0 ? (
                <div>
                  <p className="text-gray-400 font-medium">
                    Todavía no tenés tareas.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Escribí una idea arriba y presioná Enter.
                  </p>
                </div>
              ) : visibleTasks.length === 0 ? (
                <div>
                  <p className="text-gray-400 font-medium">
                    {hasQuery
                      ? "No hay tareas que coincidan."
                      : "No hay tareas para este filtro."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {visibleTasks.map((task) => (
                      <motion.div
                        key={task._id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -40,
                          filter: "blur(4px)",
                          scale: 0.97,
                        }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <TaskCard
                          task={task}
                          onDelete={handleDeleteTask}
                          onEdit={handleEditClick}
                          onStatusChange={handleStatusChange}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Toast
        show={toast.visible}
        message={toast.message}
        action={toast.action}
      />

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
