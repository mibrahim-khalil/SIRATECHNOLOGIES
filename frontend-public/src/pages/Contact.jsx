import { useState } from "react";
import Button from "../components/ui/Button.jsx";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // Later: send to backend /api/contact
    alert("Message saved locally (connect backend API next).");
  };

  const inputStyle = {
    width: "100%",
    height: 40,
    padding: "8px 16px",
    borderRadius: "var(--rounded-full)",
    border: "1px solid var(--hairline)",
    outline: "none",
    fontSize: 16
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="display" style={{ fontSize: 36, lineHeight: 1.12, marginBottom: 12 }}>
          Contact
        </h1>
        <p style={{ marginTop: 0 }}>
          Tell us what you want to build. We’ll reply with the next steps.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 12, maxWidth: 560 }}>
          <input
            style={inputStyle}
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            style={inputStyle}
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={onChange}
            required
          />

          <textarea
            name="message"
            placeholder="Project details"
            value={form.message}
            onChange={onChange}
            required
            rows={6}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "18px",
              border: "1px solid var(--hairline)",
              outline: "none",
              fontSize: 16,
              resize: "vertical"
            }}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Button type="submit">Send message</Button>
            <Button as="a" href="mailto:hello@siratechnologies.com" variant="secondary">
              Email us
            </Button>
          </div>

          <div style={{ color: "var(--mute)", fontSize: 12 }}>
            Tip: connect this form to your backend `/api/contact` route next.
          </div>
        </form>
      </div>
    </section>
  );
}