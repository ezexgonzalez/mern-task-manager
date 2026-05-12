import { Loader2 } from "lucide-react";

const TaskStatusIndicator = ({ isPending, dotClass }) => {
  return (
    <div className="mt-1 shrink-0 w-3 h-3 flex items-center justify-center">
      {isPending ? (
        <Loader2 className="w-3 h-3 text-white/50 animate-spin" />
      ) : (
        <span
          className={`block w-2.5 h-2.5 rounded-full transition-colors duration-300 ${dotClass}`}
        />
      )}
    </div>
  );
};

export default TaskStatusIndicator;
