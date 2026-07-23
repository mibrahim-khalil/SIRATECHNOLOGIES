import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";

export default function About() {
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

      <section className="section">
        <div className="container">
          <div className="about-split">
            <div>
              <h2 className="about-h2">Who we are</h2>
              <p className="about-p">
                SIRA Technologies is a digital solutions company focused on building innovative, scalable, and future-ready technology solutions. We help businesses transform their ideas into powerful digital products by combining creativity, engineering expertise, and emerging technologies. Our expertise includes Full-Stack Web Development, where we build secure, high-performance, and scalable web applications; UI/UX and Graphic Design, where we create intuitive interfaces and impactful brand experiences; Artificial Intelligence and Machine Learning, where we develop intelligent solutions to solve complex challenges; and Automation Solutions, where we streamline business processes through smart, efficient, and technology-driven systems.
              </p>

              <div className="about-kpis">
                <div className="kpi">
                  <div className="kpi-num">Design</div>
                  <div className="kpi-label">Creating modern digital experiences through UI/UX design, branding systems, and visual identities that connect businesses with their audiences.</div>
                </div>
                <div className="kpi">
                  <div className="kpi-num">Build</div>
                  <div className="kpi-label">Developing full-stack web applications with scalable architecture, clean code, and user-focused functionality.</div>
                </div>
                <div className="kpi">
                  <div className="kpi-num">Scale</div>
                  <div className="kpi-label">Helping businesses grow through AI-powered solutions, automation, and intelligent technologies that improve efficiency and performance.</div>
                </div>
              </div>
            </div>

            <div className="about-card">
              <div className="about-card-title">Our vision</div>
              <div className="about-card-text">
                Our vision is to become a trusted digital innovation partner for businesses worldwide by creating impactful, scalable, and intelligent technology solutions. We aim to empower organizations through modern design, advanced technologies, and seamless digital experiences that drive growth, efficiency, and long-term success.
              </div>

              <div className="about-card-divider" />

              <div className="about-card-title">Our approach</div>
              <ul className="about-list">
                <li>We analyze business goals, challenges, and user needs to identify the right digital solutions.</li>
                <li>We create simple, modern, and engaging experiences focused on usability and user satisfaction.</li>
                <li>We develop secure, scalable, and high-performance solutions using modern technologies.</li>
                <li>We continuously measure performance, gather insights, and refine solutions for long-term success.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="about-h2">What we do</h2>

          <div className="about-grid">
            <div className="about-tile">
              <div className="about-tile-media" />
              <div className="about-tile-title">Branding & Design</div>
              <div className="about-tile-text">Creating impactful brand identities, social media assets, marketing materials, and modern visuals that help businesses stand out.</div>
            </div>

            <div className="about-tile">
              <div className="about-tile-media" />
              <div className="about-tile-title">UI/UX</div>
              <div className="about-tile-text">UCreating user-friendly, modern, and intuitive digital experiences with clean layouts and seamless user journeys.</div>
            </div>

            <div className="about-tile">
              <div className="about-tile-media" />
              <div className="about-tile-title">Full‑Stack Development</div>
              <div className="about-tile-text">Building fast, secure, and scalable web applications tailored to business needs.</div>
            </div>

            <div className="about-tile">
              <div className="about-tile-media" />
              <div className="about-tile-title">AI & Automation</div>
              <div className="about-tile-text">Creating smart solutions, automated workflows, and intelligent integrations to improve efficiency.</div>
            </div>
          </div>

          <div className="about-cta-row">
            <Button as="a" href="/services" variant="secondary">Explore Services</Button>
            <Button as="a" href="/start-project" variant="primary">Start a Project</Button>
          </div>
        </div>
      </section>
    </>
  );
}