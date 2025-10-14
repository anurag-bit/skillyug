import { AnswerRecord, CourseRecommendation } from '@/types/quiz';
import { WEIGHT_CONFIG, AFFIRMATIONS } from '@/constants/quiz';
import { QUIZ_QUESTIONS } from '@/data/quiz-questions';
import coursesData from '@/data/courses.json';

export const calculateRecommendation = (answers: AnswerRecord): CourseRecommendation => {
  const scores: { webdev: number; javadsa: number; python: number } = { 
    webdev: 0, 
    javadsa: 0, 
    python: 0 
  };
  
  const experienceLevel = answers[1]; // Experience level (0: beginner, 1: some exp, 2: experienced)
  
  // Enhanced scoring with weights
  Object.entries(answers).forEach(([questionId, optionIndex]) => {
    const questionIndex = parseInt(questionId) - 1;
    const question = QUIZ_QUESTIONS[questionIndex];
    const selectedOption = question.options[optionIndex];
    
    // Apply different weights to different questions
    let weight: number = WEIGHT_CONFIG.DEFAULT;
    if (questionIndex === 0) weight = WEIGHT_CONFIG.PROGRAMMING_INTEREST;
    if (questionIndex === 4) weight = WEIGHT_CONFIG.PROJECT_TYPE;
    if (questionIndex === 6) weight = WEIGHT_CONFIG.CAREER_GOALS;
    if (questionIndex === 2) weight = WEIGHT_CONFIG.PROBLEM_SOLVING;
    if (questionIndex === 3) weight = WEIGHT_CONFIG.LEARNING_STYLE;
    
    scores[selectedOption.track] += weight;
  });

  // Find the track with highest score
  const topTrack = (Object.entries(scores) as [keyof typeof scores, number][])
    .reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
  
  // Get course data for the recommended track
  const trackData = coursesData.learning_tracks[topTrack];
  const trackCourses = coursesData.courses.filter(course => course.track === topTrack);
  
  // Determine appropriate starting course based on experience level
  let recommendedCourse;
  if (experienceLevel === 0) { // Complete beginner
    recommendedCourse = trackCourses.find(course => course.level === 'beginner');
  } else if (experienceLevel === 1) { // Some experience
    recommendedCourse = trackCourses.find(course => course.level === 'intermediate') || 
                       trackCourses.find(course => course.level === 'beginner');
  } else { // Experienced
    recommendedCourse = trackCourses.find(course => course.level === 'advanced') || 
                       trackCourses.find(course => course.level === 'intermediate');
  }
  
  // Calculate confidence score based on answer consistency
  const totalAnswers = Object.keys(answers).length;
  const maxScore = Math.max(...Object.values(scores));
  const confidence = Math.min(Math.round((maxScore / (totalAnswers * 2.5)) * 100), 97);
  
  // Ensure we have a valid course
  if (!recommendedCourse) {
    recommendedCourse = trackCourses[0]; // Fallback to first course in track
  }

  // Create enhanced recommendation object
  return {
    ...recommendedCourse,
    trackData,
    allCourses: trackCourses,
    confidence,
    scores,
    alternativeTracks: Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(1)
      .map(([track]) => ({
        track,
        data: coursesData.learning_tracks[track as keyof typeof coursesData.learning_tracks],
        courses: coursesData.courses.filter(course => course.track === track)
      }))
  } as CourseRecommendation;
};

export const getRandomAffirmation = (track: string): string => {
  const trackKey = track as keyof typeof AFFIRMATIONS;
  const affirmations = AFFIRMATIONS[trackKey] || ["Great choice! 🌟"];
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};