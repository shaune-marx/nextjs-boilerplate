import { NextResponse } from "next/server";
import prompts from "@/app/data/prompts.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Prompt = { text: string; type?: string };

const isPicture = (t?: string) => (t ?? "").toLowerCase().includes("picture");

// ---------- utilities ----------
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(arr: T[], rnd: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
function daysBetweenUTC(aYMD: string, bYMD: string) {
  const [ay, am, ad] = aYMD.split("-").map(Number);
  const [by, bm, bd] = bYMD.split("-").map(Number);
  const a = Date.UTC(ay, am - 1, ad);
  const b = Date.UTC(by, bm - 1, bd);
  const ms = b - a;
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

// ---------- build a stable, no-repeat permutation ----------
const ALL: Prompt[] = (prompts as Prompt[]).filter((p) => p && p.text);
const N = ALL.length;

// Seed is derived from prompt content so changing the list reshuffles deterministically
const seedString = ALL.map((p) => (p.text ?? "") + "|" + (p.type ?? "")).join("\u0001");
const rnd = mulberry32(hash(seedString) || 1);

// Start from a simple shuffled order of indices
const baseOrder = shuffle([...Array(N).keys()], rnd);

// Repair step: try to avoid adjacent picture questions by swapping with next non-picture
const order = [...baseOrder];
if (N > 1) {
  for (let i = 1; i < N; i++) {
    const prev = order[i - 1];
    const curr = order[i];
    if (isPicture(ALL[prev].type) && isPicture(ALL[curr].type)) {
      // find next non-picture to swap with
      let j = i + 1;
      while (j < N && isPicture(ALL[order[j]].type)) j++;
      if (j < N) {
        [order[i], order[j]] = [order[j], order[i]];
      }
      // if none found, we leave it as-is (unavoidable when most/all are pictures)
    }
  }
}

// Epoch: stable anchor date for the cycle
const EPOCH = "2025-01-01"; // YYYY-MM-DD

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keyParam = url.searchParams.get("key"); // expected "YYYY-MM-DD"

  // default key = today's UTC date
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const utcKey = `${y}-${m}-${d}`;

  const key = keyParam && /^\d{4}-\d{2}-\d{2}$/.test(keyParam) ? keyParam : utcKey;

  if (N === 0) {
    return NextResponse.json(
      { index: 0, text: "no prompts available", type: "other", date: key },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  // Index into the permutation by day offset since EPOCH
  const offset = daysBetweenUTC(EPOCH, key);
  const idx = order[mod(offset, N)];
  const item = ALL[idx];

  return NextResponse.json(
    { index: idx, ...item, date: key },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}


