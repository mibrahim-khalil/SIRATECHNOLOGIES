export default function ServicesPreview() {
  const items = [
    ["Graphic Design & Branding", "Visual identity, social media, marketing assets."],
    ["UI/UX Design", "Modern interfaces and smooth user journeys."],
    ["Full-Stack Web Development", "Fast, secure, scalable web apps."],
    ["AI & Machine Learning", "Smart systems, predictive models, custom AI apps."],
    ["Automation Solutions", "Workflows and integrations to save time."]
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 className="display" style={{ fontSize: 30, marginBottom: 18 }}>What we offer</h2>

        <div style={{ display: "grid", gap: 14 }}>
          {items.map(([title, desc]) => (
            <div key={title} style={{ padding: "14px 0", borderBottom: "1px solid var(--hairline)" }}>
              <div style={{ color: "var(--ink)", fontWeight: 500 }}>{title}</div>
              <div style={{ color: "var(--body)", marginTop: 6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}