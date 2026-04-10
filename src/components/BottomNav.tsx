"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { emoji: "🏠", label: "Home", href: "/home" },
  { emoji: "🔍", label: "Discover", href: "/discover" },
  { emoji: "🎙", label: "Rooms", href: "/rooms" },
  { emoji: "🤫", label: "Confess", href: "/confess" },
  { emoji: "👤", label: "Me", href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(5,1,2,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,120,70,0.1)",
      }}
    >
      <div
        className="flex items-center justify-around w-full max-w-[430px] mx-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 py-2 px-3 relative"
            >
              <span className="text-xl leading-none relative">
                {tab.emoji}
                {"hasNotification" in tab && (tab as any).hasNotification && (
                  <span
                    className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full"
                    style={{ background: "#FF3B30" }}
                  />
                )}
              </span>
              <span
                className="text-[10px] leading-tight"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: isActive ? "#FF7846" : "rgba(255,243,236,0.35)",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
