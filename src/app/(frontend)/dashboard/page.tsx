// src/app/(frontend)/dashboard/page.tsx
import ClientInteractivePart from './ClientInteractivePart'
import { getServerSideMember } from '@/lib/getServerSideUser.server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const member = await getServerSideMember()

  if (!member) {
    redirect('/auth/login')
  }

  return <ClientInteractivePart user={member} />
}
