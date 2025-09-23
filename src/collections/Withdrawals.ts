// src/collections/Withdrawals.ts
import { CollectionConfig } from 'payload'
import { updateWallet } from '../hooks/updateWallet'
import { isAdmin } from '../access/isAdmin'

const Withdrawals: CollectionConfig = {
  slug: 'withdrawals',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'amount', 'status', 'createdAt'],
    group: 'Finance',
  },
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      return { user: { equals: req.user.id } }
    },
    update: isAdmin,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'members',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0.5, // minimum $0.5 USDT
    },
    {
      name: 'paymentInfo',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
      admin: {
        description: 'Change to "Approved" to deduct points from wallet',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data) return data // Ensure data is defined

        if (operation === 'create') return data

        if (operation === 'update' && data.status === 'approved') {
          const userId = data.user
          if (typeof userId !== 'string') throw new Error('Invalid user ID')

          const member = await req.payload.findByID({
            collection: 'members',
            id: userId,
            depth: 0,
          })

          if (!member) throw new Error('User not found')

          const totalUsdtAvailable = (member.usdtBalance || 0) + (member.wallet || 0) * 0.001
          if (totalUsdtAvailable < data.amount) {
            throw new Error(
              `Insufficient balance. Available: $${totalUsdtAvailable.toFixed(4)} USDT, Requested: $${data.amount}`,
            )
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (doc.status === 'approved' && previousDoc?.status !== 'approved') {
          try {
            // Deduct from usdtBalance
            await updateWallet({
              userId: doc.user as string,
              amount: -doc.amount, // negative = deduction from USDT
              req,
              type: 'usdt', // specify we're updating usdtBalance
            })
            req.payload.logger.info(
              `✅ Approved withdrawal: $${doc.amount} USDT from user ${doc.user}`,
            )
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            req.payload.logger.error(`❌ Failed to deduct USDT: ${errorMessage}`)
            await req.payload.update({
              collection: 'withdrawals',
              id: doc.id,
              data: { status: 'pending' },
            })
            throw new Error('Failed to process withdrawal')
          }
        }

        if (doc.status === 'rejected' && previousDoc?.status === 'approved') {
          try {
            await updateWallet({
              userId: doc.user as string,
              amount: doc.amount, // refund USDT
              req,
              type: 'usdt',
            })
            req.payload.logger.info(`↩️ Refunded $${doc.amount} USDT to user ${doc.user}`)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            req.payload.logger.error(`❌ Failed to refund: ${errorMessage}`)
            throw new Error('Failed to refund')
          }
        }
      },
    ],
  },
}

export default Withdrawals
