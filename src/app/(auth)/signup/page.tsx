'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const inputStyle = {
    fontFamily: 'var(--font-body)',
    background: 'rgba(255,243,236,0.05)',
    border: '1px solid rgba(255,120,70,0.1)',
  };

  const handleCreateAccount = async () => {
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to our terms to continue');
      setIsLoading(false);
      return;
    }

    const displayName = [firstName, lastName].filter(Boolean).join(' ').trim();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || undefined,
          phone: phone || undefined,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Save consent timestamp to profile
    try {
      const { data: { user: newUser } } = await supabase.auth.getUser();
      if (newUser) {
        await supabase
          .from('profiles')
          .update({ accepted_terms_at: new Date().toISOString() })
          .eq('id', newUser.id);
      }
    } catch (e) {
      // Column may not exist yet — consent is still tracked client-side via the checkbox
      console.warn('Could not save consent timestamp:', e);
    }

    // Save email for verify page resend functionality
    localStorage.setItem('unlon_signup_email', email);
    router.push('/verify');
  };

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6 py-10"
      style={{
        background: 'linear-gradient(160deg, #1A0508, #0D0320, #1A0508)',
      }}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <span
            className="text-2xl font-extrabold gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            UNLON
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-[28px] font-bold text-warm mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Create your world
        </h1>
        <p
          className="text-sm mb-7"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
        >
          Join thousands already vibing on UNLON
        </p>

        {/* Error message */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-[14px] text-sm"
            style={{
              background: 'rgba(244,63,94,0.1)',
              border: '1px solid rgba(244,63,94,0.3)',
              color: '#fb7185',
              fontFamily: 'var(--font-body)',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Name row */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
              >
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                className="h-[50px] rounded-[14px] px-4 text-sm text-warm outline-none transition-all input-focus-ring"
                style={inputStyle}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
              >
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                className="h-[50px] rounded-[14px] px-4 text-sm text-warm outline-none transition-all input-focus-ring"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium"
              style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-[50px] rounded-[14px] px-4 text-sm text-warm outline-none transition-colors"
              style={inputStyle}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium"
              style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
            >
              Phone number
            </label>
            <div className="flex gap-2">
              <div
                className="h-[50px] rounded-[14px] px-4 flex items-center text-sm font-medium text-warm shrink-0"
                style={{
                  background: 'rgba(255,243,236,0.05)',
                  border: '1px solid rgba(255,120,70,0.1)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="flex-1 h-[50px] rounded-[14px] px-4 text-sm text-warm outline-none transition-all input-focus-ring"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium"
              style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full h-[50px] rounded-[14px] px-4 pr-12 text-sm text-warm outline-none transition-all input-focus-ring"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-base"
                style={{ color: 'rgba(255,243,236,0.4)' }}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Consent checkbox */}
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreedToTerms}
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className="mt-0.5 w-[20px] h-[20px] rounded-[6px] flex items-center justify-center shrink-0 transition-all duration-200"
                style={{
                  background: agreedToTerms
                    ? 'rgba(255,80,32,0.15)'
                    : 'rgba(255,243,236,0.05)',
                  border: agreedToTerms
                    ? '2px solid #FF7040'
                    : '2px solid rgba(255,243,236,0.15)',
                }}
              >
                {agreedToTerms && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="#FF7040"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
              >
                I agree to the{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  style={{ color: '#FF7040', textDecoration: 'underline' }}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  style={{ color: '#FF7040', textDecoration: 'underline' }}
                >
                  Privacy Policy
                </Link>
                , and I confirm I am 18 years or older
              </span>
            </label>
            <p
              className="text-[11px] pl-[32px]"
              style={{ color: 'rgba(255,243,236,0.3)', fontFamily: 'var(--font-body)' }}
            >
              By creating an account, you also agree to our{' '}
              <Link
                href="/guidelines"
                target="_blank"
                style={{ color: 'rgba(255,243,236,0.45)' }}
              >
                Community Guidelines
              </Link>
            </p>
          </div>

          {/* Create Account button */}
          <button
            onClick={handleCreateAccount}
            disabled={isLoading || !agreedToTerms}
            className="w-full h-[52px] rounded-[50px] text-base font-bold text-white gradient-bg transition-transform active:scale-[0.97] mt-2 disabled:opacity-50 disabled:active:scale-100"
            style={{
              fontFamily: 'var(--font-heading)',
              boxShadow: agreedToTerms ? '0 8px 32px rgba(255,80,32,0.25)' : 'none',
            }}
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,120,70,0.1)' }} />
          <span
            className="text-xs"
            style={{ color: 'rgba(255,243,236,0.3)', fontFamily: 'var(--font-body)' }}
          >
            OR
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,120,70,0.1)' }} />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => showToast('Social login coming soon!')}
            className="flex-1 h-[50px] rounded-[14px] flex items-center justify-center gap-2.5 text-sm font-medium text-warm transition-colors active:scale-[0.97]"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'rgba(255,243,236,0.05)',
              border: '1px solid rgba(255,120,70,0.1)',
            }}
          >
            <span className="text-lg">G</span>
            Google
          </button>
          <button
            onClick={() => showToast('Social login coming soon!')}
            className="flex-1 h-[50px] rounded-[14px] flex items-center justify-center gap-2.5 text-sm font-medium text-warm transition-colors active:scale-[0.97]"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'rgba(255,243,236,0.05)',
              border: '1px solid rgba(255,120,70,0.1)',
            }}
          >
            <span className="text-lg"></span>
            Apple
          </button>
        </div>

        {/* Bottom section */}
        <div className="mt-auto pt-6 flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="text-sm"
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
          >
            Already vibing?{' '}
            <span className="font-medium" style={{ color: '#FF7040' }}>
              Sign In
            </span>
          </Link>
          <p
            className="text-[11px] text-center leading-relaxed"
            style={{ color: 'rgba(255,243,236,0.25)', fontFamily: 'var(--font-body)' }}
          >
            By creating an account, you agree to our{' '}
            <span style={{ color: 'rgba(255,243,236,0.45)' }}>Terms of Service</span> and{' '}
            <span style={{ color: 'rgba(255,243,236,0.45)' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
