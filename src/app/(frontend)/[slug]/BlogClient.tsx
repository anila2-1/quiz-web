'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../_providers/Auth'
import Link from 'next/link'
import { RichText } from '../../../components/RichText'

interface Question {
  id: string
  questionText: string
  options: { label: string; value: string }[]
  correctAnswer: string
}

interface Quiz {
  id: string
  title: string
  questions: Question[]
}

interface Blog {
  id: string
  title: string
  content: any[]
  image?: { url: string }
  quizzes?: Quiz[]
}

interface QuizState {
  showQuiz: boolean
  answers: (string | null)[]
  currentQuestionIndex: number
  animationDirection: 'next' | 'prev' | ''
  result: { score: number; total: number; pointsEarned: number } | null
  completed: boolean
}

export function BlogClient({ initialBlog }: { initialBlog?: Blog }) {
  const { user, refreshUser } = useAuth()
  const [post] = useState<Blog | null>(initialBlog || null)
  const [quizStates, setQuizStates] = useState<Record<string, QuizState>>({})

  // Initialize quiz states
  useEffect(() => {
    if (post?.quizzes?.length) {
      const initial = post.quizzes.reduce(
        (acc, quiz) => {
          const isCompleted =
            user?.completedQuizIds?.some((item) => item.quizId === quiz.id) || false
          const questionsLength = quiz.questions?.length || 0

          acc[quiz.id] = {
            showQuiz: false,
            answers: Array(questionsLength).fill(null),
            currentQuestionIndex: 0,
            animationDirection: '',
            result: null,
            completed: isCompleted,
          }
          return acc
        },
        {} as Record<string, QuizState>,
      )
      setQuizStates(initial)
    }
  }, [post?.quizzes, user])

  const handleAnswerChange = (quizId: string, index: number, value: string) => {
    setQuizStates((prev) => ({
      ...prev!,
      [quizId]: {
        ...prev![quizId],
        answers: prev![quizId].answers.map((ans, i) => (i === index ? value : ans)),
      },
    }))
  }

  const goToNext = (quizId: string) => {
    setQuizStates((prev) => {
      const quiz = post?.quizzes?.find((q) => q.id === quizId)
      if (!quiz || !prev![quizId]) return prev!
      const { currentQuestionIndex } = prev![quizId]
      if (!Array.isArray(quiz.questions) || currentQuestionIndex >= quiz.questions.length - 1)
        return prev!

      return {
        ...prev!,
        [quizId]: {
          ...prev![quizId],
          animationDirection: 'next',
          currentQuestionIndex: currentQuestionIndex + 1,
        },
      }
    })

    setTimeout(() => {
      setQuizStates((prev) => ({
        ...prev!,
        [quizId]: { ...prev![quizId], animationDirection: '' },
      }))
    }, 150)
  }

  const goToPrev = (quizId: string) => {
    setQuizStates((prev) => {
      if (!prev[quizId] || prev[quizId].currentQuestionIndex <= 0) return prev

      return {
        ...prev,
        [quizId]: {
          ...prev[quizId],
          animationDirection: 'prev',
          currentQuestionIndex: prev[quizId].currentQuestionIndex - 1,
        },
      }
    })

    setTimeout(() => {
      setQuizStates((prev) => ({
        ...prev,
        [quizId]: { ...prev[quizId], animationDirection: '' },
      }))
    }, 150)
  }

  // In your BlogClient component, update the handleSubmitQuiz function:
  const handleSubmitQuiz = async (quizId: string) => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    const currentState = quizStates![quizId]
    if (!currentState) return

    try {
      const res = await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          userId: user.id,
          blogId: post!.id,
          answers: currentState.answers,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        refreshUser()
        setQuizStates((prev) => ({
          ...prev!,
          [quizId]: {
            ...prev![quizId],
            completed: true,
            result: {
              score: data.result.score,
              total: data.result.total,
              pointsEarned: data.result.pointsEarned,
            },
          },
        }))
      } else {
        console.error('Failed to submit quiz:', await res.text())
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err)
    }
  }
  // inside your component:
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelayedSubmit = (quizId: string) => {
    if (isSubmitting) return // prevent multiple clicks
    setIsSubmitting(true)

    handleSubmitQuiz(quizId).finally(() => {
      setIsSubmitting(false)
    })
  }

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>

        {/* Text */}
        <p className="text-lg font-semibold text-gray-700 animate-pulse text-center px-4">
          Loading your content...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Blog Title */}
      <h1
        className="text-2xl sm:text-3xl md:text-4xl mb-6 lg:text-5xl 
             font-extrabold 
             text-transparent bg-clip-text 
             bg-gradient-to-r from-blue-800 via-violet-800 to-fuchsia-800
             text-center leading-snug sm:leading-tight 
             px-4 py-2 
             animate-fade-in-up"
      >
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
        }

        return (
          <div
            key={quiz.id}
            className="mb-8 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl"
          >
            {/* Quiz Header */}
            <div className="flex justify-center items-center mb-6 sm:mb-8">
              {state.completed ? (
                <div className="group relative">
                  {/* Main Badge */}
                  <div className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white rounded-full text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 sm:gap-3 backdrop-blur-sm border border-white/10">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Quiz Completed</span>
                  </div>

                  {/* Subtle floating halo effect */}
                  <div className="absolute inset-0 rounded-full border border-green-400/30 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setQuizStates((prev) => ({
                      ...prev!,
                      [quiz.id]: { ...prev![quiz.id], showQuiz: !prev![quiz.id]?.showQuiz },
                    }))
                  }
                  className="group relative px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 sm:gap-3 overflow-hidden"
                >
                  {/* Animated gradient background shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>

                  {/* Icon */}
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={state.showQuiz ? 'M6 18L18 6M6 6l12 12' : 'M13 10V3L4 14h7v7l9-11h-7z'}
                    />
                  </svg>

                  {/* Text */}
                  <span className="relative z-10">
                    {state.showQuiz ? 'Hide Quiz' : 'Start Quiz'}
                  </span>

                  {/* Shine Animation Style */}
                  <style jsx>{`
                    @keyframes shine {
                      0% {
                        transform: translateX(-100%);
                      }
                      100% {
                        transform: translateX(200%);
                      }
                    }
                    .animate-shine {
                      animation: shine 1.8s ease-in-out infinite;
                    }
                  `}</style>
                </button>
              )}
            </div>
            {/* Quiz Flow */}
            {state.showQuiz && !state.completed && (
              <div className="mt-4 sm:mt-6">
                {/* Progress Dots */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="flex space-x-2 sm:space-x-3">
                    {(Array.isArray(quiz.questions) ? quiz.questions : []).map((_, idx) => (
                      <div
                        key={`${quiz.id}-dot-${idx}`} // Add unique key here
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
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
                  className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg sm:shadow-2xl min-h-64 sm:min-h-80 transition-all duration-300 ${
                    state.animationDirection === 'next'
                      ? 'animate-slide-left'
                      : state.animationDirection === 'prev'
                        ? 'animate-slide-right'
                        : ''
                  }`}
                >
                  <div className="p-4 sm:p-6 md:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
                      {state.currentQuestionIndex + 1}.{' '}
                      {Array.isArray(quiz.questions) &&
                      quiz.questions[state.currentQuestionIndex] ? (
                        <span>{quiz.questions[state.currentQuestionIndex].questionText}</span>
                      ) : (
                        <span className="text-red-500">Invalid question</span>
                      )}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {Array.isArray(quiz.questions) &&
                      quiz.questions[state.currentQuestionIndex]?.options ? (
                        quiz.questions[state.currentQuestionIndex].options.map((opt, optIndex) => {
                          const safeValue =
                            opt?.value !== undefined ? String(opt.value) : `opt-${optIndex}`
                          const isSelected = state.answers[state.currentQuestionIndex] === safeValue

                          return (
                            <label
                              key={`${quiz.id}-${state.currentQuestionIndex}-opt-${optIndex}`}
                              htmlFor={`q${state.currentQuestionIndex}-opt${optIndex}`}
                              className={`flex items-center p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
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
                                onChange={() =>
                                  handleAnswerChange(quiz.id, state.currentQuestionIndex, safeValue)
                                }
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center ${
                                  isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white"></div>
                                )}
                              </div>
                              <span className="text-base sm:text-lg font-medium text-gray-800">
                                {opt.label || `Option ${optIndex + 1}`}
                              </span>
                            </label>
                          )
                        })
                      ) : (
                        <p className="text-gray-500">No options available.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-0">
                  <button
                    onClick={() => goToPrev(quiz.id)}
                    disabled={state.currentQuestionIndex === 0}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-200 rounded-lg sm:rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    ← Previous
                  </button>

                  {Array.isArray(quiz.questions) &&
                  state.currentQuestionIndex < (quiz.questions?.length || 0) - 1 ? (
                    <button
                      onClick={() => goToNext(quiz.id)}
                      disabled={!state.answers[state.currentQuestionIndex]}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelayedSubmit(quiz.id)}
                      disabled={!state.answers[state.currentQuestionIndex] || isSubmitting}
                      className={`
    group relative
    px-6 sm:px-8 py-3 sm:py-3.5
    text-sm sm:text-base font-medium
    bg-gradient-to-r from-green-600 to-emerald-600
    text-white
    rounded-xl sm:rounded-2xl
    shadow-lg hover:shadow-xl
    transition-all duration-300
    flex items-center justify-center
    gap-2 sm:gap-3
    ${isSubmitting ? 'opacity-90 cursor-not-allowed scale-100' : 'hover:scale-105 active:scale-95'}
  `}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
                            <svg
                              className="animate-spin text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2.5"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Quiz</span>
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-0.5 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* In the result section of your BlogClient component: */}
            {state.completed && (
              <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200/70 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl text-center animate-fade-in backdrop-blur-sm relative overflow-hidden group">
                {/* Subtle animated background pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-teal-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                {/* Floating confetti dots (optional visual flair) */}
                <div className="absolute top-0 right-0 w-20 h-20">
                  <div
                    className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0s' }}
                  ></div>
                  <div
                    className="absolute top-6 right-6 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.5s' }}
                  ></div>
                  <div
                    className="absolute top-4 right-10 w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: '1s' }}
                  ></div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
                  {/* ✅ Elegant Animated Checkmark */}
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-shadow duration-300">
                      <svg
                        className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-sm"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {/* ✅ Subtle pulse ring on success */}
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping opacity-75"></div>
                  </div>

                  {/* ✅ Modern Headline */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight">
                    Quiz Completed!
                  </h3>
                </div>

                {/* ✅ Polished Subtitle */}
                <p className="text-base sm:text-lg text-gray-700 mb-3 font-medium max-w-md mx-auto leading-relaxed">
                  You've earned <span className="font-bold text-emerald-600">points</span> added to
                  your wallet!
                </p>

                {/* ✅ Highlighted Reward Badge */}
                <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-5 py-3 rounded-full font-bold text-lg sm:text-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.655.434 1.503.707 2.37.707.867 0 1.715-.273 2.37-.707C13.398 9.765 14 8.99 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Your Points Added to Wallet{' '}
                </div>

                {/* ✅ Optional Micro-Interaction: Floating sparkles on hover */}
                <style jsx>{`
                  @keyframes float {
                    0%,
                    100% {
                      transform: translateY(0px);
                    }
                    50% {
                      transform: translateY(-8px);
                    }
                  }
                  .animate-float {
                    animation: float 3s ease-in-out infinite;
                  }
                `}</style>
              </div>
            )}
          </div>
        )
      })}

      {/* Blog Content */}
      <article
        className="relative prose prose-sm sm:prose-lg max-w-none mb-8 sm:mb-12 animate-blog-content
                   bg-white/60 backdrop-blur-xl border border-gray-200 
                   rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 leading-relaxed text-gray-800
                   transition-all duration-500 hover:shadow-xl sm:hover:shadow-2xl"
      >
        {post!.image && (
          <img
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post!.image.url}`}
            alt={post!.title}
            className="w-full h-56 sm:h-72 object-cover rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl mb-6 sm:mb-8 transform hover:scale-[1.02] transition duration-700 animate-blog-image"
          />
        )}
        <RichText content={post!.content} />
      </article>

      {/* ✅ Back to Dashboard */}
      <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-100">
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-white border border-gray-200 
               hover:shadow-md sm:hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-gray-700 font-medium text-sm sm:text-base
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {/* Arrow */}
          <span className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200 group-hover:bg-indigo-50 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300 group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </span>

          <span className="font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
            Back to Dashboard
          </span>
        </Link>
      </div>
    </div>
  )
}
