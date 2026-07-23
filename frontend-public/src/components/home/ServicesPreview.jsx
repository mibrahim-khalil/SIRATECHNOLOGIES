const ITEMS = [
  { title: "Branding", desc: "Identity, social media, marketing assets." },
  { title: "UI/UX Design", desc: "Clean flows, modern interfaces." },
  { title: "Web Development", desc: "Fast, secure, scalable apps." },
  { title: "AI / ML", desc: "Intelligent features and models." },
  { title: "Automation", desc: "Workflow + integrations that save time." },
  { title: "Admin Dashboards", desc: "Manage content, leads, and data." }
];

export default function ServicesPreview() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h2 style={{ margin: 0, color: "var(--ink)" }}>Featured Solutions</h2>
          <a href="/services">All services</a>
        </div>

        <div style={{ height: 12 }} />

        <div className="grid grid-3">
          {ITEMS.map((it) => (
            <div key={it.title} className="tile">
              <div className="tile-media" />
              <div className="tile-body">
                <div className="tile-title">{it.title}</div>
                <div className="tile-meta">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}