import Button from "../ui/Button.jsx";

const items = [
  { title: "Full‑Stack Web Development", text: "MERN apps, dashboards, APIs, secure auth, integrations." },
  { title: "UI/UX Design", text: "Modern interfaces, flows, prototypes, and design systems." },
  { title: "Logo & Branding", text: "Logos, brand kits, identity systems, and marketing assets." },
  { title: "Landing Pages", text: "High‑conversion pages for products, services, and campaigns." },
  { title: "AI / Machine Learning", text: "AI features, models, data-driven insights, prototypes." },
  { title: "Automation", text: "Workflow automation, integrations, and efficiency solutions." }
];

export default function HomeServices() {
  return (
    <section className="section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">Services</h2>
          <p className="home-sub">
            A complete stack of design + engineering to ship real results.
          </p>
        </div>

        <div className="home-grid">
          {items.map((it) => (
            <div key={it.title} className="home-card">
              <div className="home-card-media" aria-hidden="true" />
              <div className="home-card-title">{it.title}</div>
              <div className="home-card-text">{it.text}</div>
            </div>
          ))}
        </div>

        <div className="home-actions">
          <Button as="a" href="/services" variant="secondary">Explore Services</Button>
          <Button as="a" href="/start-project" variant="primary">Start a Project</Button>
        </div>
      </div>
    </section>
  );
}