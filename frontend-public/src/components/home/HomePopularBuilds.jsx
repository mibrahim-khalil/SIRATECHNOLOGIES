import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import client from "../../api/client.js";

const FALLBACK = [
  { _id: "f1", title: "Business Website", description: "Multi-page professional site with lead capture." },
  { _id: "f2", title: "Portfolio Website", description: "Premium portfolio for individuals/agencies." },
  { _id: "f3", title: "Landing Page", description: "Fast, modern landing page optimized for conversions." },
  { _id: "f4", title: "Admin Dashboard", description: "Manage content, leads, users, and data." },
  { _id: "f5", title: "Brand Kit", description: "Logo, colors, typography, and templates." },
  { _id: "f6", title: "Website Redesign", description: "Modern UI refresh + performance improvements." },
];

function IconRocket() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export default function HomePopularBuilds() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/popular-builds");
        if (!cancelled) {
          const list = data?.data?.items || data?.data?.builds || [];
          setBuilds(list);
        }
      } catch (err) {
        console.warn("[HomePopularBuilds] Fetch failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const items = builds.length > 0 ? builds.slice(0, 6) : FALLBACK;

  return (
    <section className="section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">Popular builds</h2>
          <p className="home-sub">Quick starting points—customizable to your needs.</p>
        </div>

        {loading ? (
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
            {items.map((b) => (
              <div key={b._id} className="build-card">
                <div className="build-media">
                  {b.image?.url ? (
                    <img src={b.image.url} alt={b.title} />
                  ) : (
                    <div className="build-media-fallback" aria-hidden="true">
                      <IconRocket />
                    </div>
                  )}
                </div>
                <div className="build-body">
                  <div className="build-title">{b.title}</div>
                  <div className="build-text">{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="home-actions">
          <Button as={Link} to="/pricing" variant="secondary">View Pricing</Button>
          <Button as={Link} to="/start-project" variant="primary">Start a Project</Button>
        </div>
      </div>
    </section>
  );
}