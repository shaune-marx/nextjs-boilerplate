"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import prompts from "../data/prompts.json";

type Prompt = { text: string; type: "photo_caption" | "would_you_rather" | "question" | "other" };

function InviteInner() {
  const search = useSearchParams();
  const arr = prompts as Prompt[];

  const initialFriend = (search.get("f") || "jordan").trim();
  const initialIndex = (() => {
    const i = Number(search.get("i"));
    return Number.isFinite(i) && i >= 0 && i < arr.length
      ? i
      : Math.floor(Math.random() * arr.length);
  })();

  const [friend, setFriend] = useState(initialFriend);
  const [index, setIndex] = useState<number>(initialIndex);

  const current = useMemo(() => arr[index]?.text ?? "", [index, arr]);

  const reroll = async () => {
  try {
    const res = await fetch("/api/prompts", { cache: "no-store" });
    if (!res.ok) throw new Error("failed to fetch prompt");
    const data = await res.json(); // { index, text, type }
    const next = Number(data.index);
    setIndex(next);
    const url = new URL(window.location.href);
    url.searchParams.set("i", String(next));
    url.searchParams.set("f", friend);
    window.history.replaceState(null, "", url.toString());
  } catch {
    // fallback to local random if api fails
    const max = arr.length;
    let next = Math.floor(Math.random() * max);
    if (next === index && max > 1) next = (next + 1) % max;
    setIndex(next);
  }
};


  const sms = `hey ${friend}! ${current}`;
  const smsHref = `sms:?&body=${encodeURIComponent(sms)}`;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("copied to clipboard");
    } catch {
      alert("copy failed — you can select and copy manually.");
    }
  };

  const copyLink = async () => {
    const url = new URL(window.location.origin + "/invite");
    url.searchParams.set("i", String(index));
    url.searchParams.set("f", friend);
    await copy(url.toString());
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("f", friend);
    url.searchParams.set("i", String(index));
    window.history.replaceState(null, "", url.toString());
  }, [friend, index]);


const shareNative = async () => {
  const url = new URL(window.location.origin + "/invite");
  url.searchParams.set("i", String(index));
  url.searchParams.set("f", friend);
  const link = url.toString();

  const title = "playdate — invitation to play";
  const text = `hey ${friend}! ${current}`;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: link });
    } catch {
      // user canceled or share failed; do nothing
    }
  } else {
    await copy(link); // fallback to clipboard
  }
};


  
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
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
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>friend of the day</div>
          <input
            value={friend}
            onChange={(e) => setFriend(e.target.value)}
            aria-label="friend name"
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
          <div style={{ fontSize: 14, opacity: 0.7 }}>prompt</div>
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
            {current}
          </div>
          <button
            onClick={reroll}
            style={{
              marginTop: 8,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #000",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            new prompt
          </button>
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
          <a
            href={smsHref}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            open messages
          </a>
          <button
            onClick={() => copy(sms)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #000",
              background: "transparent",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            copy sms
          </button>
          <button
            onClick={copyLink}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #000",
              background: "transparent",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            copy link
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

