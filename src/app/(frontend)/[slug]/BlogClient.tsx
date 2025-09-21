// src/app/(frontend)/blog/[slug]/BlogClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../_providers/Auth'
import Link from 'next/link'
import RichText from '@/components/RichText'
import Image from 'next/image'

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
  category?: {
    id: string
    title: string
    color?: string
    slug: string
  }
}

interface QuizState {
  showQuiz: boolean
  answers: (string | null)[]
  currentQuestionIndex: number
  animationDirection: 'next' | 'prev' | ''
  result: { score: number; total: number; pointsEarned: number } | null
  completed: boolean
}

interface BlogClientProps {
  initialBlog?: Blog
  initialCategory?: any
}

export function BlogClient({ initialBlog, initialCategory }: BlogClientProps) {
  const { user, refreshUser } = useAuth()
  const [post] = useState<Blog | null>(initialBlog || null)
  const [category] = useState<any>(initialCategory || null)
  const [quizStates, setQuizStates] = useState<Record<string, QuizState>>({})
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)

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

  // Fetch related blogs by category
  useEffect(() => {
    const fetchRelatedBlogs = async (categoryId: string, currentBlogId: string) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[category][equals][id]=${categoryId}&limit=6&depth=1`,
          { cache: 'no-store' },
        )
        if (!res.ok) throw new Error('Failed to fetch related blogs')
        const data = await res.json()
        // Filter out current blog
        return data.docs.filter((blog: any) => blog.id !== currentBlogId)
      } catch (error) {
        console.error('Error fetching related blogs:', error)
        return []
      }
    }

    if (category?.id && post?.id) {
      setLoadingRelated(true)
      fetchRelatedBlogs(category.id, post.id).then((blogs) => {
        setRelatedBlogs(blogs)
        setLoadingRelated(false)
      })
    }
  }, [category?.id, post?.id])

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

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelayedSubmit = (quizId: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    handleSubmitQuiz(quizId).finally(() => {
      setIsSubmitting(false)
    })
  }

  if (!post || Object.keys(post).length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold text-gray-700 animate-pulse text-center px-4">
          Loading...
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

      {/* Category Tag */}
      {category && (
        <div className="flex justify-center mb-8">
          <Link
            href={`/categories/${category.slug}`}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 border border-indigo-200/50 hover:border-indigo-300/70 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color || '#4F46E5' }}
            ></span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-800 transition-colors">
              {category.title}
            </span>
            <svg
              className="w-4 h-4 text-gray-500 group-hover:text-indigo-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
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
                  <span className="relative z-10">
                    {state.showQuiz ? 'Hide Quiz' : 'Start Quiz'}
                  </span>
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
                        key={`${quiz.id}-dot-${idx}`}
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

            {/* Result */}
            {state.completed && (
              <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200/70 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl text-center animate-fade-in backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-teal-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
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
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
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
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping opacity-75"></div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent leading-tight">
                    Quiz Completed!
                  </h3>
                </div>
                <div className="inline-flex items-center gap-3 rounded-xl bg-white border border-gray-200 px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300">
                  <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                    🎉 You&lsquo;ve earned points! They&lsquo;ve been added to your wallet.
                  </p>
                </div>
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
          <div className="w-ful aspect-video mb-8 overflow-hidden rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl">
            <Image
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post!.image.url}`}
              alt={post!.title}
              width={800} // Example: 800px wide
              height={600} // Example: 600px tall
              unoptimized
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        )}
        <RichText
          content={Array.isArray(post!.content) ? post!.content.join('') : post!.content}
          data={post!.content as any}
        />
      </article>

      {/* ✅ RELATED POSTS SECTION */}
      {category && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          {loadingRelated ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </>
          ) : relatedBlogs.length > 0 ? (
            <>
              <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Related Posts in “{category.title}”
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/${blog.slug}`}
                    className="group block overflow-hidden rounded-2xl bg-white border border-gray-200 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {blog.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${blog.image.url}`}
                          alt={blog.title}
                          width={800} // Example: 800px wide
                          height={600} // Example: 600px tall
                          unoptimized
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-700 line-clamp-2">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                      )}
                      <div className="flex items-center text-indigo-600 font-medium text-sm">
                        Read More
                        <svg
                          className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No related posts in this category yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Back to Blog */}
      <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-100">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-white border border-gray-200 
               hover:shadow-md sm:hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-gray-700 font-medium text-sm sm:text-base
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
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
            Back to Blog
          </span>
        </Link>
      </div>
    </div>
  )
}
