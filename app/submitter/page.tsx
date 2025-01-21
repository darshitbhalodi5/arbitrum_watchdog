'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import SubmitterDashboard from '@/components/submitter/SubmitterDashboard';

export default function SubmitterPage() {
  const router = useRouter();
  const { user, authenticated, ready } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1B1E]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ECDC4]"></div>
      </div>
    );
  }

  return <SubmitterDashboard />;
} 