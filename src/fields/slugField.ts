import { Field } from 'payload'
import { generateSlug } from '../hooks/generateSlug'

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: false,
  unique: true,
  hooks: {
    beforeChange: [generateSlug],
  },
}
