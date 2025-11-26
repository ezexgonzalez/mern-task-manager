import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const Toast = ({ show, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="
            fixed bottom-6 right-6 z-50
            bg-black/80 border border-borderGlass
            rounded-2xl shadow-bubble
            px-4 py-3
            flex items-center gap-3
            text-sm
          "
        >
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-gray-100">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
