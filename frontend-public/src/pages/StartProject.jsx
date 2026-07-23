import { useEffect, useMemo, useRef, useState } from "react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [ref, handler]);
}

function SelectMenu({ label, value, placeholder, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useOutsideClick(wrapRef, () => setOpen(false));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectedLabel = value || "";

  return (
    <div className="field">
      <label className="label">{label}</label>

      <div ref={wrapRef} className={`select ${open ? "open" : ""}`}>
        <button
          type="button"
          className="select-trigger"
          onClick={() => setOpen((p) => !p)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={selectedLabel ? "select-value" : "select-placeholder"}>
            {selectedLabel || placeholder}
          </span>

          <span className="select-caret" aria-hidden="true">
            ▼
          </span>
        </button>

        {open ? (
          <div className="select-panel" role="listbox">
            <button
              type="button"
              className={`select-option ${!value ? "active" : ""}`}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              {placeholder}
            </button>

            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`select-option ${value === opt ? "active" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ServicePill({ active, children, onClick }) {
  return (
    <button
      type="button"
      className={`service-pill ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="service-pill-dot" aria-hidden="true">
        {active ? "✓" : "+"}
      </span>
      <span className="service-pill-text">{children}</span>
    </button>
  );
}

export default function StartProject() {
  const SERVICE_GROUPS = useMemo(
    () => [
      {
        title: "Web",
        items: [
          "Full‑Stack Web App (MERN)",
          "Landing Page",
          "Business Website",
          "Portfolio Website",
          "Admin Dashboard",
          "Website Redesign"
        ]
      },
      {
        title: "Design",
        items: ["UI/UX Design", "Logo & Branding", "Graphic Design / Social Media"]
      },
      {
        title: "AI & Automation",
        items: ["AI / Machine Learning", "Automation / Integrations"]
      }
    ],
    []
  );

  const budgetOptions = ["Under $200", "$200–$500", "$500–$1,000", "$1,000–$3,000", "$3,000+"];

  const timelineOptions = ["ASAP", "1–2 weeks", "2–4 weeks", "1–2 months", "Flexible"];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    timeline: "",
    message: ""
  });

  const [services, setServices] = useState([]);

  const toggleService = (label) => {
    setServices((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, services });
    alert("Thanks! Your request is saved locally. Next step: connect backend API.");
  };

  return (
    <>
      <PageHero
        title="Start a Project"
        subtitle="Tell us what you want to build. We’ll reply with a plan, timeline, and quote."
        image="/assets/start-hero.jpg"
        primaryCtaLabel="Send Requirements"
        primaryCtaTo="#start-form"
        secondaryCtaLabel="See Work"
        secondaryCtaTo="/portfolio"
      />

      <section className="section" id="start-form">
        <div className="container">
          <div className="start-layout">
            {/* Left: Form */}
            <div className="form-card">
              <h2 className="start-h2">Project details</h2>
              <p className="start-sub">
                Select services you need and share a short description. We’ll respond within 24–48 hours.
              </p>

              <form onSubmit={onSubmit} className="start-form">
                {/* Basic info */}
                <div className="form-section">
                  <div className="form-section-title">Basic info</div>

                  <div className="field-grid">
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

                    <div className="field">
                      <label className="label">Phone (optional)</label>
                      <div className="control">
                        <input
                          className="control-input"
                          name="phone"
                          value={form.phone}
                          onChange={onChange}
                          placeholder="+92 3xx xxxxxxx"
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Company (optional)</label>
                      <div className="control">
                        <input
                          className="control-input"
                          name="company"
                          value={form.company}
                          onChange={onChange}
                          placeholder="Company / Brand name"
                          autoComplete="organization"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="form-section">
                  <div className="form-section-title">Services needed</div>

                  <div className="service-groups">
                    {SERVICE_GROUPS.map((g) => (
                      <div key={g.title} className="service-group">
                        <div className="service-group-title">{g.title}</div>
                        <div className="service-grid">
                          {g.items.map((s) => (
                            <ServicePill
                              key={s}
                              active={services.includes(s)}
                              onClick={() => toggleService(s)}
                            >
                              {s}
                            </ServicePill>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hint">Choose one or multiple.</div>
                </div>

                {/* Scope */}
                <div className="form-section">
                  <div className="form-section-title">Scope</div>

                  <div className="field-grid">
                    <SelectMenu
                      label="Budget (optional)"
                      value={form.budget}
                      placeholder="Select budget"
                      options={budgetOptions}
                      onChange={(v) => setForm((p) => ({ ...p, budget: v }))}
                    />

                    <SelectMenu
                      label="Timeline (optional)"
                      value={form.timeline}
                      placeholder="Select timeline"
                      options={timelineOptions}
                      onChange={(v) => setForm((p) => ({ ...p, timeline: v }))}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-section">
                  <div className="form-section-title">Describe your project</div>

                  <div className="field">
                    <label className="label">
                      What do you want to build?
                      <span className="label-muted"> (links, features, pages, references)</span>
                    </label>

                    <div className="control control-textarea">
                      <textarea
                        className="control-textarea-input"
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        placeholder="Write your requirements here..."
                        rows={7}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <Button type="submit" variant="primary">
                    Send Requirements
                  </Button>
                  <Button as="a" href="/contact" variant="secondary">
                    Contact Instead
                  </Button>
                </div>

                <div className="hint">
                  Tip: Next we can connect this form to backend endpoint <code>/api/leads</code>.
                </div>
              </form>
            </div>

            {/* Right */}
            <div className="side-card">
              <div className="side-title">What happens next?</div>
              <ul className="side-list">
                <li>We review your requirements.</li>
                <li>We reply with questions (if needed).</li>
                <li>We send a quote + timeline.</li>
                <li>We start design → development → delivery.</li>
              </ul>

              <div className="side-divider" />

              <div className="side-title">Prefer WhatsApp?</div>
              <div className="side-text">You can also message us directly.</div>

              <Button
                as="a"
                href="https://wa.me/000000000000"
                variant="secondary"
                style={{ width: "100%", marginTop: 12 }}
              >
                Message on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}