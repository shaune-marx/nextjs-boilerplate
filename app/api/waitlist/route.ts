import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, phone } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
    }

    // log to vercel function logs (handy for debugging)
    console.log("waitlist signup:", {
      email,
      phone: phone || null,
      ts: new Date().toISOString(),
    });

    // send a notification email to you
    try {
      await resend.emails.send({
        from: "playdate <notifications@resend.dev>", // this can be any verified sender in Resend
        to: "support@todaysplaydate.com",            // change if you prefer a different inbox
        subject: "new playdate waitlist signup",
        text: [
          "new waitlist signup:",
          `email: ${email}`,
          phone ? `phone (optional): ${phone}` : "",
          `time: ${new Date().toISOString()}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    } catch (e) {
      // don't fail the signup just because email send failed
      console.error("resend error", e);
    }

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
