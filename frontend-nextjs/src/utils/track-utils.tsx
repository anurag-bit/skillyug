import { TrackType, TRACK_DETAILS } from '@/constants/quiz';
import { Globe, Cpu, Bot, Code } from 'lucide-react';

export const getTrackIcon = (track: TrackType) => {
  switch (track) {
    case 'webdev': return <Globe className="w-5 h-5" />;
    case 'javadsa': return <Cpu className="w-5 h-5" />;
    case 'python': return <Bot className="w-5 h-5" />;
    default: return <Code className="w-5 h-5" />;
  }
};

export const getTrackDetails = (track: TrackType) => {
  return TRACK_DETAILS[track] || TRACK_DETAILS.webdev;
};

export const getTrackGradient = (track: TrackType) => {
  const details = getTrackDetails(track);
  return {
    bg: details.gradient,
    text: details.textColor,
    border: details.borderColor
  };
};

export const getAffirmationGradient = (track: TrackType) => {
  const details = getTrackDetails(track);
  return details.affirmationGradient;
};