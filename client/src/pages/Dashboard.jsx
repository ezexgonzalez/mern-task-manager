import { useState, useRef, useEffect } from "react";
import NavBar from "../components/layout/Navbar.jsx";
import { useTasks } from "../hooks/useTasks.js";
import TaskFormWrapper from "../components/TaskFormWrapper.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskListSkeleton from "../components/TaskListSkeleton.jsx";
import Toast from "../components/Toast.jsx";
import TaskEditModal from "../components/TaskEditModal.jsx";

const Dashboard = () => {
  const { tasks, loading, error, createTask, deleteTask, updateTask } =
    useTasks();

  const [taskToEdit, setTaskToEdit] = useState(null);

  // estado genérico para cualquier toast
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    setToast({ visible: true, message });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

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

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <NavBar />

      <main
        className="
          pt-10
          flex flex-col 
          gap-6
        "
      >
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
                <p className="text-gray-500 text-sm">
                  No hay tareas aún. Creá una para comenzar.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditClick}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Toast genérico */}
      <Toast show={toast.visible} message={toast.message} />

      {/* Modal para editar */}
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

