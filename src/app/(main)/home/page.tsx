"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { SkeletonAvatar, SkeletonCard, SkeletonText } from "@/components/Skeleton";

const vibes = [
  { label: "All Vibes", emoji: "" },
  { label: "Music", emoji: "\u{1F3B5}" },
  { label: "Art", emoji: "\u{1F4F8}" },
  { label: "Travel", emoji: "\u{1F9F3}" },
  { label: "Code", emoji: "\u{1F4BB}" },
  { label: "Books", emoji: "\u{1F4DA}" },
  { label: "Gaming", emoji: "\u{1F3AE}" },
];

const fallbackStories = [
  { name: "Priya", emoji: "\u{1F469}\u200D\u{1F9B1}", id: "fallback-1" },
  { name: "Aryan", emoji: "\u{1F9D1}", id: "fallback-2" },
  { name: "Sofia", emoji: "\u{1F469}", id: "fallback-3" },
  { name: "Dev", emoji: "\u{1F9D1}\u200D\u{1F4BB}", id: "fallback-4" },
  { name: "Maya", emoji: "\u{1F467}", id: "fallback-5" },
];

const fallbackFeedCards = [
  {
    id: "fallback-fc-1",
    name: "Priya",
    age: 23,
    location: "Mumbai",
    badge: "92% match",
    badgeType: "match" as const,
    emoji: "\u{1F469}\u200D\u{1F9B1}",
    text: "Looking for someone to explore cafes in Mumbai this weekend \u{1F33F}",
    vibes: [] as string[],
  },
  {
    id: "fallback-fc-2",
    name: "Aryan",
    age: 25,
    location: "Delhi",
    badge: "New",
    badgeType: "new" as const,
    emoji: "\u{1F9D1}",
    text: "Anyone into midnight drives and deep conversations? \u{1F303}",
    vibes: [] as string[],
  },
  {
    id: "fallback-fc-3",
    name: "Sofia",
    age: 22,
    location: "Bangalore",
    badge: "88% match",
    badgeType: "match" as const,
    emoji: "\u{1F469}",
    text: "Need a coding buddy for hackathons \u{1F4BB}",
    vibes: [] as string[],
  },
  {
    id: "fallback-fc-4",
    name: "Dev",
    age: 24,
    location: "Pune",
    badge: "95% match",
    badgeType: "match" as const,
    emoji: "\u{1F9D1}\u200D\u{1F4BB}",
    text: "Let's jam together sometime \u2014 guitar, keys, anything goes \u{1F3B8}",
    vibes: [] as string[],
  },
];

const fallbackChallenge = "What's one thing that made you smile today?";

interface FeedCard {
  id: string;
  name: string;
  age: number;
  location: string;
  badge: string;
  badgeType: "match" | "new";
  emoji: string;
  text: string;
  vibes: string[];
}

export default function HomePage() {
  const [activeVibe, setActiveVibe] = useState(0);
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [dailyChallenge, setDailyChallenge] = useState(fallbackChallenge);
  const [stories, setStories] = useState(fallbackStories);
  const [feedCards, setFeedCards] = useState<FeedCard[]>(fallbackFeedCards);
  const [loadingFeed, setLoadingFeed] = useState(true);

  const displayName = profile?.display_name || "Alex";
  const avatarEmoji = (profile as any)?.avatar_emoji || "\u{1F60A}";

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  useEffect(() => {
    if (user) {
      fetchStories();
      fetchFeedCards().finally(() => setLoadingFeed(false));
    } else {
      setLoadingFeed(false);
    }
  }, [user]);

  async function fetchDailyChallenge() {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("daily_challenges")
        .select("question")
        .eq("active_date", today)
        .single();

      if (!error && data?.question) {
        setDailyChallenge(data.question);
      }
    } catch {
      // keep fallback
    }
  }

  async function fetchStories() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_emoji")
        .eq("is_online", true)
        .limit(10);

      if (!error && data && data.length > 0) {
        setStories(
          data.map((p) => ({
            id: p.id,
            name: p.display_name || "User",
            emoji: p.avatar_emoji || "\u{1F60A}",
          }))
        );
      }
    } catch {
      // keep fallback
    }
  }

  async function fetchFeedCards() {
    if (!user) return;
    try {
      // Get IDs the current user already swiped on
      const { data: matchData } = await supabase
        .from("matches")
        .select("user_b")
        .eq("user_a", user.id);

      const swipedIds = (matchData || []).map((m) => m.user_b);
      const excludeIds = [user.id, ...swipedIds];

      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_emoji, bio, age, city, vibes");

      if (!error && data && data.length > 0) {
        const myVibes: string[] = (profile as any)?.vibes || [];

        const cards: FeedCard[] = data
          .filter((p) => !excludeIds.includes(p.id))
          .map((p) => {
            const theirVibes: string[] = p.vibes || [];
            const sharedCount = myVibes.filter((v) =>
              theirVibes.includes(v)
            ).length;
            const maxCount = Math.max(myVibes.length, theirVibes.length, 1);
            const matchPct = Math.round((sharedCount / maxCount) * 100);

            return {
              id: p.id,
              name: p.display_name || "User",
              age: p.age || 0,
              location: p.city || "",
              badge: matchPct > 0 ? `${matchPct}% match` : "New",
              badgeType: (matchPct > 0 ? "match" : "new") as "match" | "new",
              emoji: p.avatar_emoji || "\u{1F60A}",
              text: p.bio || "",
              vibes: theirVibes,
            };
          });

        if (cards.length > 0) {
          setFeedCards(cards);
        }
      }
    } catch {
      // keep fallback
    }
  }

  async function handleConnect(card: FeedCard) {
    if (!user) return;
    try {
      // Insert pending match
      const { error } = await supabase.from("matches").insert({
        user_a: user.id,
        user_b: card.id,
        status: "pending",
      });
      if (error) throw error;

      // Check for mutual match
      const { data: mutual } = await supabase
        .from("matches")
        .select("status")
        .eq("user_a", card.id)
        .eq("user_b", user.id)
        .eq("status", "pending")
        .maybeSingle();

      if (mutual) {
        // Update both to matched
        await supabase
          .from("matches")
          .update({ status: "matched" })
          .eq("user_a", card.id)
          .eq("user_b", user.id);
        await supabase
          .from("matches")
          .update({ status: "matched" })
          .eq("user_a", user.id)
          .eq("user_b", card.id);
        showToast(`It's a match with ${card.name}! 🎉`);
      } else {
        showToast(`Connection request sent to ${card.name}!`);
      }

      // Remove card from list
      setFeedCards((prev) => prev.filter((c) => c.id !== card.id));
    } catch {
      showToast("Something went wrong. Try again.");
    }
  }

  async function handleSkip(card: FeedCard) {
    if (!user) return;
    try {
      await supabase.from("matches").insert({
        user_a: user.id,
        user_b: card.id,
        status: "rejected",
      });
    } catch {
      // silent fail
    }
    setFeedCards((prev) => prev.filter((c) => c.id !== card.id));
  }

  // Filter feed cards by active vibe
  const filteredFeedCards = useMemo(() => {
    if (activeVibe === 0) return feedCards; // "All Vibes"
    const selectedVibe = vibes[activeVibe].label;
    return feedCards.filter((card) =>
      card.vibes.some(
        (v) => v.toLowerCase() === selectedVibe.toLowerCase()
      )
    );
  }, [feedCards, activeVibe]);

  // Determine greeting based on time of day
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="min-h-screen bg-bg pb-28">
      {/* Ambient glow */}
      <div className="ambient-glow" />

      <div className="relative z-10">
        {/* Top Bar */}
        <div className="flex items-start justify-between px-5 pt-14 pb-2">
          <div>
            <p className="text-sm text-muted font-body">{getGreeting()}, {displayName} 👋</p>
            <h1
              className="text-2xl font-extrabold text-warm mt-0.5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Find your vibe
            </h1>
          </div>
          <Link href="/profile" className="relative mt-1">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-lg">
              {avatarEmoji}
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose rounded-full border-2 border-bg" />
          </Link>
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
                key={story.id}
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
              <span className="text-xs text-peach">New challenge!</span>
            </div>
            <p className="text-warm text-[15px] font-medium mb-3">
              {dailyChallenge}
            </p>
            <button
              onClick={() => router.push("/night")}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-bg"
              style={{
                background: "linear-gradient(135deg, #FFD000, #FFA040)",
              }}
            >
              Share Answer
            </button>
          </div>
        </div>

        {/* Late Night Mode Banner */}
        <div onClick={() => router.push('/night')} className="mx-4 mb-3 mt-4 p-3 rounded-2xl cursor-pointer" style={{ background: 'linear-gradient(135deg, rgba(123,97,255,0.1), rgba(45,27,105,0.15))', border: '1px solid rgba(123,97,255,0.2)' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌙</span>
            <div>
              <p className="text-sm font-bold" style={{ color: '#7B61FF' }}>Late Night Mode</p>
              <p className="text-xs" style={{ color: 'rgba(255,243,236,0.35)' }}>Who's awake right now?</p>
            </div>
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
          {loadingFeed ? (
            <>
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl p-4 bg-card border border-[rgba(255,120,70,0.1)]">
                  <div className="flex items-center gap-3 mb-3">
                    <SkeletonAvatar size={40} />
                    <div className="flex-1 flex flex-col gap-2">
                      <SkeletonText width="60%" height={14} />
                      <SkeletonText width="40%" height={10} />
                    </div>
                  </div>
                  <SkeletonText width="100%" height={12} className="mb-2" />
                  <SkeletonText width="75%" height={12} className="mb-4" />
                  <div className="flex gap-3">
                    <SkeletonText width="50%" height={40} className="!rounded-xl" />
                    <SkeletonText width="50%" height={40} className="!rounded-xl" />
                  </div>
                </div>
              ))}
            </>
          ) : filteredFeedCards.map((card) => (
            <div
              key={card.id}
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
                <button
                  onClick={() => handleConnect(card)}
                  className="flex-1 py-2.5 rounded-xl gradient-bg text-sm font-semibold text-bg"
                >
                  Connect 🔥
                </button>
                <button
                  onClick={() => handleSkip(card)}
                  className="flex-1 py-2.5 rounded-xl border border-[rgba(255,120,70,0.1)] text-sm font-medium text-muted"
                >
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

