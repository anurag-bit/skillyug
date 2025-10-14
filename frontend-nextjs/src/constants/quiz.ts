// Quiz constants and configurations
export const QUIZ_CONFIG = {
  TOTAL_QUESTIONS: 7,
  WELCOME_STEP: 0,
  RESULT_STEP: 8,
  INITIAL_LOADING_DELAY: 1500,
  AFFIRMATION_DURATION: 1200,
  CALCULATION_DURATION: 4800,
  TRANSITION_DELAY: 200,
} as const;

export const TRACK_TYPES = {
  WEBDEV: 'webdev',
  JAVADSA: 'javadsa',
  PYTHON: 'python',
} as const;

export type TrackType = typeof TRACK_TYPES[keyof typeof TRACK_TYPES];

export const TRACK_DETAILS = {
  [TRACK_TYPES.WEBDEV]: {
    emoji: '🌐',
    label: 'WEB DEVELOPMENT',
    gradient: 'from-green-400 via-teal-500 to-blue-600',
    textColor: 'text-green-300',
    bgColor: 'from-green-500/10 to-teal-500/10',
    borderColor: 'border-green-400/30',
    affirmationGradient: 'from-green-500 to-blue-500',
  },
  [TRACK_TYPES.JAVADSA]: {
    emoji: '☕',
    label: 'JAVA DSA',
    gradient: 'from-orange-400 via-red-500 to-pink-600',
    textColor: 'text-orange-300',
    bgColor: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-400/30',
    affirmationGradient: 'from-purple-500 to-pink-500',
  },
  [TRACK_TYPES.PYTHON]: {
    emoji: '🐍',
    label: 'PYTHON',
    gradient: 'from-blue-400 via-purple-500 to-indigo-600',
    textColor: 'text-blue-300',
    bgColor: 'from-blue-500/10 to-purple-500/10',
    borderColor: 'border-blue-400/30',
    affirmationGradient: 'from-yellow-500 to-red-500',
  },
} as const;

export const WEIGHT_CONFIG = {
  PROGRAMMING_INTEREST: 2.5, // Question 1 - highest weight
  PROJECT_TYPE: 2.0,          // Question 5
  CAREER_GOALS: 1.8,          // Question 7
  PROBLEM_SOLVING: 1.5,       // Question 3
  LEARNING_STYLE: 1.3,        // Question 4
  DEFAULT: 1.0,
} as const;

export const AFFIRMATIONS = {
  [TRACK_TYPES.WEBDEV]: [
    "Great choice! 🌟", 
    "You're going to build amazing things! 🚀", 
    "Web dev is so creative! 🎨"
  ],
  [TRACK_TYPES.JAVADSA]: [
    "Smart thinking! 💡", 
    "You'll be a problem-solving master! 🧩", 
    "Big tech, here you come! 🏢"
  ],
  [TRACK_TYPES.PYTHON]: [
    "Excellent pick! 🐍", 
    "Data science is the future! 🚀", 
    "AI magic awaits you! ✨"
  ],
} as const;