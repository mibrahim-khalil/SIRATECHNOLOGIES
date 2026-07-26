import { useEffect, useState } from "react";
import Button from "./Button.jsx";
import client from "../../api/client.js";

/**
 * PageHero component — supports both static and dynamic (DB-backed) content.
 *
 * Usage:
 *   Static (backward compatible):
 *     <PageHero title="..." subtitle="..." image="..." primaryCtaLabel="..." ... />
 *
 *   Dynamic (fetches from /api/heroes/:pageKey):
 *     <PageHero pageKey="home" title="fallback title" ... />
 *
 * If pageKey is provided, DB values override props. Props act as fallback.
 */
export default function PageHero({
  pageKey = null,
  title: propTitle = "SIRA Technologies",
  subtitle: propSubtitle = "",
  image: propImage = "/assets/hero.jpg",
  align = "left",
  primaryCtaLabel: propPrimaryCtaLabel = "Start a Project",
  primaryCtaTo: propPrimaryCtaTo = "/start-project",
  secondaryCtaLabel: propSecondaryCtaLabel = "View Work",
  secondaryCtaTo: propSecondaryCtaTo = "/portfolio",
}) {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(!!pageKey);

  useEffect(() => {
    if (!pageKey) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get(`/heroes/${pageKey}`);
        if (!cancelled) {
          setHero(data?.data?.hero || null);
        }
      } catch (err) {
        console.warn(`[PageHero] Failed to load hero for "${pageKey}":`, err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  // Merge: DB values first, fall back to props
  const title = hero?.title || propTitle;
  const subtitle = hero?.subtitle ?? propSubtitle;
  const image = hero?.image?.url || propImage;
  const primaryCtaLabel = hero?.primaryCtaLabel || propPrimaryCtaLabel;
  const primaryCtaTo = hero?.primaryCtaTo || propPrimaryCtaTo;
  const secondaryCtaLabel = hero?.secondaryCtaLabel || propSecondaryCtaLabel;
  const secondaryCtaTo = hero?.secondaryCtaTo || propSecondaryCtaTo;

  const isCenter = align === "center";

  // Optional skeleton while fetching (subtle - no big flash)
  if (loading) {
    return (
      <section className="page-hero page-hero-skeleton">
        <div className="page-hero-scrim" />
        <div className="page-hero-content">
          <div className="container">
            <div className={`page-hero-inner ${isCenter ? "center" : ""}`}>
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-sub" />
              <div className="skeleton skeleton-sub" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-hero">
      <div
        className="page-hero-media"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="page-hero-scrim" />

      <div className="page-hero-content">
        <div className="container">
          <div className={`page-hero-inner ${isCenter ? "center" : ""}`}>
            <h1 className="page-hero-title">{title}</h1>

            {subtitle ? <p className="page-hero-sub">{subtitle}</p> : null}

            {(primaryCtaLabel || secondaryCtaLabel) && (
              <div className="page-hero-actions">
                {primaryCtaLabel && (
                  <Button as="a" href={primaryCtaTo} variant="primary">
                    {primaryCtaLabel}
                  </Button>
                )}
                {secondaryCtaLabel && (
                  <Button as="a" href={secondaryCtaTo} variant="secondary">
                    {secondaryCtaLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}