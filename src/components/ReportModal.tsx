"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetName: string;
}

const REPORT_REASONS = [
  "Inappropriate content",
  "Harassment",
  "Fake profile",
  "Spam",
  "Other",
];

export default function ReportModal({
  isOpen,
  onClose,
  targetUserId,
  targetName,
}: ReportModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [blocking, setBlocking] = useState(false);

  if (!isOpen) return null;

  const handleReport = async () => {
    if (!reason) {
      showToast("Please select a reason");
      return;
    }
    if (!user) {
      showToast("Sign in to report users");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_user_id: targetUserId,
        reason,
        details: details.trim() || null,
      });

      if (error) {
        console.error("Report error:", error);
        showToast("Could not submit report. Try again later.");
      } else {
        showToast("Report submitted. Thank you.");
        setReason("");
        setDetails("");
        onClose();
      }
    } catch {
      showToast("Could not submit report. Try again later.");
    }
    setSubmitting(false);
  };

  const handleBlock = async () => {
    if (!user) {
      showToast("Sign in to block users");
      return;
    }

    setBlocking(true);
    try {
      const { error } = await supabase.from("blocks").insert({
        blocker_id: user.id,
        blocked_user_id: targetUserId,
      });

      if (error) {
        console.error("Block error:", error);
        showToast("Could not block user. Try again later.");
      } else {
        showToast(`${targetName} has been blocked`);
        onClose();
      }
    } catch {
      showToast("Could not block user. Try again later.");
    }
    setBlocking(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-[18px] p-6 relative"
        style={{
          background: "#130709",
          border: "1px solid rgba(255,120,70,0.12)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,243,236,0.08)" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFF3EC"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2
          className="text-xl font-bold mb-1"
          style={{ fontFamily: "'Syne', sans-serif", color: "#FFF3EC" }}
        >
          Report {targetName}
        </h2>
        <p className="text-[13px] mb-5" style={{ color: "rgba(255,243,236,0.45)" }}>
          Help us keep the community safe
        </p>

        {/* Reasons */}
        <div className="flex flex-col gap-2 mb-4">
          {REPORT_REASONS.map((r) => (
            <label
              key={r}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150"
              style={{
                background:
                  reason === r
                    ? "rgba(255,80,32,0.12)"
                    : "rgba(255,243,236,0.04)",
                border:
                  reason === r
                    ? "1px solid rgba(255,80,32,0.3)"
                    : "1px solid rgba(255,243,236,0.06)",
              }}
            >
              <div
                className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  border:
                    reason === r
                      ? "none"
                      : "2px solid rgba(255,243,236,0.2)",
                  background:
                    reason === r
                      ? "linear-gradient(135deg, #FF5020, #FF3070)"
                      : "transparent",
                }}
              >
                {reason === r && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#FFF3EC" }}
                  />
                )}
              </div>
              <input
                type="radio"
                name="report-reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="sr-only"
              />
              <span
                className="text-sm font-medium"
                style={{ color: "#FFF3EC" }}
              >
                {r}
              </span>
            </label>
          ))}
        </div>

        {/* Details */}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add details (optional)"
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-5"
          style={{
            background: "rgba(255,243,236,0.04)",
            border: "1px solid rgba(255,243,236,0.06)",
            color: "#FFF3EC",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleReport}
            disabled={submitting || !reason}
            className="w-full py-3 rounded-full text-sm font-bold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #FF5020, #FF3070)",
              color: "#FFF3EC",
              boxShadow: "0 4px 24px rgba(255,80,32,0.4)",
              opacity: submitting || !reason ? 0.5 : 1,
            }}
          >
            {submitting ? "Submitting..." : "Report"}
          </button>

          <button
            onClick={handleBlock}
            disabled={blocking}
            className="w-full py-3 rounded-full text-sm font-bold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: "rgba(220,38,38,0.15)",
              color: "#EF4444",
              border: "1px solid rgba(220,38,38,0.3)",
              opacity: blocking ? 0.5 : 1,
            }}
          >
            {blocking ? "Blocking..." : "Block User"}
          </button>
        </div>
      </div>
    </div>
  );
}
