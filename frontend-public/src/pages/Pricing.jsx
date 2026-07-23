import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";

function Feature({ children }) {
  return (
    <div className="price-feature">
      <span className="price-check" aria-hidden="true">✓</span>
      <span>{children}</span>
    </div>
  );
}

function PricingCard({
  title,
  subtitle,
  price,
  note,
  features,
  popular,
  ctaLabel = "Choose Plan",
  ctaTo = "/start-project"
}) {
  return (
    <div className={`price-card ${popular ? "popular" : ""}`}>
      {popular ? <div className="price-badge">Most Popular</div> : null}

      <div className="price-title">{title}</div>
      <div className="price-subtitle">{subtitle}</div>

      <div className="price-row">
        <div className="price-amount">{price}</div>
        {note ? <div className="price-note">{note}</div> : null}
      </div>

      {note ? <div className="price-note-mobile">{note}</div> : null}

      <div className="price-features">
        {features.map((f) => (
          <Feature key={f}>{f}</Feature>
        ))}
      </div>

      <div className="price-actions">
        <Button as="a" href={ctaTo} variant={popular ? "primary" : "secondary"} style={{ width: "100%" }}>
          {ctaLabel}
        </Button>
      </div>

      <div className="price-foot">
        Final cost depends on scope (pages, features, integrations).
      </div>
    </div>
  );
}

function Addon({ title, price, text }) {
  return (
    <div className="addon">
      <div className="addon-top">
        <div className="addon-title">{title}</div>
        <div className="addon-price">{price}</div>
      </div>
      <div className="addon-text">{text}</div>
    </div>
  );
}

export default function Pricing() {
  const plans = [
    {
      title: "Starter",
      subtitle: "Landing page / simple website",
      price: "$99+",
      note: "Best for: personal, small business",
      features: [
        "1 page (responsive)",
        "Modern UI layout",
        "Contact section",
        "Basic SEO setup",
        "Fast loading + clean structure"
      ]
    },
    {
      title: "Business",
      subtitle: "Multi‑page company website",
      price: "$299+",
      note: "Best for: services, agencies, startups",
      popular: true,
      features: [
        "Up to 5 pages",
        "Custom sections + animations",
        "Contact form (frontend)",
        "SEO-ready structure",
        "Deployment support"
      ]
    },
    {
      title: "Pro Web App",
      subtitle: "Web app + admin dashboard",
      price: "$699+",
      note: "Best for: platforms, dashboards",
      features: [
        "MERN stack web app",
        "Admin panel (CRUD)",
        "Authentication + roles",
        "API integration",
        "Scalable folder structure"
      ]
    }
  ];

  const addons = [
    { title: "Logo + Brand Kit", price: "$49+", text: "Logo, colors, typography, brand guidelines." },
    { title: "UI/UX Prototype", price: "$79+", text: "Wireframes + clickable Figma prototype." },
    { title: "AI Feature", price: "$199+", text: "Basic AI integration / ML feature prototype." },
    { title: "Automation Workflow", price: "$99+", text: "Integrations + automated processes (custom)." }
  ];

  const faqs = [
    ["Do you offer revisions?", "Yes. Revisions depend on the package and scope."],
    ["Do you provide hosting/domain?", "We can guide you. Hosting/domain are usually paid by the client."],
    ["Can you build exactly like my reference?", "Yes, share a reference and we can match it closely."],
    ["How do we start?", "Click “Start a Project” and send your requirements. We’ll respond with next steps."]
  ];

  return (
    <>
      <PageHero
        title="Pricing"
        subtitle="Simple packages like gigs. Final quote depends on scope."
        image="/assets/pricing-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="See Work"
        secondaryCtaTo="/portfolio"
      />

      {/* Plans */}
      <section className="section">
        <div className="container">
          <div className="pricing-head">
            <h2 className="pricing-h2">Packages</h2>
            <p className="pricing-sub">
              Choose a starting point. We’ll confirm requirements and finalize the quote.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((p) => (
              <PricingCard
                key={p.title}
                title={p.title}
                subtitle={p.subtitle}
                price={p.price}
                note={p.note}
                features={p.features}
                popular={p.popular}
                ctaLabel="Start with this"
                ctaTo="/start-project"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section">
        <div className="container">
          <div className="pricing-head">
            <h2 className="pricing-h2">Add‑ons</h2>
            <p className="pricing-sub">Upgrade your package with extra services.</p>
          </div>

          <div className="addons-grid">
            {addons.map((a) => (
              <Addon key={a.title} title={a.title} price={a.price} text={a.text} />
            ))}
          </div>

          <div className="pricing-cta">
            <div>
              <div className="pricing-cta-title">Want an exact quote?</div>
              <div className="pricing-cta-text">Send your requirements and we’ll reply with pricing + timeline.</div>
            </div>

            <div className="pricing-cta-actions">
              <Button as="a" href="/start-project" variant="primary">
                Start a Project
              </Button>
              <Button as="a" href="/contact" variant="secondary">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="pricing-head">
            <h2 className="pricing-h2">FAQ</h2>
            <p className="pricing-sub">Quick answers before you start.</p>
          </div>

          <div className="faq">
            {faqs.map(([q, a]) => (
              <div key={q} className="faq-row">
                <div className="faq-q">{q}</div>
                <div className="faq-a">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}