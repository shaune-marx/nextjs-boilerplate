"use client";

import { useEffect, useMemo, useState } from "react";
import prompts from "../data/prompts.json";

type Prompt = { text: string; type: "photo_caption" | "would_you_rather" | "question" | "other" };

export default function InviteDemo() {
  const [friend, setFriend] = useState("jordan");

  // pick a random prompt on first load
  const [index, setIndex] = useState<number>(() => Math.floor(Math.random() * (prompts as Prompt[]).length));

  // current prompt text
  const current = useMemo(() => (prompts as Prompt[])[index]?.text ?? "", [index]);

  // re-roll handler
  const reroll = () => {
    const max = (prompts as Prompt[]).length;
    let next = Math.floor(Math.random() * max);
    if (next === index && max > 1) next = (next + 1) % max; // avoid same prompt twice
    setIndex(next);
  };

  // suggested sms body
  const sms = `hey ${friend}! ${current}`;
  const smsHref = `sms:?&body=${encodeURIComponent(sms)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sms);
      alert("copied to clipboard");
    } catch {
      alert("copy failed — you can select and copy manually.");
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
            onClick={copy}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #000",
              background: "transparent",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            copy
          </button>
        </div>
      </div>
    </main>
  );
}
