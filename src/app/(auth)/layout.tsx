'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      const hasVibes =
        profile?.vibes &&
        Array.isArray((profile as any).vibes) &&
        ((profile as any).vibes as unknown[]).length > 0;

      router.replace(hasVibes ? '/home' : '/setup');
    }
  }, [user, profile, loading, router]);

  // Show spinner while loading auth state
  if (loading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{
          background: 'linear-gradient(160deg, #1A0508, #0D0320, #1A0508)',
        }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(255,120,70,0.3)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  // If user is logged in, don't render children (redirect is happening)
  if (user) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{
          background: 'linear-gradient(160deg, #1A0508, #0D0320, #1A0508)',
        }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(255,120,70,0.3)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  // Not logged in -- show auth pages
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="w-full max-w-[420px] mx-auto">{children}</div>
    </div>
  );
}
