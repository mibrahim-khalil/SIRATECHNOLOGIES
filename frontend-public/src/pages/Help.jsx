import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";

function HelpCard({ title, text, primaryLabel, primaryTo, secondaryLabel, secondaryTo }) {
  return (
    <div className="help-card">
      <div className="help-card-title">{title}</div>
      <div className="help-card-text">{text}</div>

      <div className="help-card-actions">
        <Button as="a" href={primaryTo} variant="primary">
          {primaryLabel}
        </Button>
        {secondaryLabel ? (
          <Button as="a" href={secondaryTo} variant="secondary">
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function FAQRow({ q, a }) {
  return (
    <div className="help-faq-row">
      <div className="help-faq-q">{q}</div>
      <div className="help-faq-a">{a}</div>
    </div>
  );
}

export default function Help() {
  const faqs = [
    {
      q: "How do we start working together?",
      a: "Go to Start a Project and send your requirements. We’ll reply with questions (if needed), then share a plan, quote, and timeline."
    },
    {
      q: "Do you build websites and web apps?",
      a: "Yes. We build landing pages, business websites, portfolios, dashboards, and full MERN web applications."
    },
    {
      q: "Can you redesign my existing website?",
      a: "Yes. We can modernize UI, improve speed, fix structure, and rebuild with a cleaner codebase if needed."
    },
    {
      q: "Do you provide support after delivery?",
      a: "Yes. We can offer maintenance and improvements depending on your needs."
    }
  ];

  return (
    <>
      <PageHero
        title="Help"
        subtitle="Quick answers, support, and the fastest way to start your project."
        image="/assets/help-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Contact"
        secondaryCtaTo="/contact"
      />

      {/* Quick actions */}
      <section className="section">
        <div className="container">
          <div className="help-head">
            <h2 className="help-h2">Quick actions</h2>
            <p className="help-sub">
              Choose the fastest path. If you’re not sure, start a project and we’ll guide you.
            </p>
          </div>

          <div className="help-grid">
            <HelpCard
              title="Start a new project"
              text="Send your idea, target audience, and required features. We’ll reply with the next steps."
              primaryLabel="Start a Project"
              primaryTo="/start-project"
              secondaryLabel="See Work"
              secondaryTo="/portfolio"
            />

            <HelpCard
              title="Pricing & packages"
              text="See starting packages like gigs. Final pricing depends on scope and features."
              primaryLabel="View Pricing"
              primaryTo="/pricing"
              secondaryLabel="Services"
              secondaryTo="/services"
            />

            <HelpCard
              title="Need support"
              text="Have a question or need updates on an ongoing project? Contact us and we’ll respond quickly."
              primaryLabel="Contact"
              primaryTo="/contact"
              secondaryLabel="WhatsApp"
              secondaryTo="https://wa.me/000000000000"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="help-head">
            <h2 className="help-h2">FAQ</h2>
            <p className="help-sub">Common questions about process, pricing, and delivery.</p>
          </div>

          <div className="help-faq">
            {faqs.map((f) => (
              <FAQRow key={f.q} q={f.q} a={f.a} />
            ))}
          </div>

          <div className="help-cta">
            <div>
              <div className="help-cta-title">Still need help?</div>
              <div className="help-cta-text">
                Send your message and we’ll reply with clear next steps.
              </div>
            </div>

            <div className="help-cta-actions">
              <Button as="a" href="/contact" variant="primary">
                Contact
              </Button>
              <Button as="a" href="/start-project" variant="secondary">
                Start a Project
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}