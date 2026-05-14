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
    <section className="rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-1.5 shadow-bubble backdrop-blur-xl sm:rounded-bubble sm:border-white/10 sm:bg-white/[0.025] sm:p-2">
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-1.5 lg:grid-cols-6">
        {STAT_ITEMS.map(({ key, label, Icon: IconComponent, accentClass }) => {
          const StatIcon = IconComponent;

          return (
            <div
              key={key}
              className="
                flex min-w-0 flex-col items-start gap-1.5 rounded-[14px] border border-white/[0.05] bg-white/[0.018]
                px-2 py-1.5 transition hover:bg-white/[0.035]
                sm:gap-0 sm:rounded-[16px] sm:border-white/[0.06] sm:bg-white/[0.025] sm:px-3 sm:py-2.5 sm:hover:bg-white/[0.04]
              "
            >
              <div
                className={`grid h-6 w-6 shrink-0 -translate-x-1.5 place-items-center rounded-full border opacity-80 sm:mb-2 sm:h-7 sm:w-7 sm:opacity-100 ${accentClass}`}
              >
                <StatIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </div>

              <div className="flex min-w-0 flex-col items-start">
                <p className="text-base font-semibold leading-none text-white sm:text-xl">
                  {stats[key]}
                </p>
                <p className="mt-0.5 truncate text-[10px] font-medium leading-tight text-slate-400 sm:mt-1 sm:text-xs">
                  {label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TaskStats;
