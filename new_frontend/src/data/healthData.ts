import { LucideIcon } from "lucide-react";

export type WrappedSlideType =
  | "intro"
  | "stat"
  | "comparison"
  | "personality"
  | "month-highlight"
  | "streak"
  | "chart"
  | "graph" // Clock/Time
  | "leaderboard"
  | "list"
  | "timeline"
  | "summary"
  | "badge"
  | "share";

export interface ChartItem {
  label: string;
  value: number;
  color?: string;
  icon?: string;
}

export interface SlideData {
  id: number;
  type: WrappedSlideType;
  title: string;
  subtitle?: string;
  value?: string | number;
  description?: string;
  color: string; // Tailwind text color class for theming
  bgTheme?: "green" | "cyan" | "orange" | "purple" | "pink" | "red" | "blue"; // Explicit theme key for DynamicBackground
  emoji?: string;

  // Specific Data Props
  listItems?: { label: string; value: string; icon?: string }[];
  chartData?: ChartItem[];
  highlightDate?: string; // For calendars
  meta?: any; // Flexible field for specific visual configs
}

export const healthWrappedData: SlideData[] = [
  // Page 1: Hero Intro
  {
    id: 1,
    type: "intro",
    title: "YOUR 2025 HEALTH WRAPPED",
    subtitle: "Let's see what your body did this year",
    color: "text-[#d2e823]",
    bgTheme: "green",
    value: "2025"
  },
  // Page 2: The Big Number
  {
    id: 2,
    type: "stat",
    title: "2.5 MILLION",
    subtitle: "STEPS",
    description: "That's right. Two and a half million.",
    value: "2,496,768",
    color: "text-cyan-400",
    bgTheme: "cyan",
    emoji: "👣"
  },
  // Page 3: Distance Reveal
  {
    id: 3,
    type: "comparison",
    title: "Those steps took you",
    value: "1,837 KM",
    subtitle: "Singapore to Manila",
    description: "That's the distance you covered.",
    color: "text-blue-400",
    bgTheme: "blue",
    meta: { compareIcon: "plane", label: "Singapore ✈️ Manila" }
  },
  // Page 4: Fitness Personality
  {
    id: 4,
    type: "personality",
    title: "You're a",
    value: "CARDIO KING",
    subtitle: "👑",
    description: "Running is your thing.",
    color: "text-orange-500",
    bgTheme: "orange",
    listItems: [
        { label: "Runs", value: "34", icon: "🏃" },
        { label: "Swims", value: "12", icon: "🏊" },
        { label: "Walks", value: "8", icon: "🚶" }
    ]
  },
  // Page 5: Top Activity
  {
    id: 5,
    type: "chart",
    title: "RUNNING",
    subtitle: "soundtracked your year",
    description: "34 sessions • 38 hours",
    color: "text-orange-400",
    bgTheme: "orange",
    chartData: [
        { label: "Running", value: 34, color: "#fb923c" }, // Orange-400
        { label: "Swimming", value: 12, color: "#22d3ee" }, // Cyan-400
        { label: "Walking", value: 8, color: "#4ade80" }, // Green-400
        { label: "Other", value: 3, color: "#94a3b8" }  // Slate-400 (Hiking + StairClimbing)
    ],
    meta: { chartType: "bar-horizontal" }
  },
  // Page 6: Best Month
  {
    id: 6,
    type: "month-highlight",
    title: "NOVEMBER",
    subtitle: "was your fitness renaissance",
    value: "Nov",
    description: "You were unstoppable.",
    color: "text-purple-400",
    bgTheme: "purple",
    listItems: [
        { label: "Workouts", value: "12" },
        { label: "Steps", value: "137,704" },
        { label: "Distance", value: "106.5 km" }
    ]
  },
  // Page 7: The Epic Streak
  {
    id: 7,
    type: "streak",
    title: "32 DAYS",
    subtitle: "April 9 - May 10",
    description: "You didn't miss a single day. That's dedication.",
    value: "32",
    color: "text-green-400",
    bgTheme: "green",
    meta: { startDate: "2025-04-09", endDate: "2025-05-10" }
  },
  // Page 8: Peak Performance Day
  {
    id: 8,
    type: "stat",
    title: "NOVEMBER 23",
    subtitle: "Your champion day",
    value: "141 min",
    description: "You absolutely crushed it.",
    color: "text-red-500",
    bgTheme: "red",
    listItems: [
        { label: "Running", value: "141 mins" },
        { label: "Burned", value: "1,024 kcal" },
        { label: "Peak HR", value: "173 bpm" }
    ]
  },
  // Page 9: Step Champion Day
  {
    id: 9,
    type: "stat",
    title: "AUGUST 14",
    subtitle: "Your step record",
    value: "36,070",
    description: "That's 5x the average person!",
    color: "text-cyan-400",
    bgTheme: "cyan",
    meta: { subValue: "25.7 km covered" }
  },
  // Page 10: Monthly Sprint (Animated) - Using actual monthly steps
  {
    id: 10,
    type: "chart",
    title: "WATCH YOUR YEAR",
    subtitle: "Monthly Activity Levels",
    description: "August takes the lead!",
    color: "text-yellow-400",
    bgTheme: "orange",
    chartData: [
        { label: "Jan", value: 282027 },
        { label: "Feb", value: 154335 },
        { label: "Mar", value: 129362 },
        { label: "Apr", value: 325532 },
        { label: "May", value: 255421 },
        { label: "Jun", value: 168379 },
        { label: "Jul", value: 223688 },
        { label: "Aug", value: 379689 }, // Highest!
        { label: "Sep", value: 323000 },
        { label: "Oct", value: 112932 },
        { label: "Nov", value: 137704 },
        { label: "Dec", value: 4699 }, // Only partial data
    ],
    meta: { chartType: "bar-vertical" }
  },
  // Page 11: Heart Stats
  {
    id: 11,
    type: "stat",
    title: "YOUR HEART",
    subtitle: "56.7 MILLION BEATS",
    value: "56.7M",
    description: "You pushed it!",
    color: "text-pink-500",
    bgTheme: "pink",
    listItems: [
        { label: "Avg BPM", value: "108" },
        { label: "Resting", value: "60" },
        { label: "Peak", value: "200" }
    ]
  },
  // Page 12: Time Personality
  {
    id: 12,
    type: "graph",
    title: "You're FLEXIBLE",
    subtitle: "7 PM is your power hour",
    value: "19:00",
    description: "Not a morning person 🌅, not a night owl 🌙",
    color: "text-indigo-400",
    bgTheme: "purple",
    meta: { graphType: "clock", highlightHour: 19 }
  },
  // Page 13: Favorite Day
  {
    id: 13,
    type: "chart",
    title: "SUNDAY FUNDAY",
    subtitle: "Weekend warrior confirmed.",
    value: "Sunday",
    color: "text-emerald-400",
    bgTheme: "green",
    chartData: [
        { label: "Mon", value: 7 },
        { label: "Tue", value: 8 },
        { label: "Wed", value: 8 },
        { label: "Thu", value: 8 },
        { label: "Fri", value: 7 },
        { label: "Sat", value: 9 },
        { label: "Sun", value: 10 }, // Highest
    ],
    meta: { chartType: "bar-vertical" }
  },
  // Page 14: VO2 Max
  {
    id: 14,
    type: "stat",
    title: "FITNESS SCORE",
    value: "39.6",
    subtitle: "VO2 Max (mL/min·kg)",
    description: "Younger than your years 💪",
    color: "text-blue-500",
    bgTheme: "blue"
  },
  // Page 15: Elevation Challenge
  {
    id: 15,
    type: "comparison",
    title: "1,492 FLIGHTS",
    subtitle: "of stairs climbed",
    value: "1,492",
    description: "Like climbing the Burj Khalifa 3 times!",
    color: "text-yellow-300",
    bgTheme: "orange",
    meta: { compareIcon: "building", multiplier: 3, label: "Burj Khalifa" }
  },
  // Page 16: Multi-Sport
  {
    id: 16,
    type: "list",
    title: "MULTI-SPORT ATHLETE",
    subtitle: "Variety is your strength",
    color: "text-teal-400",
    bgTheme: "cyan",
    listItems: [
        { label: "Running", value: "34", icon: "🏃" },
        { label: "Swimming", value: "12", icon: "🏊" },
        { label: "Walking", value: "8", icon: "🚶" },
        { label: "Hiking", value: "2", icon: "🥾" },
        { label: "Stairs", value: "1", icon: "🪜" },
    ]
  },
  // Page 17: August Anomaly
  {
    id: 17,
    type: "stat",
    title: "AUGUST 2025",
    subtitle: "The mystery month",
    description: "You just kept moving. What happened?",
    value: "0 Workouts",
    color: "text-rose-400",
    bgTheme: "red",
    meta: { subValue: "379,689 steps though!" }
  },
  // Page 18: First & Last
  {
    id: 18,
    type: "timeline",
    title: "YOUR JOURNEY",
    subtitle: "Started strong. Ended strong.",
    color: "text-amber-400",
    bgTheme: "orange",
    listItems: [
        { label: "Jan 27", value: "First Run", icon: "🚀" },
        { label: "Nov 30", value: "Last Run", icon: "🏁" }
    ]
  },
  // Page 19: Top 5 Days Leaderboard
  {
    id: 19,
    type: "leaderboard",
    title: "TOP STEP DAYS",
    subtitle: "Your Hall of Fame",
    color: "text-yellow-400",
    bgTheme: "orange",
    listItems: [
        { label: "Aug 14", value: "36,070" },
        { label: "Apr 24", value: "31,002" },
        { label: "May 1", value: "29,819" },
        { label: "Apr 21", value: "29,280" },
        { label: "Aug 13", value: "28,487" },
    ]
  },
  // Page 20: Wellness Habits
  {
    id: 20,
    type: "summary",
    title: "SELF CARE",
    description: "Health is more than workouts.",
    color: "text-purple-300",
    bgTheme: "purple",
    listItems: [
      { label: "Handwashes", value: "592", icon: "🧼" },
      { label: "Daylight", value: "1,316", icon: "☀️" },
      { label: "Sleep Records", value: "25k", icon: "😴" },
    ]
  },
  // Page 21: Your Number (Percentile)
  {
    id: 21,
    type: "stat",
    title: "79% OF GOAL",
    subtitle: "You're 2x the average person",
    value: "7,900",
    description: "Avg steps/day (Goal: 10k)",
    color: "text-green-400",
    bgTheme: "green"
  },
  // Page 22: Year in Review Numbers
  {
    id: 22,
    type: "list",
    title: "2025 BY THE NUMBERS",
    subtitle: "Not bad at all.",
    color: "text-white",
    bgTheme: "blue",
    listItems: [
        { label: "Steps", value: "2.5M" },
        { label: "Distance", value: "1,837 km" },
        { label: "Workouts", value: "57" },
        { label: "Burned", value: "65.7k kcal" },
        { label: "Active", value: "38 hrs" },
        { label: "Streak", value: "32 days" },
    ]
  },
  // Page 23: Activity Level Badge
  {
    id: 23,
    type: "badge",
    title: "YOUR BADGE",
    value: "MODERATE",
    subtitle: "You showed up.",
    description: "Activity Level",
    color: "text-yellow-400",
    bgTheme: "orange"
  },
  // Page 24: Share
  {
    id: 24,
    type: "share",
    title: "SHARE YOUR WRAPPED",
    subtitle: "#HealthWrapped2025",
    color: "text-white",
    bgTheme: "pink"
  }
];
