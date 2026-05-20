"use client";

import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function AuthButton({ children, isLoading, disabled, ...props }: AuthButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || disabled}
      {...props}
      className="w-full h-12 bg-[#85A1D1] hover:bg-[#7490C0] active:bg-[#637FAF] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(133,161,209,0.25)] hover:shadow-[0_8px_20px_rgba(133,161,209,0.35)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{children}</span>
    </motion.button>
  );
}
