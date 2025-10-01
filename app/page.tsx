"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
 export default function Home() {
  const [compose, setCompose] = useState<null | {
    to: string;
    subject: string;
    body: string;
    mailto: string;
    gmail: string;
    outlook: string;
    yahoo: string;
  }>(null);
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: "24px" }}>
      <div style={{ maxWidth: 720, textTransform: "lowercase" }}>
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src="/playdate-logo.png"
            alt="playdate"
            width={320}  // adjust if you want larger/smaller
            height={86}
            priority
          />
        </div>

        <p style={{ fontSize: "20px", margin: "0 0 24px" }}>
          want to keep your friends in your orbit? we&apos;ll send you a fun question every day,
          addressed to someone you want to talk to more often.
        </p>

        <form
  onSubmit={(e) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    const to = "support@todaysplaydate.com";
    const subject = "playdate early access";
    const bodyLines = [
      "please add me to the waitlist.",
      "",
      `email: ${email}`,
      phone ? `phone (optional): ${phone}` : "",
    ].filter(Boolean);

    const body = bodyLines.join("\n");

    // encoded pieces
    const su = encodeURIComponent(subject);
    const bo = encodeURIComponent(body);
    const toEnc = encodeURIComponent(to);

    // build links
    const mailto = `mailto:${to}?subject=${su}&body=${bo}`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEnc}&su=${su}&body=${bo}`;
    const outlook = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${toEnc}&subject=${su}&body=${bo}`;
    const yahoo = `https://compose.mail.yahoo.com/?to=${toEnc}&subject=${su}&body=${bo}`;

    setCompose({ to, subject, body, mailto, gmail, outlook, yahoo });
  }}
  style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}
>
  {/* keep your existing labeled inputs + button exactly as they are */}
  {/* …email label/input… */}
  {/* …phone label/input… */}
  <button
    type="submit"
    style={{
      padding: "12px 18px",
      borderRadius: 10,
      textDecoration: "none",
      border: "1px solid #000",
      fontWeight: 600,
      background: "transparent",
      cursor: "pointer",
    }}
  >
    sign up
  </button>
</form>

        {compose && (
  <div
    style={{
      marginTop: 8,
      padding: 12,
      border: "1px solid #000",
      borderRadius: 10,
      boxShadow: "4px 4px 0 #000",
      background: "#fff",
      maxWidth: 520,
    }}
  >
    <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>
      choose your email app:
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <a href={compose.gmail} target="_blank" rel="noopener noreferrer"
        style={{ padding: "10px 14px", border: "1px solid #000", borderRadius: 10, textDecoration: "none" }}>
        open gmail
      </a>
      <a href={compose.outlook} target="_blank" rel="noopener noreferrer"
        style={{ padding: "10px 14px", border: "1px solid #000", borderRadius: 10, textDecoration: "none" }}>
        open outlook
      </a>
      <a href={compose.yahoo} target="_blank" rel="noopener noreferrer"
        style={{ padding: "10px 14px", border: "1px solid #000", borderRadius: 10, textDecoration: "none" }}>
        open yahoo mail
      </a>
      <a href={compose.mailto}
        style={{ padding: "10px 14px", border: "1px solid #000", borderRadius: 10, textDecoration: "none" }}>
        default mail app
      </a>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              `To: ${compose.to}\nSubject: ${compose.subject}\n\n${compose.body}`
            );
            alert("copied details to clipboard");
          } catch {/* ignore */}
        }}
        style={{ padding: "10px 14px", border: "1px solid #000", borderRadius: 10, background: "transparent", fontWeight: 600, cursor: "pointer" }}
      >
        copy details
      </button>
      <button
        onClick={() => setCompose(null)}
        style={{ padding: "10px 14px", border: "1px solid #000", borderRadius: 10, background: "transparent", fontWeight: 600, cursor: "pointer" }}
      >
        cancel
      </button>
    </div>
  </div>
)}


        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
  by sharing your phone, you agree to receive texts from playdate (up to 1/day). reply stop to cancel, help for help. msg & data rates may apply. see{" "}
  <a href="/terms" style={{ textDecoration: "underline" }}>terms</a> &nbsp;and&nbsp;
  <a href="/privacy" style={{ textDecoration: "underline" }}>privacy</a>.
</p>


        <p style={{ marginTop: 16 }}>
  <a href="/friends" style={{ textDecoration: "underline" }}>
    add your friends ↗
  </a>
</p>

      </div>
    </main>
  );
}

