const steps = [
  { n: "01", title: "Discover", text: "We clarify goals, users, scope, and success metrics." },
  { n: "02", title: "Design", text: "UI/UX, wireframes, and a clean visual direction." },
  { n: "03", title: "Build", text: "Modern, secure development with scalable structure." },
  { n: "04", title: "Launch & Improve", text: "Deploy, monitor, and iterate for growth." }
];

export default function HomeProcess() {
  return (
    <section className="section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">How we work</h2>
          <p className="home-sub">A simple process that keeps delivery fast and clear.</p>
        </div>

        <div className="process-grid">
          {steps.map((s) => (
            <div key={s.n} className="process-card">
              <div className="process-n">{s.n}</div>
              <div className="process-title">{s.title}</div>
              <div className="process-text">{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}