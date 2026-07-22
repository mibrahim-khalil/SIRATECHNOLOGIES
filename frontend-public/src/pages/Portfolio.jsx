import Button from "../components/ui/Button.jsx";

const PROJECTS = [
  {
    title: "Brand + Landing Page",
    tags: ["Branding", "UI"],
    desc: "A clean identity system and responsive marketing site optimized for speed and clarity."
  },
  {
    title: "Business Web Platform",
    tags: ["Full-Stack", "Admin"],
    desc: "Secure web application with dashboard, role-based access, and scalable architecture."
  },
  {
    title: "Automation & Integrations",
    tags: ["Automation"],
    desc: "Workflow automation connecting tools and reducing manual operations for teams."
  }
];

function Tag({ children }) {
  return (
    <span
      className="code"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: "var(--rounded-full)",
        background: "var(--surface-soft)",
        border: "1px solid var(--hairline)",
        fontSize: 13,
        color: "var(--ink)"
      }}
    >
      {children}
    </span>
  );
}

export default function Portfolio() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="display" style={{ fontSize: 36, lineHeight: 1.12, marginBottom: 12 }}>
          Work
        </h1>
        <p style={{ marginTop: 0 }}>
          A small selection of what we build. (Replace these with real case studies when ready.)
        </p>

        <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
          {PROJECTS.map((p) => (
            <div key={p.title} className="card" style={{ padding: 18 }}>
              <div style={{ color: "var(--ink)", fontWeight: 700 }}>{p.title}</div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10, marginBottom: 10 }}>
                {p.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>

              <div style={{ color: "var(--body)" }}>{p.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button as="a" href="/contact">
            Start a project
          </Button>
          <Button as="a" href="/services" variant="secondary">
            View services
          </Button>
        </div>
      </div>
    </section>
  );
}