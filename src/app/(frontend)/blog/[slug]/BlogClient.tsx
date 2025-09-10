'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../_providers/Auth';
import Link from 'next/link';
import { RichText } from '../../../../components/RichText';

interface Question {
  id: string;
  questionText: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface Blog {
  id: string;
  title: string;
  content: any[];
  image?: { url: string };
  quizzes?: Quiz[];
}

interface QuizState {
  showQuiz: boolean;
  answers: (string | null)[];
  currentQuestionIndex: number;
  animationDirection: 'next' | 'prev' | '';
  result: { score: number; total: number; pointsEarned: number } | null;
  completed: boolean;
}

export function BlogClient({ initialBlog }: { initialBlog?: Blog }) {
  const { user, refreshUser } = useAuth();
  const [post] = useState<Blog | null>(initialBlog || null);
  const [quizStates, setQuizStates] = useState<Record<string, QuizState>>({});

  // Initialize quiz states
  useEffect(() => {
    if (post?.quizzes?.length) {
      const initial = post.quizzes.reduce((acc, quiz) => {
        const isCompleted = user?.completedQuizIds?.some((item) => item.quizId === quiz.id) || false;
        acc[quiz.id] = {
          showQuiz: false,
          answers: Array(quiz.questions.length).fill(null),
          currentQuestionIndex: 0,
          animationDirection: '',
          result: null,
          completed: isCompleted,
        };
        return acc;
      }, {} as Record<string, QuizState>);
      setQuizStates(initial);
    }
  }, [post?.quizzes, user]);

  const handleAnswerChange = (quizId: string, index: number, value: string) => {
    setQuizStates((prev) => ({
      ...prev!,
      [quizId]: {
        ...prev![quizId],
        answers: prev![quizId].answers.map((ans, i) => (i === index ? value : ans)),
      },
    }));
  };

  const goToNext = (quizId: string) => {
    setQuizStates((prev) => {
      const quiz = post?.quizzes?.find((q) => q.id === quizId);
      if (!quiz || !prev![quizId]) return prev!;
      const { currentQuestionIndex } = prev![quizId];
      if (currentQuestionIndex >= quiz.questions.length - 1) return prev!;

      return {
        ...prev!,
        [quizId]: {
          ...prev![quizId],
          animationDirection: 'next',
          currentQuestionIndex: currentQuestionIndex + 1,
        },
      };
    });

    setTimeout(() => {
      setQuizStates((prev) => ({
        ...prev!,
        [quizId]: { ...prev![quizId], animationDirection: '' },
      }));
    }, 150);
  };

  const goToPrev = (quizId: string) => {
    setQuizStates((prev) => {
      const { currentQuestionIndex } = prev![quizId] || {};
      if (currentQuestionIndex! <= 0) return prev!;

      return {
        ...prev!,
        [quizId]: {
          ...prev![quizId],
          animationDirection: 'prev',
          currentQuestionIndex: currentQuestionIndex! - 1,
        },
      };
    });

    setTimeout(() => {
      setQuizStates((prev) => ({
        ...prev!,
        [quizId]: { ...prev![quizId], animationDirection: '' },
      }));
    }, 150);
  };

  const handleSubmitQuiz = async (quizId: string) => {
  // ✅ Check if user is logged in
  if (!user) {
    // Redirect to login page
    window.location.href = '/auth/login';
    return;
  }

  const currentState = quizStates![quizId];
  if (!currentState) return;

  try {
    const res = await fetch('/api/quiz-attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId,
        userId: user.id,
        blogId: post!.id,
        answers: currentState.answers,
        score: 10,
      }),
    });

    if (res.ok) {
      refreshUser();
      setQuizStates((prev) => ({
        ...prev!,
        [quizId]: { ...prev![quizId], completed: true },
      }));
    }
  } catch (err) {
    console.error('Failed to submit quiz');
  }
};
  if (!post) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Blog Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center leading-tight animate-blog-title">
        {post!.title}
      </h1>

      {/* Quizzes */}
      {post!.quizzes?.map((quiz) => {
        const state = quizStates![quiz.id] || {
          showQuiz: false,
          answers: [],
          currentQuestionIndex: 0,
          animationDirection: '',
          result: null,
          completed: false,
        };

        return (
          <div
            key={quiz.id}
            className="mb-8 p-8 bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-3xl shadow-xl"
          >
            {/* Quiz Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">
                <span className="bg-indigo-100 p-2 rounded-full text-indigo-600">🎯</span>
                {quiz.title}
              </h2>
              {state.completed ? (
                <span className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-md flex items-center gap-2">
                  ✅ Completed
                </span>
              ) : (
                <button
                  onClick={() =>
                    setQuizStates((prev) => ({
                      ...prev!,
                      [quiz.id]: { ...prev![quiz.id], showQuiz: !prev![quiz.id]?.showQuiz },
                    }))
                  }
                  className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {state.showQuiz ? 'Hide Quiz' : 'Start Quiz'}
                </button>
              )}
            </div>

            {/* Quiz Flow */}
            {state.showQuiz && !state.completed && (
              <div className="mt-6">
                {/* Progress Dots */}
                <div className="flex justify-center mb-8">
                  <div className="flex space-x-3">
                    {quiz.questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          idx < state.answers.filter((a) => a !== null).length
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 scale-110 shadow-md'
                            : idx === state.currentQuestionIndex
                            ? 'bg-blue-500 scale-105 ring-2 ring-blue-300'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question Card */}
                <div
                  className={`relative overflow-hidden rounded-2xl bg-white shadow-2xl min-h-80 transition-all duration-300 ${
                    state.animationDirection === 'next'
                      ? 'animate-slide-left'
                      : state.animationDirection === 'prev'
                      ? 'animate-slide-right'
                      : ''
                  }`}
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
                      {state.currentQuestionIndex + 1}. {quiz.questions[state.currentQuestionIndex].questionText}
                    </h3>
                    <div className="space-y-4">
                      {quiz.questions[state.currentQuestionIndex].options.map((opt, optIndex) => {
                        const safeValue = opt?.value !== undefined ? String(opt.value) : `opt-${optIndex}`;
                        const isSelected = state.answers[state.currentQuestionIndex] === safeValue;

                        return (
                          <label
                            key={optIndex}
                            htmlFor={`q${state.currentQuestionIndex}-opt${optIndex}`}
                            className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25'
                            }`}
                          >
                            <input
                              id={`q${state.currentQuestionIndex}-opt${optIndex}`}
                              type="radio"
                              name={`q${state.currentQuestionIndex}`}
                              value={safeValue}
                              checked={isSelected}
                              onChange={() => handleAnswerChange(quiz.id, state.currentQuestionIndex, safeValue)}
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                                isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'
                              }`}
                            >
                              {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}
                            </div>
                            <span className="text-lg font-medium text-gray-800">
                              {opt.label || `Option ${optIndex + 1}`}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => goToPrev(quiz.id)}
                    disabled={state.currentQuestionIndex === 0}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    ← Previous
                  </button>
                  {state.currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                      onClick={() => goToNext(quiz.id)}
                      disabled={!state.answers[state.currentQuestionIndex]}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmitQuiz(quiz.id)}
                      disabled={!state.answers[state.currentQuestionIndex]}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quiz Result */}
            {state.completed && (
              <div className="mt-8 p-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-3xl shadow-lg text-center animate-fade-in">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <svg className="w-12 h-12 text-green-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-3xl font-bold text-green-700">Quiz Completed!</h3>
                </div>
                <p className="text-xl text-gray-800 mb-2">
                  <strong>Congratulations!</strong>
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  +10 points added to wallet!
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Blog Content */}
      <article
        className="relative prose prose-lg max-w-none mb-12 animate-blog-content
                   bg-white/60 backdrop-blur-xl border border-gray-200 
                   rounded-3xl shadow-lg p-8 leading-relaxed text-gray-800
                   transition-all duration-500 hover:shadow-2xl"
      >
        {post!.image && (
          <img
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post!.image.url}`}
            alt={post!.title}
            className="w-full h-72 object-cover rounded-2xl shadow-xl mb-8 transform hover:scale-[1.02] transition duration-700 animate-blog-image"
          />
        )}
        <RichText content={post!.content} />
      </article>

      {/* ✅ Back to Dashboard — PROFESSIONAL UPGRADE */}
<div className="mt-10 pt-6 border-t border-gray-100">
  <Link
    href="/dashboard"
    className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-white border border-gray-200 
               hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-gray-700 font-medium text-sm sm:text-base
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  >
    {/* Animated Arrow */}
    <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 group-hover:bg-indigo-50 transition-all duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300 group-hover:-translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </span>

    <span className="font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
      Back to Dashboard
    </span>
</Link>
</div>

{/* Optional: Add Shine Animation */}
<style>{`
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-shine {
    animation: shine 1.8s ease-in-out infinite;
  }
`}</style>
    </div>
  );
}