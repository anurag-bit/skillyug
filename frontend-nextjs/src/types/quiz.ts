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

export interface Course {
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
}

export interface TrackData {
  name: string;
  description: string;
  emoji: string;
  color: string;
  total_duration: string;
  career_paths: string[];
  courses: string[];
}

export interface AlternativeTrack {
  track: string;
  data: TrackData;
  courses: Course[];
}

export interface CourseRecommendation extends Course {
  trackData?: TrackData;
  allCourses?: Course[];
  confidence?: number;
  scores?: { webdev: number; javadsa: number; python: number };
  alternativeTracks?: AlternativeTrack[];
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