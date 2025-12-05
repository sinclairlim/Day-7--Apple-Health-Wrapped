import React, { useState, useEffect } from "react";
import { healthWrappedData } from "../../data/healthData";
import { ProgressBar } from "./ProgressBar";
import { DynamicBackground } from "./DynamicBackground";
import { 
  IntroSlide, 
  BigStatSlide, 
  ListSlide, 
  ChartSlide, 
  BadgeSlide, 
  ShareSlide 
} from "./Slides";
import { AnimatePresence, motion } from "motion/react";

export const WrappedDeck: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentSlide = healthWrappedData[currentIndex];

  const handleNext = () => {
    if (currentIndex < healthWrappedData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    handleNext();
  };

  // Pause on touch/hold
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  // Render Helper
  const renderSlide = () => {
    switch (currentSlide.type) {
      case "intro":
        return <IntroSlide data={currentSlide} />;
      
      case "stat":
      case "comparison":
      case "streak":
      case "month-highlight":
      case "personality":
        return <BigStatSlide data={currentSlide} />;
      
      case "chart":
      case "graph":
        return <ChartSlide data={currentSlide} />;
      
      case "list":
      case "leaderboard":
      case "summary":
      case "timeline":
        return <ListSlide data={currentSlide} />;
      
      case "badge":
        return <BadgeSlide data={currentSlide} />;
      
      case "share":
        return <ShareSlide data={currentSlide} />;
      
      default:
        // Fallback
        return <BigStatSlide data={currentSlide} />;
    }
  };

  return (
    <div 
      className="relative h-screen w-full overflow-hidden text-white"
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Background */}
      <DynamicBackground slide={currentSlide} />

      {/* Progress Bars */}
      <ProgressBar 
        total={healthWrappedData.length} 
        current={currentIndex} 
        onComplete={handleComplete}
        isActive={!isPaused}
      />

      {/* Navigation Zones */}
      <div className="absolute inset-0 z-40 flex">
        <div 
            className="h-full w-1/3" 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
        />
        <div 
            className="h-full w-2/3" 
            onClick={(e) => { e.stopPropagation(); handleNext(); }} 
        />
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="h-full w-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>

      {/* Branding / Footer Overlay */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-10">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Health Wrapped 2025</p>
      </div>
    </div>
  );
};
