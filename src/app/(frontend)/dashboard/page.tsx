import ClientInteractivePart from './ClientInteractivePart';

// src/app/(frontend)/dashboard/page.tsx
import { getServerSideMember } from '@/lib/getServerSideUser.server';
import { redirect } from 'next/navigation';


export default async function DashboardPage() {
  const member = await getServerSideMember();

  if (!member) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
  <ClientInteractivePart user={member} />
</div>

  );
}