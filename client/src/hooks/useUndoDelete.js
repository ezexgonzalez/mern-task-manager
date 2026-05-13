import { useRef, useEffect, useCallback } from "react";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export const useUndoDelete = ({
  tasks,
  removeTaskLocal,
  restoreTaskLocal,
  deleteTaskServer,
  showToast,
  hideToast,
}) => {
  const undoTimeoutRef = useRef(null);
  const pendingDeleteTaskRef = useRef(null);
  const deleteTaskServerRef = useRef(deleteTaskServer);

  useEffect(() => {
    deleteTaskServerRef.current = deleteTaskServer;
  }, [deleteTaskServer]);

  const commitPendingDelete = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    if (pendingDeleteTaskRef.current) {
      const task = pendingDeleteTaskRef.current;
      const idToDelete = task.serverId || task._id;

      if (deleteTaskServerRef.current) {
        deleteTaskServerRef.current(idToDelete).catch((err) => {
          console.error("Error al borrar definitivamente:", err);
          showToast(getErrorMessage(err, "Error al eliminar la tarea"));
        });
      }

      pendingDeleteTaskRef.current = null;
    }
  }, [showToast]);

  const handleUndoDelete = useCallback(() => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    if (pendingDeleteTaskRef.current) {
      restoreTaskLocal(pendingDeleteTaskRef.current);
      pendingDeleteTaskRef.current = null;
    }

    hideToast();
  }, [restoreTaskLocal, hideToast]);

  const handleDeleteTask = useCallback(
    (id) => {
      commitPendingDelete();

      const taskToDelete = tasks.find((t) => t._id === id);
      if (!taskToDelete) return;

      pendingDeleteTaskRef.current = taskToDelete;
      removeTaskLocal(id);

      showToast(
        "Tarea eliminada",
        {
          label: "Deshacer",
          onClick: handleUndoDelete,
        },
        3500,
      );

      undoTimeoutRef.current = setTimeout(() => {
        commitPendingDelete();
      }, 3500);
    },
    [tasks, removeTaskLocal, showToast, commitPendingDelete, handleUndoDelete],
  );

  useEffect(() => {
    return () => {
      commitPendingDelete();
    };
  }, [commitPendingDelete]);

  return { handleDeleteTask };
};
