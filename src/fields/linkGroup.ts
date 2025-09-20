import type { Field } from 'payload'

export const linkGroup = ({
  appearances = ['default', 'outline'],
  overrides = {},
}: {
  appearances?: string[]
  overrides?: Partial<Field>
} = {}): Field => {
  return {
    name: 'links',
    type: 'array',
    maxRows: 2,
    fields: [
      {
        name: 'link',
        type: 'group',
        fields: [
          {
            name: 'type',
            type: 'radio',
            options: [
              {
                label: 'Internal Link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
            },
          },
          {
            name: 'newTab',
            type: 'checkbox',
            label: 'Open in new tab',
          },
          {
            name: 'reference',
            type: 'relationship',
            relationTo: ['pages', 'blogs'],
            required: true,
            maxDepth: 1,
            admin: {
              condition: (_data, siblingData) => siblingData?.type === 'reference',
            },
          },
          {
            name: 'url',
            type: 'text',
            required: true,
            admin: {
              condition: (_data, siblingData) => siblingData?.type === 'custom',
            },
          },
          {
            name: 'label',
            type: 'text',
            required: true,
          },
          {
            name: 'appearance',
            type: 'select',
            defaultValue: 'default',
            options: appearances.map((appearance) => ({
              label: appearance,
              value: appearance,
            })),
          },
        ],
      },
    ],
    ...overrides,
  } as Field
}
