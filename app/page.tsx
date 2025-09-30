"use client";

import Image from "next/image";

export default function Home() {
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
            const subject = encodeURIComponent("playdate early access");
            const bodyLines = [
              "please add me to the waitlist.",
              "",
              `email: ${email}`,
              phone ? `phone (optional): ${phone}` : "",
            ].filter(Boolean);
            const body = encodeURIComponent(bodyLines.join("\n"));
            window.location.href = `mailto:support@todaysplaydate.com?subject=${subject}&body=${body}`;
          }}
          style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}
        >
          <label style={{ display: "block", width: "100%" }}>
  <span style={{ fontSize: 12, opacity: 0.7, display: "block", marginBottom: 4 }}>email (required)</span>
  <input
    id="email"
    type="email"
    name="email"
    required
    placeholder="your email"
    autoComplete="email"
    inputMode="email"
    autoCapitalize="none"
    spellCheck={false}
    style={{ width: "100%", padding: "10px 12px", border: "1px solid #000", borderRadius: 8 }}
  />
</label>

<label style={{ display: "block", width: "100%" }}>
  <span style={{ fontSize: 12, opacity: 0.7, display: "block", marginTop: 8, marginBottom: 4 }}>phone (optional)</span>
  <input
    id="phone"
    type="tel"
    name="phone"
    placeholder="your phone"
    autoComplete="tel"
    inputMode="tel"
    pattern="^[0-9+\\-\\s()]{7,}$"
    style={{ width: "100%", padding: "10px 12px", border: "1px solid #000", borderRadius: 8 }}
  />
</label>


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


        <p style={{ marginTop: 12, fontSize: 14, opacity: 0.7 }}>
          coming soon to todaysplaydate.com
        </p>
      </div>
    </main>
  );
}

