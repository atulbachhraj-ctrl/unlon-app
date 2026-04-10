'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const inputStyle = {
    fontFamily: 'var(--font-body)',
    background: 'rgba(255,243,236,0.05)',
    border: '1px solid rgba(255,120,70,0.1)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(255,120,70,0.4)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(255,120,70,0.1)';
  };

  const handleCreateAccount = () => {
    router.push('/verify');
  };

  return (
    <div
      className="min-h-dvh flex flex-col px-6 py-10"
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
                className="h-[50px] rounded-[14px] px-4 text-sm text-warm outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
                className="h-[50px] rounded-[14px] px-4 text-sm text-warm outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
              onFocus={handleFocus}
              onBlur={handleBlur}
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
                className="flex-1 h-[50px] rounded-[14px] px-4 text-sm text-warm outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
                className="w-full h-[50px] rounded-[14px] px-4 pr-12 text-sm text-warm outline-none transition-colors"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
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

          {/* Create Account button */}
          <button
            onClick={handleCreateAccount}
            className="w-full h-[52px] rounded-[50px] text-base font-bold text-white gradient-bg transition-transform active:scale-[0.97] mt-2"
            style={{
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 8px 32px rgba(255,80,32,0.25)',
            }}
          >
            Create Account
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
