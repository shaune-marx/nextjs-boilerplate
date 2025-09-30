"use client";

import { useState, useEffect } from "react";

function shuffleStable<T>(arr: T[], seed = 42) {
  // deterministic shuffle
  const a = arr.slice();
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function localKeyFor10amCutover(): string {
  const now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth();
  let d = now.getDate();
  if (now.getHours() < 10) {
    const yday = new Date(y, m, d - 1);
    y = yday.getFullYear(); m = yday.getMonth(); d = yday.getDate();
  }
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}


export default function FriendsPage() {
  // 20 inputs
  const [names, setNames] = useState<string[]>(
    Array.from({ length: 20 }, () => "")
  );

  // --- load on mount, save on change (this is the snippet you asked about) ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem("playdate_friends");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const next = Array.from({ length: 20 }, (_, i) => (arr[i] || ""));
          setNames(next);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("playdate_friends", JSON.stringify(names));
    } catch {
      // ignore
    }
  }, [names]);
  // --- end persistence snippet ---

  const filled = names.map((n) => n.trim()).filter(Boolean);

  const [selected, setSelected] = useState<string>("");
useEffect(() => {
  // pick the first filled name by default
  setSelected(filled[0] || "");
}, [filled]);


  const sendToday = async () => {
  if (!selected) return;
  try {
    const key = localKeyFor10amCutover();
    const res = await fetch(`/api/prompt-of-the-day?key=${key}`, { cache: "no-store" });
    if (!res.ok) throw new Error("failed");
    const data = await res.json(); // { text: string }
    const sms = `hey ${selected}! ${data.text}`;
    window.location.href = `sms:?&body=${encodeURIComponent(sms)}`;
  } catch {
    alert("couldn’t fetch today’s prompt — please try again.");
  }
};


  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 720, textTransform: "lowercase" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>friends</h1>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          add up to 20 friends you want to talk to more often.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}
        >
          {names.map((val, i) => (
            <input
              key={i}
              value={val}
              onChange={(e) => {
                const next = names.slice();
                next[i] = e.target.value;
                setNames(next);
              }}
              placeholder={`friend ${i + 1}`}
              style={{ padding: "10px 12px", border: "1px solid #000", borderRadius: 8 }}
            />
          ))}
        </form>

       

<div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
  <select
    value={selected}
    onChange={(e) => setSelected(e.target.value)}
    style={{ padding: "10px 12px", border: "1px solid #000", borderRadius: 8 }}
  >
    {filled.length === 0 ? (
      <option value="">add friends above</option>
    ) : (
      filled.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))
    )}
  </select>

  <a
    href={selected ? `/invite?f=${encodeURIComponent(selected)}` : "#"}
    style={{
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid #000",
      fontWeight: 600,
      textDecoration: "none",
      pointerEvents: selected ? "auto" : "none",
      opacity: selected ? 1 : 0.5,
    }}
  >
    open invite
  </a>
</div>

<button
  onClick={sendToday}
  style={{
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #000",
    background: "transparent",
    fontWeight: 600,
    cursor: selected ? "pointer" : "default",
    opacity: selected ? 1 : 0.5,
  }}
  disabled={!selected}
>
  send to your friend
</button>

        
        
      </div>
    </main>
  );
}

