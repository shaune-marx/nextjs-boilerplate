export default function TermsPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, textTransform: "lowercase" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>terms</h1>

      <p style={{ marginBottom: 12 }}>
        welcome to playdate. by using todaysplaydate.com you agree to these terms.
      </p>

      <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>use of the service</h2>
      <p style={{ marginBottom: 12 }}>
        playdate sends prompts and messages for you to share with friends. you’re responsible for how you use the service and for the content you send.
      </p>

      <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>accounts & contact info</h2>
      <p style={{ marginBottom: 12 }}>
        if you share an email or phone number, you confirm it’s yours and accurate. you can opt out of emails anytime, and for sms you can reply <strong>stop</strong> to cancel and <strong>help</strong> for help.
      </p>

      <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>acceptable use</h2>
      <p style={{ marginBottom: 12 }}>
        don’t misuse the service, break laws, or harass others. we may limit or suspend access for abuse or security reasons.
      </p>

      <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>privacy</h2>
      <p style={{ marginBottom: 12 }}>
        see our <a href="/privacy" style={{ textDecoration: "underline" }}>privacy</a> page for how we handle data.
      </p>

      <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>disclaimers & liability</h2>
      <p style={{ marginBottom: 12 }}>
        playdate is provided “as is.” to the extent allowed by law, we’re not liable for indirect or consequential damages.
      </p>

      <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>changes</h2>
      <p style={{ marginBottom: 12 }}>
        we may update these terms. if we make material changes, we’ll post them here with a new date.
      </p>


<hr className="my-6" />

<h2 className="text-lg font-semibold mb-2">privacy policy</h2>

<div className="space-y-3">
  <p>
    we respect your privacy. we only collect the information you give us (like email and, if you choose, a phone number).
  </p>
  <p>
    how we use it: to contact you about playdate, to send daily prompts (if you opt in), and to improve the product.
  </p>
  <p>
    data sharing: we don’t sell your data. we may use trusted processors (like hosting, email, or analytics) to run the service.
  </p>
  <p>
    sms: if you opt in to texts, you can reply stop to cancel and help for help. msg &amp; data rates may apply.
  </p>


      
      <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>contact</h2>
      <p style={{ marginBottom: 12 }}>
        questions? email <a href="mailto:support@todaysplaydate.com">support@todaysplaydate.com</a>.
      </p>

      <p style={{ opacity: 0.7, fontSize: 12 }}>
        last updated: {new Date().toISOString().slice(0, 10)}
      </p>
    </main>
  );
}
