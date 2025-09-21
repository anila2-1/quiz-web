// src/app/(frontend)/dashboard/profile/page.tsx
import { getServerSideMember } from '@/lib/getServerSideUser.server'
import { redirect } from 'next/navigation'
import ProfileWrapper from './ProfileWrapper'

// ✅ Enable static generation with revalidation
export const revalidate = 60 // Re-generate every 60 seconds

export default async function ProfilePage() {
  const member = await getServerSideMember()

  if (!member) {
    redirect('/auth/login')
  }

  return <ProfileWrapper member={member} />
}
