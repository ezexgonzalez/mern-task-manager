// TaskForm.jsx
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CalendarDays } from "lucide-react";
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  getTaskPriorityOption,
  getTaskStatusOption,
} from "../constants/taskOptions.js";
import TaskSelect from "./task/TaskSelect.jsx";

const schema = yup.object().shape({
  title: yup.string().required("El título es obligatorio"),
  description: yup.string(),
  status: yup
    .string()
    .oneOf(["pending", "in-progress", "completed"])
    .required(),
  priority: yup.string().oneOf(["low", "medium", "high"]).required(),
  dueDate: yup.string().nullable(),
  color: yup.string().required(),
});

const TaskForm = ({
  onSubmit,
  titleValue,
  initialTask,
  submitLabel = "Crear tarea",
  showTitleInput = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialTask?.title || titleValue || "",
      description: initialTask?.description || "",
      status: initialTask?.status || "pending",
      priority: initialTask?.priority || "medium",
      color: initialTask?.color || "#ffffff",
      dueDate: initialTask?.dueDate ? initialTask.dueDate.split("T")[0] : "",
    },
  });

  const { ref: descriptionFieldRef, ...descriptionReg } =
    register("description");

  const [statusOpen, setStatusOpen] = useState(false);
  const status = watch("status");
  const [priorityOpen, setPriorityOpen] = useState(false);
  const priority = watch("priority");

  const descriptionRef = useRef(null);

  // Sincroniza el título con el input del wrapper en modo crear.
  useEffect(() => {
    if (titleValue !== undefined) {
      setValue("title", titleValue);
    }
  }, [titleValue, setValue]);

  const submit = (data) => {
    onSubmit(data);

    reset({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      color: "#ffffff",
    });
    setStatusOpen(false);
    setPriorityOpen(false);

    if (descriptionRef.current) {
      descriptionRef.current.style.height = "";
    }
  };

  const currentStatus = getTaskStatusOption(status);
  const currentPriority = getTaskPriorityOption(priority);

  const handleDescriptionInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (initialTask?.description && descriptionRef.current) {
      const el = descriptionRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [initialTask]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-4 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {showTitleInput && (
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Título de la tarea"
            {...register("title")}
            className="
              w-full px-4 py-2.5
              bg-glassLight backdrop-blur-md
              rounded-bubble border border-borderGlass
              text-gray-200 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-glassMedium
              transition shadow-bubble
            "
          />
          {errors.title && (
            <p className="text-red-400 text-xs">{errors.title.message}</p>
          )}
        </div>
      )}

      <textarea
        placeholder="Descripción opcional"
        {...descriptionReg}
        ref={(el) => {
          descriptionRef.current = el;
          descriptionFieldRef(el);
        }}
        onInput={handleDescriptionInput}
        className="
          w-full px-4 py-3
          min-h-[100px]
          bg-glassLight backdrop-blur-md
          rounded-bubble border border-borderGlass
          text-gray-200 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-glassMedium
          transition shadow-bubble
          resize-none overflow-hidden
        "
      />

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.1fr] items-start gap-3">
        <TaskSelect
          value={status}
          options={TASK_STATUS_OPTIONS}
          currentOption={currentStatus}
          open={statusOpen}
          onToggle={() => {
            setStatusOpen((prev) => !prev);
            setPriorityOpen(false);
          }}
          onChange={(nextStatus) => {
            setValue("status", nextStatus, { shouldValidate: true });
            setStatusOpen(false);
          }}
        />

        <TaskSelect
          value={priority}
          options={TASK_PRIORITY_OPTIONS}
          currentOption={currentPriority}
          open={priorityOpen}
          onToggle={() => {
            setPriorityOpen((prev) => !prev);
            setStatusOpen(false);
          }}
          onChange={(nextPriority) => {
            setValue("priority", nextPriority, { shouldValidate: true });
            setPriorityOpen(false);
          }}
          labelPrefix="Prioridad "
        />

        <div className="relative min-w-0 self-start">
          <CalendarDays className="pointer-events-none absolute left-3 top-[1.35rem] w-4 h-4 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            aria-label="Fecha límite"
            {...register("dueDate")}
            className="
              w-full pl-9 pr-3 py-2.5
              bg-white/[0.035] backdrop-blur-md
              rounded-bubble border border-white/10
              text-gray-200 text-sm
              shadow-bubble
              focus:outline-none focus:ring-2 focus:ring-glassMedium
              transition hover:bg-white/[0.055]
              [color-scheme:dark]
            "
          />
          {errors.dueDate && (
            <p className="mt-1 text-red-400 text-xs">
              {errors.dueDate.message}
            </p>
          )}
        </div>
      </div>

      <input type="hidden" {...register("status")} />
      <input type="hidden" {...register("priority")} />
      <input type="color" {...register("color")} className="hidden" />

      {errors.status && (
        <p className="text-red-400 text-xs">{errors.status.message}</p>
      )}
      {errors.priority && (
        <p className="text-red-400 text-xs">{errors.priority.message}</p>
      )}

      <div className="flex justify-end mt-1">
        <button
          type="submit"
          className="
            px-5 py-2
            bg-success/20 text-success
            rounded-bubble border border-success/20
            hover:bg-success/30 hover:text-green-100
            transition
            shadow-bubble text-sm font-medium
          "
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
