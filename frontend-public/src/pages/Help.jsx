import Button from "../components/ui/Button.jsx";
import { Link } from "react-router-dom";

export default function Help() {
  return (
    <section className="section">
      <div className="container">
        <h1 style={{ margin: 0, color: "var(--ink)", fontSize: 36, lineHeight: 1.1 }}>
          Help
        </h1>
        <p style={{ color: "var(--mute)", marginTop: 10, maxWidth: 720 }}>
          Need support or have a question? Send us details and we’ll respond with the next steps.
        </p>

        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button as={Link} to="/contact" variant="primary">
            Contact Support
          </Button>
          <Button as={Link} to="/services" variant="secondary">
            View Services
          </Button>
        </div>
      </div>
    </section>
  );
}