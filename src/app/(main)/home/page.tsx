"use client";

import { useState } from "react";

const vibes = [
  { label: "All Vibes", emoji: "" },
  { label: "Music", emoji: "🎵" },
  { label: "Art", emoji: "📸" },
  { label: "Travel", emoji: "🧳" },
  { label: "Code", emoji: "💻" },
  { label: "Books", emoji: "📚" },
  { label: "Gaming", emoji: "🎮" },
];

const stories = [
  { name: "Priya", emoji: "👩‍🦱" },
  { name: "Aryan", emoji: "🧑" },
  { name: "Sofia", emoji: "👩" },
  { name: "Dev", emoji: "🧑‍💻" },
  { name: "Maya", emoji: "👧" },
];

const feedCards = [
  {
    name: "Priya",
    age: 23,
    location: "Mumbai",
    badge: "92% match",
    badgeType: "match" as const,
    emoji: "👩‍🦱",
    text: "Looking for someone to explore cafes in Mumbai this weekend 🌿",
  },
  {
    name: "Aryan",
    age: 25,
    location: "Delhi",
    badge: "New",
    badgeType: "new" as const,
    emoji: "🧑",
    text: "Anyone into midnight drives and deep conversations? 🌃",
  },
  {
    name: "Sofia",
    age: 22,
    location: "Bangalore",
    badge: "88% match",
    badgeType: "match" as const,
    emoji: "👩",
    text: "Need a coding buddy for hackathons 💻",
  },
  {
    name: "Dev",
    age: 24,
    location: "Pune",
    badge: "95% match",
    badgeType: "match" as const,
    emoji: "🧑‍💻",
    text: "Let's jam together sometime — guitar, keys, anything goes 🎸",
  },
];

export default function HomePage() {
  const [activeVibe, setActiveVibe] = useState(0);

  return (
    <div className="min-h-screen bg-bg pb-28">
      {/* Ambient glow */}
      <div className="ambient-glow" />

      <div className="relative z-10">
        {/* Top Bar */}
        <div className="flex items-start justify-between px-5 pt-14 pb-2">
          <div>
            <p className="text-sm text-muted font-body">Good evening 👋</p>
            <h1
              className="text-2xl font-extrabold text-warm mt-0.5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Find your vibe
            </h1>
          </div>
          <div className="relative mt-1">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-lg">
              😊
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose rounded-full border-2 border-bg" />
          </div>
        </div>

        {/* Vibe Filter Pills */}
        <div className="mt-4 px-5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {vibes.map((vibe, i) => (
              <button
                key={vibe.label}
                onClick={() => setActiveVibe(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeVibe === i
                    ? "gradient-bg text-bg font-semibold"
                    : "border border-[rgba(255,120,70,0.1)] text-muted"
                }`}
              >
                {vibe.emoji ? `${vibe.emoji} ${vibe.label}` : vibe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Now Section */}
        <div className="mt-6 px-5">
          <h2
            className="text-base font-bold text-warm"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Active now 🟢
          </h2>
        </div>

        {/* Stories Row */}
        <div className="mt-3 px-5">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {stories.map((story) => (
              <div
                key={story.name}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                {/* Gradient ring */}
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-sunset via-coral to-gold">
                  <div className="w-full h-full rounded-full bg-bg flex items-center justify-center text-2xl">
                    {story.emoji}
                  </div>
                </div>
                <span className="text-xs text-muted">{story.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge Card */}
        <div className="mt-6 px-5">
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,208,0,0.1)",
              border: "1px solid rgba(255,208,0,0.15)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gold">
                🎯 Daily Challenge
              </span>
              <span className="text-xs text-peach">Day 7 streak! 🔥</span>
            </div>
            <p className="text-warm text-[15px] font-medium mb-3">
              What&apos;s one thing that made you smile today?
            </p>
            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-bg"
              style={{
                background: "linear-gradient(135deg, #FFD000, #FFA040)",
              }}
            >
              Share Answer
            </button>
          </div>
        </div>

        {/* Near You Section */}
        <div className="mt-6 px-5">
          <h2
            className="text-base font-bold text-warm"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Near you 📍
          </h2>
        </div>

        {/* Feed Cards */}
        <div className="mt-3 px-5 flex flex-col gap-4">
          {feedCards.map((card) => (
            <div
              key={card.name}
              className="rounded-2xl p-4 bg-card border border-[rgba(255,120,70,0.1)] card-glow"
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-bg-rose flex items-center justify-center text-lg">
                  {card.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-warm">
                      {card.name}, {card.age}
                    </span>
                    <span className="text-xs text-muted">
                      · {card.location}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    card.badgeType === "match"
                      ? "bg-[rgba(255,112,64,0.15)] text-coral"
                      : "bg-[rgba(16,185,129,0.15)] text-emerald-400"
                  }`}
                >
                  {card.badge}
                </span>
              </div>

              {/* Card Text */}
              <p className="text-[14px] text-warm2 leading-relaxed mb-4">
                {card.text}
              </p>

              {/* Card Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-xl gradient-bg text-sm font-semibold text-bg">
                  Connect 🔥
                </button>
                <button className="flex-1 py-2.5 rounded-xl border border-[rgba(255,120,70,0.1)] text-sm font-medium text-muted">
                  Skip
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
