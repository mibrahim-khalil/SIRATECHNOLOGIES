import { useMemo, useState } from "react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";

function Tag({ children }) {
  return <span className="work-tag">{children}</span>;
}

function ProjectCard({ project }) {
  return (
    <article className="work-card">
      <div className="work-media" aria-hidden="true" />

      <div className="work-body">
        <div className="work-title-row">
          <div className="work-title">{project.title}</div>
          <div className="work-year">{project.year}</div>
        </div>

        <div className="work-desc">{project.desc}</div>

        <div className="work-tags">
          {project.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <div className="work-actions">
          <Button as="a" href="/start-project" variant="primary">
            Build something similar
          </Button>
          {project.link ? (
            <Button as="a" href={project.link} variant="secondary">
              View
            </Button>
          ) : (
            <Button as="a" href="/contact" variant="secondary">
              Contact
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const projects = useMemo(
    () => [
      {
        title: "Business Website + Lead Capture",
        year: "2026",
        category: "Websites",
        tags: ["Landing", "SEO", "Responsive"],
        desc: "A fast multi‑page business site with clean structure, call-to-actions, and lead form flow.",
        link: ""
      },
      {
        title: "Admin Dashboard Web App",
        year: "2026",
        category: "Web Apps",
        tags: ["MERN", "Admin", "Auth"],
        desc: "A secure dashboard to manage content, services, and leads with role-based access.",
        link: ""
      },
      {
        title: "Portfolio Website (Personal/Agency)",
        year: "2026",
        category: "Websites",
        tags: ["UI/UX", "Branding"],
        desc: "Minimal, premium portfolio layout built for trust and conversions.",
        link: ""
      },
      {
        title: "Automation Workflow Integration",
        year: "2026",
        category: "Automation",
        tags: ["Automation", "Integrations"],
        desc: "Automated workflows connecting tools and reducing manual operations.",
        link: ""
      },
      {
        title: "Brand Kit + Social Templates",
        year: "2026",
        category: "Branding",
        tags: ["Logo", "Brand Kit", "Social Media"],
        desc: "Logo, typography, colors, and social templates for consistent branding.",
        link: ""
      },
      {
        title: "AI Feature Prototype",
        year: "2026",
        category: "AI",
        tags: ["AI", "Data", "Prototype"],
        desc: "A prototype AI feature for classification/insights integrated into an app workflow.",
        link: ""
      }
    ],
    []
  );

  const filters = ["All", "Websites", "Web Apps", "Branding", "Automation", "AI"];
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.category === active);
  }, [active, projects]);

  return (
    <>
      <PageHero
        title="Work"
        subtitle="Selected projects across design, web development, AI, automation, and branding."
        image="/assets/work-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Services"
        secondaryCtaTo="/services"
      />

      <section className="section">
        <div className="container">
          <div className="work-top">
            <h2 className="work-h2">Projects</h2>
            <div className="work-filters" role="tablist" aria-label="Work filters">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`work-filter ${active === f ? "active" : ""}`}
                  onClick={() => setActive(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="work-grid">
            {filtered.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>

          <div className="work-bottom-cta">
            <div>
              <div className="work-bottom-title">Want your project here?</div>
              <div className="work-bottom-text">
                Share your idea and we’ll help you design, build, and launch it.
              </div>
            </div>
            <div className="work-bottom-actions">
              <Button as="a" href="/start-project" variant="primary">
                Start a Project
              </Button>
              <Button as="a" href="/contact" variant="secondary">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}