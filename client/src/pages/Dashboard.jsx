import NavBar from "../components/layout/Navbar.jsx";
import { useTasks } from "../hooks/useTasks.js";

const Dashboard = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) return <p>Cargando tareas</p>;
  if (error) return <p>Error: {error}</p>;

  if (tasks.length === 0) {
    return <p>No hay tareas aun, Crea una para comenzar.</p>;
  }

  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex flex-col justify-center items-center gap-5">
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{backgroundColor: task.color}}
            className={`flex flex-col w-50 h-50 items-center justify-between`}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span>{task.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
