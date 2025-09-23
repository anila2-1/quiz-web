// src/hooks/updateWallet.ts
import { PayloadRequest } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'

export const updateWallet = async ({
  userId,
  amount,
  req,
  type = 'points', // 'points' or 'usdt'
}: {
  userId: string
  amount: number
  req: PayloadRequest
  type?: 'points' | 'usdt'
}) => {
  const payload = await getPayload({ config })

  // Fetch member with full data
  const member = await payload.findByID({
    collection: 'members',
    id: userId,
    depth: 0,
  })

  if (!member) throw new Error('User not found')

  const updatedData: Partial<{ wallet: number; usdtBalance: number }> = {}

  if (type === 'usdt') {
    const newUsdtBalance = (member.usdtBalance || 0) + amount
    if (newUsdtBalance < 0) {
      throw new Error(
        `Wallet cannot go negative. Current: ${member.usdtBalance}, Change: ${amount}`,
      )
    }
    updatedData.usdtBalance = newUsdtBalance
  } else {
    const newWallet = (member.wallet || 0) + amount
    if (newWallet < 0) {
      throw new Error(`Wallet cannot go negative. Current: ${member.wallet}, Change: ${amount}`)
    }
    updatedData.wallet = newWallet
  }

  // Update member
  await payload.update({
    collection: 'members',
    id: userId,
    data: updatedData,
  })
}
