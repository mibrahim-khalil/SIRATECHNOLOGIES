import Button from "../components/ui/Button.jsx";

function PricingCard({ title, desc, price, dark, ctaText }) {
  const style = dark
    ? { background: "var(--surface-dark)", color: "var(--on-dark)", border: "1px solid var(--hairline)" }
    : { background: "var(--canvas)", color: "var(--ink)", border: "1px solid var(--hairline)" };

  const muted = dark ? "var(--on-dark-mute)" : "var(--body)";

  return (
    <div className="card" style={{ ...style, padding: 24 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ color: muted, marginBottom: 14 }}>{desc}</div>

      <div
        className="display"
        style={{
          fontSize: 30,
          marginBottom: 14,
          color: dark ? "var(--on-dark)" : "var(--ink)"
        }}
      >
        {price}
      </div>

      <Button
        as="a"
        href="/contact"
        style={dark ? { background: "#fff", color: "#000" } : undefined}
      >
        {ctaText}
      </Button>
    </div>
  );
}

export default function Pricing() {
  const faqs = [
    ["How do you price projects?", "By scope: pages/screens, features, timeline, and integrations."],
    ["Do you offer revisions?", "Yes. We include revision rounds depending on the package and scope."],
    ["Can you maintain the website?", "Yes. We can provide ongoing support, updates, and improvements."],
    ["Do you build admin dashboards?", "Yes. We can deliver an admin panel to manage content, leads, or users."]
  ];

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="display" style={{ fontSize: 36, lineHeight: 1.12, marginBottom: 12 }}>
            Pricing
          </h1>
          <p style={{ marginTop: 0 }}>
            These are starting points. Final quotes depend on your exact requirements.
          </p>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
            }}
          >
            <PricingCard
              title="Starter"
              desc="Landing page or small website"
              price="$"
              ctaText="Get Starter"
            />
            <PricingCard
              title="Pro"
              desc="Full website + integrations"
              price="$$"
              ctaText="Get Pro"
            />
            <PricingCard
              title="Max"
              desc="Web app + admin + AI/automation"
              price="$$$"
              dark
              ctaText="Get Max"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="display" style={{ fontSize: 30, marginBottom: 18 }}>
            Frequently asked questions
          </h2>

          <div>
            {faqs.map(([q, a]) => (
              <div key={q} style={{ padding: "16px 0", borderBottom: "1px solid var(--hairline)" }}>
                <div style={{ color: "var(--ink)", fontWeight: 500, marginBottom: 6 }}>{q}</div>
                <div style={{ color: "var(--body)" }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}