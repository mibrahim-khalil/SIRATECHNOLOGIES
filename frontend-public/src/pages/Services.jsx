import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Check, ChevronDown, HelpCircle } from "lucide-react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";
import client from "../api/client.js";
import { useSite } from "../context/SiteContext.jsx";

/* ---------- Helper: render lucide icon from string name ---------- */
function DynamicIcon({ name, size = 28, fallback = "Sparkles" }) {
  const IconComp =
    LucideIcons[name] || LucideIcons[fallback] || LucideIcons.Sparkles;
  return <IconComp size={size} strokeWidth={1.8} />;
}

/* ---------- Service Card ---------- */
function ServiceCard({ service }) {
  const hasImage = !!service.image?.url;

  return (
    <div className="svc-page-card">
      <div className="svc-page-card-head">
        {hasImage ? (
          <div className="svc-page-icon svc-page-icon-image">
            <img src={service.image.url} alt={service.title} />
          </div>
        ) : (
          <div className="svc-page-icon">
            <DynamicIcon name={service.icon || "Code"} size={28} />
          </div>
        )}
      </div>

      <div className="svc-page-title">{service.title}</div>
      <div className="svc-page-desc">
        {service.description || service.shortDescription}
      </div>

      {service.features?.length > 0 && (
        <ul className="svc-page-features">
          {service.features.map((f, i) => (
            <li key={i}>
              <span className="svc-page-check">
                <Check size={13} strokeWidth={3} />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="svc-page-actions">
        <Button as={Link} to="/start-project" variant="primary">
          Get a Quote
        </Button>
        <Button as={Link} to="/contact" variant="secondary">
          Discuss
        </Button>
      </div>
    </div>
  );
}

/* ---------- Popular Build Card ---------- */
function BuildTile({ build }) {
  return (
    <div className="build-card">
      <div className="build-media">
        {build.image?.url ? (
          <img src={build.image.url} alt={build.title} />
        ) : (
          <div className="build-media-fallback" aria-hidden="true">
            <LucideIcons.Rocket size={28} />
          </div>
        )}
      </div>
      <div className="build-body">
        <div className="build-title">{build.title}</div>
        <div className="build-text">{build.description}</div>
      </div>
    </div>
  );
}

/* ---------- FAQ Accordion Item ---------- */
function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? "faq-item-open" : ""}`}>
      <button
        type="button"
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{faq.question}</span>
        <span className="faq-icon">
          <ChevronDown size={18} />
        </span>
      </button>
      <div className="faq-answer" aria-hidden={!isOpen}>
        <div className="faq-answer-inner">{faq.answer}</div>
      </div>
    </div>
  );
}

/* ============================================
   MAIN SERVICES PAGE
   ============================================ */
const FALLBACK_BUILDS = [
  { _id: "b1", title: "Business Website", description: "Multi-page professional site with lead capture." },
  { _id: "b2", title: "Portfolio Website", description: "Premium portfolio for individuals/agencies." },
  { _id: "b3", title: "Landing Page", description: "Fast, modern landing page optimized for conversions." },
  { _id: "b4", title: "Admin Dashboard", description: "Manage content, leads, users, and data." },
];

export default function Services() {
  const { services, loading: servicesLoading } = useSite();

  const [builds, setBuilds] = useState([]);
  const [buildsLoading, setBuildsLoading] = useState(true);

  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [openFaqId, setOpenFaqId] = useState(null);

  // Load Popular Builds
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
        console.warn("[Services] Builds fetch failed:", err.message);
      } finally {
        if (!cancelled) setBuildsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load FAQs — ONLY services category
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Filter FAQs by category=services
        const { data } = await client.get("/faqs?category=services");
        if (!cancelled) {
          const list = data?.data?.items || data?.data?.faqs || [];
          setFaqs(list);
        }
      } catch (err) {
        console.warn("[Services] FAQs fetch failed:", err.message);
      } finally {
        if (!cancelled) setFaqsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const buildsData = builds.length > 0 ? builds.slice(0, 6) : FALLBACK_BUILDS;
  const hasServices = services && services.length > 0;

  return (
    <>
      {/* HERO — dynamic from PageHero */}
      <PageHero
        pageKey="services"
        title="Services"
        subtitle="Everything you need to design, build, and scale a modern digital product."
        image="/assets/services-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="See Work"
        secondaryCtaTo="/portfolio"
      />

      {/* ============ CORE SERVICES ============ */}
      <section className="section">
        <div className="container">
          <div className="services-head">
            <h2 className="services-h2">What we do</h2>
            <p className="services-sub">
              Built with a product mindset: clear scope, clean design, strong
              engineering, and measurable outcomes.
            </p>
          </div>

          {servicesLoading && !hasServices ? (
            <div className="svc-page-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="svc-page-card">
                  <div className="skeleton skeleton-icon" style={{ width: 56, height: 56, borderRadius: 16 }} />
                  <div className="skeleton skeleton-line" style={{ marginTop: 20 }} />
                  <div className="skeleton skeleton-line" style={{ width: "90%" }} />
                  <div className="skeleton skeleton-line" style={{ width: "70%" }} />
                </div>
              ))}
            </div>
          ) : hasServices ? (
            <div className="svc-page-grid">
              {services.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          ) : (
            <div className="services-empty">
              <div className="services-empty-icon">
                <LucideIcons.Package size={40} />
              </div>
              <div className="services-empty-title">Services coming soon</div>
              <div className="services-empty-text">
                We're preparing our service catalog. In the meantime, contact us to
                discuss your project.
              </div>
              <Button as={Link} to="/contact" variant="primary">
                Get in touch
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ============ POPULAR BUILDS ============ */}
      <section className="section builds-section-bg">
        <div className="container">
          <div className="services-head">
            <h2 className="services-h2">Popular builds</h2>
            <p className="services-sub">
              Quick starting points — we can customize any of these based on your
              requirements.
            </p>
          </div>

          {buildsLoading ? (
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
              {buildsData.map((b) => (
                <BuildTile key={b._id} build={b} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="section">
        <div className="container">
          <div className="svc-cta-banner">
            <div className="svc-cta-content">
              <div className="svc-cta-title">Not sure what you need?</div>
              <div className="svc-cta-text">
                Tell us your goal and we'll recommend the right solution, scope,
                and timeline.
              </div>
            </div>
            <div className="svc-cta-actions">
              <Button as={Link} to="/start-project" variant="primary">
                Start a Project
              </Button>
              <Button as={Link} to="/pricing" variant="secondary">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICE-RELATED FAQs ============ */}
      {(faqsLoading || faqs.length > 0) && (
        <section className="section">
          <div className="container">
            <div className="services-head services-head-center">
              <div className="svc-faq-badge">
                <HelpCircle size={16} />
                <span>Frequently asked</span>
              </div>
              <h2 className="services-h2">Questions about our services</h2>
              <p className="services-sub">
                Quick answers to help you get started faster.
              </p>
            </div>

            {faqsLoading ? (
              <div className="faq-list">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="faq-item">
                    <div style={{ padding: "18px 20px" }}>
                      <div className="skeleton skeleton-line" style={{ width: "60%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="faq-list">
                {faqs.map((faq) => (
                  <FaqItem
                    key={faq._id}
                    faq={faq}
                    isOpen={openFaqId === faq._id}
                    onToggle={() =>
                      setOpenFaqId(openFaqId === faq._id ? null : faq._id)
                    }
                  />
                ))}
              </div>
            )}

            <div className="svc-faq-footer">
              <div className="text-mute">Have a different question?</div>
              <Button as={Link} to="/help" variant="secondary">
                See all FAQs
              </Button>
              <Button as={Link} to="/contact" variant="primary">
                Ask us anything
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}