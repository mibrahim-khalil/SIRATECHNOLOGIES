import { useEffect, useState } from "react";
import client from "../../api/client.js";

const FALLBACK = [
  { _id: "f1", number: "01", title: "Discover", description: "We clarify goals, users, scope, and success metrics." },
  { _id: "f2", number: "02", title: "Design", description: "UI/UX, wireframes, and a clean visual direction." },
  { _id: "f3", number: "03", title: "Build", description: "Modern, secure development with scalable structure." },
  { _id: "f4", number: "04", title: "Launch & Improve", description: "Deploy, monitor, and iterate for growth." },
];

export default function HomeProcess() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/process");
        if (!cancelled) {
          const list = data?.data?.items || data?.data?.steps || [];
          setSteps(list);
        }
      } catch (err) {
        console.warn("[HomeProcess] Fetch failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const items = steps.length > 0 ? steps : FALLBACK;

  return (
    <section className="section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">How we work</h2>
          <p className="home-sub">A simple process that keeps delivery fast and clear.</p>
        </div>

        {loading ? (
          <div className="process-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="process-card">
                <div className="skeleton skeleton-line" style={{ width: 30 }} />
                <div className="skeleton skeleton-line" style={{ marginTop: 12 }} />
                <div className="skeleton skeleton-line" style={{ width: "80%" }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="process-grid">
            {items.map((s) => (
              <div key={s._id} className="process-card">
                <div className="process-n">{s.number}</div>
                <div className="process-title">{s.title}</div>
                <div className="process-text">{s.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}