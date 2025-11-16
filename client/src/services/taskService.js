import api from "./api.js";

export const getTasks = async () => {
  try {
    const res = await api.get("/tasks");
    return (await res).data;
  } catch (error) {
    throw error.response?.data?.message || "Error al obtener tareas";
  }
};

export const getTaskById = async (id) => {
  try {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al obtener la tarea";
  }
};

export const createTask = async (data) => {
  try {
    const res = await api.post("/tasks", data);
    return res.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error al crear la tarea";
  }
};

export const updateTask = async (id, data) => {
  try {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al actualizar la tarea";
  }
};

export const deleteTask = async (id) => {
  try {
    const res = await api.delete(`/tasks/${id}`);
    return res.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error al eliminar la tarea";
  }
};
