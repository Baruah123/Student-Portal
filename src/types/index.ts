export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  studentId?: string;
  experience?: number;
  level?: number;
  badges?: Badge[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  isActive: boolean;
  allowedStudents: string[];
  experiencePoints?: number;
  badge?: Badge;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: { [questionId: string]: number };
  startTime: number;
  completed: boolean;
  score?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}