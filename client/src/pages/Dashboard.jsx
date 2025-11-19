import NavBar from "../components/layout/Navbar.jsx";
import { useTasks } from "../hooks/useTasks.js";
import TaskFormWrapper from "../components/TaskFormWrapper.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskListSkeleton from "../components/TaskListSkeleton.jsx";

const Dashboard = () => {
  const { tasks, loading, error, createTask } = useTasks();
  console.log(tasks);
  return (
    <>
      {/* Navbar fijo arriba a la derecha */}
      <NavBar />

      {/* Contenido principal del dashboard */}
      <main
        className="
          pt-10               /* espacio bajo el navbar fijo */
          flex flex-col 
          gap-6
        "
      >
        {/* FORM PARA CREAR TAREAS */}
        <section>
          <TaskFormWrapper onSubmit={createTask} />
        </section>

        {/* LISTA / ESTADO DE TAREAS */}
        <section className="flex flex-col gap-4">
          {/* Error (si hay) */}
          {error && (
            <p className="text-red-400 text-sm">
              Error: {error.message || "Ocurrió un problema al cargar las tareas."}
            </p>
          )}

          {/* LOADING → SKELETON LIST */}
          {loading && !error && <TaskListSkeleton />}

          {/* Cuando no hay loading ni error */}
          {!loading && !error && (
            <>
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No hay tareas aún. Creá una para comenzar.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default Dashboard;




