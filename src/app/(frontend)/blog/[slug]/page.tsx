'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '../../../../_providers/Auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from './../../components/Footer'
import { RichText } from '../../../../components/RichText';

interface Params {
  slug: string;
}

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
  content: string | any[];
  image?: { url: string };
  quizzes?: Quiz[];
}

export default function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = use(params);
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizStates, setQuizStates] = useState<Record<string, {
    showQuiz: boolean;
    answers: (string | null)[];
    currentQuestionIndex: number;
    animationDirection: 'next' | 'prev' | '';
    result: { score: number; total: number; pointsEarned: number } | null;
    completed: boolean;
  }>>({});

  // ✅ Fetch Post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`
        );
        if (!res.ok) throw new Error('Post not found');
        const json = await res.json();

        if (json.docs?.length > 0) {
          const blog: Blog = json.docs[0];
          setPost(blog);

          if ((blog.quizzes?.length ?? 0) > 0) {
            const initialQuizStates = blog.quizzes!.reduce((acc, quiz) => {
              const isCompleted = user?.completedQuizIds?.some(item => item.quizId === quiz.id) || false;
              acc[quiz.id] = {
                showQuiz: false,
                answers: Array(quiz.questions.length).fill(null),
                currentQuestionIndex: 0,
                animationDirection: '',
                result: null,
                completed: isCompleted,
              };
              return acc;
            }, {} as Record<string, any>);
            setQuizStates(initialQuizStates);
          }
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, user]);

  // ✅ Answer Change
  const handleAnswerChange = (quizId: string, index: number, value: string) => {
    setQuizStates(prev => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        answers: prev[quizId].answers.map((ans, i) => (i === index ? value : ans)),
      },
    }));
  };

  // ✅ Next Question
  const goToNext = (quizId: string) => {
    setQuizStates(prev => {
      const quiz = post?.quizzes?.find(q => q.id === quizId);
      if (!quiz) return prev;
      const current = prev[quizId];
      if (current.currentQuestionIndex >= quiz.questions.length - 1) return prev;

      return {
        ...prev,
        [quizId]: {
          ...current,
          animationDirection: 'next',
          currentQuestionIndex: current.currentQuestionIndex + 1,
        },
      };
    });

    // Reset animation
    setTimeout(() => {
      setQuizStates(prev => ({
        ...prev,
        [quizId]: {
          ...prev[quizId],
          animationDirection: '',
        },
      }));
    }, 150);
  };

  // ✅ Previous Question
  const goToPrev = (quizId: string) => {
    setQuizStates(prev => {
      const current = prev[quizId];
      if (current.currentQuestionIndex <= 0) return prev;

      return {
        ...prev,
        [quizId]: {
          ...current,
          animationDirection: 'prev',
          currentQuestionIndex: current.currentQuestionIndex - 1,
        },
      };
    });

    // Reset animation
    setTimeout(() => {
      setQuizStates(prev => ({
        ...prev,
        [quizId]: {
          ...prev[quizId],
          animationDirection: '',
        },
      }));
    }, 150);
  };

  // ✅ Submit Quiz
  const handleSubmitQuiz = async (quizId: string) => {
    if (!post || !user) return;

    const quiz = post.quizzes?.find(q => q.id === quizId);
    if (!quiz) return;

    const currentState = quizStates[quizId];
    const total = quiz.questions.length;
    const pointsEarned = 10;

    setQuizStates(prev => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        result: { score: 0, total, pointsEarned },
      },
    }));

    try {
      const res = await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          userId: user.id,
          blogId: post.id,
          answers: currentState.answers,
          score: pointsEarned,
        }),
      });

      if (res.ok) {
        await refreshUser();
        setQuizStates(prev => ({
          ...prev,
          [quizId]: {
            ...prev[quizId],
            completed: true,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to submit quiz');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!post) return <div className="text-center py-10">Blog not found.</div>;

  return (
    <>
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Blog Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center leading-tight animate-blog-title">
        {post.title}
      </h1>

      {/* Multiple Quizzes */}
      {post.quizzes?.map((quiz) => {
        const state = quizStates[quiz.id] || {
          showQuiz: false,
          answers: [],
          currentQuestionIndex: 0,
          animationDirection: '',
          result: null,
          completed: false,
        };

        return (
          <div key={quiz.id} className="mb-8 p-8 bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-3">
                <span className="bg-indigo-100 p-2 rounded-full">🎯</span>
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
                      ...prev,
                      [quiz.id]: { ...prev[quiz.id], showQuiz: !prev[quiz.id].showQuiz },
                    }))
                  }
                  className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {state.showQuiz ? 'Hide Quiz' : 'Start Quiz'}
                </button>
              )}
            </div>

            {/* Active Quiz Flow */}
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

                {/* Question Card with Animation */}
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
                        const safeValue = opt?.value !== undefined && opt?.value !== null
                          ? String(opt.value)
                          : `opt-${state.currentQuestionIndex}-${optIndex}`;
                        const inputId = `q${state.currentQuestionIndex}-opt${optIndex}`;
                        const isSelected = state.answers[state.currentQuestionIndex] === safeValue;

                        return (
                          <label
                            key={inputId}
                            htmlFor={inputId}
                            className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25'
                            }`}
                          >
                            <input
                              id={inputId}
                              type="radio"
                              name={`q${state.currentQuestionIndex}`}
                              value={safeValue}
                              checked={isSelected}
                              onChange={() => handleAnswerChange(quiz.id, state.currentQuestionIndex, safeValue)}
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600'
                                  : 'border-gray-400'
                              }`}
                            >
                              {isSelected && (
                                <div className="w-3 h-3 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-lg font-medium text-gray-800">{opt?.label || `Option ${optIndex + 1}`}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
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
            {state.result && (
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
                  +{state.result.pointsEarned} points added to wallet!
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
          {/* Blog Image */}
      {post.image && (
        <img
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.image.url}`}
          alt={post.title}
          className="w-full h-72 object-cover rounded-2xl shadow-xl mb-8 transform hover:scale-[1.02] transition duration-700 animate-blog-image"
        />
      )}

        {post.content ? (
          <RichText content={post.content} />
        ) : (
          <p className="text-gray-500">No content available.</p>
        )}
      </article>

      {/* Back Button */}
      <div className="mt-12 text-center animate-blog-button">
        <Link href="/dashboard" className="inline-block px-7 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
    <Footer />
    </>
  );  
}
