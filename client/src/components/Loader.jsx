import { motion } from "framer-motion";

const Loader = () => {
  const dotVariants = {
    initial: {
      y: 0,
      opacity: 0, // Empiezan invisibles para un efecto más suave
    },
    animate: {
      y: -8, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2, // Un poco más lento entre puntos para elegancia
      },
    },
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black/20">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex gap-3" // Solo espaciado, sin fondo ni bordes
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            className="block w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loader;
