// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

import { Banner } from './blocks/Banner/config'
import { CallToAction } from './blocks/CallToAction/config'
import { Archive } from './blocks/ArchiveBlock/config'
import { Content } from './blocks/Content/config'
import { FormBlock } from './blocks/Form/config'
import { MediaBlock } from './blocks/MediaBlock/config'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import Users from './collections/Users'
import { Media } from './collections/Media'
import Blogs from './collections/Blogs'
import Quizzes from './collections/Quizzes'
import Withdrawals from './collections/Withdrawals'
import Members from './collections/Members'
import Pages from './collections/Pages'
import { Categories } from './collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Blogs, Members, Quizzes, Withdrawals, Categories],
  editor: lexicalEditor(),

  blocks: [Banner, CallToAction, Archive, Content, FormBlock, MediaBlock],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // database-adapter-config-start
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  // database-adapter-config-end
  sharp,
  plugins: [
    payloadCloudPlugin(),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
    }),
    // storage-adapter-placeholder
    vercelBlobStorage({
      cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN || '',
    }),
  ],
})
