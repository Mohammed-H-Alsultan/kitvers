import { motion } from "motion/react";

export default function PageTranstion({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x:-50}}
      transition={{duration: 0.25, ease:"easeOut"}}
    >
      {children}
    </motion.main>
  );
}
