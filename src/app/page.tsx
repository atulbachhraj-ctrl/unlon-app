'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const avatarEmojis = ['😎', '🥳', '🔥', '💜', '✨'];
const avatarColors = ['#FF5020', '#FF3070', '#7B61FF', '#FFD000', '#FF7040'];

export default function SplashPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(155deg, #1C0906, #2E0D00, #1C0816)',
      }}
    >
    <div className="w-full max-w-[430px] flex flex-col items-center justify-center min-h-dvh px-6">
      {/* Radial glow overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,80,32,0.12), transparent 70%), radial-gradient(ellipse 40% 35% at 30% 70%, rgba(255,48,112,0.08), transparent 60%), radial-gradient(ellipse 35% 30% at 70% 60%, rgba(123,97,255,0.06), transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-2 w-full max-w-sm">
        {/* Logo */}
        <h1
          className="text-[56px] font-extrabold tracking-tight leading-none gradient-text"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          UNLON
        </h1>

        {/* Tagline */}
        <p
          className="text-lg font-semibold tracking-[0.25em] uppercase mt-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255,243,236,0.5)' }}
        >
          Solo No More
        </p>

        {/* Stacked avatar emojis */}
        <div className="flex items-center justify-center mt-10 mb-3">
          {avatarEmojis.map((emoji, i) => (
            <div
              key={i}
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg border-2 border-[#2E0D00]"
              style={{
                background: `linear-gradient(135deg, ${avatarColors[i]}33, ${avatarColors[i]}11)`,
                marginLeft: i > 0 ? '-10px' : '0',
                zIndex: avatarEmojis.length - i,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Live count */}
        <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.45)' }}>
          <span className="font-semibold" style={{ color: '#FF7040' }}>25,847</span> vibing right now
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center gap-4 mt-10 w-full">
          <Link
            href="/signup"
            className="w-full h-[54px] rounded-[50px] flex items-center justify-center text-base font-bold text-white gradient-bg transition-transform active:scale-[0.97]"
            style={{
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 8px 32px rgba(255,80,32,0.25)',
            }}
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="text-sm transition-colors"
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.45)' }}
          >
            Already vibing?{' '}
            <span className="font-medium" style={{ color: '#FF7040' }}>
              Sign In
            </span>
          </Link>

          <p style={{ color: 'rgba(255,243,236,0.2)', fontSize: '10px', marginTop: '20px' }}>
            <Link href="/terms" style={{ color: 'rgba(255,243,236,0.2)' }}>Terms</Link> · <Link href="/privacy" style={{ color: 'rgba(255,243,236,0.2)' }}>Privacy</Link> · <Link href="/guidelines" style={{ color: 'rgba(255,243,236,0.2)' }}>Guidelines</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
