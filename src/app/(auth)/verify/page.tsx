'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [timer, setTimer] = useState(30);
  const [checking, setChecking] = useState(false);

  // Get email from URL searchParams or localStorage
  const storedEmail =
    searchParams.get('email') ||
    (typeof window !== 'undefined' ? localStorage.getItem('unlon_signup_email') : null) ||
    '';

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleContinue = async () => {
    setChecking(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // Check if user has completed profile setup (vibes set)
      const { data: profile } = await supabase
        .from('profiles')
        .select('vibes')
        .eq('id', session.user.id)
        .single();

      setChecking(false);

      const hasVibes = profile?.vibes && Array.isArray(profile.vibes) && profile.vibes.length > 0;
      router.push(hasVibes ? '/home' : '/setup');
    } else {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    if (!storedEmail) {
      showToast('No email found. Please sign up again.');
      return;
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: storedEmail,
    });

    if (error) {
      showToast(error.message);
    } else {
      showToast('Verification email resent!');
    }

    setTimer(30);
  };

  const formatTime = (s: number) => `0:${s.toString().padStart(2, '0')}`;

  return (
    <div
      className="min-h-dvh flex flex-col px-6 py-12"
      style={{
        background: 'linear-gradient(160deg, #0D1A08, #1A0D08, #0D1A08)',
      }}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1 items-center">
        {/* Logo */}
        <div className="mb-12">
          <span
            className="text-2xl font-extrabold gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            UNLON
          </span>
        </div>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255,80,32,0.15), rgba(255,208,0,0.08))',
            border: '1px solid rgba(255,120,70,0.15)',
          }}
        >
          ✉️
        </div>

        {/* Heading */}
        <h1
          className="text-[26px] font-bold text-warm mb-2 text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Check your email
        </h1>
        <p
          className="text-sm text-center mb-10"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
        >
          We sent a verification link to your email.{' '}
          <span style={{ color: 'rgba(255,243,236,0.7)' }}>Click it to confirm your account.</span>
        </p>

        {/* Continue to App button */}
        <button
          onClick={handleContinue}
          disabled={checking}
          className="w-full h-[52px] rounded-[50px] text-base font-bold text-white gradient-bg transition-transform active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
          style={{
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 8px 32px rgba(255,80,32,0.25)',
          }}
        >
          {checking ? 'Checking...' : 'Continue to App'}
        </button>

        <p
          className="text-xs text-center mt-4"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.3)' }}
        >
          Verified your email? Tap above to continue.
        </p>

        {/* Resend */}
        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p
              className="text-sm"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.35)' }}
            >
              Resend code in{' '}
              <span style={{ color: '#FF7040' }}>{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm font-medium"
              style={{ fontFamily: 'var(--font-body)', color: '#FF7040' }}
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
