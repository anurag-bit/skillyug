'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Trophy, 
  Clock, 
  Users, 
  TrendingUp, 
  Target, 
  Rocket, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  GitBranch, 
  ArrowLeft,
  Zap,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

// Optimized imports
import { QUIZ_CONFIG, TRACK_TYPES } from '@/constants/quiz';
import { CourseRecommendation, UIState, QuizStep, AnswerRecord } from '@/types/quiz';
import { QUIZ_QUESTIONS } from '@/data/quiz-questions';
import { calculateRecommendation, getRandomAffirmation } from '@/utils/quiz-calculator';
import { getTrackIcon, getTrackGradient, getAffirmationGradient } from '@/utils/track-utils';
import { 
  fadeInUp, 
  fadeInDown, 
  buttonHover
} from '@/animations/quiz-animations';

// Lazy loading for heavy components
import { WelcomeScreenSkeleton, QuestionScreenSkeleton, ResultScreenSkeleton } from '@/components/ui/quiz-skeletons';
import { TransitionLoader } from '@/components/ui/loading-animations';
import { ResultCalculationLoader } from '@/components/ui/result-calculation-loader';

const CourseRecommendationQuiz = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>(QUIZ_CONFIG.WELCOME_STEP);
  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [recommendation, setRecommendation] = useState<CourseRecommendation | null>(null);
  const [uiState, setUiState] = useState<UIState>({
    showAffirmation: false,
    isAnimating: false,
    isInitialLoading: true,
    isTransitioning: false,
    isCalculatingResult: false,
    showFullTrack: false,
    transitionType: 'processing' as 'processing' | 'calculating' | 'generating',
    isProcessingChoice: false // New flag to prevent UI conflicts
  });

  // Optimized animation variants
  const containerVariants = useMemo(() => fadeInUp, []);
  const itemVariants = useMemo(() => fadeInDown, []);
  const buttonVariants = useMemo(() => buttonHover, []);

  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setUiState(prev => ({ ...prev, isInitialLoading: false }));
    }, QUIZ_CONFIG.INITIAL_LOADING_DELAY); // Show skeleton for 1.5 seconds to ensure smooth loading experience

    return () => clearTimeout(timer);
  }, []);

  // Handle result calculation completion
  const handleResultCalculationComplete = useCallback(() => {
    setUiState(prev => ({ 
      ...prev, 
      isCalculatingResult: false,
      isAnimating: false 
    }));
    setCurrentStep(QUIZ_CONFIG.RESULT_STEP);
  }, []);

  // Use imported data for better performance and maintainability
  const questions = useMemo(() => QUIZ_QUESTIONS, []);

  const handleAnswer = (questionId: number, optionIndex: number) => {
    // Prevent multiple clicks and UI conflicts
    if (uiState.isProcessingChoice || uiState.isTransitioning) return;
    
    // Set processing state immediately to lock UI
    setUiState(prev => ({ 
      ...prev, 
      isProcessingChoice: true,
      transitionType: 'processing'
    }));
    
    // Update answer in next tick to avoid render conflicts
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
      
      // Show affirmation after answer is set
      setUiState(prev => ({ 
        ...prev, 
        showAffirmation: true,
        isTransitioning: true
      }));
      
      // Handle transition to next question
      setTimeout(() => {
        setUiState(prev => ({ 
          ...prev, 
          showAffirmation: false,
          isTransitioning: false
        }));
        
        // Proceed to next question after affirmation is hidden
        setTimeout(() => {
          handleNext();
          setUiState(prev => ({ 
            ...prev, 
            isProcessingChoice: false
          }));
        }, 150);
      }, QUIZ_CONFIG.AFFIRMATION_DURATION);
    }, 50);
  };

  const handleNext = useCallback(() => {
    if (currentStep < QUIZ_CONFIG.RESULT_STEP) {
      // For the last question, handle result calculation
      if (currentStep === QUIZ_CONFIG.TOTAL_QUESTIONS) {
        setUiState(prev => ({ 
          ...prev, 
          isCalculatingResult: true,
          isAnimating: false 
        }));
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 300);
      } else {
        // For all other questions, smooth transition
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setUiState(prev => ({ ...prev, isAnimating: false }));
        }, QUIZ_CONFIG.TRANSITION_DELAY);
      }
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > QUIZ_CONFIG.WELCOME_STEP) {
      setUiState(prev => ({ ...prev, isAnimating: true }));
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setUiState(prev => ({ ...prev, isAnimating: false }));
      }, 300);
    }
  }, [currentStep]);

  // Memoized calculation for better performance
  const memoizedCalculateRecommendation = useCallback(() => {
    return calculateRecommendation(answers);
  }, [answers]);

  useEffect(() => {
    if (currentStep === QUIZ_CONFIG.RESULT_STEP && !recommendation && !uiState.isCalculatingResult) {
      setUiState(prev => ({ ...prev, isCalculatingResult: true }));
      // 4.8 second delay for compiling all questions and answers
      setTimeout(() => {
        const result = memoizedCalculateRecommendation();
        setRecommendation(result);
        setUiState(prev => ({ ...prev, isCalculatingResult: false }));
      }, QUIZ_CONFIG.CALCULATION_DURATION);
    }
  }, [currentStep, recommendation, uiState.isCalculatingResult, memoizedCalculateRecommendation]);

  const WelcomeScreen = () => (
    <motion.div 
      className="flex items-center justify-center min-h-screen"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
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
          variants={itemVariants}
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
        <motion.main className="text-center" variants={itemVariants}>
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
            variants={containerVariants}
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
                >?tab=repositories
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
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg shadow-blue-500/30 cursor-pointer"
            variants={buttonVariants}
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
  );

  const QuestionScreen = () => {
    const currentQuestion = questions[currentStep - 1];
    
    return (
      <motion.div 
        className="flex items-center justify-center min-h-[80vh] px-4"
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, scale: 0.95 }}
        variants={containerVariants}
        key={`question-screen-${currentStep}`}
      >
        <motion.div className="max-w-5xl w-full" variants={itemVariants}>
          
          {/* AI Question Analysis Container */}
          <motion.div 
            className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute top-40 right-32 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full"
                animate={{ 
                  y: [-10, 10, -10],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-20 left-40 w-20 h-20 bg-gradient-to-r from-green-400/20 to-teal-500/20 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
            
            {/* Progress Header */}
            <motion.div 
              className="relative z-10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      scale: { duration: 2, repeat: Infinity },
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                    }}
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-bold">AI Analysis Progress</h3>
                    <p className="text-cyan-300 text-sm">Question {currentStep} of 7</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-right"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div 
                    className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    {Math.round((currentStep / 7) * 100)}%
                  </motion.div>
                  <p className="text-gray-400 text-sm">Complete</p>
                </motion.div>
              </div>
              
              {/* Animated Progress Bar */}
              <motion.div 
                className="relative"
                variants={itemVariants}
              >
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 h-full rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 7) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
                  </motion.div>
                </div>
                <div className="flex justify-between mt-2">
                  {[...Array(7)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="relative"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * i + 0.3 }}
                    >
                      <motion.div 
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          i < currentStep 
                            ? 'bg-gradient-to-r from-cyan-400 to-purple-600 shadow-lg shadow-cyan-400/50' 
                            : 'bg-gray-600'
                        }`}
                        animate={i < currentStep ? { scale: [1, 1.25, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      />
                      {i < currentStep && (
                        <motion.div 
                          className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
                          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
            
            {/* Question Content */}
            <motion.div 
              className="relative z-10 p-8"
              variants={itemVariants}
            >
              
              {/* AI Analysis Header */}
              <motion.div 
                className="text-center mb-8"
                variants={itemVariants}
              >
                <motion.div 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-full px-6 py-3 mb-6"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                  <span className="text-cyan-300 font-semibold">Neural Analysis Mode</span>
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentQuestion.question}
                </motion.h2>
                
                <motion.p 
                  className="text-gray-300 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Select the option that resonates most with you 🎯
                </motion.p>
              </motion.div>

              {/* Options */}
              <motion.div 
                className="space-y-4 max-w-4xl mx-auto"
                variants={containerVariants}
              >
                {currentQuestion.options.map((option, index) => {
                  const trackGrad = getTrackGradient(option.track);
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(currentQuestion.id, index)}
                      disabled={uiState.isTransitioning || uiState.showAffirmation || uiState.isProcessingChoice}
                      className="group w-full p-6 text-left bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/70 hover:to-gray-600/70 border border-gray-600/50 hover:border-cyan-500/50 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-800/50 disabled:hover:to-gray-700/50"
                      variants={itemVariants}
                      whileHover={!uiState.isTransitioning && !uiState.showAffirmation && !uiState.isProcessingChoice ? { 
                        scale: 1.02, 
                        boxShadow: "0 10px 30px rgba(6, 182, 212, 0.1)" 
                      } : {}}
                      whileTap={!uiState.isTransitioning && !uiState.showAffirmation && !uiState.isProcessingChoice ? { scale: 0.98 } : {}}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.4 }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Option Number & Icon */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                          <motion.div 
                            className={`w-12 h-12 bg-gradient-to-r ${trackGrad.bg} rounded-xl flex items-center justify-center font-bold text-white text-lg`}
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            {String.fromCharCode(65 + index)}
                          </motion.div>
                          <motion.div 
                            className={`w-10 h-10 bg-gradient-to-r ${trackGrad.bg} rounded-lg flex items-center justify-center`}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {getTrackIcon(option.track)}
                          </motion.div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300 leading-relaxed mb-2">
                            {option.text}
                          </p>
                          
                          {/* Track Indicator */}
                          <motion.div 
                            className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${trackGrad.bg} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300`}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.div 
                              className="w-2 h-2 bg-white rounded-full"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            <span className="text-white text-sm font-medium capitalize">
                              {option.track === 'javadsa' ? 'Java DSA' : option.track === 'webdev' ? 'Web Development' : 'Python'}
                            </span>
                          </motion.div>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex-shrink-0">
                          <motion.div 
                            className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-500 group-hover:from-cyan-500 group-hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300"
                            whileHover={{ rotate: 90 }}
                          >
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-all duration-300" />
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Navigation */}
              <motion.div 
                className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700/50"
                variants={itemVariants}
              >
                <motion.button
                  onClick={handlePrevious}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentStep === 1 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 cursor-pointer'
                  }`}
                  disabled={currentStep === 1}
                  whileHover={currentStep !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentStep !== 1 ? { scale: 0.95 } : {}}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </motion.button>
                
                <motion.div 
                  className="flex items-center gap-2 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </motion.div>
                  <span className="text-sm font-medium">Click any option to continue</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  const ResultScreen = () => {
    if (!recommendation) return null;

    const getTrackDetails = (track: string) => {
      const details = {
        webdev: { 
          emoji: '🌐', 
          label: 'WEB DEVELOPMENT', 
          gradient: 'from-green-400 via-teal-500 to-blue-600',
          textColor: 'text-green-300',
          bgColor: 'from-green-500/10 to-teal-500/10',
          borderColor: 'border-green-400/30'
        },
        javadsa: { 
          emoji: '☕', 
          label: 'JAVA DSA', 
          gradient: 'from-orange-400 via-red-500 to-pink-600',
          textColor: 'text-orange-300',
          bgColor: 'from-orange-500/10 to-red-500/10',
          borderColor: 'border-orange-400/30'
        },
        python: { 
          emoji: '🐍', 
          label: 'PYTHON', 
          gradient: 'from-blue-400 via-purple-500 to-indigo-600',
          textColor: 'text-blue-300',
          bgColor: 'from-blue-500/10 to-purple-500/10',
          borderColor: 'border-blue-400/30'
        }
      };
      return details[track as keyof typeof details] || { 
        emoji: '💻', 
        label: 'PROGRAMMING', 
        gradient: 'from-gray-400 to-gray-600',
        textColor: 'text-gray-300',
        bgColor: 'from-gray-500/10 to-gray-600/10',
        borderColor: 'border-gray-400/30'
      };
    };

    const trackDetails = getTrackDetails(recommendation.track);

    return (
      <motion.div 
        className="flex items-center justify-center min-h-[80vh] px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="max-w-6xl w-full" variants={itemVariants}>
          
          {/* AI Result Container */}
          <motion.div 
            className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            
            {/* Celebration Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full"
                animate={{ 
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-20 left-32 w-28 h-28 bg-gradient-to-r from-green-400/20 to-teal-500/20 rounded-full"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div 
                className="absolute bottom-10 right-10 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full"
                animate={{ 
                  x: [0, 15, 0],
                  y: [0, -15, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </div>
            
            {/* Success Header */}
            <motion.div 
              className="relative z-10 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-gray-700/50 p-8"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="text-center">
                <motion.div 
                  className="relative inline-block mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 200 }}
                >
                  <motion.div 
                    className={`w-24 h-24 bg-gradient-to-r ${trackDetails.gradient} rounded-2xl flex items-center justify-center mx-auto`}
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-4xl">{trackDetails.emoji}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.3, 1]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-900" />
                  </motion.div>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  Perfect Match Found! 🎉
                </motion.h1>
                
                <motion.div 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-full px-6 py-3 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                >
                  <div className="relative">
                    <motion.div 
                      className="w-3 h-3 bg-green-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full"
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-green-300 font-bold text-lg">97% Match Confidence</span>
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </motion.div>
                
                <motion.p 
                  className="text-xl text-gray-300 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  Our AI has analyzed your preferences and found your ideal learning path
                </motion.p>
              </div>
            </motion.div>
            
            {/* Main Recommendation */}
            <motion.div 
              className="relative z-10 p-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              
              {/* Course Recommendation Card */}
              <motion.div 
                className={`bg-gradient-to-r ${trackDetails.bgColor} border ${trackDetails.borderColor} rounded-2xl p-8 mb-8 backdrop-blur-sm cursor-pointer`}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-6">
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${trackDetails.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-3xl">{trackDetails.emoji}</span>
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <motion.h2 
                        className="text-3xl font-bold text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 }}
                      >
                        {recommendation.title}
                      </motion.h2>
                      <motion.span 
                        className={`px-4 py-2 bg-gradient-to-r ${trackDetails.gradient} text-white text-sm font-bold rounded-full`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                        animate-pulse
                      >
                        RECOMMENDED
                      </motion.span>
                    </div>
                    
                    <motion.p 
                      className={`${trackDetails.textColor} text-sm font-medium mb-3 tracking-wider`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                    >
                      {trackDetails.label}
                    </motion.p>
                    
                    <motion.p 
                      className="text-gray-300 text-lg leading-relaxed mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                    >
                      {recommendation.description}
                    </motion.p>
                    
                    {/* Stats Grid */}
                    <motion.div 
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      variants={containerVariants}
                    >
                      {[
                        { icon: Clock, label: 'Duration', value: recommendation.duration, color: 'text-cyan-400' },
                        { icon: TrendingUp, label: 'Level', value: recommendation.level || 'Beginner', color: 'text-green-400' },
                        { icon: Users, label: 'Students', value: `${recommendation.students_count}+`, color: 'text-purple-400' },
                        { icon: Star, label: 'Rating', value: `${recommendation.rating}/5`, color: 'text-yellow-400' }
                      ].map((stat, index) => (
                        <motion.div 
                          key={stat.label}
                          className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700/50"
                          variants={itemVariants}
                          whileHover={{ 
                            scale: 1.05,
                            backgroundColor: "rgba(0,0,0,0.3)"
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: index % 2 === 0 ? [0, 10, 0] : [0, -10, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.2
                            }}
                          >
                            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                          </motion.div>
                          <p className="text-white font-bold">{stat.value}</p>
                          <p className="text-gray-400 text-sm">{stat.label}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Learning Journey */}
              <motion.div 
                className="mb-8"
                variants={itemVariants}
              >
                <motion.div 
                  className="flex items-center gap-3 mb-6"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.8 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <GitBranch className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Your Learning Journey</h3>
                  <motion.div 
                    className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 rgba(6, 182, 212, 0)",
                        "0 0 20px rgba(6, 182, 212, 0.5)",
                        "0 0 0 rgba(6, 182, 212, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-white text-xs font-bold">AI</span>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="grid gap-6 md:grid-cols-3"
                  variants={containerVariants}
                >
                  {['beginner', 'intermediate', 'advanced'].map((level, index) => {
                    const levelContent = {
                      beginner: `Start your ${trackDetails.label.toLowerCase()} journey with fundamentals and core concepts.`,
                      intermediate: `Build practical projects and deepen your understanding of advanced topics.`,
                      advanced: `Master complex concepts and prepare for professional development roles.`
                    };
                    
                    return (
                      <motion.div 
                        key={level} 
                        className="group bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/50 hover:border-cyan-500/50 rounded-xl p-6 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 10px 30px rgba(6, 182, 212, 0.1)"
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div 
                            className={`w-12 h-12 bg-gradient-to-r ${trackDetails.gradient} rounded-lg flex items-center justify-center text-2xl`}
                            whileHover={{ 
                              scale: 1.2,
                              rotate: 360
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            {level === 'beginner' ? '🌱' : level === 'intermediate' ? '🌿' : '🌳'}
                          </motion.div>
                          <div>
                            <h4 className="text-lg font-bold text-white capitalize">
                              {level} Level
                            </h4>
                            <p className="text-gray-400 text-sm">Step {index + 1}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed mb-4">
                          {levelContent[level as keyof typeof levelContent]}
                        </p>
                        
                        {/* Progress Indicator */}
                        <div className="flex items-center gap-1">
                          {[...Array(index + 1)].map((_, i) => (
                            <motion.div 
                              key={i} 
                              className={`w-3 h-3 bg-gradient-to-r ${trackDetails.gradient} rounded-full`}
                              animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                          {[...Array(3 - index - 1)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-gray-600 rounded-full"></div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
              
              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={containerVariants}
              >
                <motion.button 
                  className="group relative bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-500 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-500 shadow-2xl cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 15px 35px rgba(6, 182, 212, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-3">
                    <motion.div
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Rocket className="w-6 h-6" />
                    </motion.div>
                    Start Learning Journey
                  </div>
                </motion.button>
                
                <motion.button 
                  onClick={() => {
                    setCurrentStep(QUIZ_CONFIG.WELCOME_STEP);
                    setAnswers({});
                    setRecommendation(null);
                    setUiState({
                      showAffirmation: false,
                      isAnimating: false,
                      isInitialLoading: false,
                      isTransitioning: false,
                      isCalculatingResult: false,
                      showFullTrack: false,
                      transitionType: 'processing',
                      isProcessingChoice: false
                    });
                  }}
                  className="group border-2 border-gray-600 hover:border-cyan-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 backdrop-blur-sm cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                  Take Quiz Again
                </motion.button>
                
                <Link
                  href="/courses"
                  className="group border-2 border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 backdrop-blur-sm cursor-pointer"
                >
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    View All Courses
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  const AffirmationOverlay = () => {
    if (!uiState.showAffirmation || currentStep === QUIZ_CONFIG.WELCOME_STEP || currentStep > QUIZ_CONFIG.TOTAL_QUESTIONS) return null;
    
    const currentQuestion = questions[currentStep - 1];
    const selectedOption = currentQuestion.options[answers[currentStep]];
    const randomAffirmation = getRandomAffirmation(selectedOption?.track || TRACK_TYPES.WEBDEV);

    return (
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          {/* Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${getAffirmationGradient(selectedOption?.track || TRACK_TYPES.WEBDEV)} rounded-3xl blur-xl opacity-30 animate-pulse scale-110`}></div>
          
          {/* Main Card */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 max-w-lg mx-auto text-center border border-white/20 shadow-2xl">
            {/* Success Icon */}
            <div className="relative mb-6">
              <div className={`w-20 h-20 bg-gradient-to-r ${getAffirmationGradient(selectedOption?.track || TRACK_TYPES.WEBDEV)} rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-bounce`}>
                <span className="text-4xl">{selectedOption?.emoji}</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#EB8216] rounded-full flex items-center justify-center animate-ping">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Affirmation Text */}
            <h3 className="text-3xl font-bold text-white mb-3 leading-tight">
              {randomAffirmation}
            </h3>
            
            {/* Track Indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getAffirmationGradient(selectedOption?.track || TRACK_TYPES.WEBDEV)} animate-pulse`}></div>
              <span className="text-lg font-semibold text-gray-300 capitalize">
                {selectedOption?.track === 'javadsa' ? 'Java DSA' : selectedOption?.track === 'webdev' ? 'Web Development' : 'Python'} Track
              </span>
            </div>
            
            {/* Loading Animation */}
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#EB8216] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#EB8216] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#EB8216] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm font-medium ml-2">Processing next question...</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-slate-950 text-slate-100 flex items-center justify-center min-h-screen">
      
      <div className="flex flex-col min-h-screen relative z-10 w-full">
        {/* Header */}
        <header className="border-b border-white/20 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link 
                href="/"
                className="group inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>cd ../home</span>
              </Link>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                  <span className="font-bold text-lg bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    AI Course Recommender
                  </span>
                </div>
                <div className="font-mono text-xs text-gray-300 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                  Automated AI Course Recommender
                </div>
              </div>

              <div className="font-mono text-xs text-gray-400 px-2 py-1 bg-white/10 rounded border border-white/20">
                v2.0.0
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            {uiState.isInitialLoading ? (
              // Show skeleton loaders during initial load
              <motion.div key="loading" exit={{ opacity: 0 }}>
                {currentStep === QUIZ_CONFIG.WELCOME_STEP && <WelcomeScreenSkeleton />}
                {currentStep >= 1 && currentStep <= QUIZ_CONFIG.TOTAL_QUESTIONS && <QuestionScreenSkeleton />}
                {currentStep === QUIZ_CONFIG.RESULT_STEP && <ResultScreenSkeleton />}
              </motion.div>
            ) : (
              // Show actual content after loading
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {currentStep === QUIZ_CONFIG.WELCOME_STEP && <WelcomeScreen />}
                {currentStep >= 1 && currentStep <= QUIZ_CONFIG.TOTAL_QUESTIONS && <QuestionScreen key={`question-${currentStep}`} />}
                {currentStep === QUIZ_CONFIG.RESULT_STEP && <ResultScreen />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Enhanced Affirmation Overlay */}
      <AnimatePresence>
        {uiState.showAffirmation && <AffirmationOverlay />}
      </AnimatePresence>
      
      {/* Transition Loading Animations */}
      <AnimatePresence>
        {uiState.isTransitioning && <TransitionLoader isVisible={uiState.isTransitioning} type={uiState.transitionType} />}
      </AnimatePresence>
      
      {/* Result Calculation Loader */}
      <AnimatePresence>
        {uiState.isCalculatingResult && (
          <ResultCalculationLoader 
            isVisible={uiState.isCalculatingResult} 
            onComplete={handleResultCalculationComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseRecommendationQuiz;
