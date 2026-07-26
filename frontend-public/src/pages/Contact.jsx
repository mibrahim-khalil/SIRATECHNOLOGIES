import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";
import Select from "../components/ui/Select.jsx";
import client from "../api/client.js";
import { useSite } from "../context/SiteContext.jsx";

/* ---------- Icons ---------- */
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconCheckCircle() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ---------- Dropdown options ---------- */
const BUDGETS = [
  "Less than $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
  "Not sure yet",
];

const TIMELINES = [
  "ASAP",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "Flexible",
];

/* ---------- Helpers ---------- */
function normalizeWhatsapp(num = "") {
  const digits = num.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
  website: "", // honeypot (spam protection — must stay empty)
};

/* ---------- Component ---------- */
export default function Contact() {
  const { settings, services } = useSite();

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const email = settings?.email || "";
  const phone = settings?.phone || "";
  const whatsappUrl = normalizeWhatsapp(settings?.whatsapp || "");
  const address = settings?.address || "";
  const responseTime = settings?.responseTime || "24–48 hours";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  // Helper for custom Select — clears field errors too
  const onSelectChange = (name) => (value) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 10)
      errs.message = "Please share a bit more detail (min 10 chars)";
    return errs;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    // Honeypot check — silent block
    if (form.website) {
      setSubmitted(true);
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setErrorMsg("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      // Combine budget + timeline into subject if not filled
      const subject =
        form.subject ||
        [form.service, form.budget, form.timeline].filter(Boolean).join(" · ") ||
        "New inquiry";

      // Build a richer message that includes budget/timeline
      const extras = [];
      if (form.budget) extras.push(`Budget: ${form.budget}`);
      if (form.timeline) extras.push(`Timeline: ${form.timeline}`);

      const finalMessage =
        extras.length > 0
          ? `${form.message}\n\n---\n${extras.join("\n")}`
          : form.message;

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject,
        service: form.service,
        message: finalMessage,
      };

      await client.post("/contact", payload);

      setSubmitted(true);
      setForm(EMPTY_FORM);
      setFieldErrors({});
      // Scroll to top of card
      window.scrollTo({ top: 300, behavior: "smooth" });
    } catch (err) {
      console.error("Contact submit error:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          "Something went wrong. Please try again or email us directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setErrorMsg("");
    setFieldErrors({});
  }

  return (
    <>
      <PageHero
        title="Contact"
        subtitle="Tell us what you want to build. We'll reply with clear next steps."
        image="/assets/contact-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Pricing"
        secondaryCtaTo="/pricing"
      />

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* ============ LEFT: Form ============ */}
            <div className="contact-card">
              {submitted ? (
                /* ---- SUCCESS STATE ---- */
                <div className="contact-success">
                  <div className="contact-success-icon">
                    <IconCheckCircle />
                  </div>
                  <h2 className="contact-h2">Message received! 🎉</h2>
                  <p className="contact-sub">
                    Thank you for reaching out. We've got your message and will
                    reply within <strong>{responseTime}</strong>.
                    {email && (
                      <>
                        {" "}
                        You'll hear from us at{" "}
                        <strong>{form.email || "your email"}</strong>.
                      </>
                    )}
                  </p>

                  <div className="contact-success-actions">
                    <Button variant="primary" onClick={resetForm}>
                      Send another message
                    </Button>
                    <Button as={Link} to="/portfolio" variant="secondary">
                      See our work
                    </Button>
                  </div>

                  <div className="contact-success-tip">
                    💡 In the meantime, feel free to explore our{" "}
                    <Link to="/services">services</Link> or check out{" "}
                    <Link to="/pricing">pricing</Link>.
                  </div>
                </div>
              ) : (
                /* ---- FORM ---- */
                <>
                  <h2 className="contact-h2">Send a message</h2>
                  <p className="contact-sub">
                    Share your goals, features, and any reference links. We
                    typically respond within {responseTime}.
                  </p>

                  {errorMsg && (
                    <div className="contact-alert">
                      <IconAlert />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={onSubmit} className="contact-form" noValidate>
                    <div className="contact-grid">
                      {/* Name */}
                      <div className="field">
                        <label className="label" htmlFor="c-name">
                          Your name <span className="req">*</span>
                        </label>
                        <div
                          className={`control ${fieldErrors.name ? "control-error" : ""}`}
                        >
                          <input
                            id="c-name"
                            className="control-input"
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="John Doe"
                            autoComplete="name"
                          />
                        </div>
                        {fieldErrors.name && (
                          <div className="field-error">{fieldErrors.name}</div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="field">
                        <label className="label" htmlFor="c-email">
                          Email <span className="req">*</span>
                        </label>
                        <div
                          className={`control ${fieldErrors.email ? "control-error" : ""}`}
                        >
                          <input
                            id="c-email"
                            className="control-input"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                          />
                        </div>
                        {fieldErrors.email && (
                          <div className="field-error">{fieldErrors.email}</div>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="field">
                        <label className="label" htmlFor="c-phone">
                          Phone <span className="label-muted">(optional)</span>
                        </label>
                        <div className="control">
                          <input
                            id="c-phone"
                            className="control-input"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={onChange}
                            placeholder="+92 300 1234567"
                            autoComplete="tel"
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="field">
                        <label className="label" htmlFor="c-subject">
                          Subject{" "}
                          <span className="label-muted">(optional)</span>
                        </label>
                        <div className="control">
                          <input
                            id="c-subject"
                            className="control-input"
                            name="subject"
                            value={form.subject}
                            onChange={onChange}
                            placeholder="Brief topic"
                          />
                        </div>
                      </div>

                      {/* Service - full width — CUSTOM SELECT */}
                      <div className="field contact-span">
                        <label className="label" htmlFor="c-service">
                          Service you need{" "}
                          <span className="label-muted">(optional)</span>
                        </label>
                        <Select
                          id="c-service"
                          value={form.service}
                          onChange={onSelectChange("service")}
                          placeholder="— Select a service —"
                          options={[
                            ...services.map((s) => ({
                              value: s.title,
                              label: s.title,
                            })),
                            {
                              value: "Other / Not sure",
                              label: "Other / Not sure",
                            },
                          ]}
                        />
                      </div>

                      {/* Budget — CUSTOM SELECT */}
                      <div className="field">
                        <label className="label" htmlFor="c-budget">
                          Budget range{" "}
                          <span className="label-muted">(optional)</span>
                        </label>
                        <Select
                          id="c-budget"
                          value={form.budget}
                          onChange={onSelectChange("budget")}
                          placeholder="— Select budget —"
                          options={BUDGETS}
                        />
                      </div>

                      {/* Timeline — CUSTOM SELECT */}
                      <div className="field">
                        <label className="label" htmlFor="c-timeline">
                          Timeline{" "}
                          <span className="label-muted">(optional)</span>
                        </label>
                        <Select
                          id="c-timeline"
                          value={form.timeline}
                          onChange={onSelectChange("timeline")}
                          placeholder="— Select timeline —"
                          options={TIMELINES}
                        />
                      </div>

                      {/* Message - full width */}
                      <div className="field contact-span">
                        <label className="label" htmlFor="c-message">
                          Message <span className="req">*</span>
                        </label>
                        <div
                          className={`control control-textarea ${fieldErrors.message ? "control-error" : ""}`}
                        >
                          <textarea
                            id="c-message"
                            className="control-textarea-input"
                            name="message"
                            value={form.message}
                            onChange={onChange}
                            placeholder="Write your message… include links, features, timeline, and budget."
                            rows={7}
                          />
                        </div>
                        {fieldErrors.message && (
                          <div className="field-error">
                            {fieldErrors.message}
                          </div>
                        )}
                      </div>

                      {/* Honeypot — hidden from users, catches bots */}
                      <div className="honeypot" aria-hidden="true">
                        <label>
                          Website
                          <input
                            type="text"
                            name="website"
                            value={form.website}
                            onChange={onChange}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="contact-actions">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span
                              className="btn-spinner"
                              aria-hidden="true"
                            ></span>
                            <span style={{ marginLeft: 10 }}>Sending…</span>
                          </>
                        ) : (
                          "Send message"
                        )}
                      </Button>
                      <Button
                        as={Link}
                        to="/start-project"
                        variant="secondary"
                      >
                        Start a Project
                      </Button>
                    </div>

                    <div className="contact-hint">
                      By submitting this form you agree to be contacted about
                      your inquiry. We respect your privacy.
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* ============ RIGHT: Sidebar ============ */}
            <div className="contact-side">
              {/* Direct contact card */}
              <div className="contact-side-card">
                <div className="contact-side-title">Direct contact</div>

                <div className="contact-info">
                  {email && (
                    <a
                      className="contact-info-block"
                      href={`mailto:${email}`}
                    >
                      <span className="contact-info-icon">
                        <IconMail />
                      </span>
                      <div>
                        <div className="contact-info-label">Email</div>
                        <div className="contact-info-value">{email}</div>
                      </div>
                    </a>
                  )}

                  {phone && (
                    <a
                      className="contact-info-block"
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                    >
                      <span className="contact-info-icon">
                        <IconPhone />
                      </span>
                      <div>
                        <div className="contact-info-label">Phone</div>
                        <div className="contact-info-value">{phone}</div>
                      </div>
                    </a>
                  )}

                  {whatsappUrl && (
                    <a
                      className="contact-info-block"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="contact-info-icon contact-info-icon-wa">
                        <IconWhatsApp />
                      </span>
                      <div>
                        <div className="contact-info-label">WhatsApp</div>
                        <div className="contact-info-value">
                          Message us instantly
                        </div>
                      </div>
                    </a>
                  )}

                  {address && (
                    <div className="contact-info-block contact-info-block-static">
                      <span className="contact-info-icon">
                        <IconMapPin />
                      </span>
                      <div>
                        <div className="contact-info-label">Address</div>
                        <div className="contact-info-value">{address}</div>
                      </div>
                    </div>
                  )}

                  <div className="contact-info-block contact-info-block-static">
                    <span className="contact-info-icon">
                      <IconClock />
                    </span>
                    <div>
                      <div className="contact-info-label">Response time</div>
                      <div className="contact-info-value">
                        Within {responseTime}
                      </div>
                    </div>
                  </div>
                </div>

                {whatsappUrl && (
                  <Button
                    as="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary"
                    style={{ width: "100%", marginTop: 14 }}
                  >
                    Chat on WhatsApp
                  </Button>
                )}
              </div>

              {/* What happens next */}
              <div className="contact-side-card">
                <div className="contact-side-title">What happens next?</div>
                <ol className="contact-steps">
                  <li>
                    <span className="step-num">1</span>
                    <div>
                      <div className="step-title">We review your inquiry</div>
                      <div className="step-text">
                        Usually within {responseTime}.
                      </div>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">2</span>
                    <div>
                      <div className="step-title">Free discovery call</div>
                      <div className="step-text">
                        30-min chat to align on goals & scope.
                      </div>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">3</span>
                    <div>
                      <div className="step-title">Proposal & timeline</div>
                      <div className="step-text">
                        Clear pricing, milestones, deliverables.
                      </div>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">4</span>
                    <div>
                      <div className="step-title">Kick off &amp; build</div>
                      <div className="step-text">
                        Weekly updates until launch.
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}