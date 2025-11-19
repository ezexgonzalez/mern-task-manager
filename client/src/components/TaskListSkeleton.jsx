
import TaskSkeletonCard from "./TaskSkeletonCard.jsx";

const TaskListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <TaskSkeletonCard />
      <TaskSkeletonCard />
      <TaskSkeletonCard />
    </div>
  );
};

export default TaskListSkeleton;
