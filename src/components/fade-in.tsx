"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "header";
};

export function FadeIn({
  delay = 0,
  y = 16,
  as = "div",
  children,
  ...rest
}: FadeInProps) {
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: reduce ? 0.2 : 0.6,
        delay: reduce ? 0 : delay,
        ease: [0.2, 0.65, 0.25, 1],
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
