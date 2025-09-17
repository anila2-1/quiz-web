// src/app/(frontend)/dashboard/profile/page.tsx
import { getServerSideMember } from '@/lib/getServerSideUser.server'
import { redirect } from 'next/navigation'

import ProfileWrapper from './ProfileWrapper'

export default async function ProfilePage() {
  const member = await getServerSideMember()

  if (!member) {
    redirect('/auth/login')
  }

  return <ProfileWrapper member={member} />
}
