"use client";

import Link from "next/link";

const vibes = [
  { emoji: "🎵", label: "Music" },
  { emoji: "📸", label: "Photography" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "💻", label: "Coding" },
  { emoji: "📚", label: "Books" },
];

const settingsItems = [
  { emoji: "👑", label: "Unlon Premium", href: "/premium", color: "rgba(255,208,0,0.15)", iconColor: "#FFD000" },
  { emoji: "✏️", label: "Edit Profile", href: "#", color: "rgba(255,112,64,0.15)", iconColor: "#FF7040" },
  { emoji: "🔔", label: "Notifications", href: "#", color: "rgba(255,80,32,0.15)", iconColor: "#FF5020" },
  { emoji: "🔒", label: "Privacy", href: "#", color: "rgba(139,92,246,0.15)", iconColor: "#8B5CF6" },
  { emoji: "🌙", label: "Late Night Mode", href: "/night", color: "rgba(123,97,255,0.15)", iconColor: "#7B61FF" },
  { emoji: "💬", label: "Messages", href: "/chats", color: "rgba(255,48,112,0.15)", iconColor: "#FF3070" },
  { emoji: "❓", label: "Help & Support", href: "#", color: "rgba(255,160,64,0.15)", iconColor: "#FFA040" },
  { emoji: "🚪", label: "Sign Out", href: "#", color: "rgba(255,48,112,0.1)", iconColor: "#FF3070", isSignOut: true },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-screen pb-24">
      {/* Cover area with gradient overlay */}
      <div
        className="relative h-40 w-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,80,32,0.3), rgba(255,48,112,0.2), rgba(139,92,246,0.15))",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 40%, #0D0509 100%)",
          }}
        />
      </div>

      {/* Profile avatar — overlapping cover */}
      <div className="relative z-10 flex flex-col items-center -mt-14">
        <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-sunset via-coral to-gold">
          <div className="w-full h-full rounded-full bg-screen flex items-center justify-center text-5xl">
            😊
          </div>
        </div>

        {/* Name + handle */}
        <h1
          className="text-2xl font-bold text-warm mt-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Alex
        </h1>
        <p className="text-sm text-muted mt-0.5">@alex_vibes</p>

        {/* Stats row */}
        <div className="flex items-center gap-5 mt-4">
          {[
            { value: "127", label: "connections" },
            { value: "42", label: "vibes" },
            { value: "15", label: "rooms" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <div className="w-px h-4 bg-[rgba(255,243,236,0.1)] -ml-2.5 mr-2.5" />
              )}
              <span className="text-sm font-semibold text-warm">{stat.value}</span>
              <span className="text-xs text-muted">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-warm2 mt-4 text-center px-8">
          Exploring the world one sunset at a time 🌅
        </p>
      </div>

      {/* My Vibes section */}
      <div className="mt-6 px-5">
        <h2
          className="text-base font-bold text-warm mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Vibes
        </h2>
        <div className="flex flex-wrap gap-2">
          {vibes.map((vibe) => (
            <span
              key={vibe.label}
              className="px-4 py-2 rounded-full text-sm font-medium text-warm"
              style={{
                background: "rgba(255,112,64,0.1)",
                border: "1px solid rgba(255,112,64,0.15)",
              }}
            >
              {vibe.emoji} {vibe.label}
            </span>
          ))}
        </div>
      </div>

      {/* Settings section */}
      <div className="mt-6 px-5">
        <h2
          className="text-base font-bold text-warm mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Settings
        </h2>
        <div className="flex flex-col gap-2">
          {settingsItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-[rgba(255,120,70,0.08)] active:scale-[0.98] transition-transform"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: item.color }}
              >
                {item.emoji}
              </div>
              <span
                className={`flex-1 text-[15px] font-medium ${
                  item.isSignOut ? "text-rose" : "text-warm"
                }`}
              >
                {item.label}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-muted flex-shrink-0"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
