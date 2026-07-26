import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import client from "../../api/client.js";

function IconStar({ filled = false }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.75-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c1 0 1.25.25 1.25 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    </svg>
  );
}

/**
 * Strip leading/trailing quotes if user typed them —
 * we always render our own opening quote.
 */
function cleanMessage(msg = "") {
  return msg
    .trim()
    .replace(/^["'“”‘’]+/, "")
    .replace(/["'“”‘’]+$/, "")
    .trim();
}

export default function HomeReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/reviews");
        if (!cancelled) {
          const list = data?.data?.reviews || [];
          const sorted = [...list].sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return 0;
          });
          setReviews(sorted.slice(0, 6));
        }
      } catch (err) {
        console.warn("[HomeReviews] Fetch failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="section reviews-section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">What clients say</h2>
          <p className="home-sub">
            Real feedback from teams we've had the pleasure to build with.
          </p>
        </div>

        {loading ? (
          <div className="reviews-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="review-tile">
                <div className="skeleton skeleton-line" style={{ width: 100 }} />
                <div className="skeleton skeleton-line" style={{ marginTop: 14 }} />
                <div className="skeleton skeleton-line" style={{ width: "90%" }} />
                <div className="skeleton skeleton-line" style={{ width: "70%" }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((r) => {
              const message = cleanMessage(r.message);
              const initial = (r.name || "?").charAt(0).toUpperCase();
              return (
                <div key={r._id} className="review-tile">
                  <div className="review-tile-quote" aria-hidden="true">
                    <IconQuote />
                  </div>

                  <div className="review-tile-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < r.rating
                            ? "review-star review-star-on"
                            : "review-star"
                        }
                      >
                        <IconStar filled={i < r.rating} />
                      </span>
                    ))}
                  </div>

                  <p className="review-tile-message">{message}</p>

                  <div className="review-tile-author">
                    <div className="review-tile-avatar">
                      {r.avatar?.url ? (
                        <img src={r.avatar.url} alt={r.name || "Client"} />
                      ) : (
                        <span className="review-tile-avatar-fallback">
                          {initial}
                        </span>
                      )}
                    </div>
                    <div className="review-tile-author-info">
                      <div className="review-tile-name">{r.name || "Anonymous"}</div>
                      {(r.role || r.company) && (
                        <div className="review-tile-role">
                          {r.role}
                          {r.role && r.company && " · "}
                          {r.company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="home-actions">
          <Button as={Link} to="/contact" variant="secondary">
            Share your feedback
          </Button>
          <Button as={Link} to="/start-project" variant="primary">
            Start Your Project
          </Button>
        </div>
      </div>
    </section>
  );
}