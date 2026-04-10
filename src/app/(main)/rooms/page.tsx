"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/Toast";

const filters = [
  { label: "All", emoji: "" },
  { label: "Late Night", emoji: "\u{1F319}" },
  { label: "Music", emoji: "\u{1F3B5}" },
  { label: "Study", emoji: "\u{1F4DA}" },
  { label: "Comedy", emoji: "\u{1F602}" },
  { label: "Deep Talk", emoji: "\u{1F4AC}" },
];

const rooms = [
  {
    id: 1,
    name: "\u{1F319} Late Night Deep Talk",
    description: "No judgments. Just raw conversations after midnight.",
    gradient: "linear-gradient(135deg, #4C1D95 0%, #1E1040 50%, #0F0520 100%)",
    isLive: true,
    listeners: 847,
    tags: ["Deep", "Feelings", "Night"],
    avatars: ["\u{1F60C}", "\u{1F970}", "\u{1F914}", "\u{1F31F}"],
  },
  {
    id: 2,
    name: "\u{1F3B5} Karaoke Night!",
    description: "Sing your heart out. Bad voices welcome.",
    gradient: "linear-gradient(135deg, #FF3070 0%, #FF5020 50%, #FF7040 100%)",
    isLive: true,
    listeners: 234,
    tags: ["Music", "Fun", "Singing"],
    avatars: ["\u{1F3A4}", "\u{1F3B6}", "\u{1F60E}"],
  },
  {
    id: 3,
    name: "\u{1F602} Roast Battle Arena",
    description: "Come get roasted or roast someone. All in good fun.",
    gradient: "linear-gradient(135deg, #FF5020 0%, #FFD000 100%)",
    isLive: true,
    listeners: 156,
    tags: ["Comedy", "Roast", "Fun"],
    avatars: ["\u{1F525}", "\u{1F602}", "\u{1F4A5}", "\u{1F3AF}"],
  },
  {
    id: 4,
    name: "\u{1F4DA} Study Together",
    description: "Camera off, mic off. Just vibing and studying together.",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
    isLive: false,
    listeners: 89,
    tags: ["Focus", "Study", "Quiet"],
    avatars: ["\u{1F4D6}", "\u{1F9E0}", "\u{270F}\u{FE0F}"],
  },
  {
    id: 5,
    name: "\u{1F4BB} Startup Stories",
    description: "Share your startup journey. Failures welcome.",
    gradient: "linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #0D9488 100%)",
    isLive: false,
    listeners: 45,
    tags: ["StartUp", "Code", "Ideas"],
    avatars: ["\u{1F680}", "\u{1F4A1}", "\u{1F4BB}"],
  },
];

export default function RoomsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { showToast } = useToast();

  const filteredRooms = useMemo(() => {
    if (activeFilter === "All") return rooms;
    return rooms.filter((room) =>
      room.tags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase()))
    );
  }, [activeFilter]);

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        background: "#06040E",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-14 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-[28px] font-extrabold tracking-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
                color: "#FFF3EC",
              }}
            >
              Vibe Rooms {"\u{1F399}\u{FE0F}"}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(255,243,236,0.45)" }}
            >
              Live audio hangouts
            </p>
          </div>
          <button
            onClick={() => showToast("Create Room coming soon!")}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
            style={{
              background: "linear-gradient(135deg, #FF5020, #FF7040)",
              color: "#FFF3EC",
              boxShadow: "0 4px 20px rgba(255,80,32,0.35)",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => {
            const isActive = activeFilter === f.label;
            return (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: isActive
                    ? "linear-gradient(135deg, #FF5020, #FF7040)"
                    : "rgba(255,243,236,0.06)",
                  color: isActive ? "#FFF3EC" : "rgba(255,243,236,0.5)",
                  border: isActive
                    ? "none"
                    : "1px solid rgba(255,243,236,0.08)",
                  boxShadow: isActive
                    ? "0 2px 12px rgba(255,80,32,0.3)"
                    : "none",
                }}
              >
                {f.emoji ? `${f.emoji} ${f.label}` : f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Room cards */}
      <div className="px-5 flex flex-col gap-4 mt-1">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: room.gradient,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Top row: name + LIVE badge */}
            <div className="flex items-start justify-between mb-2 relative z-10">
              <h2
                className="text-lg font-bold leading-snug flex-1 pr-3"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: "#FFF3EC",
                }}
              >
                {room.name}
              </h2>
              {room.isLive && (
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide flex-shrink-0"
                  style={{
                    background: "rgba(255,40,40,0.85)",
                    color: "#fff",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                    style={{ boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
                  />
                  LIVE
                </span>
              )}
            </div>

            {/* Description */}
            <p
              className="text-[13px] leading-relaxed mb-4 relative z-10"
              style={{ color: "rgba(255,243,236,0.75)" }}
            >
              {room.description}
            </p>

            {/* Tags */}
            <div className="flex gap-1.5 mb-4 relative z-10 flex-wrap">
              {room.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,243,236,0.8)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bottom row: avatars + count + join */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                {/* Overlapping avatars */}
                <div className="flex -space-x-2">
                  {room.avatars.map((emoji, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        borderColor: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(4px)",
                        zIndex: room.avatars.length - i,
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "rgba(255,243,236,0.7)" }}
                >
                  {room.listeners} listening
                </span>
              </div>

              <button
                onClick={() => showToast("Joining room... Coming soon!")}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#FFF3EC",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Room banner */}
      <div className="px-5 mt-6 mb-4">
        <div
          className="rounded-2xl p-6 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(255,80,32,0.15) 100%)",
            border: "1px solid rgba(255,243,236,0.08)",
          }}
        >
          <p
            className="text-lg font-bold mb-1"
            style={{
              fontFamily: "'Syne', sans-serif",
              color: "#FFF3EC",
            }}
          >
            Start your own room
          </p>
          <p
            className="text-[13px] mb-4"
            style={{ color: "rgba(255,243,236,0.45)" }}
          >
            Create a space for your vibe
          </p>
          <button
            onClick={() => showToast("Create Room coming soon!")}
            className="px-8 py-3 rounded-full text-sm font-bold transition-all duration-200 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FF5020, #FF3070)",
              color: "#FFF3EC",
              boxShadow: "0 4px 24px rgba(255,80,32,0.4)",
            }}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
