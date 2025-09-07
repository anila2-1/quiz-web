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
  animationDirection: string;
  result: null;
  completed: boolean;
}

export function BlogClient({ initialBlog }: { initialBlog: Blog }) {
  const { user, refreshUser } = useAuth();

  const post = initialBlog;
  const [quizStates, setQuizStates] = useState<Record<string, QuizState>>({});

  // Initialize quiz states
  useEffect(() => {
    if (post?.quizzes && post.quizzes.length > 0) {
      const initial = post.quizzes.reduce((acc: Record<string, QuizState>, quiz: Quiz) => {
        const isCompleted = user?.completedQuizIds?.some((item: any) => item.quizId === quiz.id) || false;
        acc[quiz.id] = {
          showQuiz: false,
          answers: Array(quiz.questions.length).fill(null),
          currentQuestionIndex: 0,
          animationDirection: '',
          result: null,
          completed: isCompleted,
        };
        return acc;
      }, {});
      setQuizStates(initial);
    }
  }, [post?.quizzes, user]);

  const handleAnswerChange = (quizId: string, index: number, value: string) => {
    setQuizStates(prev => {
      if (!prev) return {};
      const current = prev[quizId];
      if (!current) return prev;
      return {
        ...prev,
        [quizId]: {
          ...current,
          answers: current.answers.map((ans, i) => (i === index ? value : ans)),
        },
      };
    });
  };

  const goToNext = (quizId: string) => {
    setQuizStates((prev: Record<string, QuizState>) => {
      const quiz = post?.quizzes?.find((q: Quiz) => q.id === quizId);
      const current = prev[quizId];
      if (!quiz || !current || current.currentQuestionIndex >= quiz.questions.length - 1) return prev;
      return {
        ...prev,
        [quizId]: {
          ...current,
          animationDirection: 'next',
          currentQuestionIndex: current.currentQuestionIndex + 1,
        },
      };
    });

    setTimeout(() => {
      setQuizStates((prev: Record<string, QuizState>) => {
        const current = prev[quizId];
        if (!current) return prev;
        return {
          ...prev,
          [quizId]: { ...current, animationDirection: '' },
        };
      });
    }, 150);
  };

  const goToPrev = (quizId: string) => {
    setQuizStates((prev: Record<string, QuizState>) => {
      const current = prev[quizId];
      if (!current || current.currentQuestionIndex <= 0) return prev;
      return {
        ...prev,
        [quizId]: {
          ...current,
          animationDirection: 'prev',
          currentQuestionIndex: current.currentQuestionIndex - 1,
        },
      };
    });

    setTimeout(() => {
      setQuizStates((prev: Record<string, QuizState>) => {
        const current = prev[quizId];
        if (!current) return prev;
        return {
          ...prev,
          [quizId]: { ...current, animationDirection: '' },
        };
      });
    }, 150);
  };

  const handleSubmitQuiz = async (quizId: string) => {
    const currentState = quizStates[quizId];
    if (!user || !currentState || !currentState.answers[currentState.currentQuestionIndex] || !post) return;

    try {
      const res = await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          userId: user.id,
          blogId: post.id,
          answers: currentState.answers,
          score: 10,
        }),
      });

      if (res.ok) {
        refreshUser();
        setQuizStates((prev: Record<string, QuizState>) => {
          const current = prev[quizId];
          if (!current) return prev;
          return {
            ...prev,
            [quizId]: { ...current, completed: true },
          };
        });
      }
    } catch (err) {
      console.error('Failed to submit quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
        {post.title}
      </h1>

      {/* Quizzes */}
      {post.quizzes?.map((quiz: Quiz) => {
        const state = quizStates[quiz.id] || {
          showQuiz: false,
          answers: [],
          currentQuestionIndex: 0,
          animationDirection: '',
          result: null,
          completed: false,
        };

        return (
          <div key={quiz.id} className="mb-8 p-8 bg-white border border-indigo-200 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-800">🎯 {quiz.title}</h2>
              {state.completed ? (
                <span className="px-5 py-3 bg-green-500 text-white rounded-full">✅ Completed</span>
              ) : (
                <button
                  onClick={() =>
                    setQuizStates((prev: Record<string, QuizState>) => {
                      const current = prev[quiz.id];
                      if (!current) return prev;
                      return {
                        ...prev,
                        [quiz.id]: { ...current, showQuiz: !current.showQuiz },
                      };
                    })
                  }
                  className="px-7 py-3 bg-indigo-600 text-white rounded-xl"
                >
                  {state.showQuiz ? 'Hide' : 'Start'} Quiz
                </button>
              )}
            </div>

            {state.showQuiz && !state.completed && (
              <div className="mt-6">
                {/* Progress */}
                <div className="flex justify-center mb-8">
                  {quiz.questions.map((_: Question, idx: number) => (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full mx-1 ${
                        idx < state.answers.filter((a: string | null) => a !== null).length
                          ? 'bg-green-500'
                          : idx === state.currentQuestionIndex
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Question */}
                <div className="bg-white p-8 rounded-2xl shadow">
                  <h3 className="text-2xl font-bold mb-6">
                    {state.currentQuestionIndex + 1}. {quiz.questions[state.currentQuestionIndex].questionText}
                  </h3>
                  <div className="space-y-4">
                    {quiz.questions[state.currentQuestionIndex].options.map((opt: { label: string; value: string }, optIndex: number) => {
                      const safeValue = String(opt.value ?? `opt-${optIndex}`);
                      const isSelected = state.answers[state.currentQuestionIndex] === safeValue;

                      return (
                        <label
                          key={optIndex}
                          className={`flex items-center p-5 rounded-xl border cursor-pointer ${
                            isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                          }`}
                        >
                          <input
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
                          <span className="text-lg">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Nav Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => goToPrev(quiz.id)}
                    disabled={state.currentQuestionIndex === 0}
                    className="px-6 py-3 bg-gray-200"
                  >
                    ← Previous
                  </button>
                  {state.currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                      onClick={() => goToNext(quiz.id)}
                      disabled={!state.answers[state.currentQuestionIndex]}
                      className="px-6 py-3 bg-blue-600 text-white"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmitQuiz(quiz.id)}
                      className="px-6 py-3 bg-green-600 text-white"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none mb-12 bg-white p-8 rounded-3xl shadow">
        {post.image && (
          <img
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.image.url}`}
            alt={post.title}
            className="w-full h-72 object-cover rounded-2xl mb-8"
          />
        )}
        <RichText content={post.content} />
      </article>

      <div className="text-center">
        <Link href="/dashboard" className="inline-block px-7 py-4 bg-gray-600 text-white rounded-xl">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}