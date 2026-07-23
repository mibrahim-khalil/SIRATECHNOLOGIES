import Button from "../ui/Button.jsx";

const builds = [
  { title: "Business Website", text: "Multi-page professional site with lead capture." },
  { title: "Portfolio Website", text: "Premium portfolio for individuals/agencies." },
  { title: "Landing Page", text: "Fast, modern landing page optimized for conversions." },
  { title: "Admin Dashboard", text: "Manage content, leads, users, and data." },
  { title: "Brand Kit", text: "Logo, colors, typography, and templates." },
  { title: "Website Redesign", text: "Modern UI refresh + performance improvements." }
];

export default function HomePopularBuilds() {
  return (
    <section className="section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">Popular builds</h2>
          <p className="home-sub">Quick starting points—customizable to your needs.</p>
        </div>

        <div className="home-grid">
          {builds.map((b) => (
            <div key={b.title} className="home-card">
              <div className="home-card-media" aria-hidden="true" />
              <div className="home-card-title">{b.title}</div>
              <div className="home-card-text">{b.text}</div>
            </div>
          ))}
        </div>

        <div className="home-actions">
          <Button as="a" href="/pricing" variant="secondary">View Pricing</Button>
          <Button as="a" href="/start-project" variant="primary">Start a Project</Button>
        </div>
      </div>
    </section>
  );
}