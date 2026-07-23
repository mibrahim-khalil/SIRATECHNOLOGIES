import Button from "../components/ui/Button.jsx";
import { Link } from "react-router-dom";

export default function StartProject() {
  return (
    <section className="section">
      <div className="container">
        <h1 style={{ margin: 0, color: "var(--ink)", fontSize: 36, lineHeight: 1.1 }}>
          Start a Project
        </h1>
        <p style={{ color: "var(--mute)", marginTop: 10, maxWidth: 720 }}>
          Tell us what you want to build (website, web app, AI feature, automation). We’ll reply with a plan and quote.
        </p>

        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button as={Link} to="/contact" variant="primary">
            Send Requirements
          </Button>
          <Button as={Link} to="/portfolio" variant="secondary">
            See Work
          </Button>
        </div>
      </div>
    </section>
  );
}