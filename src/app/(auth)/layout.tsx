'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isSetupPage = pathname === '/setup';

  const hasVibes =
    profile?.vibes &&
    Array.isArray((profile as any).vibes) &&
    ((profile as any).vibes as unknown[]).length > 0;

  useEffect(() => {
    if (loading) return;

    if (user) {
      // If user has completed setup (has vibes), redirect to home from any auth page
      if (hasVibes) {
        router.replace('/home');
        return;
      }
      // If user hasn't completed setup and is NOT on setup page, redirect to setup
      if (!isSetupPage) {
        router.replace('/setup');
      }
      // If on setup page with no vibes — let them through (don't redirect)
    }
  }, [user, profile, loading, router, hasVibes, isSetupPage]);

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

  // If user is logged in and has completed setup, show spinner while redirecting to /home
  if (user && hasVibes) {
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

  // If user is logged in but on setup page (no vibes) — render setup page
  if (user && isSetupPage) {
    return <>{children}</>;
  }

  // If user is logged in but not on setup and no vibes — show spinner while redirecting
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

  // Not logged in -- show auth pages (login, signup, verify)
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="w-full max-w-[420px] mx-auto">{children}</div>
    </div>
  );
}
