import { getDueBucket } from "./taskDates.js";

export const getTaskStats = (tasks) => {
  const stats = {
    total: tasks.length,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0,
  };

  for (const task of tasks) {
    if (task.status === "pending") stats.pending += 1;
    if (task.status === "in-progress") stats.inProgress += 1;
    if (task.status === "completed") stats.completed += 1;

    const dueBucket = getDueBucket(task);
    if (dueBucket === "overdue") stats.overdue += 1;
    if (dueBucket === "upcoming") stats.upcoming += 1;
  }

  return stats;
};
