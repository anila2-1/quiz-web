'use client'

interface ReferralLinkSectionProps {
  referralLink: string
  referralCode: string
}

export default function ReferralLinkSection({
  referralLink,
  referralCode,
}: ReferralLinkSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
      <p className="text-gray-700 mb-4">
        Share your referral link with friends. You&quot;ll earn 100 points for each person who signs
        up using your code!
      </p>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={referralLink}
          readOnly
          onClick={(e) => e.currentTarget.select()}
          className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(referralLink).then(() => {
              alert('Copied to clipboard!')
            })
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Copy
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Your referral code: <span className="font-mono">{referralCode}</span>
      </p>
    </div>
  )
}
