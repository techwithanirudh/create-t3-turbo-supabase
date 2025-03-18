"use client";
import type { ReactNode } from "react";
import React from "react";
import type { MotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@acme/ui";

type MotionWrapProps = {
  children: ReactNode;
  className?: string;
  id?: string;
} & MotionProps;

const MotionWrap: React.FC<MotionWrapProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.section
      whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
      transition={{ duration: 0.5 }}
      className={cn(className, "app__flex")}
      {...props}
    >
      {children}
    </motion.section>
  );
};

export default MotionWrap;
