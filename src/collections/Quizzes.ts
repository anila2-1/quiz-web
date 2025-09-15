// src/collections/Quizzes.ts
import { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'active', 'questionsCount', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    readVersions: isAdmin,
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
      name: 'points',
      type: 'number',
      label: 'Points for Correct Answer',
      defaultValue: 10,
      min: 1,
      required: true,
      admin: {
        description: 'How many points users earn for each correct answer.',
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
      ],
    },
  ],
  hooks: {
    afterRead: [
      ({ doc, req }) => {
        // 🔐 Hide correct answers from non-admins
        if (req.user && !isAdmin({ req })) {
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
