// src/app/(frontend)/dashboard/withdraw/page.tsx
'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

const MIN_WITHDRAWAL_USDT = 0.5 // $0.5 USDT minimum

interface Member {
  id: string
  email: string
  wallet: number
  usdtBalance?: number
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
  const [converting, setConverting] = useState(false)

  // ✅ Add dummy state to force re-render after conversion
  const [refreshKey, setRefreshKey] = useState(0)

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
  }, [router, refreshKey]) // 👈 Add refreshKey here

  // ✅ Fetch past withdrawals
  useEffect(() => {
    if (!member) return

    const fetchWithdrawals = async () => {
      setFetchingWithdrawals(true)
      try {
        const res = await fetch('/api/withdrawals')
        if (!res.ok) throw new Error('Failed to load withdrawal history')
        const data = await res.json()
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

  // ✅ Handle USDT Conversion
  const handleConvertToUsdt = useCallback(async () => {
    if (!member || member.wallet <= 0) return

    setConverting(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/convert-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Conversion failed')
      }

      const result = await res.json()
      setSuccess(
        `✅ Successfully converted ${result.pointsConverted} points to $${result.usdtReceived.toFixed(4)} USDT`,
      )

      // ✅ Refresh member data + force UI update
      const memberRes = await fetch('/api/get-member')
      if (memberRes.ok) {
        const memberData = await memberRes.json()
        setMember(memberData.member)
        setRefreshKey((prev) => prev + 1) // 👈 Force re-render
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred')
    } finally {
      setConverting(false)
    }
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
      if (numAmount < MIN_WITHDRAWAL_USDT) {
        setError(`Minimum withdrawal is $${MIN_WITHDRAWAL_USDT} USDT`)
        setLoading(false)
        return
      }
      if (numAmount > (member.usdtBalance || 0)) {
        setError(
          `Insufficient USDT balance. Available: $${(member.usdtBalance || 0).toFixed(4)} USDT`,
        )
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

          // ✅ IMMEDIATELY UPDATE LOCAL BALANCE
          setMember((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              usdtBalance: (prev.usdtBalance || 0) - numAmount,
            }
          })

          setFormData({ amount: '', paymentInfo: '' })

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 sm:p-6 md:ml-64 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
            <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading...</p>
            <p className="text-sm text-gray-500 mt-2 animate-fade-in">
              Almost there — just a moment please 😊
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Sidebar (hidden on small screens, visible on md+) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* ✅ Back to Dashboard */}
          <div className="mt-6 mb-7 pt-6 border-t border-gray-100">
            <Link
              href="/dashboard"
              className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Withdraw Your Earnings</h1>
            <p className="text-gray-600">Convert or withdraw your points as USDT anytime</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  ${(member.usdtBalance || 0).toFixed(4)}
                </div>
                <div className="text-sm font-medium text-gray-600">Available USDT</div>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-yellow-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  $
                  {sortedWithdrawals
                    .filter((w) => w.status === 'pending')
                    .reduce((sum, w) => sum + w.amount, 0)
                    .toFixed(4)}
                </div>
                <div className="text-sm font-medium text-gray-600">Pending Withdrawals</div>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  $
                  {(
                    (member.usdtBalance || 0) +
                    sortedWithdrawals
                      .filter((w) => w.status === 'pending')
                      .reduce((sum, w) => sum + w.amount, 0)
                  ).toFixed(4)}
                </div>
                <div className="text-sm font-medium text-gray-600">Total USDT</div>
              </div>
            </div>
          </div>

          {/* Convert Points Section */}
          <div className="bg-white shadow-lg rounded-3xl p-8 mb-10 border border-gray-100 hover:shadow-3xl transition-all duration-500 group">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Convert Points to USDT
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Rate: <span className="font-semibold">1 point = $0.001 USDT</span>
            </p>

            {member.wallet > 0 ? (
              <button
                onClick={handleConvertToUsdt}
                disabled={converting}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                  text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl active:scale-98 
                  transition-all duration-300 relative overflow-hidden group"
              >
                <span className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {converting ? (
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
                      Converting Points...
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      Convert {member.wallet.toLocaleString()} Points to $
                      {(member.wallet * 0.001).toFixed(4)} USDT
                    </>
                  )}
                </span>
              </button>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  🎯 You have <span className="font-semibold">{member.wallet} points</span>{' '}
                  available for conversion.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Take quizzes or refer friends to earn more points!
                </p>
              </div>
            )}

            {/* ✅ Show success message in this section too */}
            {success && success.includes('converted') && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
          </div>

          {/* Withdraw Form */}
          <div className="bg-white shadow-lg rounded-3xl p-8 mb-10 border border-gray-100 hover:shadow-3xl transition-all duration-500 group">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Request USDT Withdrawal
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* ✅ Show success message only if it's NOT about conversion */}
            {success && !success.includes('converted') && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Amount Field */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USDT)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.0001"
                    value={formData.amount}
                    onChange={(e) => updateFormData('amount', e.target.value)}
                    placeholder={`Min: $${MIN_WITHDRAWAL_USDT}`}
                    required
                    className="w-full px-5 py-4 text-lg font-medium bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-gray-900 placeholder-gray-400 
                      focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/30 transition-all duration-300 shadow-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Available:{' '}
                    <span className="font-semibold">
                      ${(member.usdtBalance || 0).toFixed(4)} USDT
                    </span>
                  </p>
                </div>

                {/* Payment Info Field */}
                <div>
                  <label
                    htmlFor="paymentInfo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    USDT Wallet Address
                  </label>
                  <input
                    id="paymentInfo"
                    type="text"
                    value={formData.paymentInfo}
                    onChange={(e) => updateFormData('paymentInfo', e.target.value)}
                    placeholder="Enter your USDT (TRC20/ERC20) wallet address"
                    required
                    className="w-full px-5 py-4 text-lg font-medium bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-gray-900 placeholder-gray-400 
                      focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/30 transition-all duration-300 shadow-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    We’ll send USDT directly to this address. Double-check for accuracy.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-2xl 
                    shadow-lg hover:shadow-2xl active:scale-98 transition-all duration-300 relative overflow-hidden group"
                >
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
            </form>

            {/* Security Note */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
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
          </div>

          {/* Withdrawal History */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
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
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Amount (USDT)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Wallet Address
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedWithdrawals.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${req.amount.toFixed(4)}
                        </td>
                        <td className="px-6 py-4">
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
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs"
                          title={req.paymentInfo}
                        >
                          {req.paymentInfo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(req.createdAt).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No withdrawals yet</h3>
                <p className="mt-2 text-gray-500">Your withdrawal requests will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shine Animation */}
      <style>{`
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
    </>
  )
}
