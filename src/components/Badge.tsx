import React from 'react';
import type { Badge as BadgeType } from '../types';

interface BadgeProps {
  badge: BadgeType;
}

export default function Badge({ badge }: BadgeProps) {
  return (
    <div
      className="badge-glow flex items-center space-x-2 bg-white border-2 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
      style={{ borderColor: badge.color }}
    >
      <span className="text-2xl">{badge.icon}</span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">{badge.name}</span>
        <span className="text-xs text-gray-500">{badge.description}</span>
      </div>
    </div>
  );
}