import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";

function ServiceCard({ title, desc, bullets, tag }) {
  return (
    <div className="service-card">
      <div className="service-card-top">
        <div className="service-icon" aria-hidden="true" />
        {tag ? <div className="service-tag">{tag}</div> : null}
      </div>

      <div className="service-title">{title}</div>
      <div className="service-desc">{desc}</div>

      <ul className="service-list">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <div className="service-actions">
        <Button as="a" href="/start-project" variant="primary">
          Start a Project
        </Button>
        <Button as="a" href="/contact" variant="secondary">
          Contact
        </Button>
      </div>
    </div>
  );
}

function OfferTile({ title, text }) {
  return (
    <div className="offer-tile">
      <div className="offer-media" aria-hidden="true" />
      <div className="offer-title">{title}</div>
      <div className="offer-text">{text}</div>
    </div>
  );
}

export default function Services() {
  const coreServices = [
    {
      title: "Full‑Stack Web Development",
      tag: "MERN",
      desc: "Secure, scalable, and high‑performance web applications tailored to your business.",
      bullets: ["Responsive websites & web apps", "APIs, dashboards & admin panels", "Auth, roles, payments, integrations"]
    },
    {
      title: "UI/UX Design",
      tag: "Design",
      desc: "Modern interfaces and user journeys that improve usability, trust, and conversions.",
      bullets: ["Wireframes & prototypes", "Design systems & UI kits", "User flows + product UX"]
    },
    {
      title: "Graphic Design & Branding",
      tag: "Brand",
      desc: "A clear brand identity that looks professional and stays consistent everywhere.",
      bullets: ["Logo + brand guidelines", "Social media templates", "Marketing & pitch assets"]
    },
    {
      title: "AI & Machine Learning",
      tag: "AI",
      desc: "Intelligent features and systems that help you automate decisions and insights.",
      bullets: ["AI-powered features for apps", "Predictive / classification models", "Data-driven dashboards"]
    },
    {
      title: "Automation Solutions",
      tag: "Automation",
      desc: "Smart workflows that reduce manual work and keep teams moving faster.",
      bullets: ["Workflow automation", "Tool integrations", "Notifications & reporting"]
    },
    {
      title: "Marketing & Growth (Digital)",
      tag: "Growth",
      desc: "Improve visibility and conversion with clean content, SEO basics, and performance.",
      bullets: ["Landing page conversion optimization", "SEO-ready structure", "Performance + speed improvements"]
    }
  ];

  const productizedOffers = [
    {
      title: "Landing Pages",
      text: "Fast, modern landing pages for services, startups, and campaigns."
    },
    {
      title: "Portfolio Websites",
      text: "Personal or agency portfolios designed to look premium and convert."
    },
    {
      title: "Business Websites",
      text: "Multi-page company sites with content sections and lead capture."
    },
    {
      title: "Admin Dashboards",
      text: "Manage services, portfolio items, leads, users, and content."
    },
    {
      title: "Logo & Brand Kit",
      text: "Logo, color palette, typography, and social media templates."
    },
    {
      title: "Website Redesign",
      text: "Modern UI refresh + speed + structure improvements for better results."
    }
  ];

  return (
    <>
      <PageHero
        title="Services"
        subtitle="Everything you need to design, build, and scale a modern digital product."
        image="/assets/services-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="See Work"
        secondaryCtaTo="/portfolio"
      />

      {/* Core Services */}
      <section className="section">
        <div className="container">
          <div className="services-head">
            <h2 className="services-h2">Core services</h2>
            <p className="services-sub">
              Built with a product mindset: clear scope, clean design, strong engineering, and measurable outcomes.
            </p>
          </div>

          <div className="services-grid">
            {coreServices.map((s) => (
              <ServiceCard
                key={s.title}
                title={s.title}
                desc={s.desc}
                bullets={s.bullets}
                tag={s.tag}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Productized Offers */}
      <section className="section">
        <div className="container">
          <div className="services-head">
            <h2 className="services-h2">Popular builds</h2>
            <p className="services-sub">
              Quick ways to start. We can customize any of these based on your requirements.
            </p>
          </div>

          <div className="offers-grid">
            {productizedOffers.map((o) => (
              <OfferTile key={o.title} title={o.title} text={o.text} />
            ))}
          </div>

          <div className="services-cta">
            <div>
              <div className="services-cta-title">Not sure what you need?</div>
              <div className="services-cta-text">
                Tell us your goal and we’ll recommend the best solution and scope.
              </div>
            </div>

            <div className="services-cta-actions">
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
    </>
  );
}