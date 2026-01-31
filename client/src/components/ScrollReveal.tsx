import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
}

export const ScrollReveal = ({ children, width = "fit-content", delay = 0 }: ScrollRevealProps) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};
