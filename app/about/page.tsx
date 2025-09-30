export default function AboutPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, textTransform: "lowercase" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>about playdate</h1>
      <p style={{ marginBottom: 12 }}>
        we all have friends and family we wish we talked to more often. playdate turns staying connected into a game. every day, playdate randomly matches you with one of your friends so you can send them the daily invitation to play. it&apos;s fun, it&apos;s quick, and it helps us keep our friends in our orbit ✨
      </p>
      <p style={{ marginTop: 16 }}>
        questions? <a href="mailto:support@todaysplaydate.com" style={{ textDecoration: "underline" }}>email support</a>.
      </p>
    </main>
  );
}
