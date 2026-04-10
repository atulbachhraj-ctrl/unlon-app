'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

const AVATARS = ['😊', '😎', '🤗', '😄', '🥰', '😇', '🤓', '😏', '🙃', '😌', '🤩', '😋'];

const VIBES = [
  { emoji: '🎵', label: 'Music' },
  { emoji: '📸', label: 'Photography' },
  { emoji: '✈️', label: 'Travel' },
  { emoji: '💻', label: 'Coding' },
  { emoji: '📚', label: 'Books' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '🏋️', label: 'Fitness' },
  { emoji: '🍕', label: 'Food' },
  { emoji: '🎬', label: 'Movies' },
  { emoji: '💃', label: 'Dance' },
  { emoji: '✍️', label: 'Poetry' },
  { emoji: '🚀', label: 'StartUp' },
  { emoji: '🎌', label: 'Anime' },
  { emoji: '☕', label: 'Coffee' },
  { emoji: '🌿', label: 'Nature' },
  { emoji: '😂', label: 'Comedy' },
];

const AGES = Array.from({ length: 11 }, (_, i) => 18 + i);

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur'];

export default function SetupPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  // Form state
  const [avatar, setAvatar] = useState('');
  const [vibes, setVibes] = useState<string[]>([]);
  const [age, setAge] = useState<number | null>(null);
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  // Celebration animation
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (step === 4) {
      setTimeout(() => setShowCelebration(true), 100);
    }
  }, [step]);

  const goNext = () => {
    setDirection('forward');
    setStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => {
    setDirection('back');
    setStep((s) => Math.max(s - 1, 1));
  };

  const toggleVibe = (label: string) => {
    setVibes((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
    );
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_emoji: avatar,
        vibes,
        age,
        city: city.trim(),
        bio: bio.trim(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      console.error('Error saving profile:', error);
      return;
    }

    router.push('/home');
  };

  const displayName = profile?.display_name || user?.user_metadata?.display_name || 'Friend';

  const progressWidth = `${(step / 4) * 100}%`;

  return (
    <div
      className="min-h-dvh flex flex-col px-6 py-8"
      style={{
        background: 'linear-gradient(160deg, #1A0808, #08081A, #1A0808)',
      }}
    >
      <div className="w-full max-w-[430px] mx-auto flex flex-col flex-1">
        {/* Progress bar */}
        <div className="w-full h-[4px] rounded-full mb-8" style={{ background: 'rgba(255,243,236,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: progressWidth,
              background: 'linear-gradient(135deg, #FF5020, #FFD000)',
            }}
          />
        </div>

        {/* Back button for steps 2-3 */}
        {step > 1 && step < 4 && (
          <button
            onClick={goBack}
            className="self-start mb-4 text-sm flex items-center gap-1.5 transition-opacity active:opacity-60"
            style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
          >
            <span style={{ fontSize: '16px' }}>&#8592;</span> Back
          </button>
        )}

        {/* Step content with transitions */}
        <div
          className="flex-1 flex flex-col"
          key={step}
          style={{
            animation: `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.35s ease-out`,
          }}
        >
          {step === 1 && (
            <Step1Avatar avatar={avatar} setAvatar={setAvatar} onNext={goNext} />
          )}
          {step === 2 && (
            <Step2Vibes vibes={vibes} toggleVibe={toggleVibe} onNext={goNext} />
          )}
          {step === 3 && (
            <Step3Details
              age={age}
              setAge={setAge}
              city={city}
              setCity={setCity}
              bio={bio}
              setBio={setBio}
              onNext={goNext}
            />
          )}
          {step === 4 && (
            <Step4Done
              avatar={avatar}
              displayName={displayName}
              vibes={vibes}
              showCelebration={showCelebration}
              saving={saving}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes celebrationPop {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(60px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Step 1: Avatar ─── */
function Step1Avatar({
  avatar,
  setAvatar,
  onNext,
}: {
  avatar: string;
  setAvatar: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <>
      <h1
        className="text-[28px] font-bold text-warm mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Pick your avatar
      </h1>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
      >
        Choose a face that represents you
      </p>

      <div className="grid grid-cols-4 gap-3 mb-auto">
        {AVATARS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => setAvatar(emoji)}
            className="aspect-square rounded-[18px] flex items-center justify-center text-3xl transition-all duration-200 active:scale-95"
            style={{
              background:
                avatar === emoji
                  ? 'rgba(255,80,32,0.12)'
                  : 'rgba(255,243,236,0.04)',
              border:
                avatar === emoji
                  ? '2px solid transparent'
                  : '1.5px solid rgba(255,243,236,0.06)',
              backgroundClip: avatar === emoji ? 'padding-box' : undefined,
              boxShadow:
                avatar === emoji
                  ? '0 0 0 2px #FF5020, 0 0 16px rgba(255,80,32,0.2)'
                  : 'none',
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={onNext}
          disabled={!avatar}
          className="w-full h-[52px] rounded-[50px] text-base font-bold text-white gradient-bg transition-all active:scale-[0.97] disabled:opacity-30 disabled:active:scale-100"
          style={{
            fontFamily: 'var(--font-heading)',
            boxShadow: avatar ? '0 8px 32px rgba(255,80,32,0.25)' : 'none',
          }}
        >
          Next
        </button>
      </div>
    </>
  );
}

/* ─── Step 2: Vibes ─── */
function Step2Vibes({
  vibes,
  toggleVibe,
  onNext,
}: {
  vibes: string[];
  toggleVibe: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <>
      <h1
        className="text-[28px] font-bold text-warm mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        What&apos;s your vibe?
      </h1>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
      >
        Pick at least 3 things you love
      </p>

      <div className="flex flex-wrap gap-2.5 mb-auto">
        {VIBES.map(({ emoji, label }) => {
          const selected = vibes.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggleVibe(label)}
              className="h-[40px] px-4 rounded-full flex items-center gap-1.5 text-sm font-medium transition-all duration-200 active:scale-95"
              style={{
                fontFamily: 'var(--font-body)',
                background: selected
                  ? 'linear-gradient(135deg, #FF5020, #FFD000)'
                  : 'rgba(255,243,236,0.05)',
                border: selected
                  ? 'none'
                  : '1px solid rgba(255,243,236,0.08)',
                color: selected ? '#fff' : 'rgba(255,243,236,0.7)',
                boxShadow: selected
                  ? '0 4px 16px rgba(255,80,32,0.25)'
                  : 'none',
              }}
            >
              <span>{emoji}</span> {label}
            </button>
          );
        })}
      </div>

      <p
        className="text-xs mt-6 mb-3 text-center"
        style={{
          fontFamily: 'var(--font-body)',
          color: vibes.length >= 3 ? 'rgba(255,208,0,0.6)' : 'rgba(255,243,236,0.3)',
        }}
      >
        {vibes.length}/3 selected {vibes.length >= 3 ? '-- nice picks!' : ''}
      </p>

      <button
        onClick={onNext}
        disabled={vibes.length < 3}
        className="w-full h-[52px] rounded-[50px] text-base font-bold text-white gradient-bg transition-all active:scale-[0.97] disabled:opacity-30 disabled:active:scale-100"
        style={{
          fontFamily: 'var(--font-heading)',
          boxShadow: vibes.length >= 3 ? '0 8px 32px rgba(255,80,32,0.25)' : 'none',
        }}
      >
        Next
      </button>
    </>
  );
}

/* ─── Step 3: Details ─── */
function Step3Details({
  age,
  setAge,
  city,
  setCity,
  bio,
  setBio,
  onNext,
}: {
  age: number | null;
  setAge: (v: number | null) => void;
  city: string;
  setCity: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  onNext: () => void;
}) {
  const canProceed = age !== null && city.trim().length > 0;

  return (
    <>
      <h1
        className="text-[28px] font-bold text-warm mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Almost there
      </h1>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,243,236,0.4)' }}
      >
        Just a few more details about you
      </p>

      {/* Age selector */}
      <div className="mb-6">
        <label
          className="text-xs font-medium mb-3 block"
          style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
        >
          Your age
        </label>
        <div className="grid grid-cols-6 gap-2">
          {AGES.map((a) => (
            <button
              key={a}
              onClick={() => setAge(a)}
              className="h-[42px] rounded-[12px] text-sm font-medium transition-all duration-200 active:scale-95"
              style={{
                fontFamily: 'var(--font-body)',
                background:
                  age === a
                    ? 'linear-gradient(135deg, #FF5020, #FFD000)'
                    : 'rgba(255,243,236,0.05)',
                border:
                  age === a ? 'none' : '1px solid rgba(255,243,236,0.06)',
                color: age === a ? '#fff' : 'rgba(255,243,236,0.6)',
                boxShadow:
                  age === a ? '0 4px 12px rgba(255,80,32,0.2)' : 'none',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* City input */}
      <div className="mb-2">
        <label
          className="text-xs font-medium mb-3 block"
          style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
        >
          Your city
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Where are you based?"
          className="w-full h-[50px] rounded-[14px] px-4 text-sm text-warm outline-none transition-all input-focus-ring"
          style={{
            fontFamily: 'var(--font-body)',
            background: 'rgba(255,243,236,0.05)',
            border: '1px solid rgba(255,120,70,0.1)',
          }}
        />
      </div>

      {/* City suggestion pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CITIES.map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className="h-[30px] px-3 rounded-full text-xs font-medium transition-all active:scale-95"
            style={{
              fontFamily: 'var(--font-body)',
              background:
                city === c
                  ? 'rgba(255,80,32,0.15)'
                  : 'rgba(255,243,236,0.04)',
              border:
                city === c
                  ? '1px solid rgba(255,80,32,0.4)'
                  : '1px solid rgba(255,243,236,0.06)',
              color:
                city === c
                  ? '#FF7040'
                  : 'rgba(255,243,236,0.4)',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Bio textarea */}
      <div className="mb-auto">
        <label
          className="text-xs font-medium mb-3 block"
          style={{ color: 'rgba(255,243,236,0.5)', fontFamily: 'var(--font-body)' }}
        >
          Short bio{' '}
          <span style={{ color: 'rgba(255,243,236,0.25)' }}>({bio.length}/150)</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => {
            if (e.target.value.length <= 150) setBio(e.target.value);
          }}
          placeholder="Tell people what makes you... you ✨"
          rows={3}
          className="w-full rounded-[14px] px-4 py-3 text-sm text-warm outline-none resize-none transition-all input-focus-ring"
          style={{
            fontFamily: 'var(--font-body)',
            background: 'rgba(255,243,236,0.05)',
            border: '1px solid rgba(255,120,70,0.1)',
          }}
        />
      </div>

      <div className="mt-6">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full h-[52px] rounded-[50px] text-base font-bold text-white gradient-bg transition-all active:scale-[0.97] disabled:opacity-30 disabled:active:scale-100"
          style={{
            fontFamily: 'var(--font-heading)',
            boxShadow: canProceed ? '0 8px 32px rgba(255,80,32,0.25)' : 'none',
          }}
        >
          Next
        </button>
      </div>
    </>
  );
}

/* ─── Step 4: Celebration ─── */
function Step4Done({
  avatar,
  displayName,
  vibes,
  showCelebration,
  saving,
  onFinish,
}: {
  avatar: string;
  displayName: string;
  vibes: string[];
  showCelebration: boolean;
  saving: boolean;
  onFinish: () => void;
}) {
  const vibeMap = Object.fromEntries(VIBES.map((v) => [v.label, v.emoji]));

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center">
      {/* Confetti-like decorations */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🎉', '🔥', '💫', '✨', '🎊', '💥'].map((e, i) => (
            <span
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${15 + i * 14}%`,
                top: '-10px',
                animation: `confettiFall ${1.5 + i * 0.2}s ease-out ${i * 0.1}s forwards`,
              }}
            >
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Big avatar */}
      <div
        className="mb-6"
        style={{
          animation: showCelebration ? 'celebrationPop 0.6s ease-out' : 'none',
        }}
      >
        <div
          className="w-[100px] h-[100px] rounded-full flex items-center justify-center text-[52px]"
          style={{
            background: 'rgba(255,80,32,0.1)',
            boxShadow: '0 0 0 3px #FF5020, 0 0 40px rgba(255,80,32,0.2)',
          }}
        >
          {avatar}
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-[30px] font-bold mb-2"
        style={{
          fontFamily: 'var(--font-heading)',
          animation: showCelebration ? 'fadeUp 0.5s ease-out 0.2s both' : 'none',
        }}
      >
        <span className="gradient-text">You&apos;re in!</span>{' '}
        <span>🔥</span>
      </h1>

      {/* Name */}
      <p
        className="text-lg text-warm font-medium mb-6"
        style={{
          fontFamily: 'var(--font-heading)',
          animation: showCelebration ? 'fadeUp 0.5s ease-out 0.3s both' : 'none',
        }}
      >
        Welcome, {displayName}
      </p>

      {/* Selected vibes */}
      <div
        className="flex flex-wrap justify-center gap-2 mb-10 max-w-[320px]"
        style={{
          animation: showCelebration ? 'fadeUp 0.5s ease-out 0.4s both' : 'none',
        }}
      >
        {vibes.map((v) => (
          <span
            key={v}
            className="h-[32px] px-3 rounded-full flex items-center gap-1 text-xs font-medium"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'rgba(255,80,32,0.1)',
              border: '1px solid rgba(255,80,32,0.2)',
              color: '#FF7040',
            }}
          >
            {vibeMap[v] || ''} {v}
          </span>
        ))}
      </div>

      {/* Start button */}
      <div
        className="w-full"
        style={{
          animation: showCelebration ? 'fadeUp 0.5s ease-out 0.5s both' : 'none',
        }}
      >
        <button
          onClick={onFinish}
          disabled={saving}
          className="w-full h-[56px] rounded-[50px] text-lg font-bold text-white transition-all active:scale-[0.97] disabled:opacity-60"
          style={{
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #FF3070, #FF7040)',
            boxShadow: '0 8px 32px rgba(255,48,112,0.3)',
          }}
        >
          {saving ? 'Setting up...' : 'Start Vibing'}
        </button>
      </div>
    </div>
  );
}
