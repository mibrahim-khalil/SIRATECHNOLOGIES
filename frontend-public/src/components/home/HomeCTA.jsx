import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import { useSite } from "../../context/SiteContext.jsx";

export default function HomeCTA() {
  const { settings } = useSite();

  const siteName = settings?.siteName || "SIRA Technologies";
  const tagline =
    settings?.shortDescription ||
    "Share your idea—website, app, branding, AI, or automation—and we'll respond with a plan and quote.";

  return (
    <section className="section">
      <div className="container">
        <div className="home-cta">
          <div>
            <div className="home-cta-title">Ready to work with {siteName}?</div>
            <div className="home-cta-text">{tagline}</div>
          </div>

          <div className="home-cta-actions">
            <Button as={Link} to="/start-project" variant="primary">
              Start a Project
            </Button>
            <Button as={Link} to="/contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}