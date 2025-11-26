
const TaskSkeletonCard = () => {
  return (
    <div
      className="
        w-full
        bg-glassLight/60 backdrop-blur-md
        rounded-bubble border border-borderGlass
        shadow-bubble
        px-5 py-4
        animate-pulse
      "
    >
      <div className="flex items-start gap-3">
        {/* Puntito apagado */}
        <span className="w-2.5 h-2.5 rounded-full mt-1 bg-borderGlass/70" />

        {/* Líneas difuminadas */}
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 bg-borderGlass/70 rounded-full" />
          <div className="h-3 w-2/3 bg-borderGlass/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default TaskSkeletonCard;
