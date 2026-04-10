"use client";

const nightOwls = [
  { emoji: "😔", name: "Anonymous", status: "Can\u2019t sleep", city: "Mumbai" },
  {
    emoji: "🎵",
    name: "Music Soul",
    status: "Listening to sad songs",
    city: "Delhi",
  },
  {
    emoji: "📖",
    name: "Night Reader",
    status: "Reading at 2am",
    city: "Bangalore",
  },
  {
    emoji: "🌙",
    name: "Star Gazer",
    status: "On the terrace",
    city: "Pune",
  },
  {
    emoji: "🎨",
    name: "Night Artist",
    status: "Drawing at midnight",
    city: "Chennai",
  },
];

export default function NightPage() {
  return (
    <div
      className="min-h-screen pb-24 relative overflow-y-auto"
      style={{
        background: "linear-gradient(155deg, #0A0520, #15081A, #0A0516)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 10%, rgba(123,97,255,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="px-5 pt-14 pb-2 text-center">
          {/* Moon with glow */}
          <div className="relative inline-block mb-4">
            <div
              className="text-6xl"
              style={{
                filter: "drop-shadow(0 0 24px rgba(123,97,255,0.4))",
              }}
            >
              🌙
            </div>
          </div>

          <h1
            className="text-[28px] font-extrabold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Late Night Mode
          </h1>
          <p
            className="text-[15px] mt-2 leading-relaxed"
            style={{ color: "rgba(255,243,236,0.55)" }}
          >
            After 11pm everything shifts.
            <br />
            Deeper. Quieter. More real.
          </p>
          <p
            className="text-sm mt-3"
            style={{ color: "rgba(255,243,236,0.3)" }}
          >
            847 night owls are awake with you right now.
          </p>
        </div>

        {/* Tonight's Question Card */}
        <div className="mt-6 px-5">
          <div
            className="p-5"
            style={{
              background: "rgba(123,97,255,0.08)",
              border: "1px solid rgba(123,97,255,0.18)",
              borderRadius: "18px",
            }}
          >
            <span
              className="block text-[11px] font-bold tracking-[0.15em] mb-3"
              style={{ color: "rgba(123,97,255,0.7)" }}
            >
              TONIGHT&apos;S QUESTION
            </span>
            <p
              className="text-[17px] font-semibold text-warm leading-snug mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              If you could go back and change one moment in your life &mdash;
              would you? And why not?
            </p>
            <button
              className="w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #7B61FF, #8B5CF6)",
              }}
            >
              Share your answer anonymously 🌙
            </button>
          </div>
        </div>

        {/* Awake Right Now Section */}
        <div className="mt-8 px-5">
          <h2
            className="text-base font-bold text-warm mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Awake right now 🌙
          </h2>

          <div className="flex flex-col gap-3">
            {nightOwls.map((owl, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4"
                style={{
                  background: "rgba(123,97,255,0.05)",
                  border: "1px solid rgba(123,97,255,0.1)",
                  borderRadius: "18px",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "rgba(123,97,255,0.12)" }}
                >
                  {owl.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-warm">
                      {owl.name}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "rgba(255,243,236,0.25)" }}
                    >
                      · {owl.city}
                    </span>
                  </div>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,243,236,0.4)" }}
                  >
                    {owl.status}
                  </p>
                </div>

                {/* Talk Button */}
                <button
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #7B61FF, #8B5CF6)",
                  }}
                >
                  Talk 🌙
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
