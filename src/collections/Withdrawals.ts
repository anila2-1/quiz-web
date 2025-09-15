// src/collections/Withdrawals.ts
import { CollectionConfig, getPayload } from 'payload'
import { updateWallet } from '../hooks/updateWallet'
import config from '../payload.config'
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
      min: 500,
      validate: async (
        value: number | null | undefined,
        { data, req }: { data: Record<string, unknown>; req: any },
      ) => {
        if (value == null) return 'Amount is required.'
        if (value < 500) return 'Minimum withdrawal is 500 points.'

        const userId = data?.user
        if (!userId) return 'User not found.'

        const payload = await getPayload({ config }) // ✅ Get payload instance
        const member = await payload.findByID({
          collection: 'members', // ✅ Fixed: was 'users'
          id: userId as string,
          depth: 0,
        })

        if (!member) return 'User not found.'
        if ((member.wallet || 0) < value) return 'Insufficient wallet balance.'

        return true
      },
    },
    {
      name: 'paymentInfo',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'approved', 'rejected'],
      defaultValue: 'pending',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (doc.status === 'approved' && previousDoc.status !== 'approved') {
          await updateWallet({
            userId: doc.user as string,
            amount: -doc.amount,
            req,
          })
        }
      },
    ],
  },
}

export default Withdrawals
