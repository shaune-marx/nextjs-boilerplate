export default function NotFound() {
  return (
    <main style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: 24, textTransform: "lowercase" }}>
      <div style={{ maxWidth: 720, textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>page not found</h1>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          looks like this orbit doesn’t exist. want to head back home?
        </p>
        <a href="/" style={{ textDecoration: "underline" }}>go to homepage</a>
      </div>
    </main>
  );
}
