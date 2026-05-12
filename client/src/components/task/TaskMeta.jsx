import PriorityBadge from "./PriorityBadge.jsx";
import DueDateBadge from "./DueDateBadge.jsx";

const TaskMeta = ({ priority, dueDateInfo, isCompleted }) => {
  return (
    <div
      className={`mt-3 flex flex-wrap items-center gap-2 transition-opacity ${
        isCompleted ? "opacity-60" : "opacity-100"
      }`}
    >
      <PriorityBadge label={priority.label} className={priority.badgeClass} />
      <DueDateBadge dueDateInfo={dueDateInfo} />
    </div>
  );
};

export default TaskMeta;
