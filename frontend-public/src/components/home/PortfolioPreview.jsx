import Button from "../ui/Button.jsx";

export default function PortfolioPreview() {
  // Replace with real items later
  const projects = [
    { title: "Landing Page + Brand Kit", desc: "Clean marketing site and identity system." },
    { title: "Business Web App", desc: "Secure full-stack platform with admin panel." },
    { title: "Automation Pipeline", desc: "Integrations that reduce manual work." }
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 className="display" style={{ fontSize: 30, marginBottom: 18 }}>Selected work</h2>

        <div style={{ display: "grid", gap: 14 }}>
          {projects.map((p) => (
            <div key={p.title} className="card card-pad">
              <div style={{ color: "var(--ink)", fontWeight: 600 }}>{p.title}</div>
              <div style={{ marginTop: 6 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <Button as="a" href="/portfolio" variant="secondary">View all</Button>
        </div>
      </div>
    </section>
  );
}