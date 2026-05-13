import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Circle,
  ListTodo,
  LoaderCircle,
} from "lucide-react";

const STAT_ITEMS = [
  {
    key: "total",
    label: "Total",
    Icon: ListTodo,
    accentClass: "text-slate-200 bg-white/[0.055] border-white/10",
  },
  {
    key: "pending",
    label: "Pendientes",
    Icon: Circle,
    accentClass: "text-warning bg-warning/10 border-warning/15",
  },
  {
    key: "inProgress",
    label: "En progreso",
    Icon: LoaderCircle,
    accentClass: "text-progress bg-progress/10 border-progress/15",
  },
  {
    key: "completed",
    label: "Completadas",
    Icon: CheckCircle2,
    accentClass: "text-success bg-success/10 border-success/15",
  },
  {
    key: "overdue",
    label: "Vencidas",
    Icon: AlertTriangle,
    accentClass: "text-red-300 bg-red-400/10 border-red-400/20",
  },
  {
    key: "upcoming",
    label: "Próximas",
    Icon: CalendarClock,
    accentClass: "text-amber-200 bg-amber-400/10 border-amber-400/20",
  },
];

const TaskStats = ({ stats }) => {
  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {STAT_ITEMS.map(({ key, label, Icon: IconComponent, accentClass }) => {
        const StatIcon = IconComponent;

        return (
          <div
            key={key}
            className="
              min-w-0 rounded-bubble border border-white/10 bg-white/[0.035]
              px-3 py-3 shadow-bubble backdrop-blur-xl
            "
          >
            <div
              className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full border ${accentClass}`}
            >
              <StatIcon className="h-4 w-4" />
            </div>

            <p className="text-2xl font-semibold leading-none text-white">
              {stats[key]}
            </p>
            <p className="mt-1 truncate text-xs font-medium text-slate-400">
              {label}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default TaskStats;
