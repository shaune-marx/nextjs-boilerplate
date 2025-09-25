export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, textTransform: "lowercase" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>privacy</h1>
      <p style={{ marginBottom: 12 }}>
        we respect your privacy. we only collect the information you give us (like email and, if you choose, a phone number).
      </p>
      <p style={{ marginBottom: 12 }}>
        how we use it: to contact you about playdate, to send daily prompts (if you opt in), and to improve the product.
      </p>
      <p style={{ marginBottom: 12 }}>
        data sharing: we don’t sell your data. we may use trusted processors (like hosting, email, or analytics) to run the service.
      </p>
      <p style={{ marginBottom: 12 }}>
        sms: if you opt in to texts, you can reply <strong>stop</strong> to cancel and <strong>help</strong> for help. msg &amp; data rates may apply.
      </p>
      <p style={{ marginBottom: 12 }}>
        contact: questions? email <a href="mailto:support@todaysplaydate.com">support@todaysplaydate.com</a>.
      </p>
      <p style={{ opacity: 0.7, fontSize: 12 }}>
        last updated: {new Date().toISOString().slice(0, 10)}
      </p>
    </main>
  );
}
