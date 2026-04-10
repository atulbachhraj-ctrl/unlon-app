"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const features = [
  { emoji: "👁", text: "See who viewed & liked your profile" },
  { emoji: "💫", text: "Unlimited connections every day" },
  { emoji: "🌍", text: "Global match — connect worldwide" },
  { emoji: "✅", text: "Verified premium badge on profile" },
  { emoji: "🎁", text: "100 free gift coins every month" },
  { emoji: "🎭", text: "Unlimited anonymous crushes" },
];

const plans = [
  { id: "monthly", price: "₹99", period: "/ month", badge: null },
  { id: "yearly", price: "₹599", period: "/ year", badge: "Save 50% 🔥" },
  { id: "quarterly", price: "₹249", period: "/ 3 months", badge: null },
];

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const router = useRouter();

  return (
    <div
      className="min-h-screen pb-24 relative"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255,80,32,0.18), transparent 70%), radial-gradient(ellipse 60% 40% at 30% 80%, rgba(255,48,112,0.1), transparent 60%), #0D0509",
      }}
    >
      {/* Sparkle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute text-sm"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 17) % 60}%`,
              animation: `sparkle-drift ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0,
            }}
          >
            {["✨", "⭐", "💫", "🌟"][i % 4]}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 pt-16">
        {/* Crown emoji */}
        <div className="text-6xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>
          👑
        </div>

        {/* Title */}
        <h1
          className="text-3xl font-extrabold gradient-text text-center"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Unlon Premium
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-muted mt-2 text-center">
          Unlock the full Unlon experience
        </p>

        {/* Feature list */}
        <div className="mt-8 w-full flex flex-col gap-3.5">
          {features.map((feature) => (
            <div key={feature.text} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center flex-shrink-0">
                {feature.emoji}
              </span>
              <span className="text-[15px] text-warm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Pricing plans */}
        <div className="mt-8 w-full grid grid-cols-3 gap-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative flex flex-col items-center py-4 px-2 rounded-2xl transition-all ${isSelected ? "plan-selected-glow" : ""}`}
                style={{
                  background: isSelected
                    ? "rgba(255,80,32,0.12)"
                    : "rgba(255,243,236,0.04)",
                  border: isSelected
                    ? "2px solid #FF5020"
                    : "2px solid rgba(255,243,236,0.08)",
                }}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #FF5020, #FFD000)",
                      color: "#060104",
                    }}
                  >
                    {plan.badge}
                  </span>
                )}
                <span
                  className="text-xl font-extrabold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: isSelected ? "#FF7040" : "#FFF3EC",
                  }}
                >
                  {plan.price}
                </span>
                <span className="text-xs text-muted mt-0.5">{plan.period}</span>
              </button>
            );
          })}
        </div>

        {/* CTA buttons */}
        <button
          className="mt-8 w-full py-4 rounded-2xl text-base font-bold gradient-bg active:scale-[0.97] transition-transform"
          style={{ color: "#060104" }}
        >
          Unlock Premium 👑
        </button>

        <button
          onClick={() => router.push("/home")}
          className="mt-3 w-full py-3.5 rounded-2xl text-sm font-medium text-muted border border-[rgba(255,243,236,0.08)] active:scale-[0.97] transition-transform"
        >
          Continue Free
        </button>
      </div>
    </div>
  );
}
