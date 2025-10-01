import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, phone } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
    }

    // TODO: save to a database or send a notification (e.g., Vercel Postgres, Supabase, or Resend)
    console.log("waitlist signup:", {
      email,
      phone: phone || null,
      ts: new Date().toISOString(),
    });

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request" }, { status: 400 });
  }
}
