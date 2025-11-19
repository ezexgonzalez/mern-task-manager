
const STATUS_DOT_COLOR = {
  pending: "bg-warning",        // naranja
  "in-progress": "bg-progress", // amarillo
  completed: "bg-success",      // verde
};

const TaskCard = ({ task }) => {
  const dotClass = STATUS_DOT_COLOR[task.status] || "bg-warning";

  return (
    <div
      className="
        w-full
        bg-glassLight backdrop-blur-md
        rounded-bubble border border-borderGlass
        shadow-bubble
        px-5 py-4
        transition
        hover:bg-glassMedium      /* un poco más brillante, no blanco */
        hover:border-glassMedium  /* borde apenas más marcado */
        hover:-translate-y-[1px]  /* efecto flotando */
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.55)]
      "
    >
      <div className="flex items-start gap-3">
        {/* Puntito de estado */}
        <span className={`w-2.5 h-2.5 rounded-full mt-1 ${dotClass}`} />

        {/* Texto */}
        <div className="flex flex-col">
          <h3 className="text-gray-100 font-semibold text-base leading-snug">
            {task.title}
          </h3>

          <p className="text-slate-400 text-sm mt-1">
            {task.description || "Descripción opcional"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;


