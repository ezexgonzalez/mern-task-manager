import { useState, useEffect } from "react";
import {
  getTasks as getTasksService,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from "../services/taskService.js";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  // 🔹 Estados bien separados
  const [isFetching, setIsFetching] = useState(true); // carga inicial
  const [isMutating, setIsMutating] = useState(false); // create / update / delete
  const [error, setError] = useState(null);

  // ======================
  // Fetch inicial
  // ======================
  const fetchTasks = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const data = await getTasksService();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsFetching(false);
    }
  };
  // ======================
  // Create (Optimistic)
  // ======================
  const createTask = async (taskData) => {
    const tempId = `temp-${Date.now()}`;

    const optimisticTask = {
      _id: tempId,
      serverId: null,
      ...taskData, // Aquí vienen { title, description, status }
      status: taskData.status || "pending",

      isPending: true,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsMutating(true);

      // 1️⃣ UI Update
      setTasks((prev) => [optimisticTask, ...prev]);

      // 2️⃣ Backend Call
      const { task: realTask } = await createTaskService(taskData);

      // 3️⃣ Confirmación (Reemplazo de ID)
      setTasks((prev) =>
        prev.map((t) =>
          t._id === tempId
            ? {
                ...t,
                serverId: realTask._id,
                isPending: false,
                // Aseguramos que los datos finales sean los del servidor
                title: realTask.title,
                description: realTask.description,
                status: realTask.status,
              }
            : t
        )
      );
    } catch (err) {
      // Rollback
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  // ======================
  // Update (Optimistic UI corregido)
  // ======================
  const updateTask = async (id, updates) => {
    // 1️⃣ Guardamos el estado actual por si hay que volver atrás (Rollback)
    const previousTasks = tasks;

    // 2️⃣ Buscamos el ID real para el backend
    const taskToUpdate = tasks.find((t) => t._id === id);
    // Si tiene serverId (es nueva), úsalo. Si no, usa el id normal.
    const idToSendToBackend = taskToUpdate?.serverId || id;

    // 3️⃣ Optimistic Update: Actualizamos la UI YA mismo usando el ID LOCAL
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updates } : t))
    );

    try {
      // 4️⃣ Backend Update: Enviamos los datos usando el ID REAL
      await updateTaskService(idToSendToBackend, updates);
    } catch (err) {
      // 5️⃣ Si falla: Rollback (volvemos al estado anterior)
      setTasks(previousTasks);
      setError(err);

      // Lanzamos el error para que el Toast del Dashboard avise "Error al actualizar"
      throw err;
    }
  };

  // ======================
  // Delete (optimistic)
  // ======================
  const deleteTask = async (id) => {
    // 1️⃣ Buscamos la tarea en el estado actual para ver si tiene un serverId real
    const taskToDelete = tasks.find((t) => t._id === id);

    // Si tiene serverId (es una tarea creada en esta sesión), lo usamos para la API.
    // Si no, usamos el id normal (es una tarea vieja cargada desde DB).
    const idToSendToBackend = taskToDelete?.serverId || id;

    // 2️⃣ Optimistic remove: Borramos usando el ID LOCAL (para que desaparezca de la UI ya)
    const previousTasks = tasks; // Guardamos copia por si hay error
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      // 3️⃣ Backend update: Usamos el ID REAL
      await deleteTaskService(idToSendToBackend);
    } catch (err) {
      setError(err);
      // Rollback: restauramos la lista anterior si falló
      setTasks(previousTasks);
      // Ojo: si prefieres usar fetchTasks() para el rollback está bien,
      // pero restaurar el estado previo es más rápido visualmente.

      throw err; // Importante para que el Dashboard muestre el error
    }
  };

  // Fetch inicial
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    error,

    // 👇 estados bien claros
    isFetching,
    isMutating,

    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
