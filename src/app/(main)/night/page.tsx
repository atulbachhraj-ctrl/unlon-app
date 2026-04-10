"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

interface NightOwl {
  id: string;
  emoji: string;
  name: string;
  status: string;
  city: string;
}

const fallbackNightOwls: NightOwl[] = [
  { id: "f1", emoji: "\u{1F614}", name: "Anonymous", status: "Can\u2019t sleep", city: "Mumbai" },
  { id: "f2", emoji: "\u{1F3B5}", name: "Music Soul", status: "Listening to sad songs", city: "Delhi" },
  { id: "f3", emoji: "\u{1F4D6}", name: "Night Reader", status: "Reading at 2am", city: "Bangalore" },
  { id: "f4", emoji: "\u{1F319}", name: "Star Gazer", status: "On the terrace", city: "Pune" },
  { id: "f5", emoji: "\u{1F3A8}", name: "Night Artist", status: "Drawing at midnight", city: "Chennai" },
];

const fallbackQuestion =
  "If you could go back and change one moment in your life \u2014 would you? And why not?";

const moodOptions = [
  { emoji: "\u{1F614}", label: "Sad" },
  { emoji: "\u{1F3B5}", label: "Musical" },
  { emoji: "\u{1F319}", label: "Dreamy" },
  { emoji: "\u{1F4AD}", label: "Thoughtful" },
  { emoji: "\u{2764}\uFE0F", label: "Lonely" },
];

export default function NightPage() {
  const { user, profile } = useAuth();
  const [nightOwls, setNightOwls] = useState<NightOwl[]>(fallbackNightOwls);
  const [question, setQuestion] = useState(fallbackQuestion);
  const [owlCount, setOwlCount] = useState(847);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTonightsQuestion();
    fetchNightOwls();
  }, []);

  async function fetchTonightsQuestion() {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("night_questions")
        .select("question")
        .eq("active_date", today)
        .single();

      if (!error && data?.question) {
        setQuestion(data.question);
      }
    } catch {
      // keep fallback
    }
  }

  async function fetchNightOwls() {
    try {
      const { data, error } = await supabase
        .from("night_sessions")
        .select("id, user_id, mood_emoji, status_text, is_active, created_at, profiles(display_name, avatar_emoji, city)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        const mapped: NightOwl[] = data.map((s: any) => ({
          id: s.id,
          emoji: s.mood_emoji || "\u{1F319}",
          name: s.profiles?.display_name || "Anonymous",
          status: s.status_text || "Awake late...",
          city: s.profiles?.city || "Somewhere",
        }));
        setNightOwls(mapped);
        setOwlCount(data.length);
      }
    } catch {
      // keep fallback
    }
  }

  async function handleShareAnswer(moodEmoji: string) {
    if (!user) {
      alert("Sign in to share your answer");
      return;
    }
    setSubmitting(true);
    try {
      // Deactivate any existing session for this user
      await supabase
        .from("night_sessions")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);

      // Create new session
      const { error } = await supabase.from("night_sessions").insert({
        user_id: user.id,
        mood_emoji: moodEmoji,
        status_text: "Sharing thoughts...",
        is_active: true,
      });

      if (error) throw error;

      setShowMoodPicker(false);
      // Refresh the list
      await fetchNightOwls();
    } catch (err: any) {
      alert("Could not share: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  }

  function handleTalk(owl: NightOwl) {
    alert("Connecting... Chat feature coming soon!");
  }

  return (
    <div
      className="min-h-screen pb-24 relative overflow-y-auto"
      style={{
        background: "linear-gradient(155deg, #0A0520, #15081A, #0A0516)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 10%, rgba(123,97,255,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="px-5 pt-14 pb-2 text-center">
          {/* Moon with glow */}
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 -m-8 moon-glow rounded-full" />
            <div
              className="relative text-6xl"
              style={{
                filter: "drop-shadow(0 0 24px rgba(123,97,255,0.4))",
              }}
            >
              🌙
            </div>
          </div>

          <h1
            className="text-[28px] font-extrabold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Late Night Mode
          </h1>
          <p
            className="text-[15px] mt-2 leading-relaxed"
            style={{ color: "rgba(255,243,236,0.55)" }}
          >
            After 11pm everything shifts.
            <br />
            Deeper. Quieter. More real.
          </p>
          <p
            className="text-sm mt-3"
            style={{ color: "rgba(255,243,236,0.3)" }}
          >
            {owlCount} night owls are awake with you right now.
          </p>
        </div>

        {/* Tonight's Question Card */}
        <div className="mt-6 px-5">
          <div
            className="p-5"
            style={{
              background: "rgba(123,97,255,0.08)",
              border: "1px solid rgba(123,97,255,0.18)",
              borderRadius: "18px",
            }}
          >
            <span
              className="block text-[11px] font-bold tracking-[0.15em] mb-3"
              style={{ color: "rgba(123,97,255,0.7)" }}
            >
              TONIGHT&apos;S QUESTION
            </span>
            <p
              className="text-[17px] font-semibold text-warm leading-snug mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {question}
            </p>

            {showMoodPicker ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-center" style={{ color: "rgba(255,243,236,0.4)" }}>
                  How are you feeling tonight?
                </p>
                <div className="flex justify-center gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => handleShareAnswer(mood.emoji)}
                      disabled={submitting}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-[rgba(123,97,255,0.15)] disabled:opacity-50"
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-[10px]" style={{ color: "rgba(255,243,236,0.4)" }}>
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowMoodPicker(false)}
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,243,236,0.3)" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowMoodPicker(true)}
                className="w-full py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #7B61FF, #8B5CF6)",
                }}
              >
                Share your answer anonymously 🌙
              </button>
            )}
          </div>
        </div>

        {/* Awake Right Now Section */}
        <div className="mt-8 px-5">
          <h2
            className="text-base font-bold text-warm mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Awake right now 🌙
          </h2>

          <div className="flex flex-col gap-3">
            {nightOwls.map((owl) => (
              <div
                key={owl.id}
                className="flex items-center gap-3 p-4 night-owl-hover cursor-pointer"
                style={{
                  background: "rgba(123,97,255,0.05)",
                  border: "1px solid rgba(123,97,255,0.1)",
                  borderRadius: "18px",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "rgba(123,97,255,0.12)" }}
                >
                  {owl.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-warm">
                      {owl.name}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "rgba(255,243,236,0.25)" }}
                    >
                      · {owl.city}
                    </span>
                  </div>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,243,236,0.4)" }}
                  >
                    {owl.status}
                  </p>
                </div>

                {/* Talk Button */}
                <button
                  onClick={() => handleTalk(owl)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #7B61FF, #8B5CF6)",
                  }}
                >
                  Talk 🌙
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
