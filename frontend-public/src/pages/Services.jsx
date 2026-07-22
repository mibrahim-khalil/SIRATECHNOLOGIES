const SERVICES = [
  {
    title: "Graphic Design & Branding",
    desc: "Professional visual identities, brand kits, marketing materials, social media designs, and digital assets."
  },
  {
    title: "UI/UX Design",
    desc: "Modern interfaces, intuitive layouts, and user journeys that improve engagement across web and mobile."
  },
  {
    title: "Full-Stack Web Development",
    desc: "Fast, secure, scalable web apps. From responsive websites to complex platforms tailored to your needs."
  },
  {
    title: "AI & Machine Learning Solutions",
    desc: "Predictive models, data-driven systems, and custom AI-powered applications to solve real problems."
  },
  {
    title: "Automation Solutions",
    desc: "Automated workflows and integrations that reduce manual work and improve efficiency."
  }
];

export default function Services() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="display" style={{ fontSize: 36, lineHeight: 1.12, marginBottom: 12 }}>
          Services
        </h1>
        <p style={{ marginTop: 0 }}>
          Simple, modern solutions — designed to look good, work fast, and scale with your business.
        </p>

        <div style={{ marginTop: 18 }}>
          {SERVICES.map((s) => (
            <div key={s.title} style={{ padding: "16px 0", borderBottom: "1px solid var(--hairline)" }}>
              <div style={{ color: "var(--ink)", fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
              <div style={{ color: "var(--body)" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}