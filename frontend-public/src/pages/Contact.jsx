import { useState } from "react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Message saved locally. Next step: connect backend /api/contact.");
  };

  return (
    <>
      <PageHero
        title="Contact"
        subtitle="Tell us what you want to build. We’ll reply with clear next steps."
        image="/assets/contact-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Pricing"
        secondaryCtaTo="/pricing"
      />

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Left: form */}
            <div className="contact-card">
              <h2 className="contact-h2">Send a message</h2>
              <p className="contact-sub">
                Share your goals, pages/features, and any reference links. We typically respond within 24–48 hours.
              </p>

              <form onSubmit={onSubmit} className="contact-form">
                <div className="contact-grid">
                  <div className="field">
                    <label className="label">Your name</label>
                    <div className="control">
                      <input
                        className="control-input"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="John Doe"
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        className="control-input"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="field contact-span">
                    <label className="label">Subject</label>
                    <div className="control">
                      <input
                        className="control-input"
                        name="subject"
                        value={form.subject}
                        onChange={onChange}
                        placeholder="Website / Web App / Branding / AI / Automation"
                      />
                    </div>
                  </div>

                  <div className="field contact-span">
                    <label className="label">Message</label>
                    <div className="control control-textarea">
                      <textarea
                        className="control-textarea-input"
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        placeholder="Write your message… include links, features, timeline, and budget (optional)."
                        rows={7}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="contact-actions">
                  <Button type="submit" variant="primary">
                    Send message
                  </Button>
                  <Button as="a" href="/start-project" variant="secondary">
                    Start a Project
                  </Button>
                </div>

                <div className="contact-hint">
                  Tip: next we can connect this form to backend endpoint <code>/api/contact</code>.
                </div>
              </form>
            </div>

            {/* Right: contact options */}
            <div className="contact-side">
              <div className="contact-side-card">
                <div className="contact-side-title">Direct contact</div>

                <div className="contact-info">
                  <div className="contact-info-row">
                    <div className="contact-info-label">Email</div>
                    <a className="contact-info-value" href="mailto:hello@siratechnologies.com">
                      hello@siratechnologies.com
                    </a>
                  </div>

                  <div className="contact-info-row">
                    <div className="contact-info-label">WhatsApp</div>
                    <a className="contact-info-value" href="https://wa.me/000000000000" target="_blank" rel="noreferrer">
                      Message on WhatsApp
                    </a>
                  </div>

                  <div className="contact-info-row">
                    <div className="contact-info-label">Response time</div>
                    <div className="contact-info-value">24–48 hours</div>
                  </div>
                </div>

                <Button
                  as="a"
                  href="https://wa.me/000000000000"
                  variant="secondary"
                  style={{ width: "100%", marginTop: 14 }}
                >
                  WhatsApp
                </Button>
              </div>

              <div className="contact-side-card">
                <div className="contact-side-title">What to include</div>
                <ul className="contact-list">
                  <li>What you want to build (website/app/branding)</li>
                  <li>Any reference links</li>
                  <li>Required features/pages</li>
                  <li>Timeline and budget (optional)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}