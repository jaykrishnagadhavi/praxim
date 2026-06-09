export interface UseCaseData {
  slug: string;
  title: string;
  description: string;
  h1: string;
  heroSubtitle: string;
  benefits: {
    title: string;
    description: string;
  }[];
  suggestedHabits: string[];
}

export const useCases: UseCaseData[] = [
  {
    slug: "adhd-habit-tracker",
    title: "Best Habit Tracker for ADHD | Praxim",
    description: "A minimalist, distraction-free habit tracker designed for ADHD. Stack routines, minimize executive dysfunction, and build momentum without the overwhelm.",
    h1: "The Distraction-Free Habit Tracker for ADHD.",
    heroSubtitle: "Gamification and complex dashboards cause executive dysfunction. Praxim strips away the noise so you can focus on building momentum, one habit at a time.",
    benefits: [
      {
        title: "No Overwhelming Interfaces",
        description: "Standard trackers throw graphs, points, and streaks at you. Praxim presents a clean, minimalist checklist that calms the mind."
      },
      {
        title: "Time-Horizon Stacking",
        description: "Don't stress about doing everything today. Separate tasks into Daily, Weekly, and Monthly horizons to relieve immediate pressure."
      },
      {
        title: "Mood & Reflection Logging",
        description: "ADHD often comes with emotional dysregulation. Quickly capture your mood and micro-reflections alongside your habits."
      }
    ],
    suggestedHabits: [
      "Take medication at 9 AM",
      "10-minute inbox zero",
      "Write tomorrow's 3 priority tasks"
    ]
  },
  {
    slug: "minimalist-habit-tracker",
    title: "Minimalist Habit Tracker App | Praxim",
    description: "The aesthetic, beautifully minimalist habit tracker app for deep focus. No ads, no social feeds, no clutter. Just your routines.",
    h1: "A Beautifully Minimalist Habit Tracker.",
    heroSubtitle: "Your productivity tools shouldn't be a source of distraction. Praxim is a beautifully crafted, aesthetic workspace for deep work and discipline.",
    benefits: [
      {
        title: "Aesthetic by Design",
        description: "Dark mode native, beautiful typography, and smooth micro-animations. A workspace you'll actually want to open every morning."
      },
      {
        title: "Zero Gamification",
        description: "You're building discipline, not playing a video game. We removed streaks and badges in favor of pure, intrinsic motivation."
      },
      {
        title: "Frictionless Capture",
        description: "Click a button, check off a habit. Write a quick reflection and get out. Praxim is designed for maximum speed and minimal friction."
      }
    ],
    suggestedHabits: [
      "Read 10 pages",
      "Morning meditation",
      "No screens after 10 PM"
    ]
  },
  {
    slug: "student-routine-planner",
    title: "Daily Routine Planner for Students | Praxim",
    description: "The ultimate daily routine planner and habit tracker for students. Manage study sessions, track wellness, and maintain academic consistency.",
    h1: "The Ultimate Routine Planner for Students.",
    heroSubtitle: "Balance classes, study sessions, and your personal life. Praxim helps students build consistent routines that lead to academic success without burnout.",
    benefits: [
      {
        title: "Separate Study & Life",
        description: "Use custom habits to track both your academic commitments and your personal wellness in one unified dashboard."
      },
      {
        title: "Track Weekly Assignments",
        description: "Not everything needs to be done daily. Use the Weekly habit stack to ensure you chip away at long-term projects."
      },
      {
        title: "Reflect on Progress",
        description: "Use the micro-reflection journal to capture lecture notes, ideas, or just vent about exam stress in a safe space."
      }
    ],
    suggestedHabits: [
      "2 hours of deep work studying",
      "Review tomorrow's lecture slides",
      "Drink 2 liters of water"
    ]
  },
  {
    slug: "daily-mood-journal",
    title: "Daily Mood Tracker & Reflection Journal | Praxim",
    description: "Track your emotional wellbeing alongside your daily habits. A private, secure daily mood journal for mental health and self-discovery.",
    h1: "Your Private Daily Mood Tracker & Journal.",
    heroSubtitle: "Your habits and your mental health are deeply connected. Praxim lets you log your emotional state alongside your daily accomplishments.",
    benefits: [
      {
        title: "One-Click Mood Logging",
        description: "Select from 5 core emotional states to instantly log how you feel each day, directly from your primary dashboard."
      },
      {
        title: "Micro-Reflection Journal",
        description: "Don't have time for long-form journaling? Capture your thoughts in short, 280-character bursts that timestamp automatically."
      },
      {
        title: "Secure & Private",
        description: "Your thoughts belong to you. Praxim uses secure authentication and database infrastructure to ensure your reflections stay private."
      }
    ],
    suggestedHabits: [
      "Write 3 things I'm grateful for",
      "15 minutes of outdoor sunlight",
      "Log end-of-day mood"
    ]
  }
];

export function getUseCaseBySlug(slug: string): UseCaseData | undefined {
  return useCases.find(uc => uc.slug === slug);
}
