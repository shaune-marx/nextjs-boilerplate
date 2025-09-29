"use client";

import { useMemo, useState } from "react";

function shuffleStable<T>(arr: T[], seed = 42) {
  // deterministic shuffle (so reloading shows the same order)
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

export default function FriendsPage() {
  const [names, setNames] = useState<string[]>(
    Array.from({ length: 20 }, () => "")
  );

  const filled = names.map(n => n.trim()).filter(Boolean);

  // simple 7-day rotation preview, no repeats
  const schedule = useMemo(() => {
    if (filled.length === 0) return [];
    const order = shuffleStable(filled, 123); // fixed seed for now
    const days = 7;
    // repeat the list if fewer than 7 names
    const picks = Array.from({ length: days }, (_, i) => order[i % order.length]);
    return picks;
  }, [filled]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 720, textTransform: "lowercase" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>friends</h1>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          add up to 20 friends you want to talk to more often. below is a 7-day preview (no repeats if you have 7+ names).
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

        <div style={{ border: "1px solid #000", borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>7-day rotation preview</div>
          {schedule.length === 0 ? (
            <div style={{ opacity: 0.7 }}>add at least one name to see the schedule</div>
          ) : (
            <ol style={{ paddingLeft: 18, margin: 0 }}>
              {schedule.map((n, idx) => (
                <li key={idx} style={{ margin: "6px 0" }}>
                  day {idx + 1}: {n}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </main>
  );
}
