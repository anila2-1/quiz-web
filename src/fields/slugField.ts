// src/fields/slugField.ts
export const slugField = {
  name: 'slug',
  type: 'text',
  label: 'Slug',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
  },
}