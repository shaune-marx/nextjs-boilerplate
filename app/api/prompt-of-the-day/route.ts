import { NextResponse } from "next/server";
import prompts from "@/app/data/prompts.json";

// Updated to reflect current labels.
type Prompt = { text: string; type: "question" | "picture question" };

// simple stable hash of a string → integer
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Parse "YYYY-MM-DD" as a UTC date
function parseUTC(key: string) {
  // Safe because we explicitly add Z (UTC) and zero time.
  return new Date(`${key}T00:00:00Z`);
}

function formatUTC(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function prevDayKey(key: string) {
  const dt = parseUTC(key);
  dt.setUTCDate(dt.getUTCDate() - 1);
  return formatUTC(dt);
}

function indexForKey(key: string, len: number) {
  return hash(key) % len;
}

function isPicture(p: Prompt | undefined) {
  return p?.type === "picture question";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keyParam = url.searchParams.get("key"); // optional: "YYYY-MM-DD"

  // default key = today's UTC date
  const today = new Date();
  const y = today.getUTCFullYear();
  const m = String(today.getUTCMonth() + 1).padStart(2, "0");
  const d = String(today.getUTCDate()).padStart(2, "0");
  const utcKey = `${y}-${m}-${d}`;

  const key = keyParam && /^\d{4}-\d{2}-\d{2}$/.test(keyParam) ? keyParam : utcKey;

  const arr = prompts as Prompt[];
  const n = arr.length;

  // Candidate based on today's key
  let i = indexForKey(key, n);
  let item = arr[i];

  // If today and yesterday would both be "picture question",
  // walk forward to the next non-picture deterministically.
  if (isPicture(item)) {
    const yKey = prevDayKey(key);
    const j = indexForKey(yKey, n);
    const yesterday = arr[j];

    if (isPicture(yesterday)) {
      // Find next non-picture index, wrapping around.
      let k = (i + 1) % n;
      let steps = 0;
      while (steps < n && isPicture(arr[k])) {
        k = (k + 1) % n;
        steps++;
      }
      // Only switch if we actually found a non-picture
      if (steps < n && !isPicture(arr[k])) {
        i = k;
        item = arr[i];
      }
      // If all are pictures (edge case), we just keep the original i
    }
  }

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
