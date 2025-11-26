// TaskForm.jsx
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const schema = yup.object().shape({
  title: yup.string().required("El título es obligatorio"),
  description: yup.string(),
  status: yup
    .string()
    .oneOf(["pending", "in-progress", "completed"])
    .required(),
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
      color: initialTask?.color || "#ffffff",
    },
  });

  const { ref: descriptionFieldRef, ...descriptionReg } =
    register("description");

  const [statusOpen, setStatusOpen] = useState(false);
  const status = watch("status");

  const descriptionRef = useRef(null);

  // sincroniza el título con el input del wrapper (modo crear)
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
      color: "#ffffff",
    });
    setStatusOpen(false);

    if (descriptionRef.current) {
      descriptionRef.current.style.height = "";
    }
  };

  const allStatusOptions = [
    { value: "pending", label: "Pendiente", dotClass: "bg-warning" },
    { value: "in-progress", label: "En progreso", dotClass: "bg-progress" },
    { value: "completed", label: "Completada", dotClass: "bg-success" },
  ];

  const current =
    allStatusOptions.find((opt) => opt.value === status) || allStatusOptions[0];

  const visibleOptions = allStatusOptions.filter((opt) => opt.value !== status);

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
      {/* TÍTULO (solo en modo edición / cuando se pida) */}
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

      {/* DESCRIPCIÓN */}
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

      {/* STATUS */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setStatusOpen((prev) => !prev)}
          className="
            w-full px-4 py-3
            bg-glassLight backdrop-blur-md
            rounded-bubble border border-borderGlass
            text-gray-200
            flex items-center justify-between gap-3
            shadow-bubble
            focus:outline-none focus:ring-2 focus:ring-glassMedium
            transition
          "
        >
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${current.dotClass}`} />
            <span>{current.label}</span>
          </div>

          <ChevronDown
            size={18}
            className={`transition-transform ${
              statusOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <input type="hidden" {...register("status")} />

        <AnimatePresence>
          {statusOpen && (
            <motion.div
              layout
              initial={{ height: 0, opacity: 0, y: -4 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="
                bg-glassLight backdrop-blur-md
                rounded-bubble border border-borderGlass
                shadow-bubble overflow-hidden
              "
            >
              {visibleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setValue("status", opt.value, { shouldValidate: true });
                    setStatusOpen(false);
                  }}
                  className="
                    w-full px-4 py-3
                    flex items-center justify-between gap-3
                    text-gray-200 text-sm
                    hover:bg-glassMedium/80
                    transition
                  "
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${opt.dotClass}`}
                    />
                    <span>{opt.label}</span>
                  </div>

                  {status === opt.value && (
                    <Check size={16} className="text-success" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* COLOR oculto */}
      <input type="color" {...register("color")} className="hidden" />

      {errors.status && (
        <p className="text-red-400 text-xs">{errors.status.message}</p>
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
