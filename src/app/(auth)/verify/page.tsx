'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    router.push('/home');
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
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
          📱
        </div>

        {/* Heading */}
        <h1
          className="text-[26px] font-bold text-warm mb-2 text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Verify your number
        </h1>
        <p
          className="text-sm text-center mb-10"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
        >
          We sent a code to{' '}
          <span style={{ color: 'rgba(255,243,236,0.7)' }}>+91 98XXX XXXXX</span>
        </p>

        {/* OTP inputs */}
        <div className="flex gap-3 mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-[64px] h-[64px] rounded-[16px] text-center text-2xl font-bold text-warm outline-none transition-all"
              style={{
                fontFamily: 'var(--font-heading)',
                background: digit
                  ? 'rgba(255,80,32,0.08)'
                  : 'rgba(255,243,236,0.05)',
                border: digit
                  ? '1.5px solid rgba(255,120,70,0.4)'
                  : '1.5px solid rgba(255,120,70,0.1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255,120,70,0.5)';
                e.target.style.background = 'rgba(255,80,32,0.08)';
              }}
              onBlur={(e) => {
                if (!digit) {
                  e.target.style.borderColor = 'rgba(255,120,70,0.1)';
                  e.target.style.background = 'rgba(255,243,236,0.05)';
                }
              }}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          className="w-full h-[52px] rounded-[50px] text-base font-bold text-white gradient-bg transition-transform active:scale-[0.97]"
          style={{
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 8px 32px rgba(255,80,32,0.25)',
          }}
        >
          Verify
        </button>

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
