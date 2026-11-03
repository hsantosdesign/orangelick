"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// Reduced-motion preferences are handled globally by <MotionConfig reducedMotion="user"> in the root layout,
// so server and client render identical initial styles (no hydration mismatch).

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  /** Vertical travel in px before the element settles into place. */
  offset?: number;
}

/** Fades and lifts content in as it scrolls into view. */
export function Reveal({ delay = 0, offset = 28, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Staggers direct children that are wrapped in <RevealItem>. */
export function RevealGroup({ children, stagger = 0.08, ...props }: HTMLMotionProps<"div"> & { stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
