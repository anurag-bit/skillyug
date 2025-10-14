import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Rocket,
  ArrowRight
} from 'lucide-react';
import { fadeInUp, fadeInDown, buttonHover } from '@/animations/quiz-animations';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen = React.memo(({ onNext }: WelcomeScreenProps) => (
  <motion.div 
    className="flex items-center justify-center min-h-screen"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={fadeInUp}
  >
    <motion.div 
      className="bg-slate-900/20 backdrop-blur-lg rounded-xl p-8 max-w-4xl w-full text-white shadow-2xl border border-slate-700/50 mx-4" 
      style={{background: "radial-gradient(circle, rgba(29, 78, 216, 0.1), rgba(2, 8, 23, 0.1) 70%)"}}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      
      {/* Header */}
      <motion.header 
        className="flex justify-between items-center mb-10"
        variants={fadeInDown}
      >
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="bg-blue-600 p-2 rounded-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="text-white text-2xl w-6 h-6" />
          </motion.div>
          <div>
            <motion.h1 
              className="font-bold text-lg text-slate-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              AI Course Finder
            </motion.h1>
            <motion.p 
              className="text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Neural Engine v8.0 - Ready
            </motion.p>
          </div>
        </motion.div>
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold text-green-400">ONLINE</span>
        </motion.div>
      </motion.header>
      
      {/* Main Content */}
      <motion.main className="text-center" variants={fadeInDown}>
        <motion.h2 
          className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Discover Your Perfect<br/>Learning Journey
        </motion.h2>
        <motion.p 
          className="text-slate-400 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Our advanced AI analyzes your preferences, goals, and learning style to recommend the perfect course tailored just for you.
        </motion.p>
        
        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Target, color: "blue", title: "Precision Matching", desc: "97% accuracy in course recommendations" },
            { icon: TrendingUp, color: "purple", title: "Learning Paths", desc: "Complete roadmap from beginner to expert" },
            { icon: Zap, color: "green", title: "Instant Results", desc: "Get recommendations in under 30 seconds" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="bg-slate-800/50 p-6 rounded-lg text-center border border-slate-700/50 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index + 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className={`inline-block bg-${item.color}-500/20 p-3 rounded-full mb-4 border border-${item.color}-500/50`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className={`text-${item.color}-400 w-8 h-8 ${item.title === "Learning Paths" ? "transform -rotate-45" : ""}`} />
              </motion.div>
              <motion.h3 
                className="font-semibold text-lg text-slate-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.6 }}
              >
                {item.title}
              </motion.h3>
              <motion.p 
                className="text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.7 }}
              >
                {item.desc}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Start Button */}
        <motion.button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg shadow-blue-500/30 cursor-pointer"
          variants={buttonHover}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Start AI Analysis
        </motion.button>
        <motion.p 
          className="text-sm text-slate-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          7 smart questions - Personalized results
        </motion.p>
      </motion.main>
    </motion.div>
  </motion.div>
));

WelcomeScreen.displayName = 'WelcomeScreen';

export default WelcomeScreen;