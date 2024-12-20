import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { useAuthStore } from '../store/authStore';
import { Clock, AlertCircle } from 'lucide-react';

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { quizzes, startQuiz, submitAnswer, completeQuiz, getCurrentAttempt } =
    useQuizStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const quiz = quizzes.find((q) => q.id === quizId);
  const attempt = getCurrentAttempt(user?.studentId || '');

  useEffect(() => {
    if (quiz && user && !attempt) {
      startQuiz(quiz.id, user.studentId!);
    }
  }, [quiz, user]);

  useEffect(() => {
    if (attempt && quiz) {
      const endTime = attempt.startTime + quiz.duration * 60 * 1000;
      const interval = setInterval(() => {
        const remaining = Math.max(0, endTime - Date.now());
        setTimeLeft(remaining);

        if (remaining === 0) {
          clearInterval(interval);
          completeQuiz(attempt.id);
          navigate('/dashboard');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [attempt, quiz]);

  if (!quiz || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
        Quiz not found
      </div>
    );
  }

  const handleAnswerSubmit = (answer: number) => {
    submitAnswer(attempt.id, quiz.questions[currentQuestion].id, answer);
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz(attempt.id);
      navigate('/dashboard');
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{quiz.title}</h1>
          <div className="flex items-center text-gray-700">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              {question.text}
            </h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSubmit(index)}
                className="w-full text-left p-4 rounded-lg border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Select an answer to continue
          </span>
          <div className="text-sm text-gray-500">
            {currentQuestion + 1} / {quiz.questions.length}
          </div>
        </div>
      </div>
    </div>
  );
}