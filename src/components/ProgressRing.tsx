import React from "react";
import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // Progress percentage
  size: number; // Diameter of the progress ring
  strokeWidth: number; // Thickness of the progress ring
}

export default function ProgressRing({
  progress,
  size,
  strokeWidth,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow Animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl opacity-40"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* SVG Progress Ring */}
      <svg
        className="relative z-10"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Static Background Circle */}
        <circle
          className="text-gray-300"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated Gradient Circle */}
        <motion.circle
          className="text-gradient"
          stroke="url(#progress-gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </motion.circle>
      </svg>

      {/* Animated Progress Text */}
      <motion.div
        className="absolute z-20 text-center font-extrabold"
        style={{
          fontSize: `${size / 5}px`,
          color: "white",
          textShadow: "0px 0px 12px rgba(0, 0, 0, 0.7)",
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {progress}%
      </motion.div>

      {/* Particle Effect for Level-Up */}
      {progress === 100 && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [1, 0],
            scale: [0.9, 1.3],
            rotate: [0, 360],
          }}
          transition={{ duration: 1.5 }}
        >
          <div className="relative w-full h-full">
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                  initial={{
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 200 - 100}px`,
                    y: `${Math.random() * 200 - 100}px`,
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.1,
                  }}
                ></motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Celebration Text */}
      {progress === 100 && (
        <motion.div
          className="absolute z-30 text-center font-extrabold text-yellow-400"
          style={{
            fontSize: `${size / 6}px`,
            textShadow: "0px 0px 12px rgba(255, 223, 0, 0.7)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: 2 }}
        >
          LEVEL UP!
        </motion.div>
      )}
    </div>
  );
}
