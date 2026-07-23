import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";

function Avatar({ name, image }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  return (
    <div className="person-avatar" aria-label={name}>
      {image ? (
        <img
          src={image}
          alt={name}
          className="person-img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <div className="person-initials">{initials}</div>
    </div>
  );
}

function SocialLink({ href, label }) {
  if (!href) return null;
  return (
    <a className="person-link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export default function About() {
  const kpis = [
    {
      title: "Design",
      desc: "Modern digital experiences through UI/UX design, branding systems, and visual identities."
    },
    {
      title: "Build",
      desc: "Secure, scalable full‑stack web applications with clean code and user‑focused functionality."
    },
    {
      title: "Scale",
      desc: "AI‑powered solutions and automation to improve efficiency, performance, and long‑term growth."
    }
  ];

  const whatWeDo = [
    {
      title: "Branding & Design",
      text: "Impactful brand identities, social media assets, marketing materials, and modern visuals."
    },
    {
      title: "UI/UX",
      text: "User-friendly, modern, and intuitive experiences with clean layouts and seamless journeys."
    },
    {
      title: "Full‑Stack Development",
      text: "Fast, secure, and scalable web applications tailored to business needs."
    },
    {
      title: "AI & Automation",
      text: "Smart solutions, automated workflows, and intelligent integrations to improve efficiency."
    }
  ];

  // Replace these with your real info
  const founder = {
    name: "Founder Name",
    role: "Founder",
    bio: "Focused on building reliable web products, clean UI systems, and automation-first solutions for businesses.",
    image: "/assets/team/founder.jpg",
    links: {
      linkedin: "",
      github: "",
      email: "mailto:hello@siratechnologies.com"
    }
  };

  // Add/remove members as needed
  const team = [
    {
      name: "Team Member 1",
      role: "UI/UX Designer",
      bio: "Design systems, user flows, and modern interfaces.",
      image: "/assets/team/member-1.jpg",
      links: { linkedin: "" }
    },
    {
      name: "Team Member 2",
      role: "Full‑Stack Developer",
      bio: "Secure APIs, dashboards, and scalable web apps.",
      image: "/assets/team/member-2.jpg",
      links: { github: "" }
    },
    {
      name: "Team Member 3",
      role: "AI / Automation Engineer",
      bio: "Integrations, workflows, and AI features to save time.",
      image: "/assets/team/member-3.jpg",
      links: {}
    }
  ];

  return (
    <>
      <PageHero
        title="About SIRA Technologies"
        subtitle="Building Digital Solutions That Drive Innovation"
        image="/assets/about-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Contact"
        secondaryCtaTo="/contact"
      />

      {/* WHO WE ARE */}
      <section className="section">
        <div className="container">
          <div className="about-split">
            <div>
              <h2 className="about-h2">Who we are</h2>

              <p className="about-p">
                SIRA Technologies is a digital solutions company focused on building innovative, scalable, and
                future‑ready technology solutions. We help businesses transform ideas into powerful digital products by
                combining creativity, engineering expertise, and emerging technologies.
              </p>

              <p className="about-p">
                Our core expertise includes: Full‑Stack Web Development, UI/UX & Graphic Design, Artificial Intelligence
                & Machine Learning, and Automation Solutions.
              </p>

              <div className="about-kpis">
                {kpis.map((k) => (
                  <div key={k.title} className="kpi">
                    <div className="kpi-num">{k.title}</div>
                    <div className="kpi-label">{k.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-card">
              <div className="about-card-title">Our vision</div>
              <div className="about-card-text">
                Our vision is to become a trusted digital innovation partner for businesses worldwide by creating
                impactful, scalable, and intelligent technology solutions. We aim to empower organizations through
                modern design, advanced technologies, and seamless digital experiences that drive growth, efficiency,
                and long‑term success.
              </div>

              <div className="about-card-divider" />

              <div className="about-card-title">Our approach</div>
              <ul className="about-list">
                <li>Analyze business goals, challenges, and user needs to identify the right solution.</li>
                <li>Create simple, modern, engaging experiences focused on usability.</li>
                <li>Develop secure, scalable, high‑performance solutions using modern technologies.</li>
                <li>Measure results, gather insights, and refine solutions for long‑term success.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section">
        <div className="container">
          <h2 className="about-h2">What we do</h2>

          <div className="about-grid">
            {whatWeDo.map((item) => (
              <div key={item.title} className="about-tile">
                <div className="about-tile-media" />
                <div className="about-tile-title">{item.title}</div>
                <div className="about-tile-text">{item.text}</div>
              </div>
            ))}
          </div>

          <div className="about-cta-row">
            <Button as="a" href="/services" variant="secondary">
              Explore Services
            </Button>
            <Button as="a" href="/start-project" variant="primary">
              Start a Project
            </Button>
          </div>
        </div>
      </section>

      {/* FOUNDER + TEAM */}
      <section className="section">
        <div className="container">
          <h2 className="about-h2">Founder & Team</h2>
          <p className="about-p" style={{ maxWidth: "70ch" }}>
            A focused team delivering design quality, reliable engineering, and smooth execution from idea to launch.
          </p>

          <div className="founder-card">
            <div>
              <Avatar name={founder.name} image={founder.image} />
            </div>

            <div>
              <div className="person-name">{founder.name}</div>
              <div className="person-role">{founder.role}</div>
              <div className="person-bio">{founder.bio}</div>

              <div className="person-links">
                <SocialLink href={founder.links.linkedin} label="LinkedIn" />
                <SocialLink href={founder.links.github} label="GitHub" />
                <SocialLink href={founder.links.email} label="Email" />
              </div>
            </div>
          </div>

          <div className="team-grid">
            {team.map((m) => (
              <div key={m.name} className="person-card">
                <Avatar name={m.name} image={m.image} />
                <div className="person-name">{m.name}</div>
                <div className="person-role">{m.role}</div>
                <div className="person-bio">{m.bio}</div>

                <div className="person-links">
                  <SocialLink href={m.links?.linkedin} label="LinkedIn" />
                  <SocialLink href={m.links?.github} label="GitHub" />
                </div>
              </div>
            ))}
          </div>

          <div className="about-cta-row" style={{ marginTop: 18 }}>
            <Button as="a" href="/portfolio" variant="secondary">
              See Work
            </Button>
            <Button as="a" href="/contact" variant="primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}