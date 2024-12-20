import { create } from 'zustand';
import { Quiz, QuizAttempt, Badge } from '../types';
import { nanoid } from 'nanoid';
import { useAuthStore } from './authStore';

const initialQuizzes: Quiz[] = [
  {
    id: nanoid(),
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental DSA concepts and problem-solving techniques',
    duration: 45,
    experiencePoints: 200,
    badge: {
      id: 'dsa-master',
      name: 'Algorithm Master',
      description: 'Mastered DSA fundamentals',
      icon: '🎯',
      color: '#FF6B6B'
    },
    questions: [
      {
        id: nanoid(),
        text: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1,
      },
      {
        id: nanoid(),
        text: 'Which data structure follows LIFO principle?',
        options: ['Queue', 'Stack', 'LinkedList', 'Array'],
        correctAnswer: 1,
      },
    ],
    isActive: true,
    allowedStudents: ['STU001'],
  },
  {
    id: nanoid(),
    title: 'Web Design Fundamentals',
    description: 'Learn modern web design principles and UI/UX best practices',
    duration: 30,
    experiencePoints: 150,
    badge: {
      id: 'web-design',
      name: 'Design Guru',
      description: 'Mastered web design principles',
      icon: '🎨',
      color: '#4ECDC4'
    },
    questions: [
      {
        id: nanoid(),
        text: 'Which color model is used for web design?',
        options: ['CMYK', 'RGB', 'HSL', 'All of the above'],
        correctAnswer: 1,
      },
      {
        id: nanoid(),
        text: 'What is the recommended maximum width for readable text content?',
        options: ['40-60 characters', '60-75 characters', '75-90 characters', '90-100 characters'],
        correctAnswer: 1,
      },
    ],
    isActive: true,
    allowedStudents: ['STU001'],
  },
  {
    id: nanoid(),
    title: 'React Advanced Patterns',
    description: 'Master advanced React patterns and performance optimization',
    duration: 40,
    experiencePoints: 180,
    badge: {
      id: 'react-pro',
      name: 'React Pro',
      description: 'Mastered advanced React concepts',
      icon: '⚛️',
      color: '#45B7D1'
    },
    questions: [
      {
        id: nanoid(),
        text: 'Which hook is used for memoization in React?',
        options: ['useEffect', 'useMemo', 'useCallback', 'useState'],
        correctAnswer: 1,
      },
      {
        id: nanoid(),
        text: 'What pattern is used to share logic between components?',
        options: ['HOC', 'Custom Hooks', 'Render Props', 'All of the above'],
        correctAnswer: 3,
      },
    ],
    isActive: true,
    allowedStudents: ['STU001'],
  },
];

interface QuizState {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  deleteQuiz: (id: string) => void;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void;
  startQuiz: (quizId: string, studentId: string) => QuizAttempt;
  submitAnswer: (attemptId: string, questionId: string, answer: number) => void;
  completeQuiz: (attemptId: string) => void;
  getCurrentAttempt: (studentId: string) => QuizAttempt | undefined;
  getStudentProgress: (studentId: string) => number;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quizzes: initialQuizzes,
  attempts: [],
  addQuiz: (quiz) =>
    set((state) => ({
      quizzes: [...state.quizzes, { ...quiz, id: nanoid() }],
    })),
  deleteQuiz: (id) =>
    set((state) => ({
      quizzes: state.quizzes.filter((quiz) => quiz.id !== id),
    })),
  updateQuiz: (id, updatedQuiz) =>
    set((state) => ({
      quizzes: state.quizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, ...updatedQuiz } : quiz
      ),
    })),
  startQuiz: (quizId, studentId) => {
    const attempt: QuizAttempt = {
      id: nanoid(),
      quizId,
      studentId,
      answers: {},
      startTime: Date.now(),
      completed: false,
    };
    set((state) => ({
      attempts: [...state.attempts, attempt],
    }));
    return attempt;
  },
  submitAnswer: (attemptId, questionId, answer) =>
    set((state) => ({
      attempts: state.attempts.map((attempt) =>
        attempt.id === attemptId
          ? {
              ...attempt,
              answers: { ...attempt.answers, [questionId]: answer },
            }
          : attempt
      ),
    })),
  completeQuiz: (attemptId) => {
    const state = get();
    const attempt = state.attempts.find((a) => a.id === attemptId);
    const quiz = state.quizzes.find((q) => q.id === attempt?.quizId);

    if (attempt && quiz) {
      const totalQuestions = quiz.questions.length;
      const correctAnswers = quiz.questions.reduce((acc, question) => {
        return attempt.answers[question.id] === question.correctAnswer
          ? acc + 1
          : acc;
      }, 0);
      const score = (correctAnswers / totalQuestions) * 100;
      
      // Award experience points and badge if score is good
      if (score >= 70) {
        const addExperience = useAuthStore.getState().addExperience;
        const addBadge = useAuthStore.getState().addBadge;
        
        if (quiz.experiencePoints) {
          addExperience(quiz.experiencePoints);
        }
        
        if (quiz.badge) {
          addBadge(quiz.badge);
        }
      }

      set((state) => ({
        attempts: state.attempts.map((a) =>
          a.id === attemptId
            ? { ...a, completed: true, score: Math.round(score) }
            : a
        ),
      }));
    }
  },
  getCurrentAttempt: (studentId) => {
    const state = get();
    return state.attempts.find(
      (attempt) => attempt.studentId === studentId && !attempt.completed
    );
  },
  getStudentProgress: (studentId) => {
    const state = get();
    const completedQuizzes = state.attempts.filter(
      (attempt) => attempt.studentId === studentId && attempt.completed
    ).length;
    const totalAvailableQuizzes = state.quizzes.filter(
      (quiz) => quiz.isActive && quiz.allowedStudents.includes(studentId)
    ).length;
    return totalAvailableQuizzes > 0
      ? (completedQuizzes / totalAvailableQuizzes) * 100
      : 0;
  },
}));