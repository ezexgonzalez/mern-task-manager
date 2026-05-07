import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, color, priority } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "El titulo es obligatorio" });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      status,
      color,
      priority,
      user: userId,
    });

    return res
      .status(201)
      .json({ message: "Tarea creada correctamente", task: newTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "Tareas obtenidas correctamente", tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "La tarea no existe" });
    }
    if (task.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tiene permiso para acceder a esta tarea" });
    }

    return res
      .status(200)
      .json({ message: "Tarea encontrada con exito", task });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, color, priority } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "La tarea no existe" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tiene permiso para editar esta tarea" });
    }

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ message: "El titulo es obligatorio" });
      }

      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (color !== undefined) {
      task.color = color;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    await task.save();

    return res
      .status(200)
      .json({ message: "Tarea actualizada con exito", task });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "La tarea no existe" });
    }
    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tiene permiso para eliminar esta tarea" });
    }

    await task.deleteOne();

    return res.status(200).json({ message: "Tarea eliminada con exito" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
