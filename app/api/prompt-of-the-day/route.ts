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

export async function GET() {
  const arr = prompts as Prompt[];
  // use UTC date so everyone sees the same prompt globally
  const today = new Date();
  const y = today.getUTCFullYear();
  const m = String(today.getUTCMonth() + 1).padStart(2, "0");
  const d = String(today.getUTCDate()).padStart(2, "0");
  const key = `${y}-${m}-${d}`; // e.g., 2025-09-29

  const i = hash(key) % arr.length;
  const item = arr[i];

  return NextResponse.json({ index: i, ...item, date: key });
}
