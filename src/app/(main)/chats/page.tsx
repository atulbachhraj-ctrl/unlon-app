"use client";

import { useState } from "react";
import Link from "next/link";

const chats = [
  {
    id: "priya",
    name: "Priya ❤️",
    emoji: "👩‍🦱",
    lastMessage: "🎤 Voice message · 0:24",
    time: "9:33 AM",
    unread: 2,
    online: true,
    gradient: "from-rose to-coral",
  },
  {
    id: "aryan",
    name: "Aryan",
    emoji: "🧑",
    lastMessage: "Bro that Goa sunset was 🔥🔥",
    time: "Yesterday",
    unread: 0,
    online: true,
    gradient: "from-sunset to-peach",
  },
  {
    id: "healing-circle",
    name: "Healing Circle",
    emoji: "💙",
    lastMessage: "Ocean Mind: Moving alone to new city...",
    time: "1h ago",
    unread: 8,
    online: false,
    gradient: "from-violet to-blush",
  },
  {
    id: "sofia",
    name: "Sofia",
    emoji: "👩",
    lastMessage: "Thank you for listening 💙",
    time: "Monday",
    unread: 1,
    online: false,
    gradient: "from-coral to-gold",
  },
  {
    id: "goa-trip",
    name: "Goa Trip 🌊",
    emoji: "✈️",
    lastMessage: "Aryan: Who books flights? 😄",
    time: "2h ago",
    unread: 5,
    online: true,
    gradient: "from-sunset to-gold",
  },
  {
    id: "skills-exchange",
    name: "Skills Exchange",
    emoji: "💼",
    lastMessage: "Priya: Guitar lesson Tuesday? 🎸",
    time: "3h ago",
    unread: 0,
    online: false,
    gradient: "from-peach to-coral",
  },
];

export default function ChatsPage() {
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1
          className="text-2xl font-extrabold text-warm"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Messages 💬
        </h1>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ background: "rgba(255,112,64,0.12)" }}
        >
          ✏️
        </button>
      </div>

      {/* Search bar */}
      <div className="px-5 mt-3">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(255,243,236,0.04)",
            border: "1px solid rgba(255,243,236,0.08)",
          }}
        >
          <span className="text-base">🔍</span>
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-warm placeholder:text-muted flex-1 outline-none"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="mt-4 px-5 flex flex-col gap-1.5">
        {filteredChats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chats/${chat.id}`}
            className="flex items-center gap-3 p-3 rounded-2xl active:bg-card transition-colors hover-glow"
          >
            {/* Avatar with online dot */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${chat.gradient} flex items-center justify-center text-xl`}
              >
                {chat.emoji}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-screen animate-online-pulse" />
              )}
            </div>

            {/* Name + last message */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-warm truncate">
                  {chat.name}
                </span>
                <span className="text-xs text-muted flex-shrink-0 ml-2">
                  {chat.time}
                </span>
              </div>
              <p className="text-sm text-muted truncate mt-0.5">
                {chat.lastMessage}
              </p>
            </div>

            {/* Unread badge */}
            {chat.unread > 0 && (
              <div
                className="min-w-[22px] h-[22px] px-1.5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: "0 0 8px rgba(255,80,32,0.4)" }}
              >
                <span className="text-[11px] font-bold" style={{ color: "#060104" }}>
                  {chat.unread}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
