// src/app/(frontend)/dashboard/profile/page.tsx
import { getServerSideMember } from '@/lib/getServerSideUser.server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import Sidebar from '@/components/Sidebar';

export default async function ProfilePage() {
  const member = await getServerSideMember();

  if (!member) {
    redirect('/auth/login');
  }

  return (
    
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex">
        <div className="ml-64 p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
          <ProfileForm member={member} />
        </div>
      </div>
    </div>
  );
}