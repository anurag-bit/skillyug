import { TrackType } from '@/constants/quiz';

export interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    track: TrackType;
    emoji: string;
  }[];
}

export interface CourseRecommendation {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  track: TrackType;
  price: number;
  duration: string;
  rating: number;
  students_count: number;
  instructor: string;
  tags: string[];
  features: string[];
  topics: string[];
  projects: string[];
  career_outcomes: string[];
  next_courses: string[];
  emoji: string;
  trackData?: any;
  allCourses?: any[];
  confidence?: number;
  scores?: { webdev: number; javadsa: number; python: number };
  alternativeTracks?: any[];
}

export interface UIState {
  showAffirmation: boolean;
  isAnimating: boolean;
  isInitialLoading: boolean;
  isTransitioning: boolean;
  isCalculatingResult: boolean;
  showFullTrack: boolean;
  transitionType: 'processing' | 'calculating' | 'generating';
  isProcessingChoice: boolean;
}

export type QuizStep = number; // 0 = welcome, 1-7 = questions, 8 = result
export type AnswerRecord = Record<number, number>;