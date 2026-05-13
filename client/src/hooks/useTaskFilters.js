import { useState, useEffect, useMemo } from "react";
import { getDueBucket, getDueDateTime } from "../utils/taskDates.js";
import { getTaskStats } from "../utils/taskStats.js";

export const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "in-progress", label: "En progreso" },
  { key: "completed", label: "Completadas" },
];

export const PRIORITY_FILTERS = [
  { key: "all", label: "Todas" },
  { key: "high", label: "Alta" },
  { key: "medium", label: "Media" },
  { key: "low", label: "Baja" },
];

export const DUE_FILTERS = [
  { key: "all", label: "Todas" },
  { key: "overdue", label: "Vencidas" },
  { key: "today", label: "Hoy" },
  { key: "upcoming", label: "Próximas" },
  { key: "none", label: "Sin fecha" },
];

export const SORT_OPTIONS = [
  { key: "smart", label: "Relevancia" },
  { key: "recent", label: "Recientes" },
  { key: "dueDate", label: "Fecha límite" },
  { key: "priority", label: "Prioridad" },
];

const VALID_FILTERS = FILTERS.map((f) => f.key);
const VALID_PRIORITY_FILTERS = PRIORITY_FILTERS.map((f) => f.key);
const VALID_DUE_FILTERS = DUE_FILTERS.map((f) => f.key);
const VALID_SORT_OPTIONS = SORT_OPTIONS.map((o) => o.key);

const getSavedValue = (key, validValues, fallback) => {
  const saved = localStorage.getItem(key);
  return validValues.includes(saved) ? saved : fallback;
};

const getTime = (task) => {
  const value = task.updatedAt || task.createdAt;
  const ms = value ? new Date(value).getTime() : 0;
  return Number.isFinite(ms) ? ms : 0;
};

export const useTaskFilters = (tasks) => {
  const [statusFilter, setStatusFilter] = useState(() =>
    getSavedValue("tm_statusFilter", VALID_FILTERS, "all"),
  );
  const [showCompleted, setShowCompleted] = useState(() => {
    const saved = localStorage.getItem("tm_showCompleted");
    return saved === null ? true : saved === "true";
  });
  const [priorityFilter, setPriorityFilter] = useState(() =>
    getSavedValue("tm_priorityFilter", VALID_PRIORITY_FILTERS, "all"),
  );
  const [dueFilter, setDueFilter] = useState(() =>
    getSavedValue("tm_dueFilter", VALID_DUE_FILTERS, "all"),
  );
  const [sortMode, setSortMode] = useState(() =>
    getSavedValue("tm_sortMode", VALID_SORT_OPTIONS, "smart"),
  );
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("tm_statusFilter", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem("tm_showCompleted", String(showCompleted));
  }, [showCompleted]);

  useEffect(() => {
    localStorage.setItem("tm_priorityFilter", priorityFilter);
  }, [priorityFilter]);

  useEffect(() => {
    localStorage.setItem("tm_dueFilter", dueFilter);
  }, [dueFilter]);

  useEffect(() => {
    localStorage.setItem("tm_sortMode", sortMode);
  }, [sortMode]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!showCompleted && statusFilter === "completed") {
      setStatusFilter("all");
    }
  }, [showCompleted, statusFilter]);

  const sortedTasks = useMemo(() => {
    const statusRank = { "in-progress": 0, pending: 1, completed: 2 };
    const priorityRank = { high: 0, medium: 1, low: 2 };

    return [...tasks].sort((a, b) => {
      if (sortMode === "recent") {
        return getTime(b) - getTime(a);
      }

      if (sortMode === "dueDate") {
        const dueDiff = getDueDateTime(a) - getDueDateTime(b);
        if (dueDiff !== 0) return dueDiff;
        return getTime(b) - getTime(a);
      }

      if (sortMode === "priority") {
        const pa = priorityRank[a.priority] ?? 99;
        const pb = priorityRank[b.priority] ?? 99;
        if (pa !== pb) return pa - pb;
        return getTime(b) - getTime(a);
      }

      const ra = statusRank[a.status] ?? 99;
      const rb = statusRank[b.status] ?? 99;
      if (ra !== rb) return ra - rb;

      return getTime(b) - getTime(a);
    });
  }, [tasks, sortMode]);

  const counts = useMemo(() => {
    const c = { all: tasks.length, pending: 0, "in-progress": 0, completed: 0 };

    for (const task of tasks) {
      if (c[task.status] !== undefined) c[task.status] += 1;
    }

    return c;
  }, [tasks]);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  const visibleTasks = useMemo(() => {
    const byStatus =
      statusFilter === "all"
        ? sortedTasks
        : sortedTasks.filter((task) => task.status === statusFilter);

    const byCompleted =
      showCompleted || statusFilter === "completed"
        ? byStatus
        : byStatus.filter((task) => task.status !== "completed");

    const byPriority =
      priorityFilter === "all"
        ? byCompleted
        : byCompleted.filter((task) => task.priority === priorityFilter);

    const byDueDate =
      dueFilter === "all"
        ? byPriority
        : byPriority.filter((task) => getDueBucket(task) === dueFilter);

    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return byDueDate;

    return byDueDate.filter((task) => {
      const title = (task.title || "").toLowerCase();
      const description = (task.description || "").toLowerCase();
      return title.includes(q) || description.includes(q);
    });
  }, [
    sortedTasks,
    statusFilter,
    showCompleted,
    priorityFilter,
    dueFilter,
    debouncedQuery,
  ]);

  const hasActiveFilters =
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    dueFilter !== "all" ||
    sortMode !== "smart" ||
    query.trim().length > 0 ||
    !showCompleted;

  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setDueFilter("all");
    setSortMode("smart");
    setQuery("");
    setShowCompleted(true);
  };

  return {
    statusFilter,
    setStatusFilter,
    showCompleted,
    setShowCompleted,
    priorityFilter,
    setPriorityFilter,
    dueFilter,
    setDueFilter,
    sortMode,
    setSortMode,
    query,
    setQuery,
    debouncedQuery,
    visibleTasks,
    counts,
    stats,
    hasActiveFilters,
    resetFilters,
  };
};
