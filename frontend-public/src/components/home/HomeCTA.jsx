import Button from "../ui/Button.jsx";

export default function HomeCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="home-cta">
          <div>
            <div className="home-cta-title">Ready to start?</div>
            <div className="home-cta-text">
              Share your idea—website, app, branding, AI, or automation—and we’ll respond with a plan and quote.
            </div>
          </div>

          <div className="home-cta-actions">
            <Button as="a" href="/start-project" variant="primary">Start a Project</Button>
            <Button as="a" href="/contact" variant="secondary">Contact</Button>
          </div>
        </div>
      </div>
    </section>
  );
}