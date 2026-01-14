import { useState, useEffect, useCallback } from "react";
import {
  getTasks as getTasksService,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from "../services/taskService.js";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  // 🔹 Estados
  const [isFetching, setIsFetching] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);

  // ======================
  // Fetch inicial
  // ======================
  const fetchTasks = useCallback(async () => {
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
  }, []);

  // ======================
  // Create
  // ======================
  const createTask = async (taskData) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      serverId: null,
      ...taskData,
      status: taskData.status || "pending",
      isPending: true,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsMutating(true);
      setTasks((prev) => [optimisticTask, ...prev]);

      const { task: realTask } = await createTaskService(taskData);

      setTasks((prev) =>
        prev.map((t) =>
          t._id === tempId
            ? {
                ...t,
                serverId: realTask._id,
                isPending: false,
                title: realTask.title,
                description: realTask.description,
                status: realTask.status,
              }
            : t
        )
      );
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  // ======================
  // Update
  // ======================
  const updateTask = async (id, updates) => {
    const previousTasks = tasks;
    const taskToUpdate = tasks.find((t) => t._id === id);
    const idToSendToBackend = taskToUpdate?.serverId || id;

    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updates } : t))
    );

    try {
      await updateTaskService(idToSendToBackend, updates);
    } catch (err) {
      setTasks(previousTasks);
      setError(err);
      throw err;
    }
  };

  // ======================
  // 🆕 DELETE LOGIC (Separada)
  // ======================

  // 1. Solo elimina de la UI (Para usar antes del timer)
  const removeTaskLocal = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  // 2. Restaura a la UI (Si el usuario da Undo)
  const restoreTaskLocal = (task) => {
    // Agregamos la tarea y dejamos que el useMemo del Dashboard la ordene
    setTasks((prev) => [...prev, task]);
  };

  // 3. Elimina del Servidor (Cuando se acaba el timer)
  const deleteTaskServer = async (id) => {
    // Buscamos el ID real por si acaso, aunque a este punto ya deberíamos tener el correcto
    // Nota: Como la tarea ya no está en 'tasks' (porque la borramos localmente),
    // debemos confiar en que el 'id' que nos pasan es el correcto para el backend.
    try {
      await deleteTaskService(id);
    } catch (err) {
      setError(err);
      // Si falla el borrado real, quizás deberíamos recargar la lista
      fetchTasks();
      throw err;
    }
  };

  // Fetch inicial
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    error,
    isFetching,
    isMutating,
    fetchTasks,
    createTask,
    updateTask,
    // Nuevos métodos expuestos
    removeTaskLocal,
    restoreTaskLocal,
    deleteTaskServer,
  };
};
