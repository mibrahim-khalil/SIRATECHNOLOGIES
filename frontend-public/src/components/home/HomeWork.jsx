import Button from "../ui/Button.jsx";

const projects = [
  { title: "Business Website + Lead Capture", text: "A clean structure designed to convert visitors into leads." },
  { title: "Admin Dashboard Web App", text: "Secure CRUD, roles, and scalable architecture." },
  { title: "Brand Kit + Social Templates", text: "Consistent identity across platforms." }
];

export default function HomeWork() {
  return (
    <section className="section">
      <div className="container">
        <div className="home-head">
          <h2 className="home-h2">Selected work</h2>
          <p className="home-sub">A few examples of what we can build.</p>
        </div>

        <div className="home-work-grid">
          {projects.map((p) => (
            <div key={p.title} className="home-work-card">
              <div className="home-work-media" aria-hidden="true" />
              <div className="home-card-title">{p.title}</div>
              <div className="home-card-text">{p.text}</div>
            </div>
          ))}
        </div>

        <div className="home-actions">
          <Button as="a" href="/portfolio" variant="secondary">View All Work</Button>
          <Button as="a" href="/start-project" variant="primary">Build Something Similar</Button>
        </div>
      </div>
    </section>
  );
}