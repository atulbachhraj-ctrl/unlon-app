"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

// Seed/fallback confessions shown when DB is empty
const seedConfessions = [
  {
    id: "seed-1",
    content:
      "I moved to a new city 3 months ago and I still haven\u2019t made a single real friend. Everyone seems to have their groups already...",
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    hearts: 42,
    hugs: 24,
    sads: 18,
    wows: 8,
    is_anonymous: true,
  },
  {
    id: "seed-2",
    content:
      "I pretend I\u2019m okay on video calls with my parents. They don\u2019t know how lonely it gets here.",
    created_at: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
    hearts: 89,
    hugs: 73,
    sads: 56,
    wows: 12,
    is_anonymous: true,
  },
  {
    id: "seed-3",
    content:
      "I have a crush on someone at work but I\u2019m too scared they\u2019ll think I\u2019m weird if I talk to them",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    hearts: 67,
    hugs: 45,
    sads: 9,
    wows: 31,
    is_anonymous: true,
  },
  {
    id: "seed-4",
    content:
      "Sometimes I drive around at 2am just so I don\u2019t feel the silence of my apartment",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    hearts: 124,
    hugs: 61,
    sads: 88,
    wows: 19,
    is_anonymous: true,
  },
];

interface Confession {
  id: string;
  content: string;
  created_at: string;
  hearts: number;
  hugs: number;
  sads: number;
  wows: number;
  is_anonymous: boolean;
  user_id?: string | null;
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function ConfessPage() {
  const [confessionText, setConfessionText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(true);

  let user: { id: string } | null = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch {
    // Auth provider not available; allow anonymous usage
  }

  // Fetch confessions
  const fetchConfessions = useCallback(async () => {
    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching confessions:", error);
      setConfessions(seedConfessions);
    } else if (data && data.length > 0) {
      setConfessions(data as Confession[]);
    } else {
      setConfessions(seedConfessions);
    }
    setLoadingFeed(false);
  }, []);

  useEffect(() => {
    fetchConfessions();
  }, [fetchConfessions]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("confessions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "confessions" },
        (payload) => {
          const newConfession = payload.new as Confession;
          setConfessions((prev) => {
            // Avoid duplicates
            if (prev.some((c) => c.id === newConfession.id)) return prev;
            return [newConfession, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "confessions" },
        (payload) => {
          const updated = payload.new as Confession;
          setConfessions((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Post confession
  const handleConfess = async () => {
    const text = confessionText.trim();
    if (!text || isPosting) return;

    setIsPosting(true);
    const { error } = await supabase.from("confessions").insert({
      content: text,
      user_id: isAnonymous ? null : user?.id ?? null,
      is_anonymous: isAnonymous,
      hearts: 0,
      hugs: 0,
      sads: 0,
      wows: 0,
    });

    if (error) {
      console.error("Error posting confession:", error);
    } else {
      setConfessionText("");
    }
    setIsPosting(false);
  };

  // Handle reaction
  const handleReaction = async (
    confession: Confession,
    reactionType: "hearts" | "hugs" | "sads" | "wows"
  ) => {
    // Skip for seed data
    if (String(confession.id).startsWith("seed-")) return;

    // Optimistic update
    setConfessions((prev) =>
      prev.map((c) =>
        c.id === confession.id
          ? { ...c, [reactionType]: c[reactionType] + 1 }
          : c
      )
    );

    const { error } = await supabase
      .from("confessions")
      .update({ [reactionType]: confession[reactionType] + 1 })
      .eq("id", confession.id);

    if (error) {
      console.error("Error updating reaction:", error);
      // Revert optimistic update
      setConfessions((prev) =>
        prev.map((c) =>
          c.id === confession.id
            ? { ...c, [reactionType]: c[reactionType] - 1 }
            : c
        )
      );
    }
  };

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
            Confess
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
              disabled={isPosting}
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
                  100% Anonymous
                </span>
              </button>

              <button
                onClick={handleConfess}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #FF3070, #FF8098)",
                  opacity: confessionText.trim() && !isPosting ? 1 : 0.5,
                }}
                disabled={!confessionText.trim() || isPosting}
              >
                {isPosting ? "Posting..." : "Confess"}
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

          {loadingFeed ? (
            <div className="flex justify-center py-10">
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "rgba(255,48,112,0.4)", borderTopColor: "transparent" }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {confessions.map((confession) => (
                <div
                  key={confession.id}
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
                      {"\uD83E\uDEE5"}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-warm">
                        Anonymous
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,243,236,0.25)" }}
                      >
                        · {timeAgo(confession.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Confession Text */}
                  <p
                    className="text-[14px] leading-relaxed italic mb-4"
                    style={{ color: "rgba(255,243,236,0.75)" }}
                  >
                    &ldquo;{confession.content}&rdquo;
                  </p>

                  {/* Reaction Row */}
                  <div className="flex items-center gap-3">
                    {(
                      [
                        { emoji: "\u2764\uFE0F", type: "hearts" as const },
                        { emoji: "\uD83D\uDE22", type: "sads" as const },
                        { emoji: "\uD83E\uDD17", type: "hugs" as const },
                        { emoji: "\uD83D\uDE2E", type: "wows" as const },
                      ] as const
                    ).map((reaction) => (
                      <button
                        key={reaction.emoji}
                        onClick={() =>
                          handleReaction(confession, reaction.type)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
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
                          {confession[reaction.type]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
