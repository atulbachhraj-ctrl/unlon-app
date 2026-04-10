"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

/* ───── profile data ───── */
interface Profile {
  id: string | number;
  name: string;
  age: number;
  city: string;
  distance?: string;
  emoji: string;
  tags: string[];
  matchPct?: number;
  online?: boolean;
  gradient: string;
}

/* ───── hardcoded fallbacks ───── */
const GRADIENTS = [
  "linear-gradient(145deg, #FF5020 0%, #FF3070 60%, #8B5CF6 100%)",
  "linear-gradient(145deg, #7B61FF 0%, #FF3070 60%, #FF7040 100%)",
  "linear-gradient(145deg, #FFD000 0%, #FF5020 50%, #FF3070 100%)",
  "linear-gradient(145deg, #FF3070 0%, #8B5CF6 60%, #7B61FF 100%)",
  "linear-gradient(145deg, #FFA040 0%, #FF5020 60%, #FF3070 100%)",
];

const fallbackProfiles: Profile[] = [
  {
    id: 1,
    name: "Priya",
    age: 23,
    city: "Mumbai",
    distance: "2km away",
    emoji: "👩🏽",
    tags: ["Coffee", "Art", "Music"],
    matchPct: 92,
    gradient: "linear-gradient(145deg, #FF5020 0%, #FF3070 60%, #8B5CF6 100%)",
  },
  {
    id: 2,
    name: "Aryan",
    age: 25,
    city: "Delhi",
    emoji: "🧑🏻",
    tags: ["Drives", "Coding", "Travel"],
    online: true,
    gradient: "linear-gradient(145deg, #7B61FF 0%, #FF3070 60%, #FF7040 100%)",
  },
  {
    id: 3,
    name: "Maya",
    age: 22,
    city: "Pune",
    emoji: "👩🏻",
    tags: ["Books", "Yoga", "Photography"],
    matchPct: 87,
    gradient: "linear-gradient(145deg, #FFD000 0%, #FF5020 50%, #FF3070 100%)",
  },
];

const nearbyProfiles = [
  { id: 10, emoji: "👦🏽", name: "Rohan", gradient: "linear-gradient(135deg,#FF5020,#FFD000)" },
  { id: 11, emoji: "👧🏻", name: "Anvi", gradient: "linear-gradient(135deg,#FF3070,#8B5CF6)" },
  { id: 12, emoji: "🧑🏽", name: "Kabir", gradient: "linear-gradient(135deg,#7B61FF,#FF7040)" },
  { id: 13, emoji: "👩🏽", name: "Isha", gradient: "linear-gradient(135deg,#FFA040,#FF3070)" },
  { id: 14, emoji: "🧔🏻", name: "Dev", gradient: "linear-gradient(135deg,#FFD000,#FF5020)" },
];

/* ───── helper: map DB profile to card profile ───── */
function dbToProfile(row: Record<string, unknown>, idx: number): Profile {
  const vibes = Array.isArray(row.vibes) ? (row.vibes as string[]) : [];
  return {
    id: row.id as string,
    name: (row.display_name as string) || (row.username as string) || "Someone",
    age: (row.age as number) || 22,
    city: (row.city as string) || "Nearby",
    emoji: (row.avatar_emoji as string) || "🙂",
    tags: vibes.length > 0 ? vibes.slice(0, 4) : ["Vibes"],
    online: !!(row.is_online),
    gradient: GRADIENTS[idx % GRADIENTS.length],
  };
}

/* ───── component ───── */
export default function DiscoverPage() {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>(fallbackProfiles);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gone, setGone] = useState<Set<number>>(new Set());
  const [stamp, setStamp] = useState<"like" | "nope" | null>(null);
  const [matched, setMatched] = useState(false);
  const [matchName, setMatchName] = useState("");

  /* ── fetch real profiles on mount ── */
  useEffect(() => {
    if (!user) return;

    async function loadProfiles() {
      // 1) Get IDs the current user already swiped on
      const { data: existingSwipes } = await supabase
        .from("matches")
        .select("user_b")
        .eq("user_a", user!.id);

      const swipedIds = (existingSwipes || []).map((s: { user_b: string }) => s.user_b);

      // 2) Fetch profiles excluding self and already-swiped
      let query = supabase
        .from("profiles")
        .select("*")
        .neq("id", user!.id)
        .limit(20);

      if (swipedIds.length > 0) {
        // Use .not('id', 'in', ...) to exclude already-swiped profiles
        query = query.not("id", "in", `(${swipedIds.join(",")})`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        return; // keep fallback
      }

      if (data && data.length > 0) {
        const mapped = data.map((row, idx) => dbToProfile(row, idx));
        setProfiles(mapped);
        // Reset card state for fresh deck
        setCurrentIdx(0);
        setGone(new Set());
      }
      // If no data, fallback profiles remain
    }

    loadProfiles();
  }, [user]);

  /* ── save swipe to DB ── */
  const saveSwipe = useCallback(
    async (targetProfile: Profile, action: "connect" | "super" | "pass") => {
      if (!user) return;

      const targetId = String(targetProfile.id);
      const status = action === "pass" ? "rejected" : "pending";

      // Insert the swipe
      const { error: insertErr } = await supabase
        .from("matches")
        .insert({
          user_a: user.id,
          user_b: targetId,
          status,
        });

      if (insertErr) {
        console.error("Error saving swipe:", insertErr);
        return;
      }

      // If it's a like/super, check if the other person already liked us back
      if (status === "pending") {
        const { data: mutual } = await supabase
          .from("matches")
          .select("id")
          .eq("user_a", targetId)
          .eq("user_b", user.id)
          .eq("status", "pending")
          .maybeSingle();

        if (mutual) {
          const now = new Date().toISOString();
          // Update both records to 'matched'
          await Promise.all([
            supabase
              .from("matches")
              .update({ status: "matched", matched_at: now })
              .eq("user_a", user.id)
              .eq("user_b", targetId),
            supabase
              .from("matches")
              .update({ status: "matched", matched_at: now })
              .eq("user_a", targetId)
              .eq("user_b", user.id),
          ]);
          return true; // mutual match!
        }
      }
      return false;
    },
    [user],
  );

  const dismissCard = useCallback(
    (action: "pass" | "connect" | "super") => {
      if (currentIdx >= profiles.length) return;
      const targetProfile = profiles[currentIdx];
      setStamp(action === "pass" ? "nope" : "like");

      // Save to DB (fire and forget, but handle match)
      const swipePromise = saveSwipe(targetProfile, action);

      setTimeout(() => {
        setGone((prev) => new Set(prev).add(currentIdx));
        setStamp(null);
        setCurrentIdx((i) => i + 1);

        if (action === "connect" || action === "super") {
          swipePromise.then((isMutual) => {
            if (isMutual) {
              // Real mutual match
              setMatchName(targetProfile.name);
              setMatched(true);
              setTimeout(() => setMatched(false), 2400);
            } else if (!user) {
              // Not logged in fallback: show match animation anyway
              setMatched(true);
              setTimeout(() => setMatched(false), 1800);
            }
          });
        }
      }, 300);
    },
    [currentIdx, profiles, saveSwipe, user],
  );

  const visibleCards = profiles.filter((_, i) => !gone.has(i));

  return (
    <div className="min-h-dvh pb-24" style={{ background: "#090412" }}>
      {/* ── match flash ── */}
      {matched && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-center animate-bounce">
            <p className="text-5xl mb-2">🔥</p>
            <p
              className="font-heading text-3xl font-bold"
              style={{
                background: "linear-gradient(135deg,#FF5020,#FFD000)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              It&apos;s a Match!
            </p>
            <p className="text-warm2 text-sm mt-1">
              {matchName ? `You and ${matchName} liked each other!` : "Start a conversation now"}
            </p>
          </div>
        </div>
      )}

      {/* ── header ── */}
      <header className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[26px] font-bold text-warm">
            Discover 🌍
          </h1>
          <p className="text-muted text-[13px] mt-0.5">Find your person</p>
        </div>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,243,236,0.08)" }}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            viewBox="0 0 24 24"
            className="text-warm"
          >
            <path d="M4 21v-7m0 0V3m0 11h6m-6 0H2m14 10v-4m0 0V3m0 14h4m-4 0h-2m-2-7h6M10 10H8" />
          </svg>
        </button>
      </header>

      {/* ── swipe card stack ── */}
      <section className="px-5 relative" style={{ height: 370 }}>
        {visibleCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-4xl mb-3">✨</p>
            <p className="font-heading text-lg font-semibold text-warm">
              No more profiles
            </p>
            <p className="text-muted text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          profiles.map((p, i) => {
            if (gone.has(i)) return null;
            const pos = i - currentIdx;
            if (pos < 0 || pos > 2) return null;

            return (
              <div
                key={p.id}
                className="absolute inset-x-5 rounded-3xl overflow-hidden"
                style={{
                  height: 340,
                  background: p.gradient,
                  transform: `scale(${1 - pos * 0.05}) translateY(${pos * 14}px)`,
                  zIndex: 10 - pos,
                  opacity: pos > 2 ? 0 : 1,
                  transition: "transform 0.35s ease, opacity 0.35s ease",
                  boxShadow: pos === 0 ? "0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)" : "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {/* dark overlay for readability */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                  }}
                />

                {/* stamps */}
                {pos === 0 && stamp === "like" && (
                  <div
                    className="absolute top-8 left-6 z-20 border-[3px] border-green-400 rounded-lg px-4 py-1"
                    style={{ transform: "rotate(-14deg)" }}
                  >
                    <span className="font-heading text-2xl font-bold text-green-400 tracking-wider">
                      LIKE
                    </span>
                  </div>
                )}
                {pos === 0 && stamp === "nope" && (
                  <div
                    className="absolute top-8 right-6 z-20 border-[3px] rounded-lg px-4 py-1"
                    style={{
                      transform: "rotate(14deg)",
                      borderColor: "#FF3070",
                    }}
                  >
                    <span
                      className="font-heading text-2xl font-bold tracking-wider"
                      style={{ color: "#FF3070" }}
                    >
                      NOPE
                    </span>
                  </div>
                )}

                {/* content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-5">
                  {/* emoji avatar */}
                  <span className="text-[80px] leading-none mb-3 drop-shadow-lg">
                    {p.emoji}
                  </span>

                  {/* name + age */}
                  <h2 className="font-heading text-[22px] font-bold text-white">
                    {p.name}, {p.age}
                  </h2>

                  {/* location */}
                  <p className="text-white/70 text-[13px] mt-1">
                    {p.city}
                    {p.distance ? ` · ${p.distance}` : ""}
                  </p>

                  {/* badges row */}
                  <div className="flex items-center gap-2 mt-2.5">
                    {p.online && (
                      <span
                        className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full text-white font-medium"
                        style={{ background: "rgba(34,197,94,0.25)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-glow"
                        />
                        Online
                      </span>
                    )}
                    {p.matchPct && (
                      <span
                        className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: "rgba(255,112,64,0.2)",
                          color: "#FF7040",
                        }}
                      >
                        {p.matchPct}% match
                      </span>
                    )}
                  </div>

                  {/* tag pills */}
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-3 py-1 rounded-full text-white/90 font-medium"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ── action buttons ── */}
      <section className="flex items-center justify-center gap-4 mt-6">
        {/* pass */}
        <button
          onClick={() => dismissCard("pass")}
          className="flex items-center justify-center rounded-full active:scale-90 action-btn-hover"
          style={{
            width: 54,
            height: 54,
            background: "rgba(255,243,236,0.08)",
          }}
        >
          <span className="text-xl">❌</span>
        </button>

        {/* connect */}
        <button
          onClick={() => dismissCard("connect")}
          className="flex items-center justify-center rounded-full active:scale-90 action-btn-hover"
          style={{
            width: 70,
            height: 70,
            background: "linear-gradient(135deg, #FF5020, #FF3070)",
            boxShadow: "0 6px 24px rgba(255,80,32,0.35)",
          }}
        >
          <span className="text-3xl">🔥</span>
        </button>

        {/* super like */}
        <button
          onClick={() => dismissCard("super")}
          className="flex items-center justify-center rounded-full active:scale-90 action-btn-hover"
          style={{
            width: 54,
            height: 54,
            background: "rgba(139,92,246,0.18)",
          }}
        >
          <span className="text-xl">💜</span>
        </button>

        {/* voice */}
        <button
          className="flex items-center justify-center rounded-full active:scale-90 action-btn-hover"
          style={{
            width: 46,
            height: 46,
            background: "rgba(255,208,0,0.14)",
          }}
        >
          <span className="text-lg">🎤</span>
        </button>
      </section>

      {/* ── also nearby ── */}
      <section className="mt-8 px-5">
        <h3 className="font-heading text-[15px] font-semibold text-warm mb-3">
          Also nearby
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {nearbyProfiles.map((p) => (
            <div
              key={p.id}
              className="flex-shrink-0 rounded-2xl overflow-hidden relative flex flex-col items-center justify-end"
              style={{
                width: 112,
                height: 92,
                background: p.gradient,
              }}
            >
              {/* dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
                }}
              />
              <span className="text-[32px] leading-none mb-1 relative z-10 drop-shadow">
                {p.emoji}
              </span>
              <p className="relative z-10 text-[11px] text-white/90 font-medium mb-2">
                {p.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
