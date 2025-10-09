"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";

type Pod = { index: number; text: string; type: string; date: string };

// LocalStorage keys we will try in order:
const FRIEND_KEYS = ["playdate:friends", "playdate_friends", "friends", "friendsList"] as const;

// simple stable hash of a string → integer
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function localKeyFor10amCutover(): string {
  const now = new Date(); // user's local time
  let y = now.getFullYear();
  let m = now.getMonth(); // 0-based
  let d = now.getDate();

  // before 10:00 local → use yesterday's date
  if (now.getHours() < 10) {
    const yday = new Date(y, m, d - 1);
    y = yday.getFullYear();
    m = yday.getMonth();
    d = yday.getDate();
  }

  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`; // YYYY-MM-DD
}

/** Try to read friends from several known keys and shapes */
function readFriends(): string[] {
  try {
    for (const key of FRIEND_KEYS) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);

      // Case 1: Array of strings
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
        return parsed.map((v) => v.trim()).filter(Boolean);
      }

      // Case 2: Array of objects with "name", "fullName", etc.
      if (Array.isArray(parsed) && parsed.every((v) => v && typeof v === "object")) {
        const names = parsed
          .map((v) => {
            const anyObj = v as Record<string, unknown>;
            const name =
              (anyObj.name ??
                anyObj.fullName ??
                anyObj.displayName ??
                anyObj.title ??
                "") as string;
            return (name ?? "").toString().trim();
          })
          .filter(Boolean);
        if (names.length) return names;
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

function selectFriendOfDay(friends: string[], dateKey: string): string {
  if (!friends.length) return "";
  const i = hash(`friend|${dateKey}`) % friends.length;
  return friends[i];
}

function InviteInner() {
  const [friends, setFriends] = useState<string[]>([]);
  const [friend, setFriend] = useState<string>("");

  const [pod, setPod] = useState<Pod | null>(null);
  const [loading, setLoading] = useState(true);

  // new: user's typed answer + modal visibility
  const [answer, setAnswer] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const dateKey = useMemo(() => localKeyFor10amCutover(), []);
  const displayDate = useMemo(() => {
    const [y, m, d] = dateKey.split("-");
    return `${m}-${d}-${y}`;
  }, [dateKey]);

  // Load friends and compute friend-of-the-day on mount
  useEffect(() => {
    const list = readFriends();
    setFriends(list);
    setFriend(selectFriendOfDay(list, dateKey));
  }, [dateKey]);

  // If /friends updates localStorage in another tab/window, re-select
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.storageArea !== localStorage) return;
      if (!e.key || (FRIEND_KEYS as readonly string[]).includes(e.key)) {
        const list = readFriends();
        setFriends(list);
        setFriend(selectFriendOfDay(list, dateKey));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [dateKey]);

  // fetch the prompt-of-the-day for the local day (10:00 am cutover)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/prompt-of-the-day?key=${dateKey}`, { cache: "no-store" });
        const data = (await res.json()) as Pod;
        if (mounted) setPod(data);
      } catch {
        if (mounted) setPod(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dateKey]);

  const text = pod?.text ?? "";

  // IMPORTANT: Keep share function exactly the same; just update the sms it uses.
  const sms = `hey ${friend || "friend"}! today's playdate is: ${text} my answer: ${answer || ""}. what's your answer?`;

  const shareNative = async () => {
    // Share the invite link; friend is re-selected on load per day
    const link = new URL(window.location.origin + "/invite").toString();
    const title = "playdate — invitation to play";
    const textToShare = sms;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: textToShare, url: link });
      } catch {
        // user canceled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(link);
        alert("copied to clipboard");
      } catch {
        // clipboard not available; do nothing
      }
    }
  };

  const onSubmit = () => {
    // Show modal with friend name + share button
    setShowModal(true);
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 720, textTransform: "lowercase", width: "100%" }}>
        {/* Logo block (same as app/page.tsx) */}
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src="/playdate-logo.png"
            alt="playdate"
            width={320} // adjust if you want larger/smaller
            height={86}
            priority
          />
        </div>

        {/* Invite card */}
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            border: "1px solid #000",
            borderRadius: 16,
            padding: 16,
            boxShadow: "4px 4px 0 #000",
            background: "#fff",
          }}
        >
          {/* Title */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>today&apos;s playdate:</div>
          </div>

          {/* Date line */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              prompt of the day - {displayDate}
            </div>
          </div>

          {/* Prompt text */}
          <div
            style={{
              width: "100%",
              marginTop: 0,
              marginBottom: 12,
              padding: "10px 12px",
              border: "1px solid #000",
              borderRadius: 8,
              background: "#f9f9f9",
              whiteSpace: "pre-wrap",
              minHeight: 72,
              display: "flex",
              alignItems: "center",
            }}
          >
            {loading ? "loading…" : text}
          </div>

          {/* Answer box */}
          <div style={{ marginBottom: 12 }}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              aria-label="your answer"
              placeholder="type your answer here"
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #000",
                borderRadius: 8,
                resize: "vertical",
              }}
            />
          </div>

          {/* Submit button */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={onSubmit}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #000",
                background: "transparent",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              submit
            </button>
          </div>
        </div>
      </div>

      {/* Modal popup on submit */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              border: "1px solid #000",
              borderRadius: 16,
              padding: 16,
              boxShadow: "4px 4px 0 #000",
              background: "#fff",
              textTransform: "lowercase",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 700 }}>
              send this playdate to: {friend || "friend"}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={shareNative}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #000",
                  background: "transparent",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                share
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #000",
                  background: "transparent",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={null}>
      <InviteInner />
    </Suspense>
  );
}

