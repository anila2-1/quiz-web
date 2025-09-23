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
      min: 0.5,
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
    // ✅ REMOVED beforeValidate — handled in API route
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // ✅ Only handle REJECTION — because deduction already happened on CREATE
        if (doc.status === 'rejected' && previousDoc?.status !== 'rejected') {
          try {
            await updateWallet({
              userId: doc.user as string,
              amount: doc.amount, // REFUND
              req,
              type: 'usdt',
            })
            req.payload.logger.info(`↩️ Refunded $${doc.amount} USDT to user ${doc.user}`)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            req.payload.logger.error(`❌ Failed to refund: ${errorMessage}`)
            throw new Error('Failed to refund points')
          }
        }

        // ✅ If approved — do nothing (already deducted)
        if (doc.status === 'approved' && previousDoc?.status !== 'approved') {
          req.payload.logger.info(`✅ Approved withdrawal: $${doc.amount} USDT (already deducted)`)
        }
      },
    ],
  },
}

export default Withdrawals
