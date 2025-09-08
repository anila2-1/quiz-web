// src/globals/SiteSettings.ts

import { GlobalConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { updateSEOTitle } from '../hooks/updateSEOTitle'; // ✅ Import hook

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    // Just admin can edit
    read: () => true, // (frontend )
    update: isAdmin,  // just admin edit
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      label: 'Site Title',
      defaultValue: 'Learn & Earn Quiz Platform',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      defaultValue: 'Learn, Quiz, Earn Points, Withdraw USDT',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          defaultValue: 'Learn & Earn Quiz Platform',
          hooks: {
            beforeChange: [updateSEOTitle], // ✅ Hook lag gaya
          },
        },
  ],
},
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon (32x32)',
      admin: {
        description: 'Upload a 32x32 PNG image for favicon',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (Light)',
      admin: {
        description: 'Main logo for light backgrounds',
      },
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (Dark)',
      admin: {
        description: 'Optional: Logo for dark mode or backgrounds',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter / X URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube Channel URL',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
        },
      ],
    },
    {
      name: 'footerText',
      type: 'textarea',
      label: 'Footer Text',
      defaultValue: '© 2025 Learn & Earn Quiz Platform. All rights reserved.',
    },
    {
      name: 'minWithdrawalPoints',
      type: 'number',
      label: 'Minimum Withdrawal Points',
      defaultValue: 500,
      min: 100,
      admin: {
        description: 'User must have at least this many points to request withdrawal',
      },
    },
    {
      name: 'referralPoints',
      type: 'number',
      label: 'Referral Bonus Points',
      defaultValue: 100,
      min: 1,
      admin: {
        description: 'Points awarded to referrer when someone signs up via their link',
      },
    },
    {
      name: 'quizPointsPerCorrect',
      type: 'number',
      label: 'Points per Correct Answer',
      defaultValue: 10,
      min: 1,
      admin: {
        description: 'Default points awarded for each correct quiz answer',
      },
    },
    {
      name: 'announcement',
      type: 'richText',
      label: 'Announcement Bar',
      admin: {
        description: 'Show a banner at the top of the site (optional)',
      },
    },
  ],
  admin: {
    description: 'Global settings for the entire site',
  },
};
export default SiteSettings;