import { CollectionConfig } from 'payload'

const Members: CollectionConfig = {
  slug: 'members',
  auth: true,
  admin: {
    hidden: false,
    group: 'Members',
    useAsTitle: 'username',
    description: 'Username is case-insensitive and must be unique',
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'resetPasswordToken',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'resetPasswordExpires',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'wallet',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'usdtBalance',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'verificationToken',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'verificationTokenExpiry',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'referralCode',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'referralsCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'referredBy',
      type: 'relationship',
      relationTo: 'members',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'walletAddress',
      type: 'text',
      required: false,
    },

    // {
    //   name: 'completedBlogs',
    //   type: 'array',
    //   label: 'Completed Articles',
    //   fields: [
    //     {
    //       name: 'blog',
    //       type: 'relationship',
    //       relationTo: 'blogs',
    //     },
    //     {
    //       name: 'completedAt',
    //       type: 'date',
    //       defaultValue: () => new Date().toISOString(),
    //     },
    //     {
    //       name: 'score',
    //       type: 'number',
    //     },
    //   ],
    // },
    {
      name: 'completedQuizIds',
      type: 'array',
      label: 'Completed Quiz IDs',
      fields: [
        {
          name: 'quizId',
          type: 'text',
        },
        {
          name: 'completedAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
        },
        {
          name: 'score',
          type: 'number',
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data || typeof data.username !== 'string') return data
        return {
          ...data,
          username: data.username.trim().toLowerCase(), // ✅ Normalize to lowercase
        }
      },
    ],

    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' && !doc.referralCode) {
          const code = `REF${doc.id.slice(0, 6).toUpperCase()}`
          await req.payload.update({
            collection: 'members',
            id: doc.id,
            data: { referralCode: code },
          })
        }
        return doc
      },
    ],
  },
}

export default Members
