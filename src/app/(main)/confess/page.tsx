"use client";

import { useState } from "react";

const confessions = [
  {
    text: "I moved to a new city 3 months ago and I still haven\u2019t made a single real friend. Everyone seems to have their groups already...",
    time: "12 min ago",
    reactions: { heart: 42, cry: 18, hug: 24, wow: 8 },
  },
  {
    text: "I pretend I\u2019m okay on video calls with my parents. They don\u2019t know how lonely it gets here.",
    time: "34 min ago",
    reactions: { heart: 89, cry: 56, hug: 73, wow: 12 },
  },
  {
    text: "I have a crush on someone at work but I\u2019m too scared they\u2019ll think I\u2019m weird if I talk to them",
    time: "1 hr ago",
    reactions: { heart: 67, cry: 9, hug: 45, wow: 31 },
  },
  {
    text: "Sometimes I drive around at 2am just so I don\u2019t feel the silence of my apartment",
    time: "2 hr ago",
    reactions: { heart: 124, cry: 88, hug: 61, wow: 19 },
  },
];

export default function ConfessPage() {
  const [confessionText, setConfessionText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  return (
    <div
      className="min-h-screen pb-24 relative overflow-y-auto"
      style={{ background: "#050810" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,48,112,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 pt-14 pb-2">
          <h1
            className="text-[28px] font-extrabold text-warm"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Confess 🤫
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "rgba(255,243,236,0.35)" }}
          >
            Anonymous. Safe. No judgment. Ever.
          </p>
        </div>

        {/* Write Confession Card */}
        <div className="mt-5 px-5">
          <div
            className="p-5"
            style={{
              background: "rgba(255,48,112,0.05)",
              border: "1px solid rgba(255,48,112,0.15)",
              borderRadius: "18px",
            }}
          >
            <label
              className="block text-[11px] font-bold tracking-[0.15em] mb-3"
              style={{ color: "rgba(255,48,112,0.7)" }}
            >
              YOUR CONFESSION
            </label>
            <textarea
              value={confessionText}
              onChange={(e) => setConfessionText(e.target.value)}
              placeholder="I've been wanting to tell someone..."
              rows={4}
              className="w-full bg-transparent text-warm text-[15px] leading-relaxed placeholder:text-[rgba(255,243,236,0.2)] outline-none resize-none"
              style={{ fontFamily: "var(--font-body)" }}
            />

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(255,48,112,0.1)]">
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className="flex items-center gap-2"
              >
                <div
                  className="w-10 h-[22px] rounded-full relative transition-all"
                  style={{
                    background: isAnonymous
                      ? "linear-gradient(135deg, #FF3070, #FF8098)"
                      : "rgba(255,243,236,0.1)",
                  }}
                >
                  <div
                    className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all"
                    style={{
                      left: isAnonymous ? "calc(100% - 19px)" : "3px",
                    }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: "rgba(255,243,236,0.5)" }}
                >
                  🔒 100% Anonymous
                </span>
              </button>

              <button
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #FF3070, #FF8098)",
                  opacity: confessionText.trim() ? 1 : 0.5,
                }}
                disabled={!confessionText.trim()}
              >
                Confess
              </button>
            </div>
          </div>
        </div>

        {/* Confession Feed */}
        <div className="mt-8 px-5">
          <h2
            className="text-base font-bold text-warm mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Latest Confessions
          </h2>

          <div className="flex flex-col gap-4">
            {confessions.map((confession, i) => (
              <div
                key={i}
                className="p-4"
                style={{
                  background: "rgba(255,48,112,0.04)",
                  border: "1px solid rgba(255,48,112,0.08)",
                  borderRadius: "18px",
                }}
              >
                {/* Avatar + Meta */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "rgba(255,48,112,0.12)" }}
                  >
                    🫥
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-warm">
                      Anonymous
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "rgba(255,243,236,0.25)" }}
                    >
                      · {confession.time}
                    </span>
                  </div>
                </div>

                {/* Confession Text */}
                <p
                  className="text-[14px] leading-relaxed italic mb-4"
                  style={{ color: "rgba(255,243,236,0.75)" }}
                >
                  &ldquo;{confession.text}&rdquo;
                </p>

                {/* Reaction Row */}
                <div className="flex items-center gap-3">
                  {[
                    { emoji: "❤️", count: confession.reactions.heart },
                    { emoji: "😢", count: confession.reactions.cry },
                    { emoji: "🤗", count: confession.reactions.hug },
                    { emoji: "😮", count: confession.reactions.wow },
                  ].map((reaction) => (
                    <button
                      key={reaction.emoji}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:scale-105"
                      style={{
                        background: "rgba(255,48,112,0.06)",
                        border: "1px solid rgba(255,48,112,0.08)",
                      }}
                    >
                      <span className="text-sm">{reaction.emoji}</span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "rgba(255,243,236,0.45)" }}
                      >
                        {reaction.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
