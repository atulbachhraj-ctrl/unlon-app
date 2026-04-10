'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import { useAuth } from '@/lib/auth-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && profile) {
      const vibes = (profile as any).vibes;
      if (!vibes || (Array.isArray(vibes) && vibes.length === 0)) {
        router.push('/setup');
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '100dvh' }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(255,120,70,0.3)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center" style={{ minHeight: "100dvh" }}>
      <div className="w-full max-w-[430px] flex-1 relative">{children}</div>
      <BottomNav />
      <InstallPrompt />
    </div>
  );
}
