import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';
import { Clock, CheckCircle, Award, AlertCircle, BookOpen, Star } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import LevelBadge from '../components/LevelBadge';
import ExperienceBar from '../components/ExperienceBar';
import Badge from '../components/Badge';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { quizzes, attempts, getStudentProgress } = useQuizStore();

  const progress = user?.studentId ? getStudentProgress(user.studentId) : 0;
  const experienceToNextLevel = user?.level ? Math.pow(user.level + 1, 2) * 100 : 100;
  const currentLevelProgress = user?.experience ? (user.experience % experienceToNextLevel) / experienceToNextLevel * 100 : 0;

  const availableQuizzes = quizzes.filter(
    (quiz) =>
      quiz.isActive &&
      quiz.allowedStudents.includes(user?.studentId || '') &&
      !attempts.some(
        (attempt) =>
          attempt.quizId === quiz.id &&
          attempt.studentId === user?.studentId &&
          attempt.completed
      )
  );

  const pendingQuizzes = quizzes.filter(
    (quiz) =>
      quiz.isActive &&
      !quiz.allowedStudents.includes(user?.studentId || '') &&
      !attempts.some(
        (attempt) =>
          attempt.quizId === quiz.id &&
          attempt.studentId === user?.studentId &&
          attempt.completed
      )
  );

  const completedAttempts = attempts.filter(
    (attempt) => attempt.studentId === user?.studentId && attempt.completed
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <LevelBadge
              level={user?.level || 1}
              experience={user?.experience || 0}
              progress={currentLevelProgress}
            />
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="mt-1 text-primary-100">Student ID: {user?.studentId}</p>
            </div>
          </div>
          <div className="text-center">
            <ProgressRing
              progress={progress}
              size={100}
              strokeWidth={8}
              className="text-white"
            />
            <p className="mt-2 font-medium">Overall Progress</p>
          </div>
        </div>

        <div className="mt-8">
          <ExperienceBar
            currentXP={user?.experience || 0}
            nextLevelXP={experienceToNextLevel}
            progress={currentLevelProgress}
          />
        </div>
      </div>

      {/* Badges Section */}
      {user?.badges && user.badges.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Achievements</h2>
          <div className="flex flex-wrap gap-4">
            {user.badges.map((badge) => (
              <Badge key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Available Quizzes */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Available Quizzes</h2>
          <p className="mt-2 text-gray-500">
            Take these quizzes to earn experience points and unlock new badges!
          </p>
        </div>
        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="quiz-card bg-white rounded-xl border p-6 hover:border-primary-500"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {quiz.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{quiz.description}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                  <BookOpen className="h-5 w-5 text-primary-500" />
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {quiz.duration}m
                </div>
                <div className="flex items-center text-primary-600">
                  <Star className="h-4 w-4 mr-1" />
                  {quiz.experiencePoints} XP
                </div>
              </div>

              {quiz.badge && (
                <div className="mt-4 flex items-center text-sm text-purple-600 bg-purple-50 rounded-full px-3 py-1">
                  <Award className="h-4 w-4 mr-1" />
                  Earn "{quiz.badge.name}"
                </div>
              )}

              <button
                onClick={() => navigate(`/quiz/${quiz.id}`)}
                className="mt-4 w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Start Quiz
              </button>
            </div>
          ))}
          {availableQuizzes.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No quizzes available at the moment.
            </div>
          )}
        </div>
      </div>

      {/* Completed Quizzes */}
      {completedAttempts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Completed Quizzes</h2>
          </div>
          <div className="divide-y">
            {completedAttempts.map((attempt) => {
              const quiz = quizzes.find((q) => q.id === attempt.quizId);
              return (
                <div key={attempt.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {quiz?.title}
                      </h3>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center text-success-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Score: {attempt.score}%
                        </div>
                        {quiz?.experiencePoints && attempt.score && attempt.score >= 70 && (
                          <div className="flex items-center text-primary-600">
                            <Star className="h-4 w-4 mr-1" />
                            Earned {quiz.experiencePoints} XP
                          </div>
                        )}
                      </div>
                    </div>
                    <ProgressRing
                      progress={attempt.score || 0}
                      size={60}
                      strokeWidth={4}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Quizzes */}
      {pendingQuizzes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Pending Access</h2>
          </div>
          <div className="divide-y">
            {pendingQuizzes.map((quiz) => (
              <div key={quiz.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {quiz.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {quiz.description}
                    </p>
                  </div>
                  <div className="flex items-center text-warning-500">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Awaiting Permission
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}