function Avatar({ name, image }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  return (
    <div className="person-avatar">
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

      {/* If image missing/broken, show initials */}
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

export default function TeamSection() {
  // Replace with your real data
  const founder = {
    name: "Founder Name",
    role: "Founder & Lead Developer",
    bio: "Building modern web apps with MERN, UI/UX systems, and automation-first engineering.",
    image: "/assets/team/founder.jpg", // add file or set to "" to use initials
    links: {
      linkedin: "https://linkedin.com/",
      github: "https://github.com/",
      email: "mailto:hello@siratechnologies.com"
    }
  };

  const team = [
    {
      name: "Team Member 1",
      role: "UI/UX Designer",
      bio: "Designs clean interfaces, product flows, and design systems.",
      image: "/assets/team/member-1.jpg",
      links: { linkedin: "https://linkedin.com/" }
    },
    {
      name: "Team Member 2",
      role: "Full-Stack Developer",
      bio: "Builds secure APIs, dashboards, and scalable web apps.",
      image: "/assets/team/member-2.jpg",
      links: { github: "https://github.com/" }
    },
    {
      name: "Team Member 3",
      role: "AI / Automation Engineer",
      bio: "Automation pipelines, integrations, and AI-powered features.",
      image: "/assets/team/member-3.jpg",
      links: {}
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 className="about-h2">Founder & Team</h2>
        <p className="about-p" style={{ maxWidth: "70ch" }}>
          A small team focused on design quality, engineering reliability, and shipping fast.
        </p>

        {/* Founder */}
        <div className="founder-card">
          <div className="founder-left">
            <Avatar name={founder.name} image={founder.image} />
          </div>

          <div className="founder-right">
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

        {/* Team */}
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
      </div>
    </section>
  );
}