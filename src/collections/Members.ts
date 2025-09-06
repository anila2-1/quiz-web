import { CollectionConfig } from 'payload';

const Members: CollectionConfig = {
  slug: 'members',
  auth: true,
  admin: {
    hidden: false,
    group: 'Members',
    useAsTitle: 'username',
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
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
      name: 'wallet',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'totalPoints',
      type: 'number',
      defaultValue: 0,
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
    
    {
      name: 'completedBlogs',
      type: 'array',
      label: 'Completed Articles',
      fields: [
        {
          name: 'blog',
          type: 'relationship',
          relationTo: 'blogs',
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
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' && !doc.referralCode) {
          const code = `REF${doc.id.slice(0, 6).toUpperCase()}`;
          await req.payload.update({
            collection: 'members',
            id: doc.id,
            data: { referralCode: code },
          });
        }
        return doc;
      },
    ],
  },
};

export default Members;