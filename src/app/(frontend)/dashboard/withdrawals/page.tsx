'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const MIN_WITHDRAWAL = 500;

interface Member {
  id: string;
  email: string;
  wallet: number;
}

interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentInfo: string;
  createdAt: string;
}

interface FormData {
  amount: string;
  paymentInfo: string;
}

export default function WithdrawalsPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [formData, setFormData] = useState<FormData>({ amount: '', paymentInfo: '' });
  const [loading, setLoading] = useState(false);
  const [fetchingWithdrawals, setFetchingWithdrawals] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => {
      const current = prev || { amount: '', paymentInfo: '' };
      return { ...current, [field]: value };
    });
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // ✅ Fetch member info
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch('/api/get-member');
        if (!res.ok) throw new Error('Failed to fetch member data');
        const data = await res.json();
        setMember(data.member);
      } catch (err) {
        console.error('Failed to fetch member:', err);
        router.push('/auth/login');
      }
    };
    fetchMember();
  }, [router]);

  // // ✅ Fetch past withdrawals
  // useEffect(() => {
  //   if (!member) return;

  //   const fetchWithdrawals = async () => {
  //     setFetchingWithdrawals(true);
  //     try {
  //       const res = await fetch('/api/withdrawals');
  //       const data = await res.json();
  //       setWithdrawals(data.withdrawals || []);
  //     } catch (err) {
  //       console.error('Failed to fetch withdrawals:', err);
  //     } finally {
  //       setFetchingWithdrawals(false);
  //     }
  //   };

  //   fetchWithdrawals();
  // }, [member]);

  // ✅ Handle withdrawal request
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    clearMessages();
    setLoading(true);

    const numAmount = Number(formData.amount);
    const trimmedPaymentInfo = formData.paymentInfo.trim();

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }
    if (numAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal is ${MIN_WITHDRAWAL} points`);
      setLoading(false);
      return;
    }
    if (numAmount > member.wallet) {
      setError(`Insufficient wallet balance. You have ${member.wallet} points available.`);
      setLoading(false);
      return;
    }
    if (!trimmedPaymentInfo) {
      setError('Payment information is required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          paymentInfo: trimmedPaymentInfo,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess('Withdrawal request submitted successfully!');
        setFormData({ amount: '', paymentInfo: '' });

        // Optimistic update
        setMember(prev => prev ? { ...prev, wallet: prev.wallet - numAmount } : null);
        setWithdrawals(prev => [
          {
            id: data.id || Date.now().toString(),
            amount: numAmount,
            status: 'pending',
            paymentInfo: trimmedPaymentInfo,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        const json = await res.json();
        throw new Error(json.error || 'Withdrawal request failed');
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [member, formData, clearMessages]);

  const sortedWithdrawals = useMemo(() => {
    return [...withdrawals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [withdrawals]);

  if (!member) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ">
      <Sidebar />
      <div className="max-w-3xl mx-auto py-10 px-6 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Withdraw Earnings</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}

        {/* ✅ Balance Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Balance</h2>
          <p className="text-2xl font-bold text-blue-600">{member.wallet} Points</p>
          <p className="text-gray-600">Minimum withdrawal: {MIN_WITHDRAWAL} Points</p>
        </div>

        {/* ✅ Withdrawal Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Withdrawal</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (Points)
              </label>
              <input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => updateFormData('amount', e.target.value)}
                min={MIN_WITHDRAWAL}
                max={member.wallet}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="paymentInfo" className="block text-sm font-medium text-gray-700">
                Payment Email or USDT Wallet Address
              </label>
              <input
                id="paymentInfo"
                type="text"
                value={formData.paymentInfo}
                onChange={(e) => updateFormData('paymentInfo', e.target.value)}
                placeholder={member.email}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:shadow-lg disabled:opacity-70 transition-all duration-300 font-medium"
            >
              {loading ? 'Submitting...' : 'Request Withdrawal'}
            </button>
          </div>
        </form>

        {/* ✅ Past Withdrawals
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Requests</h2>
          {fetchingWithdrawals ? (
            <p className="text-gray-500">Loading withdrawal history...</p>
          ) : sortedWithdrawals.length > 0 ? (
            <div className="space-y-4">
              {sortedWithdrawals.map((req) => (
                <div key={req.id} className="border-b pb-3">
                  <p className="font-medium text-gray-900">Amount: {req.amount} Points</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={
                        req.status === 'approved'
                          ? 'text-green-600'
                          : req.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }
                    >
                      {req.status}
                    </span>
                  </p>
                  <p className="text-gray-600">Payment: {req.paymentInfo}</p>
                  <p className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No withdrawal requests yet.</p>
          )}
        </div> */}

        <div className="mt-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
