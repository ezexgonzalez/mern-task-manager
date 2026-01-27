import { useRef, useEffect, useCallback } from "react";

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

  // 🛡️ TRUCO PRO: Guardamos la función del server en una Ref.
  // Esto nos permite usarla en el cleanup sin disparar el useEffect en cada render.
  const deleteTaskServerRef = useRef(deleteTaskServer);

  // Mantenemos la ref actualizada siempre
  useEffect(() => {
    deleteTaskServerRef.current = deleteTaskServer;
  }, [deleteTaskServer]);

  // 1. Confirma el borrado (Borrado definitivo)
  // Ahora esta función es ESTABLE (no tiene dependencias externas que cambien)
  const commitPendingDelete = useCallback(() => {
    // Limpiamos timeout si existe
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    // Si hay algo pendiente, lo borramos del server
    if (pendingDeleteTaskRef.current) {
      const task = pendingDeleteTaskRef.current;
      const idToDelete = task.serverId || task._id;

      // Usamos la REF para llamar al server
      if (deleteTaskServerRef.current) {
        deleteTaskServerRef.current(idToDelete).catch((err) => {
          console.error("Error al borrar definitivamente:", err);
        });
      }

      // 🗑️ Aquí limpiamos la referencia (el punto de no retorno)
      pendingDeleteTaskRef.current = null;
    }
  }, []);

  // 2. Acción de deshacer
  const handleUndoDelete = useCallback(() => {
    // Cancelamos el timer
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }

    // Restauramos visualmente
    if (pendingDeleteTaskRef.current) {
      restoreTaskLocal(pendingDeleteTaskRef.current);
      pendingDeleteTaskRef.current = null;
    }

    hideToast();
  }, [restoreTaskLocal, hideToast]);

  // 3. Trigger principal (Borrado optimista)
  const handleDeleteTask = useCallback(
    (id) => {
      // Si ya había uno pendiente, lo confirmamos antes de pisarlo
      commitPendingDelete();

      const taskToDelete = tasks.find((t) => t._id === id);
      if (!taskToDelete) return;

      // Guardamos en el limbo
      pendingDeleteTaskRef.current = taskToDelete;

      // UI Update inmediato
      removeTaskLocal(id);

      // Mostramos Toast
      showToast(
        "Tarea eliminada",
        {
          label: "Deshacer",
          onClick: handleUndoDelete,
        },
        3500,
      );

      // Timer de seguridad (3.5s)
      undoTimeoutRef.current = setTimeout(() => {
        commitPendingDelete();
      }, 3500);
    },
    [tasks, removeTaskLocal, showToast, commitPendingDelete, handleUndoDelete],
  );

  // 4. Seguridad: Confirmar SOLO al desmontar el componente (navegar fuera)
  useEffect(() => {
    return () => {
      commitPendingDelete();
    };
  }, []); // ✅ Array vacío: Solo se ejecuta al morir el componente

  return { handleDeleteTask };
};
