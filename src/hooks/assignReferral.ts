// src/hooks/assignReferral.ts
import { FieldHook } from 'payload'

export const assignReferral: FieldHook = async ({ value, data, req, operation }) => {
  // Sirf user creation pe chale
  if (operation !== 'create') return value

  const referralCode = data?.referralCodeUsed?.trim()
  if (!referralCode) return value

  const { payload } = req

  try {
    // Find member with this referralCode
    const members = await payload.find({
      collection: 'members',
      where: {
        referralCode: { equals: referralCode },
      },
      limit: 1,
    })

    if (members.docs.length === 0) {
      payload.logger.warn(`Invalid referral code used: ${referralCode}`)
      return value
    }

    const referrer = members.docs[0]

    // ❌ Prevent self-referral
    if (referrer.id === req.user?.id) {
      payload.logger.warn('User tried to refer themselves')
      return value
    }

    // 🔐 Update referrer: Add points
    await payload.update({
      collection: 'members',
      id: referrer.id,
      data: {
        referralsCount: (referrer.referralsCount || 0) + 1,
        wallet: (referrer.wallet || 0) + 100,
      },
    })

    payload.logger.info(
      `Referral successful: User ${req.user?.id} used code ${referralCode}. Referrer ${referrer.id} earned 100 points.`,
    )
  } catch (error: any) {
    payload.logger.error('Error in referral assignment:', error)
    // Don't block signup if referral fails
  }

  return value
}
