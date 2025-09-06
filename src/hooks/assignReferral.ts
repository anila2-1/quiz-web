// src/hooks/assignReferral.ts
import { FieldHook } from 'payload'

export const assignReferral: FieldHook = async ({ value, data, req, operation }) => {
  // Sirf user creation pe chale
  if (operation !== 'create') return value

  const referralCode = data?.referralCodeUsed?.trim()
  if (!referralCode) return value

  const { payload } = req

  try {
    // Find user with this referralCode
    const users = await payload.find({
      collection: 'users',
      where: {
        referralCode: { equals: referralCode },
      },
      limit: 1,
    })

    if (users.docs.length === 0) {
      payload.logger.warn(`Invalid referral code used: ${referralCode}`)
      return value
    }

    const referrer = users.docs[0]

    // ❌ Prevent self-referral
    if (referrer.id === req.user?.id) {
      payload.logger.warn('User tried to refer themselves')
      return value
    }

    // 🔐 Update referrer: Add points
    await payload.update({
      collection: 'users',
      id: referrer.id,
      data: {
        referralCount: (referrer.referralCount || 0) + 1,
        referralEarnings: (referrer.referralEarnings || 0) + 100,
        walletBalance: (referrer.walletBalance || 0) + 100,
      },
    })

    payload.logger.info(
      `Referral successful: User ${req.user?.id} used code ${referralCode}. Referrer ${referrer.id} earned 100 points.`
    )
  } catch (error: any) {
    payload.logger.error('Error in referral assignment:', error)
    // Don't block signup if referral fails
  }

  return value
}