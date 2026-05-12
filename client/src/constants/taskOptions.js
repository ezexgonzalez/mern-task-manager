export const TASK_STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente", dotClass: "bg-warning" },
  { value: "in-progress", label: "En progreso", dotClass: "bg-progress" },
  { value: "completed", label: "Completada", dotClass: "bg-success" },
];

export const TASK_PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Baja",
    dotClass: "bg-slate-400",
    badgeClass: "text-slate-400 border-white/10 bg-white/[0.03]",
  },
  {
    value: "medium",
    label: "Media",
    dotClass: "bg-slate-300",
    badgeClass: "text-slate-300 border-white/10 bg-white/[0.04]",
  },
  {
    value: "high",
    label: "Alta",
    dotClass: "bg-red-400",
    badgeClass: "text-red-300 border-red-400/20 bg-red-400/5",
  },
];

export const getTaskStatusOption = (status) =>
  TASK_STATUS_OPTIONS.find((option) => option.value === status) ||
  TASK_STATUS_OPTIONS[0];

export const getTaskPriorityOption = (priority) =>
  TASK_PRIORITY_OPTIONS.find((option) => option.value === priority) ||
  TASK_PRIORITY_OPTIONS[1];

export const getDueDateInfo = (dueDate) => {
  if (!dueDate) return null;

  const today = new Date();
  const dateOnly =
    typeof dueDate === "string" ? dueDate.split("T")[0] : dueDate;
  const [year, month, day] = dateOnly.split("-").map(Number);
  const taskDate = new Date(year, month - 1, day);

  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: "Vencida",
      className: "text-red-300 border-red-400/20 bg-red-400/5",
    };
  }

  if (diffDays === 0) {
    return {
      label: "Vence hoy",
      className: "text-amber-300 border-amber-400/20 bg-amber-400/5",
    };
  }

  if (diffDays === 1) {
    return {
      label: "Vence ma\u00f1ana",
      className: "text-amber-200 border-amber-400/15 bg-amber-400/5",
    };
  }

  return {
    label: `Vence ${taskDate.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
    })}`,
    className: "text-slate-400 border-slate-500/20 bg-slate-500/5",
  };
};
