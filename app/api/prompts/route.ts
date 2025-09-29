import { NextResponse } from "next/server";
import prompts from "@/app/data/prompts.json";

type Prompt = { text: string; type: "photo_caption" | "would_you_rather" | "question" | "other" };

export async function GET() {
  const arr = prompts as Prompt[];
  const i = Math.floor(Math.random() * arr.length);
  return NextResponse.json({ index: i, ...arr[i] });
}
