'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const MIN_WITHDRAWAL = 500

interface Member {
  id: string
  email: string
  wallet: number
}

interface Withdrawal {
  id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  paymentInfo: string
  createdAt: string
}

interface FormData {
  amount: string
  paymentInfo: string
}

export default function WithdrawalsPage() {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [formData, setFormData] = useState<FormData>({ amount: '', paymentInfo: '' })
  const [loading, setLoading] = useState(false)
  const [fetchingWithdrawals, setFetchingWithdrawals] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const current = prev || { amount: '', paymentInfo: '' }
      return { ...current, [field]: value }
    })
  }, [])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  // ✅ Fetch member info
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch('/api/get-member')
        if (!res.ok) throw new Error('Failed to fetch member data')
        const data = await res.json()
        setMember(data.member)
      } catch (err) {
        console.error('Failed to fetch member:', err)
        router.push('/auth/login')
      }
    }
    fetchMember()
  }, [router])

  // ✅ Fetch past withdrawals — FIXED
  useEffect(() => {
    if (!member) return

    const fetchWithdrawals = async () => {
      setFetchingWithdrawals(true)
      try {
        const res = await fetch('/api/withdrawals')

        if (!res.ok) {
          const errorText = await res.text()
          console.error('Server error:', errorText)
          throw new Error('Failed to load withdrawal history')
        }

        const text = await res.text()
        if (!text.trim()) {
          console.warn('Empty response from server')
          setWithdrawals([])
          return
        }

        const data = JSON.parse(text)
        setWithdrawals(data.withdrawals || [])
      } catch (err: any) {
        console.error('Failed to fetch withdrawals:', err)
        setError('Could not load withdrawal history. Please refresh.')
      } finally {
        setFetchingWithdrawals(false)
      }
    }

    fetchWithdrawals()
  }, [member])

  // ✅ Handle withdrawal request
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!member) return

      clearMessages()
      setLoading(true)

      const numAmount = Number(formData.amount)
      const trimmedPaymentInfo = formData.paymentInfo.trim()

      if (isNaN(numAmount) || numAmount <= 0) {
        setError('Please enter a valid amount')
        setLoading(false)
        return
      }
      if (numAmount < MIN_WITHDRAWAL) {
        setError(`Minimum withdrawal is ${MIN_WITHDRAWAL} points`)
        setLoading(false)
        return
      }
      if (numAmount > member.wallet) {
        setError(`Insufficient wallet balance. You have ${member.wallet} points available.`)
        setLoading(false)
        return
      }
      if (!trimmedPaymentInfo) {
        setError('Payment information is required')
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/withdrawals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: numAmount,
            paymentInfo: trimmedPaymentInfo,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setSuccess('Withdrawal request submitted successfully!')
          setFormData({ amount: '', paymentInfo: '' })

          // ✅ Add new pending request to UI — NO WALLET DEDUCTION
          setWithdrawals((prev) => [
            {
              id: data.id || Date.now().toString(),
              amount: numAmount,
              status: 'pending',
              paymentInfo: trimmedPaymentInfo,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ])

          // ✅ Refetch member to ensure UI matches server (in case of race conditions)
          const memberRes = await fetch('/api/get-member')
          if (memberRes.ok) {
            const memberData = await memberRes.json()
            setMember(memberData.member)
          }
        } else {
          const json = await res.json()
          throw new Error(json.error || 'Withdrawal request failed')
        }
      } catch (err: any) {
        setError(err.message || 'Unexpected error occurred')
      } finally {
        setLoading(false)
      }
    },
    [member, formData, clearMessages],
  )
  const sortedWithdrawals = useMemo(() => {
    return [...withdrawals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [withdrawals])

  if (!member) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>

        {/* Text */}
        <p className="text-lg font-semibold text-gray-700 animate-pulse">Loading your content...</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50 ">
      <Sidebar />
      <div className="max-w-3xl mx-auto py-10 px-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl top-4 font-bold text-gray-900 mb-6">Withdraw Earnings</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* ✅ Balance Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Balance</h2>
          <p className="text-2xl font-bold text-blue-600">{member.wallet} Points</p>
          <p className="text-gray-600">Minimum withdrawal: {MIN_WITHDRAWAL} Points</p>
        </div>

        {/* ✅ Withdrawal Form — PROFESSIONAL UPGRADE */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-3xl p-8 mb-10 border border-gray-100 hover:shadow-3xl transition-all duration-500 group"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
              Request Withdrawal
            </h2>
            <p className="text-gray-500 text-sm">Transfer your earnings securely</p>
          </div>

          <div className="space-y-6">
            {/* Amount Field */}
            <div className="relative group">
              <label
                htmlFor="amount"
                className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                Amount (Points)
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => updateFormData('amount', e.target.value)}
                  min={MIN_WITHDRAWAL}
                  max={member.wallet}
                  required
                  placeholder={`Min: ${MIN_WITHDRAWAL}`}
                  className="w-full px-5 py-4 text-lg font-medium bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-gray-900 placeholder-gray-400 
                     focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/30 transition-all duration-300 shadow-sm
                     group-hover:border-gray-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  PTS
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Available:{' '}
                <span className="font-semibold text-indigo-600">{member.wallet} PTS</span> • Min:{' '}
                {MIN_WITHDRAWAL} PTS
              </p>
            </div>

            {/* Payment Info Field */}
            <div className="relative group">
              <label
                htmlFor="paymentInfo"
                className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Payment Email or USDT Wallet
              </label>
              <input
                id="paymentInfo"
                type="text"
                value={formData.paymentInfo}
                onChange={(e) => updateFormData('paymentInfo', e.target.value)}
                placeholder={member.email || 'Enter email or USDT address'}
                required
                className="w-full px-5 py-4 text-lg font-medium bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-gray-900 placeholder-gray-400 
                   focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/30 transition-all duration-300 shadow-sm
                   group-hover:border-gray-300"
              />
              <p className="mt-1 text-xs text-gray-500">We’ll send payment to this address</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl 
                 shadow-lg hover:shadow-2xl active:scale-98 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Shine Effect */}
              <span className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine"></span>

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Request...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Request Withdrawal
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong className="font-medium">Secure & Encrypted</strong> — Your payment
                information is protected with bank-grade encryption. Withdrawals are manually
                reviewed for your safety.
              </p>
            </div>
          </div>
        </form>

        {/* Add Shine Animation */}
        <style>{`
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-shine {
    animation: shine 1.8s ease-in-out infinite;
  }
`}</style>

        {/* ✅ Past Withdrawals — PROFESSIONAL UI */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Withdrawal History</h2>
            <span className="text-sm text-gray-500">
              {sortedWithdrawals.length} {sortedWithdrawals.length === 1 ? 'request' : 'requests'}
            </span>
          </div>

          {fetchingWithdrawals ? (
            <div className="flex flex-col items-center py-10">
              <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500">Loading your history...</p>
            </div>
          ) : sortedWithdrawals.length > 0 ? (
            <div className="space-y-5">
              {sortedWithdrawals.map((req) => (
                <div
                  key={req.id}
                  className="p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        <span className="text-lg font-bold text-blue-600">{req.amount}</span> Points
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Payment:</strong> {req.paymentInfo}
                      </p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          req.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : req.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500">
                        {new Date(req.createdAt).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No withdrawals yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your withdrawal requests will appear here permanently.
              </p>
            </div>
          )}
        </div>

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
    </div>
  )
}
