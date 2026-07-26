import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import { useSite } from "../../context/SiteContext.jsx";

const FALLBACK = [
  { _id: "f1", title: "Full-Stack Web Development", shortDescription: "MERN apps, dashboards, APIs, secure auth, integrations." },
  { _id: "f2", title: "UI/UX Design", shortDescription: "Modern interfaces, flows, prototypes, and design systems." },
  { _id: "f3", title: "Logo & Branding", shortDescription: "Logos, brand kits, identity systems, and marketing assets." },
  { _id: "f4", title: "Landing Pages", shortDescription: "High-conversion pages for products, services, and campaigns." },
  { _id: "f5", title: "AI / Machine Learning", shortDescription: "AI features, models, data-driven insights, prototypes." },
  { _id: "f6", title: "Automation", shortDescription: "Workflow automation, integrations, and efficiency solutions." },
];

/* Fallback service icon — used when no image uploaded */
function IconService() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export default function HomeServices() {
  const { services, loading } = useSite();
  const items = services?.length > 0 ? services.slice(0, 6) : FALLBACK;

  return (
    <section className="section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">Services</h2>
          <p className="home-sub">
            A complete stack of design + engineering to ship real results.
          </p>
        </div>

        {loading && services.length === 0 ? (
          <div className="builds-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="build-card">
                <div className="skeleton build-media-skeleton" />
                <div style={{ padding: 16 }}>
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line" style={{ width: "80%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="builds-grid">
            {items.map((s) => (
              <Link
                key={s._id}
                to="/services"
                className="build-card build-card-link"
              >
                <div className="build-media">
                  {s.image?.url ? (
                    <img src={s.image.url} alt={s.title} />
                  ) : (
                    <div className="build-media-fallback" aria-hidden="true">
                      <IconService />
                    </div>
                  )}
                </div>
                <div className="build-body">
                  <div className="build-title">{s.title}</div>
                  <div className="build-text">
                    {s.shortDescription || s.description?.slice(0, 100)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="home-actions">
          <Button as={Link} to="/services" variant="secondary">
            Explore Services
          </Button>
          <Button as={Link} to="/start-project" variant="primary">
            Start a Project
          </Button>
        </div>
      </div>
    </section>
  );
}