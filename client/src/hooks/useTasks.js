import { useState, useEffect } from "react";
import {
  getTasks as getTasksService,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from "../services/taskService.js";

export const useTasks = () => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () =>{
    try {
      setLoading(true);
      setError(null);
      const data = await getTasksService();
      setTasks(data || []);
    } catch (error) {
      setError(error);
    }finally{
      setLoading(false);
    }
  };

  const createTask = async (taskData) =>{
    try {
      setLoading(true);
      await createTaskService(taskData);
      await fetchTasks();
    } catch (error) {
      setError(error);
    }finally{
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData)=>{
    try {
      setLoading(true);
      await updateTaskService(id, taskData);
      await fetchTasks();
    } catch (error) {
      setError(error);
    }finally{
      setLoading(false);
    }
  }

  const deleteTask = async (id) =>{
    try {
      setLoading(true);
      await deleteTaskService(id);
      await fetchTasks();
    } catch (error) {
      setError(error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchTasks();
  },[]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }

};


