"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Pod = { index: number; text: string; type: string; date: string };

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

function InviteInner() {
  const search = useSearchParams();

  const initialFriend = (search.get("f") || "").trim();
  const [friend, setFriend] = useState(initialFriend);
  const [pod, setPod] = useState<Pod | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch the prompt-of-the-day for the local day (10:00 am cutover)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const key = localKeyFor10amCutover();
        const res = await fetch(`/api/prompt-of-the-day?key=${key}`, { cache: "no-store" });
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
  }, []);

  // keep URL updated with friend for shareability
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("f", friend);
    window.history.replaceState(null, "", url.toString());
  }, [friend]);

  const text = pod?.text ?? "";
  const sms = `hey ${friend}! ${text}`;

  const shareNative = async () => {
    const url = new URL(window.location.origin + "/invite");
    url.searchParams.set("f", friend);
    const link = url.toString();

    const title = "playdate — invitation to play";
    const textToShare = `hey ${friend}! ${text}`;

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

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      {/* Top-of-page logo */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 0,
          right: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
        }}
      >
        <img
          src="/playdate-logo.png"
          alt="playdate"
          width={320}
          height={86}
          style={{ display: "block" }}
        />
      </div>


      
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          border: "1px solid #000",
          borderRadius: 16,
          padding: 16,
          boxShadow: "4px 4px 0 #000",
          background: "#fff",
          textTransform: "lowercase",
        }}
      >
        {/* Title above the box */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>today&apos;s playdate:</div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>friend of the day</div>
          <input
            value={friend}
            onChange={(e) => setFriend(e.target.value)}
            aria-label="friend name"
            placeholder="friend name"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              border: "1px solid #000",
              borderRadius: 8,
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            prompt of the day{pod?.date ? ` — ${pod.date}` : ""}
          </div>
          <div
            style={{
              width: "100%",
              marginTop: 6,
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
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>suggested sms</div>
          <div
            style={{
              border: "1px dashed #000",
              borderRadius: 8,
              padding: 12,
              background: "#f9f9f9",
              whiteSpace: "pre-wrap",
            }}
          >
            {sms}
          </div>
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
        </div>
      </div>
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

