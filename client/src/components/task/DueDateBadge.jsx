import { CalendarDays } from "lucide-react";

const DueDateBadge = ({ dueDateInfo }) => {
  if (!dueDateInfo) return null;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        shrink-0 text-[10px]
        px-2 py-0.5 rounded-full border
        font-medium tracking-[0.04em]
        ${dueDateInfo.className}
      `}
    >
      <CalendarDays className="w-3 h-3" />
      {dueDateInfo.label}
    </span>
  );
};

export default DueDateBadge;
