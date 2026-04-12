"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-8 text-center" style={{ background: '#060104' }}>
      <p className="text-4xl mb-4">😵</p>
      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne',sans-serif", color: '#FFF3EC' }}>Something went wrong</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(255,243,236,0.35)' }}>Don't worry, it happens to the best of us</p>
      <button onClick={reset} className="px-8 py-3 rounded-full text-white font-bold gradient-bg" style={{ fontFamily: "'Syne',sans-serif" }}>Try Again</button>
    </div>
  );
}
