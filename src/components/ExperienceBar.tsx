import React from 'react';
import { Sparkles } from 'lucide-react';

interface ExperienceBarProps {
  currentXP: number;
  nextLevelXP: number;
  progress: number;
}

export default function ExperienceBar({ currentXP, nextLevelXP, progress }: ExperienceBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center text-primary-600 font-medium">
          <Sparkles className="h-4 w-4 mr-1" />
          <span>{currentXP} XP</span>
        </div>
        <span className="text-gray-500">{nextLevelXP} XP needed</span>
      </div>
      <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}