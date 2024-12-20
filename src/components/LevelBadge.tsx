import React from 'react';
import { Trophy } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  experience: number;
  progress: number;
}

export default function LevelBadge({ level, experience, progress }: LevelBadgeProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary-500 rounded-full animate-pulse opacity-20"></div>
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
        <div className="text-center">
          <Trophy className="h-8 w-8 mx-auto text-white mb-1" />
          <span className="block text-xl font-bold text-white">Lvl {level}</span>
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 rounded-full bg-warning-500 border-2 border-white shadow">
        <span className="text-xs font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}