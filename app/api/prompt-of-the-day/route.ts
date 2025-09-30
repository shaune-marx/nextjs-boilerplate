import { NextResponse } from "next/server";
import prompts from "@/app/data/prompts.json";

type Prompt = { text: string; type: "photo_caption" | "would_you_rather" | "question" | "other" };

// simple stable hash of a string → integer
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
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
  const i = hash(key) % arr.length;
  const item = arr[i];

  return NextResponse.json(
  { index: i, ...item, date: key },
  {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  }
);


