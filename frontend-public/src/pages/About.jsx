import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";
import TeamSection from "../components/about/TeamSection.jsx";
import client from "../api/client.js";
import { useSite } from "../context/SiteContext.jsx";

/* ---------- Helper: render lucide icon from string name ---------- */
function DynamicIcon({ name, size = 22, fallback = "Sparkles" }) {
  const IconComp = LucideIcons[name] || LucideIcons[fallback] || LucideIcons.Sparkles;
  return <IconComp size={size} strokeWidth={2} />;
}

/* ---------- Fallback content if AboutContent doc doesn't exist yet ---------- */
const FALLBACK_ABOUT = {
  heading: "About SIRA Technologies",
  subheading: "Building Digital Solutions That Drive Innovation",
  storyTitle: "Our Story",
  storyContent:
    "SIRA Technologies is a digital solutions company focused on building innovative, scalable, and future-ready technology solutions. We help businesses transform ideas into powerful digital products by combining creativity, engineering expertise, and emerging technologies.",
  storyImage: null,
  mission:
    "To empower businesses with modern, scalable technology that drives real growth and lasting impact.",
  vision:
    "To become a trusted digital innovation partner for businesses worldwide by creating impactful, scalable, and intelligent technology solutions.",
  stats: [
    { value: "50+", label: "Projects delivered", icon: "TrendingUp" },
    { value: "10+", label: "Happy clients", icon: "Users" },
    { value: "100%", label: "Client satisfaction", icon: "Heart" },
    { value: "24/7", label: "Support available", icon: "Clock" },
  ],
  values: [
    { title: "Innovation", description: "We embrace new ideas and cutting-edge technology.", icon: "Lightbulb" },
    { title: "Quality", description: "We deliver excellence in every line of code.", icon: "Award" },
    { title: "Integrity", description: "Honest communication and transparent processes.", icon: "Shield" },
    { title: "Speed", description: "Fast delivery without sacrificing quality.", icon: "Zap" },
  ],
  teamSectionTitle: "Meet Our Team",
  teamSectionSubtitle: "The brilliant minds behind SIRA Technologies.",
  ctaTitle: "Ready to work with us?",
  ctaSubtitle: "Let's build something amazing together.",
  ctaButtonText: "Get in touch",
  ctaButtonLink: "/contact",
};

export default function About() {
  const { settings } = useSite();
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/about");
        if (!cancelled) {
          setAbout(data?.data?.about || null);
        }
      } catch (err) {
        console.warn("[About] Fetch failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Merge DB values with fallbacks — DB wins
  const content = {
    ...FALLBACK_ABOUT,
    ...(about || {}),
    stats: about?.stats?.length ? about.stats : FALLBACK_ABOUT.stats,
    values: about?.values?.length ? about.values : FALLBACK_ABOUT.values,
  };

  const hasStats = content.stats && content.stats.length > 0;
  const hasValues = content.values && content.values.length > 0;
  const hasMission = !!content.mission?.trim();
  const hasVision = !!content.vision?.trim();
  const hasStory = !!content.storyContent?.trim();
  const siteName = settings?.siteName || "SIRA Technologies";

  return (
    <>
      {/* Dynamic hero */}
      <PageHero
        pageKey="about"
        title={content.heading || "About " + siteName}
        subtitle={content.subheading || "Building Digital Solutions That Drive Innovation"}
        image="/assets/about-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Contact"
        secondaryCtaTo="/contact"
      />

      {/* ============ STORY + MISSION/VISION ============ */}
      {(hasStory || hasMission || hasVision) && (
        <section className="section">
          <div className="container">
            <div className="about-split">
              {/* Left: Story */}
              <div>
                {hasStory && (
                  <>
                    <h2 className="about-h2">{content.storyTitle || "Our Story"}</h2>
                    {content.storyImage?.url && (
                      <div className="about-story-image">
                        <img
                          src={content.storyImage.url}
                          alt={content.storyTitle || "Our Story"}
                        />
                      </div>
                    )}
                    {content.storyContent.split("\n\n").map((para, i) => (
                      <p key={i} className="about-p">
                        {para}
                      </p>
                    ))}
                  </>
                )}
              </div>

              {/* Right: Mission / Vision cards */}
              <div className="about-mv-stack">
                {hasMission && (
                  <div className="about-card about-mv-card">
                    <div className="about-mv-icon about-mv-icon-mission">
                      <DynamicIcon name="Target" size={20} />
                    </div>
                    <div className="about-card-title">Our Mission</div>
                    <div className="about-card-text">{content.mission}</div>
                  </div>
                )}

                {hasVision && (
                  <div className="about-card about-mv-card">
                    <div className="about-mv-icon about-mv-icon-vision">
                      <DynamicIcon name="Eye" size={20} />
                    </div>
                    <div className="about-card-title">Our Vision</div>
                    <div className="about-card-text">{content.vision}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ STATS / BY THE NUMBERS ============ */}
      {hasStats && (
        <section className="section stats-section">
          <div className="container">
            <div className="about-head-center">
              <h2 className="about-h2">By the numbers</h2>
              <p className="about-p about-p-center">
                Results that speak for themselves.
              </p>
            </div>

            <div className="stats-grid-public">
              {content.stats.map((s, i) => (
                <div key={i} className="stat-tile">
                  <div className="stat-tile-icon">
                    <DynamicIcon name={s.icon || "TrendingUp"} size={26} />
                  </div>
                  <div className="stat-tile-value">{s.value}</div>
                  <div className="stat-tile-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CORE VALUES ============ */}
      {hasValues && (
        <section className="section">
          <div className="container">
            <div className="about-head-center">
              <h2 className="about-h2">Core Values</h2>
              <p className="about-p about-p-center">
                The principles that guide everything we do.
              </p>
            </div>

            <div className="values-grid">
              {content.values.map((v, i) => (
                <div key={i} className="value-card">
                  <div className="value-icon">
                    <DynamicIcon name={v.icon || "Heart"} size={24} />
                  </div>
                  <div className="value-title">{v.title}</div>
                  {v.description && (
                    <div className="value-text">{v.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TEAM ============ */}
      <TeamSection
        title={content.teamSectionTitle}
        subtitle={content.teamSectionSubtitle}
      />

      {/* ============ CTA ============ */}
      <section className="section">
        <div className="container">
          <div className="home-cta about-cta-final">
            <div>
              <div className="home-cta-title">
                {content.ctaTitle || `Ready to work with ${siteName}?`}
              </div>
              {content.ctaSubtitle && (
                <div className="home-cta-text">{content.ctaSubtitle}</div>
              )}
            </div>

            <div className="home-cta-actions">
              <Button
                as={Link}
                to={content.ctaButtonLink || "/contact"}
                variant="primary"
              >
                {content.ctaButtonText || "Get in touch"}
              </Button>
              <Button as={Link} to="/portfolio" variant="secondary">
                See Our Work
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}