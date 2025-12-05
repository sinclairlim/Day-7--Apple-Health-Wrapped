import React from "react";
import { motion, animate } from "motion/react";
import { SlideData } from "../../data/healthData";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  Trophy, 
  Medal, 
  Share2, 
  Instagram, 
  Copy, 
  Twitter, 
  Plane, 
  Building,
  Clock,
  Calendar,
  Flame,
  Award,
  Footprints,
  Waves
} from "lucide-react";

// --- Utility Components ---

const CountUp = ({ value, className }: { value: string | number | undefined; className?: string }) => {
  if (!value) return null;
  const stringVal = value.toString();
  // extracting numbers if it's like "2.5M" or "36,070"
  const numericMatch = stringVal.match(/[\d,.]+/);
  
  if (!numericMatch) return <span className={className}>{value}</span>;
  
  const numericValue = parseFloat(numericMatch[0].replace(/,/g, ""));
  const suffix = stringVal.replace(/[\d,.]+/g, "");
  const isNumber = !isNaN(numericValue);

  if (!isNumber) return <span className={className}>{value}</span>;

  const nodeRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, numericValue, {
      duration: 1.5,
      onUpdate(v) {
        // Handle integers vs decimals
        const formatted = numericValue % 1 !== 0 
           ? v.toFixed(1) 
           : Math.round(v).toLocaleString();
        node.textContent = formatted;
      },
      ease: "easeOut"
    });

    return () => controls.stop();
  }, [numericValue]);

  return <span className={className}><span ref={nodeRef}>0</span>{suffix}</span>;
};

// --- Slide Components ---

export const IntroSlide: React.FC<{ data: SlideData }> = ({ data }) => {
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center p-8 text-center`}>
      <motion.h1
        className={`mb-6 text-5xl sm:text-7xl font-black uppercase tracking-tighter ${data.color}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {data.title}
      </motion.h1>
      <motion.div
         className="my-8 h-1 w-32 bg-white/20 rounded-full overflow-hidden"
         initial={{ width: 0 }}
         animate={{ width: 128 }}
         transition={{ delay: 0.2, duration: 0.5 }}
      >
          <motion.div
             className="h-full bg-white"
             animate={{ x: [-128, 128] }}
             transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
      </motion.div>
      <motion.p
        className="text-2xl font-bold text-white max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {data.subtitle}
      </motion.p>
    </div>
  );
};

export const BigStatSlide: React.FC<{ data: SlideData }> = ({ data }) => {
  // Handles: stat, comparison, streak, month-highlight, personality

  // Dynamic Icon selection
  const Icon = data.meta?.compareIcon === "plane" ? Plane :
               data.meta?.compareIcon === "building" ? Building :
               data.type === "streak" ? Flame :
               data.type === "personality" ? Award :
               null;

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center p-6 text-center z-10`}>

      {/* Top Title */}
      <motion.h3
        className="mb-8 text-2xl font-bold text-white/80 uppercase tracking-widest"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {data.title}
      </motion.h3>

      {/* Optional Icon/Emoji */}
      {(data.emoji || Icon) && (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-6 text-8xl"
        >
            {Icon ? <Icon size={100} className={data.color} /> : data.emoji}
        </motion.div>
      )}

      {/* Main Value */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, type: "spring" }}
      >
        <h2 className={`text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tighter ${data.color}`}>
           <CountUp value={data.value} />
        </h2>
      </motion.div>

      {/* Subtitle */}
      {data.subtitle && (
        <motion.p
            className="mt-6 text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
        >
            {data.subtitle}
        </motion.p>
      )}

      {/* Description / Extra Text */}
      {data.description && (
        <motion.p
            className="mt-4 text-xl text-white/70 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
        >
            {data.description}
        </motion.p>
      )}

      {/* List items if present (e.g. Personality breakdown) */}
      {data.listItems && (
          <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-lg">
             {data.listItems.map((item, idx) => (
                 <motion.div
                    key={idx}
                    className="flex flex-col items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                 >
                    <span className="text-2xl font-bold text-white">{item.value}</span>
                    <span className="text-xs uppercase text-white/60">{item.label}</span>
                 </motion.div>
             ))}
          </div>
      )}
    </div>
  );
};

export const ChartSlide: React.FC<{ data: SlideData }> = ({ data }) => {
  // Handles: chart, graph
  const isClock = data.meta?.graphType === "clock";

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center p-6 text-center`}>
       <motion.h2
         className={`mb-2 text-4xl font-black uppercase ${data.color}`}
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4 }}
       >
         {data.title}
       </motion.h2>
       <motion.p
         className="mb-8 text-xl text-white/80"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.2, duration: 0.4 }}
       >
         {data.subtitle}
       </motion.p>

       <div className="h-[40vh] w-full max-w-xl">
          {isClock ? (
              <div className="relative flex items-center justify-center h-full">
                  <Clock size={200} className={`${data.color} opacity-80`} />
                  <motion.div
                    className="absolute text-4xl font-bold text-white bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                      {data.value}
                  </motion.div>
              </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} layout={data.meta?.chartType === "bar-horizontal" ? "vertical" : "horizontal"}>
                    <XAxis
                        type={data.meta?.chartType === "bar-horizontal" ? "number" : "category"}
                        dataKey={data.meta?.chartType === "bar-horizontal" ? undefined : "label"}
                        hide
                    />
                    <YAxis
                        type={data.meta?.chartType === "bar-horizontal" ? "category" : "number"}
                        dataKey={data.meta?.chartType === "bar-horizontal" ? "label" : undefined}
                        hide={data.meta?.chartType === "bar-vertical"}
                        width={80}
                        tick={{fill: 'white', fontSize: 12}}
                    />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                        {data.chartData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || (data.color.includes('orange') ? '#f97316' : '#fff')} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          )}
       </div>

       {/* Legend or Summary for Chart */}
       <div className="mt-8 flex flex-wrap justify-center gap-4">
          {data.description && (
             <motion.div
                className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-md border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
             >
                <p className="text-lg font-medium text-white">{data.description}</p>
             </motion.div>
          )}
       </div>
    </div>
  );
};

export const ListSlide: React.FC<{ data: SlideData }> = ({ data }) => {
  // Handles: list, leaderboard, summary, timeline
  const isLeaderboard = data.type === "leaderboard";
  const isTimeline = data.type === "timeline";

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center p-6 text-center`}>
      <motion.h2
        className={`mb-4 text-3xl sm:text-5xl font-black uppercase ${data.color}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {data.title}
      </motion.h2>

      {data.subtitle && (
        <motion.p
          className="mb-8 text-xl text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {data.subtitle}
        </motion.p>
      )}

      <div className="flex w-full max-w-md flex-col gap-3">
        {data.listItems?.map((item, index) => (
          <motion.div
            key={index}
            className={`flex items-center justify-between rounded-xl p-4 backdrop-blur-md
                ${isLeaderboard && index === 0 ? "bg-yellow-500/20 border border-yellow-500/50" : "bg-white/10"}
                ${isTimeline ? "border-l-4 border-white/20 pl-6" : ""}
            `}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <div className="flex items-center gap-4 text-left">
              {isLeaderboard && <span className="text-xl font-bold w-6">#{index + 1}</span>}
              {isTimeline && <div className="absolute left-[-10px] w-4 h-4 rounded-full bg-white" />}

              <div>
                  <span className="block text-sm font-medium text-white/60 uppercase tracking-wider">{item.label}</span>
                  {item.icon && <span className="text-xs text-white/40">{item.icon}</span>}
              </div>
            </div>
            <span className={`text-xl font-bold text-white ${isLeaderboard && index === 0 ? "text-yellow-300" : ""}`}>
                {item.value}
            </span>
          </motion.div>
        ))}
      </div>

      {data.description && (
          <motion.p
            className="mt-8 text-lg text-white/80 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
              "{data.description}"
          </motion.p>
      )}
    </div>
  );
};

export const BadgeSlide: React.FC<{ data: SlideData }> = ({ data }) => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15, duration: 0.5 }}
                className="relative mb-8"
            >
                <div className="absolute inset-0 bg-yellow-500 blur-[60px] opacity-40 rounded-full"></div>
                <Trophy size={180} className="text-yellow-400 relative z-10" />
            </motion.div>

            <motion.h2
                className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                {data.value}
            </motion.h2>

            <motion.div
                className="bg-white/10 px-6 py-2 rounded-full backdrop-blur-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
            >
                <p className="text-xl font-bold text-white">{data.subtitle}</p>
            </motion.div>
        </div>
    );
};

export const ShareSlide: React.FC<{ data: SlideData }> = ({ data }) => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
             <motion.div
                className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full mb-8 transform rotate-[-2deg]"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
             >
                 <h3 className="text-xs font-bold text-white/60 uppercase mb-2">Health Wrapped 2025</h3>
                 <h2 className="text-4xl font-black text-[#d2e823] mb-4">I'M ACTIVE</h2>
                 <div className="grid grid-cols-2 gap-4 text-left mb-6">
                     <div>
                         <p className="text-xs text-white/50">Steps</p>
                         <p className="text-xl font-bold text-white">2.5M</p>
                     </div>
                     <div>
                         <p className="text-xs text-white/50">Top Sport</p>
                         <p className="text-xl font-bold text-white">Running</p>
                     </div>
                     <div>
                         <p className="text-xs text-white/50">Streak</p>
                         <p className="text-xl font-bold text-white">32 Days</p>
                     </div>
                     <div>
                         <p className="text-xs text-white/50">Rating</p>
                         <p className="text-xl font-bold text-yellow-400">Moderate</p>
                     </div>
                 </div>
                 <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
                     <span className="text-xs font-mono text-white/40">figma-make.app</span>
                 </div>
             </motion.div>

             <motion.h2
                className="text-3xl font-black uppercase mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
             >
                {data.title}
             </motion.h2>

             <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
             >
                 <button className="p-4 bg-pink-600 rounded-full text-white hover:scale-105 transition-transform">
                     <Instagram />
                 </button>
                 <button className="p-4 bg-blue-400 rounded-full text-white hover:scale-105 transition-transform">
                     <Twitter />
                 </button>
                 <button className="p-4 bg-white/20 rounded-full text-white hover:scale-105 transition-transform">
                     <Copy />
                 </button>
             </motion.div>

             <motion.button
                onClick={() => window.location.reload()}
                className="mt-12 text-sm text-white/50 underline hover:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
             >
                 Watch Again
             </motion.button>
        </div>
    );
};
