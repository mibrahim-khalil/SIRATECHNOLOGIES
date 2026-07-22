export default function About() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="display" style={{ fontSize: 36, lineHeight: 1.12, marginBottom: 12 }}>
          About SIRA Technologies
        </h1>

        <p style={{ marginTop: 0 }}>
          SIRA Technologies is a modern software and digital solutions company focused on transforming ideas into
          powerful, scalable, and intelligent digital experiences.
        </p>

        <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--hairline)" }}>
          <div style={{ color: "var(--ink)", fontWeight: 600, marginBottom: 8 }}>Our vision</div>
          <p style={{ margin: 0 }}>
            To become a trusted technology partner by creating innovative digital solutions that help businesses grow,
            adapt, and succeed in the modern digital world.
          </p>
        </div>

        <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--hairline)" }}>
          <div style={{ color: "var(--ink)", fontWeight: 600, marginBottom: 8 }}>How we work</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>We start with clarity: goals, users, and constraints.</li>
            <li>We design with intent: simple, usable interfaces.</li>
            <li>We ship with quality: secure, scalable, maintainable builds.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}