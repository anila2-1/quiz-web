// src/collections/Quizzes.ts

import { CollectionConfig } from 'payload'

const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'active', 'questionsCount', 'updatedAt'],
  },
  access: {
    // Sabhi users blog ke saath quiz dekh sakte hain (lekin answers nahi)
    read: () => true,

    // Sirf w1techy8@gmail.com create, edit, delete kar sake
    create: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    update: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    delete: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    readVersions: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Quiz Title',
      admin: {
        description: 'Enter a clear and engaging title for the quiz.',
      },
    },

    {
      name: 'questions',
      type: 'array',
      label: 'Questions',
      minRows: 1,
      fields: [
        {
          name: 'questionText',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'options',
          type: 'array',
          label: 'Multiple Choice Options',
          minRows: 2,
          maxRows: 6,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Option Text',
            },
          ],
        },
        {
          name: 'correctAnswerIndex',
          type: 'number',
          required: true,
          label: 'Correct Answer Index',
          min: 0,
          admin: {
            description: 'Index (starting at 0) of the correct option from the list above.',
            condition: () => true,
            readOnly: false,
          },
        },
        {
          name: 'points',
          type: 'number',
          label: 'Points for Correct Answer',
          defaultValue: 10,
          min: 1,
          required: true,
          admin: {
            description: 'How many points user earns if correct.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterRead: [
      ({ doc, req }) => {
        // 🔐 Hide correct answers from non-admins
        if (req.user && req.user.email !== 'w1techy8@gmail.com') {
          doc.questions?.forEach((q: any) => {
            if (q.correctAnswerIndex !== undefined) {
              delete q.correctAnswerIndex
            }
          })
        }
        return doc
      },
    ],
  },
  timestamps: true,
}

export default Quizzes
