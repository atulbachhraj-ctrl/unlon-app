"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "voice" | "image" | "system";
  is_read: boolean;
  created_at: string;
}

interface OtherProfile {
  id: string;
  display_name: string;
  avatar_emoji: string;
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateDivider(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function shouldShowDateDivider(
  current: Message,
  previous: Message | null
): boolean {
  if (!previous) return true;
  const currentDate = new Date(current.created_at).toDateString();
  const prevDate = new Date(previous.created_at).toDateString();
  return currentDate !== prevDate;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherProfile, setOtherProfile] = useState<OtherProfile | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }, 50);
  }, []);

  // Fetch match info and other person's profile
  useEffect(() => {
    if (!user || !matchId) return;

    async function fetchMatchAndProfile() {
      const { data: match, error } = await supabase
        .from("matches")
        .select("id, user_a, user_b, status")
        .eq("id", matchId)
        .single();

      if (error || !match || match.status !== "matched") {
        return;
      }

      const otherId =
        match.user_a === user!.id ? match.user_b : match.user_a;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_emoji")
        .eq("id", otherId)
        .single();

      if (profile) {
        setOtherProfile(profile as OtherProfile);
      }
    }

    fetchMatchAndProfile();
  }, [user, matchId]);

  // Fetch messages
  useEffect(() => {
    if (!user || !matchId) return;

    async function fetchMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
        scrollToBottom("instant");
      }
      setLoading(false);

      // Mark unread messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("match_id", matchId)
        .eq("is_read", false)
        .neq("sender_id", user!.id);
    }

    fetchMessages();
  }, [user, matchId, scrollToBottom]);

  // Real-time subscription
  useEffect(() => {
    if (!user || !matchId) return;

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          scrollToBottom();

          // Mark as read if from other user
          if (newMsg.sender_id !== user!.id) {
            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMsg.id)
              .then(() => {});
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, matchId, scrollToBottom]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || sending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Optimistic add
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      match_id: matchId,
      sender_id: user.id,
      content,
      message_type: "text",
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    const { data, error } = await supabase
      .from("messages")
      .insert({
        match_id: matchId,
        sender_id: user.id,
        content,
        message_type: "text",
      })
      .select()
      .single();

    if (error) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      console.error("Failed to send message:", error);
    } else if (data) {
      // Replace optimistic with real
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? (data as Message) : m))
      );
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100dvh",
        background: "#0D0509",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3"
        style={{
          background: "rgba(13,5,9,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,120,70,0.08)",
        }}
      >
        <button
          onClick={() => router.push("/chats")}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,243,236,0.06)" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFF3EC"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center text-lg"
            >
              {otherProfile?.avatar_emoji || "\uD83D\uDE0A"}
            </div>
            <div
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full"
              style={{ border: "2px solid #0D0509" }}
            />
          </div>
          <div className="min-w-0">
            <h2
              className="text-[15px] font-bold truncate"
              style={{ color: "#FFF3EC", fontFamily: "var(--font-heading)" }}
            >
              {otherProfile?.display_name || "Loading..."}
            </h2>
            <p
              className="text-[11px]"
              style={{ color: "rgba(255,243,236,0.35)" }}
            >
              Online
            </p>
          </div>
        </div>

        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,243,236,0.06)" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFF3EC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ overscrollBehavior: "contain" }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: "rgba(255,120,70,0.3)",
                borderTopColor: "transparent",
              }}
            />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="text-5xl">
              {otherProfile?.avatar_emoji || "\uD83D\uDC4B"}
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: "#FFF3EC" }}
            >
              Say hello to {otherProfile?.display_name || "your match"}!
            </p>
            <p
              className="text-xs text-center max-w-[250px]"
              style={{ color: "rgba(255,243,236,0.35)" }}
            >
              This is the beginning of your conversation. Send a message to
              break the ice.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {messages.map((msg, index) => {
              const isMe = msg.sender_id === user?.id;
              const prev = index > 0 ? messages[index - 1] : null;
              const showDate = shouldShowDateDivider(msg, prev);

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <span
                        className="text-[11px] px-3 py-1 rounded-full"
                        style={{
                          color: "rgba(255,243,236,0.35)",
                          background: "rgba(255,243,236,0.04)",
                        }}
                      >
                        {formatDateDivider(msg.created_at)}
                      </span>
                    </div>
                  )}

                  {msg.message_type === "system" ? (
                    <div className="flex items-center justify-center my-3">
                      <span
                        className="text-[12px] px-4 py-1.5 rounded-full"
                        style={{
                          color: "rgba(255,243,236,0.45)",
                          background: "rgba(255,243,236,0.04)",
                        }}
                      >
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
                    >
                      <div
                        className={`max-w-[78%] px-4 py-2.5 ${
                          isMe ? "rounded-[18px_18px_4px_18px]" : "rounded-[18px_18px_18px_4px]"
                        }`}
                        style={
                          isMe
                            ? {
                                background:
                                  "linear-gradient(135deg, #FF5020, #FFD000)",
                              }
                            : {
                                background: "#130709",
                                border: "1px solid rgba(255,120,70,0.1)",
                              }
                        }
                      >
                        <p
                          className="text-[14px] leading-relaxed break-words"
                          style={{
                            color: isMe ? "#0D0509" : "#FFF3EC",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {msg.content}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${isMe ? "text-right" : "text-left"}`}
                          style={{
                            color: isMe
                              ? "rgba(13,5,9,0.5)"
                              : "rgba(255,243,236,0.25)",
                          }}
                        >
                          {formatMessageTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        className="sticky bottom-0 z-20 px-4 py-3 flex items-end gap-2"
        style={{
          background: "rgba(5,1,2,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,120,70,0.08)",
        }}
      >
        <div
          className="flex-1 flex items-end rounded-2xl px-4 py-3"
          style={{
            background: "rgba(255,243,236,0.05)",
            border: "1px solid rgba(255,243,236,0.08)",
          }}
        >
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none max-h-[100px]"
            style={{
              color: "#FFF3EC",
              fontFamily: "var(--font-body)",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
            }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background:
              newMessage.trim()
                ? "linear-gradient(135deg, #FF5020, #FFD000)"
                : "rgba(255,243,236,0.08)",
            opacity: newMessage.trim() ? 1 : 0.5,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={newMessage.trim() ? "#0D0509" : "rgba(255,243,236,0.4)"}
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
