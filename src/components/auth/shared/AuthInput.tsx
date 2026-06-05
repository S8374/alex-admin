"use client";

import { InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export function AuthInput({ label, error, rightElement, ...props }: AuthInputProps) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[13px] font-semibold text-muted-foreground ml-1 transition-colors group-focus-within:text-primary">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          className={`w-full h-12 bg-gray-50 border ${
            error ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-primary/10 focus:border-primary"
          } rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-4 focus:bg-white`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground">
            {rightElement}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-red-500 font-medium ml-1 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
