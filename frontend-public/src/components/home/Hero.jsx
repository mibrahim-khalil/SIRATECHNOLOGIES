import Button from "../ui/Button.jsx";

export default function Hero() {
  // Put an image at: frontend-public/public/assets/hero.jpg
  const heroImage = "/assets/hero.jpg";

  return (
    <section className="campaign">
      <div
        className="campaign-media"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="campaign-scrim" />

      <div className="campaign-content">
        <div className="campaign-inner">
          <h1 className="campaign-title">BUILD. SCALE. AUTOMATE.</h1>
          <div className="campaign-sub">
            SIRA Technologies builds modern websites, web apps, AI solutions, and automation —
            with design that feels fast and engineering that lasts.
          </div>

          <div className="campaign-actions">
            <Button as="a" href="/contact" variant="primary">
              Start a Project
            </Button>
            <Button as="a" href="/portfolio" variant="outlineOnImage">
              View Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}