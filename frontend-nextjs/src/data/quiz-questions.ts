import { Question } from '@/types/quiz';
import { TRACK_TYPES } from '@/constants/quiz';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which of these sounds fun to you right now?",
    options: [
      { text: "Making websites or apps that people can actually use!", track: TRACK_TYPES.WEBDEV, emoji: "🌐" },
      { text: "Solving tricky programming puzzles and challenges", track: TRACK_TYPES.JAVADSA, emoji: "🧩" },
      { text: "Playing with data, AI, or making smart programs", track: TRACK_TYPES.PYTHON, emoji: "🤖" }
    ]
  },
  {
    id: 2,
    question: "Imagine your dream job. Which one makes you go \"Wow!\"?",
    options: [
      { text: "Creating cool websites or apps that everyone talks about", track: TRACK_TYPES.WEBDEV, emoji: "🚀" },
      { text: "Working in big tech companies like Google, Amazon, Microsoft, Meta, Apple", track: TRACK_TYPES.JAVADSA, emoji: "🏢" },
      { text: "Analyzing data or building AI/ML programs", track: TRACK_TYPES.PYTHON, emoji: "🧠" }
    ]
  },
  {
    id: 3,
    question: "Which projects would make you excited to wake up and code?",
    options: [
      { text: "Personal websites, online stores, or portfolio pages", track: TRACK_TYPES.WEBDEV, emoji: "💻" },
      { text: "Algorithm problems, student record systems, or backend projects", track: TRACK_TYPES.JAVADSA, emoji: "⚙️" },
      { text: "Data analysis, automation scripts, or small AI models", track: TRACK_TYPES.PYTHON, emoji: "📊" }
    ]
  },
  {
    id: 4,
    question: "If you could pick a skill to master first, which one?",
    options: [
      { text: "HTML, CSS, JavaScript, React, Node.js", track: TRACK_TYPES.WEBDEV, emoji: "🎨" },
      { text: "Problem-solving, algorithms, data structures", track: TRACK_TYPES.JAVADSA, emoji: "🔍" },
      { text: "Python, Pandas, NumPy, or machine learning basics", track: TRACK_TYPES.PYTHON, emoji: "🐍" }
    ]
  },
  {
    id: 5,
    question: "What makes you happy while learning tech?",
    options: [
      { text: "Seeing a website/app come alive on the screen", track: TRACK_TYPES.WEBDEV, emoji: "✨" },
      { text: "Cracking a tough coding challenge", track: TRACK_TYPES.JAVADSA, emoji: "💡" },
      { text: "Turning messy data into something meaningful", track: TRACK_TYPES.PYTHON, emoji: "🔄" }
    ]
  },
  {
    id: 6,
    question: "How do you like to learn best?",
    options: [
      { text: "Hands-on, building things you can show off", track: TRACK_TYPES.WEBDEV, emoji: "🛠️" },
      { text: "Step-by-step challenges and practice problems", track: TRACK_TYPES.JAVADSA, emoji: "📝" },
      { text: "Experimenting with data or small projects", track: TRACK_TYPES.PYTHON, emoji: "🧪" }
    ]
  },
  {
    id: 7,
    question: "What's your ultimate dream for the future?",
    options: [
      { text: "Build your own apps, startups, or online projects", track: TRACK_TYPES.WEBDEV, emoji: "🌟" },
      { text: "Work in a big tech company", track: TRACK_TYPES.JAVADSA, emoji: "🏆" },
      { text: "Become an AI, ML, or data expert", track: TRACK_TYPES.PYTHON, emoji: "🎯" }
    ]
  }
];