import { Flag } from "lucide-react";

const PriorityBadge = ({ label, className }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        shrink-0 text-[10px]
        px-2 py-0.5 rounded-full border
        font-medium tracking-[0.04em]
        ${className}
      `}
    >
      <Flag className="w-3 h-3" />
      Prioridad {label}
    </span>
  );
};

export default PriorityBadge;
