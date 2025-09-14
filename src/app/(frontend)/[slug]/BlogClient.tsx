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
          acc[quiz.id] = {
            showQuiz: false,
            answers: Array(quiz.questions.length).fill(null),
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
      if (currentQuestionIndex >= quiz.questions.length - 1) return prev!

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
      const { currentQuestionIndex } = prev![quizId] || {}
      if (currentQuestionIndex! <= 0) return prev!

      return {
        ...prev!,
        [quizId]: {
          ...prev![quizId],
          animationDirection: 'prev',
          currentQuestionIndex: currentQuestionIndex! - 1,
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
          score: 10,
        }),
      })

      if (res.ok) {
        refreshUser()
        setQuizStates((prev) => ({
          ...prev!,
          [quizId]: { ...prev![quizId], completed: true },
        }))
      }
    } catch (err) {
      console.error('Failed to submit quiz')
    }
  }

  // inside your component:
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelayedSubmit = (quizId: string) => {
    if (isSubmitting) return // prevent multiple clicks
    setIsSubmitting(true)

    // Simulate delay (3 sec)
    setTimeout(() => {
      handleSubmitQuiz(quizId)
      setIsSubmitting(false) // optional reset after submission
    }, 3000)
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
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
             font-extrabold 
             text-transparent bg-clip-text 
             bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-700
             drop-shadow-lg 
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
                <span className="px-4 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs sm:text-sm font-bold shadow-md flex items-center gap-2">
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
                  className="px-5 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {state.showQuiz ? 'Hide Quiz' : 'Start Quiz'}
                </button>
              )}
            </div>

            {/* Quiz Flow */}
            {state.showQuiz && !state.completed && (
              <div className="mt-4 sm:mt-6">
                {/* Progress Dots */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="flex space-x-2 sm:space-x-3">
                    {quiz.questions.map((_, idx) => (
                      <div
                        key={idx}
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
                      {quiz.questions[state.currentQuestionIndex].questionText}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {quiz.questions[state.currentQuestionIndex].options.map((opt, optIndex) => {
                        const safeValue =
                          opt?.value !== undefined ? String(opt.value) : `opt-${optIndex}`
                        const isSelected = state.answers[state.currentQuestionIndex] === safeValue

                        return (
                          <label
                            key={optIndex}
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
                      })}
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
                  {state.currentQuestionIndex < quiz.questions.length - 1 ? (
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
                      className={`px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base 
              bg-gradient-to-r from-green-600 to-emerald-600 text-white 
              rounded-lg sm:rounded-xl 
              transition-all duration-300 font-medium
              ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl transform hover:scale-105'}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quiz Result */}
            {state.completed && (
              <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg text-center animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-2xl sm:text-3xl font-bold text-green-700">Quiz Completed!</h3>
                </div>
                <p className="text-lg sm:text-xl text-gray-800 mb-2">
                  <strong>Congratulations!</strong>
                </p>
                <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  +10 points added to wallet!
                </p>
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
