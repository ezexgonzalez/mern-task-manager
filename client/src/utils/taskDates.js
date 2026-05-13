const DAY_MS = 1000 * 60 * 60 * 24;

export const getDueDateTime = (taskOrDueDate) => {
  const dueDate =
    typeof taskOrDueDate === "object" && taskOrDueDate !== null
      ? taskOrDueDate.dueDate
      : taskOrDueDate;

  if (!dueDate) return Number.POSITIVE_INFINITY;

  const dateOnly = typeof dueDate === "string" ? dueDate.split("T")[0] : dueDate;
  const [year, month, day] = dateOnly.split("-").map(Number);
  const ms = new Date(year, month - 1, day).getTime();

  return Number.isFinite(ms) ? ms : Number.POSITIVE_INFINITY;
};

export const getDueDateDiffDays = (taskOrDueDate) => {
  const dueDateTime = getDueDateTime(taskOrDueDate);
  if (!Number.isFinite(dueDateTime)) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(dueDateTime);
  taskDate.setHours(0, 0, 0, 0);

  return Math.round((taskDate.getTime() - today.getTime()) / DAY_MS);
};

export const getDueBucket = (task) => {
  if (!task.dueDate) return "none";

  const diffDays = getDueDateDiffDays(task);

  if (diffDays === null) return "none";
  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  return "upcoming";
};
