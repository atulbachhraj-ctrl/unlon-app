"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { SkeletonAvatar, SkeletonText } from "@/components/Skeleton";

interface ChatItem {
  id: string;
  name: string;
  emoji: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  gradient: string;
}

const hardcodedChats: ChatItem[] = [
  {
    id: "priya",
    name: "Priya",
    emoji: "\uD83D\uDC69\u200D\uD83E\uDDB1",
    lastMessage: "\uD83C\uDFA4 Voice message \u00B7 0:24",
    time: "9:33 AM",
    unread: 2,
    online: true,
    gradient: "from-rose to-coral",
  },
  {
    id: "aryan",
    name: "Aryan",
    emoji: "\uD83E\uDDD1",
    lastMessage: "Bro that Goa sunset was \uD83D\uDD25\uD83D\uDD25",
    time: "Yesterday",
    unread: 0,
    online: true,
    gradient: "from-sunset to-peach",
  },
  {
    id: "healing-circle",
    name: "Healing Circle",
    emoji: "\uD83D\uDC99",
    lastMessage: "Ocean Mind: Moving alone to new city...",
    time: "1h ago",
    unread: 8,
    online: false,
    gradient: "from-violet to-blush",
  },
  {
    id: "sofia",
    name: "Sofia",
    emoji: "\uD83D\uDC69",
    lastMessage: "Thank you for listening \uD83D\uDC99",
    time: "Monday",
    unread: 1,
    online: false,
    gradient: "from-coral to-gold",
  },
];

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const gradients = [
  "from-rose-500 to-orange-400",
  "from-orange-400 to-yellow-400",
  "from-violet-500 to-pink-400",
  "from-pink-400 to-orange-300",
  "from-amber-400 to-red-400",
  "from-fuchsia-500 to-rose-400",
];

export default function ChatsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchChats() {
      try {
        // Fetch matches where current user is involved and status is 'matched'
        const { data: matches, error: matchError } = await supabase
          .from("matches")
          .select("id, user_a, user_b, matched_at")
          .or(`user_a.eq.${user!.id},user_b.eq.${user!.id}`)
          .eq("status", "matched")
          .order("matched_at", { ascending: false });

        if (matchError || !matches || matches.length === 0) {
          setChats(hardcodedChats);
          setLoading(false);
          return;
        }

        // Get other user IDs
        const otherUserIds = matches.map((m) =>
          m.user_a === user!.id ? m.user_b : m.user_a
        );

        // Fetch profiles for all other users
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_emoji, is_online")
          .in("id", otherUserIds);

        const profileMap = new Map(
          (profiles || []).map((p) => [p.id, p])
        );

        // For each match, fetch latest message and unread count
        const chatItems: ChatItem[] = await Promise.all(
          matches.map(async (match, index) => {
            const otherId =
              match.user_a === user!.id ? match.user_b : match.user_a;
            const profileData = profileMap.get(otherId);

            // Get latest message
            const { data: latestMessages } = await supabase
              .from("messages")
              .select("content, message_type, created_at, sender_id")
              .eq("match_id", match.id)
              .order("created_at", { ascending: false })
              .limit(1);

            // Count unread messages (messages from other user that are not read)
            const { count: unreadCount } = await supabase
              .from("messages")
              .select("id", { count: "exact", head: true })
              .eq("match_id", match.id)
              .eq("is_read", false)
              .neq("sender_id", user!.id);

            const latestMsg = latestMessages?.[0];
            let lastMessage = "Say hello! \uD83D\uDC4B";
            if (latestMsg) {
              if (latestMsg.message_type === "voice") {
                lastMessage = "\uD83C\uDFA4 Voice message";
              } else if (latestMsg.message_type === "image") {
                lastMessage = "\uD83D\uDCF7 Photo";
              } else if (latestMsg.message_type === "system") {
                lastMessage = latestMsg.content;
              } else {
                lastMessage = latestMsg.content;
              }
            }

            return {
              id: match.id,
              name: profileData?.display_name || "Someone",
              emoji: profileData?.avatar_emoji || "\uD83D\uDE0A",
              lastMessage,
              time: latestMsg
                ? formatTime(latestMsg.created_at)
                : formatTime(match.matched_at),
              unread: unreadCount || 0,
              online: !!profileData?.is_online,
              gradient: `bg-gradient-to-br ${gradients[index % gradients.length]}`,
            };
          })
        );

        // Sort by most recent message activity
        setChats(chatItems);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        setChats(hardcodedChats);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, [user]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("chats-page-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new as {
            id: string;
            match_id: string;
            sender_id: string;
            content: string;
            message_type: string;
            created_at: string;
          };

          setChats((prev) => {
            const chatIndex = prev.findIndex((c) => c.id === newMsg.match_id);
            if (chatIndex === -1) return prev;

            const updated = [...prev];
            const chat = { ...updated[chatIndex] };

            // Update last message
            if (newMsg.message_type === "voice") {
              chat.lastMessage = "\uD83C\uDFA4 Voice message";
            } else if (newMsg.message_type === "image") {
              chat.lastMessage = "\uD83D\uDCF7 Photo";
            } else {
              chat.lastMessage = newMsg.content;
            }
            chat.time = formatTime(newMsg.created_at);

            // Increment unread if sender is not current user
            if (newMsg.sender_id !== user.id) {
              chat.unread = chat.unread + 1;
            }

            updated[chatIndex] = chat;

            // Re-sort: move this chat to the top
            const [movedChat] = updated.splice(chatIndex, 1);
            updated.unshift(movedChat);

            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
          Messages
        </h1>
        <button
          onClick={() => {
            router.push("/discover");
            showToast("Find someone new to chat with!");
          }}
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

      {/* Loading state */}
      {loading && (
        <div className="mt-4 px-5 flex flex-col gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl">
              <SkeletonAvatar size={48} />
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <SkeletonText width="40%" height={14} />
                  <SkeletonText width={40} height={10} />
                </div>
                <SkeletonText width="70%" height={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat list */}
      {!loading && (
        <div className="mt-4 px-5 flex flex-col gap-1.5">
          {filteredChats.length === 0 && (
            <div className="text-center mt-16">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-warm text-sm font-medium">No conversations yet</p>
              <p className="text-muted text-xs mt-1">
                Match with someone to start chatting
              </p>
            </div>
          )}
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
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: "#060104" }}
                  >
                    {chat.unread}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
