'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div
      className="min-h-dvh flex flex-col px-6 py-12"
      style={{
        background: 'linear-gradient(160deg, #050D1A, #1A0508, #050D1A)',
      }}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">
        {/* Logo */}
        <div className="flex justify-center mb-10">
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
          Welcome back
        </h1>
        <p
          className="text-sm mb-8"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
        >
          Sign in to continue vibing
        </p>

        {/* Form */}
        <div className="flex flex-col gap-4">
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
              style={{
                fontFamily: 'var(--font-body)',
                background: 'rgba(255,243,236,0.05)',
                border: '1px solid rgba(255,120,70,0.1)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255,120,70,0.4)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,120,70,0.1)')}
            />
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
                placeholder="Enter your password"
                className="w-full h-[50px] rounded-[14px] px-4 pr-12 text-sm text-warm outline-none transition-colors"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'rgba(255,243,236,0.05)',
                  border: '1px solid rgba(255,120,70,0.1)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(255,120,70,0.4)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,120,70,0.1)')}
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

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              className="text-xs font-medium"
              style={{ color: '#FF7040', fontFamily: 'var(--font-body)' }}
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In button */}
          <button
            className="w-full h-[52px] rounded-[50px] text-base font-bold text-white gradient-bg transition-transform active:scale-[0.97] mt-2"
            style={{
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 8px 32px rgba(255,80,32,0.25)',
            }}
          >
            Sign In
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-4 my-7">
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

        {/* Bottom link */}
        <div className="mt-auto pt-8 text-center">
          <Link
            href="/signup"
            className="text-sm"
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
          >
            New here?{' '}
            <span className="font-medium" style={{ color: '#FF7040' }}>
              Create Account
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
