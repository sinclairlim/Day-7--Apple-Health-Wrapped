import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface ProgressBarProps {
  total: number;
  current: number;
  onComplete?: () => void;
  isActive: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ total, current, onComplete, isActive }) => {
  return (
    <div className="absolute top-4 left-0 right-0 z-50 flex gap-2 px-4">
      {Array.from({ length: total }).map((_, idx) => (
        <ProgressSegment
          key={idx}
          active={idx === current}
          completed={idx < current}
          isActive={isActive}
          onComplete={idx === current ? onComplete : undefined}
        />
      ))}
    </div>
  );
};

const ProgressSegment = ({ 
  active, 
  completed, 
  isActive,
  onComplete 
}: { 
  active: boolean; 
  completed: boolean; 
  isActive: boolean;
  onComplete?: () => void;
}) => {
  const [isFinished, setIsFinished] = useState(false);

  // Reset finished state when active changes
  useEffect(() => {
    if (!active) setIsFinished(false);
  }, [active]);

  // If we finished while paused, and now we are active again, trigger complete
  useEffect(() => {
    if (isFinished && isActive && active && onComplete) {
      onComplete();
    }
  }, [isFinished, isActive, active, onComplete]);

  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
      <motion.div
        className="h-full bg-white"
        initial={{ width: "0%" }}
        animate={{ width: completed ? "100%" : active ? "100%" : "0%" }}
        transition={
          active && !completed
            ? { duration: 15, ease: "linear" }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (active) {
            setIsFinished(true);
            if (isActive && onComplete) {
              onComplete();
            }
          }
        }}
      />
    </div>
  );
};
