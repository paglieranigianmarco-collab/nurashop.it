"use client";

import { motion } from "framer-motion";

interface ScarcityCounterProps {
  current: number;
  total: number;
}

export default function ScarcityCounter({ current, total }: ScarcityCounterProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="flex flex-col items-center w-64">
      <div className="flex justify-between w-full text-xs text-secondary/80 font-medium mb-2 font-mono tracking-widest">
        <span>SPOTS CLAIMED</span>
        <span className="text-primary">{current} / {total}</span>
      </div>
      <div className="h-1 w-full bg-border rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="absolute top-0 left-0 h-full bg-accent rounded-full shadow-[0_0_10px_rgba(201,168,76,0.6)]"
        />
      </div>
      <p className="mt-3 text-[10px] text-secondary/50 tracking-widest uppercase">
        *Access strictly limited
      </p>
    </div>
  );
}
