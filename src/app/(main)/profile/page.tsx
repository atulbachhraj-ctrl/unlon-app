"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const defaultVibes = [
  { emoji: "\u{1F3B5}", label: "Music" },
  { emoji: "\u{1F4F8}", label: "Photography" },
  { emoji: "\u2708\uFE0F", label: "Travel" },
  { emoji: "\u{1F4BB}", label: "Coding" },
  { emoji: "\u{1F4DA}", label: "Books" },
];

const settingsGroups = [
  {
    items: [
      { emoji: "\u{1F451}", label: "Unlon Premium", href: "/premium", color: "rgba(255,208,0,0.15)", iconColor: "#FFD000" },
      { emoji: "\u270F\uFE0F", label: "Edit Profile", href: "#edit", color: "rgba(255,112,64,0.15)", iconColor: "#FF7040", isEdit: true },
    ],
  },
  {
    items: [
      { emoji: "\u{1F514}", label: "Notifications", href: "#", color: "rgba(255,80,32,0.15)", iconColor: "#FF5020" },
      { emoji: "\u{1F512}", label: "Privacy", href: "#", color: "rgba(139,92,246,0.15)", iconColor: "#8B5CF6" },
      { emoji: "\u{1F319}", label: "Late Night Mode", href: "/night", color: "rgba(123,97,255,0.15)", iconColor: "#7B61FF" },
      { emoji: "\u{1F4AC}", label: "Messages", href: "/chats", color: "rgba(255,48,112,0.15)", iconColor: "#FF3070" },
    ],
  },
  {
    items: [
      { emoji: "\u2753", label: "Help & Support", href: "#", color: "rgba(255,160,64,0.15)", iconColor: "#FFA040" },
      { emoji: "\u{1F6AA}", label: "Sign Out", href: "#signout", color: "rgba(255,48,112,0.1)", iconColor: "#FF3070", isSignOut: true },
    ],
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  const [connectionsCount, setConnectionsCount] = useState(0);
  const [confessionsCount, setConfessionsCount] = useState(0);

  // Derive display values from profile or defaults
  const displayName = profile?.display_name || "Alex";
  const username = (profile as any)?.username || "alex_vibes";
  const avatarEmoji = (profile as any)?.avatar_emoji || "\u{1F60A}";
  const bio = (profile as any)?.bio || "Exploring the world one sunset at a time \u{1F305}";
  const city = (profile as any)?.city || "";
  const vibesData: string[] = (profile as any)?.vibes || [];

  const vibes =
    vibesData.length > 0
      ? vibesData.map((v: string) => {
          const match = defaultVibes.find((d) => d.label.toLowerCase() === v.toLowerCase());
          return match || { emoji: "\u2728", label: v };
        })
      : defaultVibes;

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    if (!user) return;
    try {
      // Count connections (matches)
      const { count: matchCount } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .or(`user_id.eq.${user.id},matched_user_id.eq.${user.id}`);
      setConnectionsCount(matchCount || 0);
    } catch {
      // keep 0
    }
    try {
      // Count confessions
      const { count: confCount } = await supabase
        .from("confessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setConfessionsCount(confCount || 0);
    } catch {
      // keep 0
    }
  }

  function startEdit() {
    setEditDisplayName(displayName);
    setEditBio(bio);
    setEditCity(city);
    setEditAvatar(avatarEmoji);
    setEditMode(true);
  }

  async function saveEdit() {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: editDisplayName,
          bio: editBio,
          city: editCity,
          avatar_emoji: editAvatar,
        })
        .eq("id", user.id);

      if (error) throw error;
      setEditMode(false);
      // Reload page to pick up new profile in auth context
      window.location.reload();
    } catch (err: any) {
      alert("Could not save: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  function handleSettingClick(item: any, e: React.MouseEvent) {
    if (item.isSignOut) {
      e.preventDefault();
      handleSignOut();
    } else if (item.isEdit) {
      e.preventDefault();
      startEdit();
    }
  }

  return (
    <div className="min-h-screen bg-screen pb-24">
      {/* Cover area with gradient overlay */}
      <div
        className="relative h-40 w-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,80,32,0.3), rgba(255,48,112,0.2), rgba(139,92,246,0.15))",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 40%, #0D0509 100%)",
          }}
        />
      </div>

      {/* Profile avatar — overlapping cover */}
      <div className="relative z-10 flex flex-col items-center -mt-14">
        <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-sunset via-coral to-gold">
          <div className="w-full h-full rounded-full bg-screen flex items-center justify-center text-5xl">
            {avatarEmoji}
          </div>
        </div>

        {/* Name + handle */}
        <h1
          className="text-2xl font-bold text-warm mt-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {displayName}
        </h1>
        <p className="text-sm text-muted mt-0.5">@{username}</p>

        {/* Stats row */}
        <div className="flex items-center gap-5 mt-4">
          {[
            { value: String(connectionsCount), label: "connections" },
            { value: String(confessionsCount), label: "confessions" },
            { value: "0", label: "rooms" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <div className="w-px h-4 bg-[rgba(255,243,236,0.1)] -ml-2.5 mr-2.5" />
              )}
              <span className="text-sm font-semibold text-warm">{stat.value}</span>
              <span className="text-xs text-muted">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-warm2 mt-4 text-center px-8">
          {bio}
        </p>
      </div>

      {/* Inline Edit Mode */}
      {editMode && (
        <div className="mt-4 px-5">
          <div
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{
              background: "rgba(255,112,64,0.06)",
              border: "1px solid rgba(255,112,64,0.15)",
            }}
          >
            <h3 className="text-sm font-bold text-warm" style={{ fontFamily: "var(--font-heading)" }}>
              Edit Profile
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted">Avatar Emoji</label>
              <input
                type="text"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                maxLength={4}
                className="bg-[rgba(255,243,236,0.05)] border border-[rgba(255,120,70,0.12)] rounded-xl px-3 py-2 text-warm text-sm outline-none focus:border-[rgba(255,120,70,0.3)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted">Display Name</label>
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="bg-[rgba(255,243,236,0.05)] border border-[rgba(255,120,70,0.12)] rounded-xl px-3 py-2 text-warm text-sm outline-none focus:border-[rgba(255,120,70,0.3)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={2}
                className="bg-[rgba(255,243,236,0.05)] border border-[rgba(255,120,70,0.12)] rounded-xl px-3 py-2 text-warm text-sm outline-none focus:border-[rgba(255,120,70,0.3)] resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted">City</label>
              <input
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="bg-[rgba(255,243,236,0.05)] border border-[rgba(255,120,70,0.12)] rounded-xl px-3 py-2 text-warm text-sm outline-none focus:border-[rgba(255,120,70,0.3)]"
              />
            </div>
            <div className="flex gap-3 mt-1">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-bg disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #FF5020, #FF3070)" }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted border border-[rgba(255,120,70,0.1)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Vibes section */}
      <div className="mt-6 px-5">
        <h2
          className="text-base font-bold text-warm mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Vibes
        </h2>
        <div className="flex flex-wrap gap-2">
          {vibes.map((vibe: any) => (
            <span
              key={vibe.label}
              className="px-4 py-2 rounded-full text-sm font-medium text-warm"
              style={{
                background: "rgba(255,112,64,0.1)",
                border: "1px solid rgba(255,112,64,0.15)",
              }}
            >
              {vibe.emoji} {vibe.label}
            </span>
          ))}
        </div>
      </div>

      {/* Settings section */}
      <div className="mt-6 px-5">
        <h2
          className="text-base font-bold text-warm mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Settings
        </h2>
        <div className="flex flex-col gap-4">
          {settingsGroups.map((group, gi) => (
            <div key={gi} className="flex flex-col gap-1.5">
              {group.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleSettingClick(item, e)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-[rgba(255,120,70,0.08)] active:scale-[0.98] transition-all hover-glow"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: item.color }}
                  >
                    {item.emoji}
                  </div>
                  <span
                    className={`flex-1 text-[15px] font-medium ${
                      "isSignOut" in item && item.isSignOut ? "text-rose" : "text-warm"
                    }`}
                  >
                    {item.label}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-muted flex-shrink-0"
                  >
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ))}
              {gi < settingsGroups.length - 1 && (
                <div className="h-px mx-3 mt-2" style={{ background: "rgba(255,120,70,0.08)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
