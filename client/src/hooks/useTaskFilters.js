import { useState, useEffect, useMemo } from "react";

export const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "in-progress", label: "En progreso" },
  { key: "completed", label: "Completadas" },
];

const VALID_FILTERS = FILTERS.map((f) => f.key);

export const useTaskFilters = (tasks) => {
  // 1. Estado de Filtros (con persistencia)
  const [statusFilter, setStatusFilter] = useState(() => {
    const saved = localStorage.getItem("tm_statusFilter");
    const isValid = VALID_FILTERS.includes(saved);
    return isValid ? saved : "all";
  });

  const [showCompleted, setShowCompleted] = useState(() => {
    const saved = localStorage.getItem("tm_showCompleted");
    return saved === null ? true : saved === "true";
  });

  // 2. Persistencia
  useEffect(() => {
    localStorage.setItem("tm_statusFilter", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem("tm_showCompleted", String(showCompleted));
  }, [showCompleted]);

  // 3. Búsqueda y Debounce
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  // 4. Lógica de Ordenamiento
  const sortedTasks = useMemo(() => {
    const rank = { "in-progress": 0, pending: 1, completed: 2 };

    const getTime = (t) => {
      const v = t.updatedAt || t.createdAt;
      const ms = v ? new Date(v).getTime() : 0;
      return Number.isFinite(ms) ? ms : 0;
    };

    return [...tasks].sort((a, b) => {
      const ra = rank[a.status] ?? 99;
      const rb = rank[b.status] ?? 99;
      if (ra !== rb) return ra - rb;
      return getTime(b) - getTime(a);
    });
  }, [tasks]);

  // 5. Contadores
  const counts = useMemo(() => {
    const c = { all: tasks.length, pending: 0, "in-progress": 0, completed: 0 };
    for (const t of tasks) {
      if (c[t.status] !== undefined) c[t.status] += 1;
    }
    return c;
  }, [tasks]);

  // 6. Filtrado Final (Visible Tasks)
  const visibleTasks = useMemo(() => {
    // A) Filtro por estado
    const byStatus =
      statusFilter === "all"
        ? sortedTasks
        : sortedTasks.filter((t) => t.status === statusFilter);

    // B) Ocultar completadas
    const byCompleted =
      showCompleted || statusFilter === "completed"
        ? byStatus
        : byStatus.filter((t) => t.status !== "completed");

    // C) Búsqueda
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return byCompleted;

    return byCompleted.filter((t) => {
      const title = (t.title || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [sortedTasks, statusFilter, showCompleted, debouncedQuery]);

  // 7. Reset automático si ocultamos completadas estando en tab completadas
  useEffect(() => {
    if (!showCompleted && statusFilter === "completed") {
      setStatusFilter("all");
    }
  }, [showCompleted, statusFilter]);

  return {
    statusFilter,
    setStatusFilter,
    showCompleted,
    setShowCompleted,
    query,
    setQuery,
    debouncedQuery,
    visibleTasks,
    counts,
  };
};