import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import client from "../../api/client.js";

const FALLBACK = [
  { _id: "f1", title: "Business Website + Lead Capture", shortDescription: "A clean structure designed to convert visitors into leads.", category: "Web" },
  { _id: "f2", title: "Admin Dashboard Web App", shortDescription: "Secure CRUD, roles, and scalable architecture.", category: "Web" },
  { _id: "f3", title: "Brand Kit + Social Templates", shortDescription: "Consistent identity across platforms.", category: "Branding" },
];

function IconImage() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

export default function HomeWork() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/portfolio");
        if (!cancelled) {
          // ✅ FIX: backend returns { data: { portfolios: [...] } }
          const list =
            data?.data?.portfolios ||
            data?.data?.items ||
            data?.data?.projects ||
            data?.data?.portfolio ||
            [];

          const sorted = [...list].sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return (a.order || 0) - (b.order || 0);
          });
          setProjects(sorted.slice(0, 3));
        }
      } catch (err) {
        console.warn("[HomeWork] Fetch failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const items = projects.length > 0 ? projects : FALLBACK;

  return (
    <section className="section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">Selected work</h2>
          <p className="home-sub">A few examples of what we can build.</p>
        </div>

        {loading ? (
          <div className="home-work-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="home-work-card">
                <div className="skeleton skeleton-work-media" />
                <div style={{ padding: 16 }}>
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line" style={{ width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-work-grid">
            {items.map((p) => (
              <Link
                key={p._id}
                to="/portfolio"
                className="home-work-card home-work-card-link"
              >
                <div className="home-work-media">
                  {p.coverImage?.url ? (
                    <img src={p.coverImage.url} alt={p.title} />
                  ) : (
                    <div className="home-work-media-fallback" aria-hidden="true">
                      <IconImage />
                      <span>Preview</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  {p.category && (
                    <span className="home-work-cat">{p.category}</span>
                  )}
                  <div className="home-card-title" style={{ marginTop: p.category ? 8 : 0 }}>
                    {p.title}
                  </div>
                  <div className="home-card-text">{p.shortDescription}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="home-actions">
          <Button as={Link} to="/portfolio" variant="secondary">View All Work</Button>
          <Button as={Link} to="/start-project" variant="primary">Build Something Similar</Button>
        </div>
      </div>
    </section>
  );
}
