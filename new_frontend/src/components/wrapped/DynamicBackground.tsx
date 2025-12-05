import React from "react";
import { motion } from "motion/react";
import { SlideData } from "../../data/healthData";
import { 
  Dumbbell, 
  Activity, 
  Moon, 
  Sun, 
  Droplets, 
  Heart, 
  Trophy,
  Footprints,
  Waves
} from "lucide-react";

export const DynamicBackground: React.FC<{ slide: SlideData }> = ({ slide }) => {
  
  const getTheme = (themeKey?: string) => {
    switch (themeKey) {
      case "green": return { bg: "bg-[#1a2e05]", accent: "#d2e823", icon: "fitness" };
      case "cyan": return { bg: "bg-cyan-950", accent: "#06b6d4", icon: "water" };
      case "orange": return { bg: "bg-orange-950", accent: "#f97316", icon: "sun" };
      case "purple": return { bg: "bg-purple-950", accent: "#a855f7", icon: "sleep" };
      case "pink": return { bg: "bg-pink-950", accent: "#ec4899", icon: "heart" };
      case "red": return { bg: "bg-red-950", accent: "#ef4444", icon: "heart" };
      case "blue": return { bg: "bg-blue-950", accent: "#3b82f6", icon: "water" };
      default: return { bg: "bg-zinc-900", accent: "#ffffff", icon: "fitness" };
    }
  };

  const theme = getTheme(slide.bgTheme);

  // Pattern overlay for that "Data/Tech" feel
  const gridPattern = `radial-gradient(${theme.accent}33 1px, transparent 1px)`;

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${theme.bg} transition-colors duration-700 ease-in-out`}>
      
      {/* Grid/Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
            backgroundImage: gridPattern, 
            backgroundSize: '40px 40px' 
        }} 
      />

      {/* Floating Sports/Health Glyphs */}
      <FloatingGlyphs theme={theme} />

      {/* Vignette for focus */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};

const FloatingGlyphs = ({ theme }: { theme: { accent: string, icon: string } }) => {
  const shapes = [
    { id: 1, x: "-10%", y: "10%", size: 300, delay: 0, duration: 35, rotate: 15 },
    { id: 2, x: "85%", y: "60%", size: 400, delay: 2, duration: 40, rotate: -15 },
    { id: 3, x: "15%", y: "85%", size: 250, delay: 1, duration: 30, rotate: 45 },
    { id: 4, x: "80%", y: "-10%", size: 200, delay: 3, duration: 45, rotate: -10 },
  ];

  return (
    <>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute opacity-10"
          style={{ 
            left: shape.x, 
            top: shape.y,
            color: theme.accent 
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [shape.rotate, shape.rotate + 10, shape.rotate],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay
          }}
        >
          <GlyphIcon type={theme.icon} index={shape.id} size={shape.size} />
        </motion.div>
      ))}
    </>
  );
};

const GlyphIcon = ({ type, index, size }: { type: string, index: number, size: number }) => {
  // Return different icons based on the type theme to allow variety
  // e.g. "water" theme can return drops, waves, or faucet
  
  if (type === "water") {
      const icons = [Droplets, Waves, Droplets, Waves];
      const Icon = icons[index % icons.length];
      return <Icon size={size} strokeWidth={1} />;
  }

  if (type === "sun") {
      const icons = [Sun, Activity, Sun, Activity];
      const Icon = icons[index % icons.length];
      return <Icon size={size} strokeWidth={1} />;
  }

  if (type === "sleep") {
      const icons = [Moon, Moon, Moon, Moon];
      const Icon = icons[index % icons.length];
      return <Icon size={size} strokeWidth={1} />;
  }

  if (type === "heart") {
      const icons = [Heart, Trophy, Heart, Trophy];
      const Icon = icons[index % icons.length];
      return <Icon size={size} strokeWidth={1} />;
  }
  
  // Default "fitness"
  const icons = [Dumbbell, Footprints, Activity, Trophy];
  const Icon = icons[index % icons.length];
  return <Icon size={size} strokeWidth={1} />;
};