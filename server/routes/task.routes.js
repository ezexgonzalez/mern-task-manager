import express from "express";
import { authRequired } from "../middlewares/authRequired.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", authRequired, createTask);
router.get("/", authRequired, getTasks);
router.get("/:id", authRequired, getTaskById);
router.put("/:id", authRequired, updateTask);
router.delete("/:id", authRequired, deleteTask);

const taskRoutes = router;

export default taskRoutes;
