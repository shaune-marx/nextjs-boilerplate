import { NextResponse } from "next/server";
import prompts from "@/app/data/prompts.json";

// ✅ kill all caching / static optimization
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Prompt = { text: string; type?: string };

// simple stable hash of a string → integer
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// parse "YYYY-MM-DD" and return YYYY-MM-DD for previous calendar day
function prevDay(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function isPicture(t: string | undefined) {
  return (t ?? "").toLowerCase().includes("picture");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keyParam = url.searchParams.get("key"); // expected "YYYY-MM-DD"

  // default key = today's UTC date
  const today = new Date();
  const y = today.getUTCFullYear();
  const m = String(today.getUTCMonth() + 1).padStart(2, "0");
  const d = String(today.getUTCDate()).padStart(2, "0");
  const utcKey = `${y}-${m}-${d}`;

  const key = keyParam && /^\d{4}-\d{2}-\d{2}$/.test(keyParam) ? keyParam : utcKey;

  const arr = (prompts as Prompt[]).filter(p => p && p.text); // guard
  const n = arr.length;
  if (n === 0) {
    return NextResponse.json(
      { index: 0, text: "no prompts available", type: "other", date: key },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  // base index from the key
  let i = hash(key) % n;

  // ensure we don't have two "picture question" in a row (based on previous day)
  const prevKey = prevDay(key);
  const prevIndex = hash(prevKey) % n;

  if (isPicture(arr[i].type) && isPicture(arr[prevIndex].type)) {
    // walk forward until not picture (guaranteed to terminate if there's any non-picture)
    let tries = 0;
    while (tries < n && isPicture(arr[i].type)) {
      i = (i + 1) % n;
      tries++;
    }
  }

  const item = arr[i];

  return NextResponse.json(
    { index: i, ...item, date: key },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

