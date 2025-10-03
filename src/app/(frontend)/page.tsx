// src/app/(frontend)/page.tsx
import { generateMeta } from './../../utilities/generateMeta'
import HomePageClient from './HomePageClient'

// ✅ Allowed: top-level export in Server Component
export async function generateMetadata() {
  return generateMeta({ doc: null })
}

export default function HomePage() {
  return <HomePageClient />
}
