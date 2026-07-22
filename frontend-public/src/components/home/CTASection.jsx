import Button from "../ui/Button.jsx";

export default function CTASection() {
  return (
    <section className="section">
      <div className="container">
        <div style={{
          background: "var(--surface-dark)",
          color: "var(--on-dark)",
          borderRadius: "var(--rounded-lg)",
          padding: "24px 28px",
          border: "1px solid var(--hairline)"
        }}>
          <div className="display" style={{ fontSize: 24, marginBottom: 8, color: "var(--on-dark)" }}>
            Your data stays yours.
          </div>
          <div style={{ color: "var(--on-dark-mute)", marginBottom: 14 }}>
            We build with privacy, security, and maintainability in mind from day one.
          </div>
          <Button as="a" href="/contact" style={{ background: "#fff", color: "#000" }}>
            Start a project
          </Button>
        </div>
      </div>
    </section>
  );
}