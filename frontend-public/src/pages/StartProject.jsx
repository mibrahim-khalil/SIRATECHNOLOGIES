import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Wrench,
  FileText,
  DollarSign,
  Send,
  Sparkles,
  Building2,
  Globe,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";
import Select from "../components/ui/Select.jsx";
import client from "../api/client.js";
import { useSite } from "../context/SiteContext.jsx";

/* ---------- Fallback service list ---------- */
const FALLBACK_SERVICES = [
  "Web Development",
  "UI/UX Design",
  "Mobile App",
  "Branding & Logo",
  "AI Integration",
  "Automation",
];

/* ---------- Options ---------- */
const PROJECT_TYPES = [
  { value: "new", label: "🚀 New project from scratch" },
  { value: "redesign", label: "🎨 Redesign existing product" },
  { value: "features", label: "➕ Add features to existing product" },
  { value: "not-sure", label: "🤔 Not sure yet — help me decide" },
];

const BUDGETS = [
  "Less than $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
  "Not sure yet",
];

const TIMELINES = [
  "ASAP (rush)",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "Flexible",
];

const CONTACT_METHODS = [
  { value: "email", label: "📧 Email" },
  { value: "phone", label: "📞 Phone call" },
  { value: "whatsapp", label: "💬 WhatsApp" },
  { value: "any", label: "Any of the above" },
];

/* ---------- Empty form template ---------- */
const EMPTY_FORM = {
  // Step 1: Basics
  name: "",
  email: "",
  company: "",
  website: "",

  // Step 2: Services (array of strings)
  services: [],

  // Step 3: Scope
  projectType: "",
  description: "",
  references: ["", "", ""], // 3 optional reference URLs

  // Step 4: Budget & Timeline
  budget: "",
  timeline: "",
  startDate: "",

  // Step 5: Contact
  phone: "",
  contactMethod: "email",

  // Honeypot
  honeypot: "",
};

/* ---------- Step config ---------- */
const STEPS = [
  { key: "basics", label: "Basics", icon: User },
  { key: "services", label: "Services", icon: Wrench },
  { key: "scope", label: "Scope", icon: FileText },
  { key: "budget", label: "Budget", icon: DollarSign },
  { key: "review", label: "Review", icon: Send },
];

/* ============================================
   MAIN COMPONENT
   ============================================ */
export default function StartProject() {
  const { services: dbServices, settings } = useSite();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Build service list — real DB services or fallback
  const availableServices = useMemo(() => {
    if (dbServices && dbServices.length > 0) {
      return dbServices.map((s) => s.title);
    }
    return FALLBACK_SERVICES;
  }, [dbServices]);

  // Scroll to top on step change
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  /* ---------- Form update helpers ---------- */
  function updateField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function toggleService(service) {
    setForm((p) => ({
      ...p,
      services: p.services.includes(service)
        ? p.services.filter((s) => s !== service)
        : [...p.services, service],
    }));
    if (errors.services) setErrors((p) => ({ ...p, services: "" }));
  }

  function updateReference(idx, value) {
    setForm((p) => {
      const next = [...p.references];
      next[idx] = value;
      return { ...p, references: next };
    });
  }

  /* ---------- Validation per step ---------- */
  function validateStep(stepIdx) {
    const errs = {};

    if (stepIdx === 0) {
      if (!form.name.trim()) errs.name = "Please enter your name";
      if (!form.email.trim()) {
        errs.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errs.email = "Please enter a valid email";
      }
    }

    if (stepIdx === 1) {
      if (form.services.length === 0) {
        errs.services = "Please select at least one service";
      }
    }

    if (stepIdx === 2) {
      if (!form.projectType) errs.projectType = "Please select a project type";
      if (!form.description.trim()) {
        errs.description = "Please describe your project";
      } else if (form.description.trim().length < 20) {
        errs.description = "Please share a bit more detail (min 20 chars)";
      }
    }

    // Step 3 (budget) and 4 (review) don't require validation

    return errs;
  }

  function goNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function goToStep(targetStep) {
    // Only allow jumping to completed steps
    if (targetStep < step) {
      setStep(targetStep);
    }
  }

  /* ---------- Submit ---------- */
  async function handleSubmit() {
    // Honeypot check
    if (form.honeypot) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // Build a rich message combining all data
      const cleanRefs = form.references.filter((r) => r.trim());

      const messageParts = [
        `PROJECT INQUIRY`,
        `================`,
        ``,
        `Project Type: ${PROJECT_TYPES.find((t) => t.value === form.projectType)?.label || form.projectType}`,
        ``,
        `Description:`,
        form.description,
        ``,
      ];

      if (cleanRefs.length > 0) {
        messageParts.push(`Reference links:`);
        cleanRefs.forEach((r, i) => messageParts.push(`  ${i + 1}. ${r}`));
        messageParts.push(``);
      }

      messageParts.push(`--- Company & Contact ---`);
      if (form.company) messageParts.push(`Company: ${form.company}`);
      if (form.website) messageParts.push(`Website: ${form.website}`);
      if (form.phone) messageParts.push(`Phone: ${form.phone}`);
      messageParts.push(`Preferred contact: ${form.contactMethod}`);
      messageParts.push(``);

      messageParts.push(`--- Budget & Timeline ---`);
      if (form.budget) messageParts.push(`Budget: ${form.budget}`);
      if (form.timeline) messageParts.push(`Timeline: ${form.timeline}`);
      if (form.startDate) messageParts.push(`Preferred start: ${form.startDate}`);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: `New Project: ${form.services.slice(0, 2).join(", ")}${form.services.length > 2 ? ` + ${form.services.length - 2} more` : ""}`,
        service: form.services.join(", "),
        message: messageParts.join("\n"),
      };

      await client.post("/contact", payload);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          "Something went wrong. Please try again or email us directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setStep(0);
    setErrors({});
    setErrorMsg("");
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- If submitted, show success screen ---------- */
  if (submitted) {
    return <SuccessScreen onReset={resetForm} email={form.email} responseTime={settings?.responseTime || "24-48 hours"} />;
  }

  return (
    <>
      <PageHero
        pageKey="start-project"
        title="Let's Build Something Amazing"
        subtitle="Tell us about your project in 5 quick steps. We'll respond with a plan, timeline, and quote."
        image="/assets/start-hero.jpg"
        primaryCtaLabel="Get Started"
        primaryCtaTo="#wizard"
        secondaryCtaLabel="See Our Work"
        secondaryCtaTo="/portfolio"
      />

      <section className="section" id="wizard" ref={contentRef}>
        <div className="container">
          <div className="wizard-layout">
            {/* Main wizard */}
            <div className="wizard-main">
              {/* Progress bar */}
              <div className="wizard-progress">
                <div className="wizard-progress-track">
                  <div
                    className="wizard-progress-fill"
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="wizard-steps">
                  {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const isDone = i < step;
                    const isActive = i === step;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        className={`wizard-step ${isActive ? "wizard-step-active" : ""} ${isDone ? "wizard-step-done" : ""}`}
                        onClick={() => goToStep(i)}
                        disabled={i > step}
                      >
                        <span className="wizard-step-icon">
                          {isDone ? <Check size={14} /> : <Icon size={14} />}
                        </span>
                        <span className="wizard-step-label">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="wizard-progress-info">
                  Step {step + 1} of {STEPS.length}
                </div>
              </div>

              {/* Error banner (from submit) */}
              {errorMsg && (
                <div className="wizard-alert">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step content */}
              <div className="wizard-card">
                {/* ============ STEP 1: BASICS ============ */}
                {step === 0 && (
                  <div className="wizard-step-content">
                    <div className="wizard-step-header">
                      <div className="wizard-step-badge">
                        <User size={14} />
                        <span>Step 1 · Basics</span>
                      </div>
                      <h2 className="wizard-h2">Let's start with the basics</h2>
                      <p className="wizard-sub">
                        Tell us a bit about yourself so we know how to reach you.
                      </p>
                    </div>

                    <div className="wizard-form">
                      <div className="grid-2">
                        <div className="field">
                          <label className="label">
                            Your name <span className="req">*</span>
                          </label>
                          <div className={`control ${errors.name ? "control-error" : ""}`}>
                            <input
                              className="control-input"
                              value={form.name}
                              onChange={(e) => updateField("name", e.target.value)}
                              placeholder="John Doe"
                              autoComplete="name"
                              autoFocus
                            />
                          </div>
                          {errors.name && <div className="field-error">{errors.name}</div>}
                        </div>

                        <div className="field">
                          <label className="label">
                            Email <span className="req">*</span>
                          </label>
                          <div className={`control ${errors.email ? "control-error" : ""}`}>
                            <input
                              type="email"
                              className="control-input"
                              value={form.email}
                              onChange={(e) => updateField("email", e.target.value)}
                              placeholder="you@example.com"
                              autoComplete="email"
                            />
                          </div>
                          {errors.email && <div className="field-error">{errors.email}</div>}
                        </div>
                      </div>

                      <div className="grid-2">
                        <div className="field">
                          <label className="label">
                            Company <span className="label-muted">(optional)</span>
                          </label>
                          <div className="control control-with-icon">
                            <Building2 size={16} className="control-icon" />
                            <input
                              className="control-input"
                              value={form.company}
                              onChange={(e) => updateField("company", e.target.value)}
                              placeholder="Your company or brand"
                              autoComplete="organization"
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label className="label">
                            Website URL <span className="label-muted">(optional)</span>
                          </label>
                          <div className="control control-with-icon">
                            <Globe size={16} className="control-icon" />
                            <input
                              type="url"
                              className="control-input"
                              value={form.website}
                              onChange={(e) => updateField("website", e.target.value)}
                              placeholder="https://yoursite.com"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============ STEP 2: SERVICES ============ */}
                {step === 1 && (
                  <div className="wizard-step-content">
                    <div className="wizard-step-header">
                      <div className="wizard-step-badge">
                        <Wrench size={14} />
                        <span>Step 2 · Services</span>
                      </div>
                      <h2 className="wizard-h2">What are you looking to build?</h2>
                      <p className="wizard-sub">
                        Select all that apply — you can pick multiple services.
                      </p>
                    </div>

                    <div className="wizard-form">
                      <div className="service-chip-grid">
                        {availableServices.map((service) => {
                          const isActive = form.services.includes(service);
                          return (
                            <button
                              key={service}
                              type="button"
                              className={`service-chip ${isActive ? "service-chip-active" : ""}`}
                              onClick={() => toggleService(service)}
                            >
                              <span className="service-chip-check">
                                {isActive ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
                              </span>
                              <span>{service}</span>
                            </button>
                          );
                        })}
                      </div>

                      {form.services.length > 0 && (
                        <div className="services-summary">
                          <Sparkles size={14} />
                          <span>
                            {form.services.length} service{form.services.length > 1 ? "s" : ""} selected
                          </span>
                        </div>
                      )}

                      {errors.services && (
                        <div className="field-error" style={{ textAlign: "center" }}>
                          {errors.services}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ============ STEP 3: SCOPE ============ */}
                {step === 2 && (
                  <div className="wizard-step-content">
                    <div className="wizard-step-header">
                      <div className="wizard-step-badge">
                        <FileText size={14} />
                        <span>Step 3 · Scope</span>
                      </div>
                      <h2 className="wizard-h2">Tell us about your project</h2>
                      <p className="wizard-sub">
                        The more detail you share, the more accurate our proposal.
                      </p>
                    </div>

                    <div className="wizard-form">
                      <div className="field">
                        <label className="label">
                          What kind of project? <span className="req">*</span>
                        </label>
                        <div className="option-grid">
                          {PROJECT_TYPES.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              className={`option-card ${form.projectType === opt.value ? "option-card-active" : ""}`}
                              onClick={() => updateField("projectType", opt.value)}
                            >
                              <span>{opt.label}</span>
                              {form.projectType === opt.value && (
                                <Check size={16} className="option-card-check" />
                              )}
                            </button>
                          ))}
                        </div>
                        {errors.projectType && (
                          <div className="field-error">{errors.projectType}</div>
                        )}
                      </div>

                      <div className="field">
                        <label className="label">
                          Project description <span className="req">*</span>
                        </label>
                        <div className={`control control-textarea ${errors.description ? "control-error" : ""}`}>
                          <textarea
                            className="control-textarea-input"
                            value={form.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="What are you building? Who is it for? What features do you need? What problem does it solve?"
                            rows={6}
                          />
                        </div>
                        <div className="hint">
                          {form.description.length} characters — minimum 20
                        </div>
                        {errors.description && (
                          <div className="field-error">{errors.description}</div>
                        )}
                      </div>

                      <div className="field">
                        <label className="label">
                          Reference links <span className="label-muted">(optional)</span>
                        </label>
                        <div className="hint" style={{ marginBottom: 8 }}>
                          Share websites you like the look of, or examples of similar products.
                        </div>
                        {form.references.map((ref, i) => (
                          <div key={i} className="control control-with-icon" style={{ marginBottom: 8 }}>
                            <Globe size={16} className="control-icon" />
                            <input
                              type="url"
                              className="control-input"
                              value={ref}
                              onChange={(e) => updateReference(i, e.target.value)}
                              placeholder={`https://reference-${i + 1}.com`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ============ STEP 4: BUDGET ============ */}
                {step === 3 && (
                  <div className="wizard-step-content">
                    <div className="wizard-step-header">
                      <div className="wizard-step-badge">
                        <DollarSign size={14} />
                        <span>Step 4 · Budget & Timeline</span>
                      </div>
                      <h2 className="wizard-h2">Budget & timing</h2>
                      <p className="wizard-sub">
                        These help us recommend the right approach. Not sure yet? That's OK — leave them blank.
                      </p>
                    </div>

                    <div className="wizard-form">
                      <div className="grid-2">
                        <div className="field">
                          <label className="label">
                            Budget range <span className="label-muted">(optional)</span>
                          </label>
                          <Select
                            value={form.budget}
                            onChange={(v) => updateField("budget", v)}
                            placeholder="Select budget"
                            options={BUDGETS}
                          />
                        </div>

                        <div className="field">
                          <label className="label">
                            Timeline <span className="label-muted">(optional)</span>
                          </label>
                          <Select
                            value={form.timeline}
                            onChange={(v) => updateField("timeline", v)}
                            placeholder="Select timeline"
                            options={TIMELINES}
                          />
                        </div>
                      </div>

                      <div className="field">
                        <label className="label">
                          Preferred start date <span className="label-muted">(optional)</span>
                        </label>
                        <div className="control">
                          <input
                            type="date"
                            className="control-input"
                            value={form.startDate}
                            onChange={(e) => updateField("startDate", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="wizard-info-card">
                        <Sparkles size={18} />
                        <div>
                          <strong>Why we ask about budget</strong>
                          <p>
                            Budget helps us recommend the right scope and features.
                            We'll always be transparent about pricing and can work with
                            most budgets.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============ STEP 5: REVIEW ============ */}
                {step === 4 && (
                  <div className="wizard-step-content">
                    <div className="wizard-step-header">
                      <div className="wizard-step-badge">
                        <Send size={14} />
                        <span>Step 5 · Review & Send</span>
                      </div>
                      <h2 className="wizard-h2">Almost done! Review your info</h2>
                      <p className="wizard-sub">
                        Check the details below, add contact preferences, and hit send.
                      </p>
                    </div>

                    <div className="wizard-form">
                      {/* Summary cards */}
                      <div className="wizard-summary">
                        <SummaryRow
                          label="Contact"
                          onEdit={() => goToStep(0)}
                          items={[
                            form.name,
                            form.email,
                            form.company && `${form.company}`,
                            form.website && form.website,
                          ].filter(Boolean)}
                        />

                        <SummaryRow
                          label="Services"
                          onEdit={() => goToStep(1)}
                          items={form.services.length > 0 ? form.services : ["None selected"]}
                          isChips
                        />

                        <SummaryRow
                          label="Project"
                          onEdit={() => goToStep(2)}
                          items={[
                            PROJECT_TYPES.find((t) => t.value === form.projectType)?.label || form.projectType,
                            form.description && form.description.slice(0, 100) + (form.description.length > 100 ? "..." : ""),
                          ].filter(Boolean)}
                        />

                        <SummaryRow
                          label="Budget & Timeline"
                          onEdit={() => goToStep(3)}
                          items={[
                            form.budget || "Not specified",
                            form.timeline || "Not specified",
                            form.startDate && `Start: ${form.startDate}`,
                          ].filter(Boolean)}
                        />
                      </div>

                      {/* Contact preferences (last minute) */}
                      <div className="wizard-final-section">
                        <div className="form-section-title">Contact preferences</div>

                        <div className="grid-2">
                          <div className="field">
                            <label className="label">
                              Phone <span className="label-muted">(optional)</span>
                            </label>
                            <div className="control control-with-icon">
                              <Phone size={16} className="control-icon" />
                              <input
                                type="tel"
                                className="control-input"
                                value={form.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                placeholder="+92 300 1234567"
                              />
                            </div>
                          </div>

                          <div className="field">
                            <label className="label">
                              How should we reach you?
                            </label>
                            <Select
                              value={form.contactMethod}
                              onChange={(v) => updateField("contactMethod", v)}
                              placeholder="Preferred method"
                              options={CONTACT_METHODS}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Honeypot */}
                      <div className="honeypot" aria-hidden="true">
                        <input
                          type="text"
                          name="honeypot"
                          value={form.honeypot}
                          onChange={(e) => updateField("honeypot", e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="wizard-nav">
                <button
                  type="button"
                  className="wizard-nav-btn wizard-nav-back"
                  onClick={goBack}
                  disabled={step === 0}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    className="wizard-nav-btn wizard-nav-next"
                    onClick={goNext}
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="wizard-nav-btn wizard-nav-submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="wizard-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Project
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="wizard-sidebar">
              <div className="wizard-sidebar-card">
                <div className="wizard-sidebar-title">What happens next?</div>
                <ol className="wizard-timeline">
                  <li className="wizard-timeline-item">
                    <span className="wizard-timeline-num">1</span>
                    <div>
                      <div className="wizard-timeline-label">You submit this form</div>
                      <div className="wizard-timeline-text">Takes about 2-3 minutes</div>
                    </div>
                  </li>
                  <li className="wizard-timeline-item">
                    <span className="wizard-timeline-num">2</span>
                    <div>
                      <div className="wizard-timeline-label">We review your request</div>
                      <div className="wizard-timeline-text">Usually within {settings?.responseTime || "24-48 hours"}</div>
                    </div>
                  </li>
                  <li className="wizard-timeline-item">
                    <span className="wizard-timeline-num">3</span>
                    <div>
                      <div className="wizard-timeline-label">Free discovery call</div>
                      <div className="wizard-timeline-text">30 minutes to align on goals</div>
                    </div>
                  </li>
                  <li className="wizard-timeline-item">
                    <span className="wizard-timeline-num">4</span>
                    <div>
                      <div className="wizard-timeline-label">Proposal & quote</div>
                      <div className="wizard-timeline-text">Clear pricing, timeline, deliverables</div>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="wizard-sidebar-card wizard-sidebar-cta">
                <MessageSquare size={22} />
                <div className="wizard-sidebar-title">Prefer to chat?</div>
                <p className="wizard-sidebar-text">
                  Skip the form and reach us directly.
                </p>
                <Button as={Link} to="/contact" variant="secondary" style={{ width: "100%" }}>
                  Contact Us
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Summary Row (Review step) ---------- */
function SummaryRow({ label, items, onEdit, isChips = false }) {
  return (
    <div className="summary-row">
      <div className="summary-row-head">
        <div className="summary-row-label">{label}</div>
        <button type="button" className="summary-row-edit" onClick={onEdit}>
          Edit <ChevronRight size={12} />
        </button>
      </div>
      {isChips ? (
        <div className="summary-chips">
          {items.map((item, i) => (
            <span key={i} className="summary-chip">{item}</span>
          ))}
        </div>
      ) : (
        <div className="summary-row-body">
          {items.map((item, i) => (
            <div key={i} className="summary-row-item">{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Success Screen ---------- */
function SuccessScreen({ onReset, email, responseTime }) {
  return (
    <>
      <PageHero
        pageKey="start-project"
        title="Let's Build Something Amazing"
        subtitle="Tell us about your project in 5 quick steps."
        image="/assets/start-hero.jpg"
        primaryCtaLabel=""
        secondaryCtaLabel=""
      />
      <section className="section">
        <div className="container">
          <div className="success-wrap">
            <div className="success-card">
              <div className="success-icon-wrap">
                <div className="success-icon-ring" />
                <div className="success-icon-ring success-icon-ring-2" />
                <CheckCircle2 size={60} className="success-icon" />
              </div>

              <h1 className="success-title">Project submitted! 🎉</h1>
              <p className="success-text">
                Thanks for reaching out! We've received your project details and
                will get back to you at <strong>{email}</strong> within{" "}
                <strong>{responseTime}</strong>.
              </p>

              <div className="success-steps">
                <div className="success-step">
                  <div className="success-step-num">1</div>
                  <div>
                    <div className="success-step-label">We review your project</div>
                    <div className="success-step-text">Within {responseTime}</div>
                  </div>
                </div>
                <div className="success-step">
                  <div className="success-step-num">2</div>
                  <div>
                    <div className="success-step-label">Free discovery call</div>
                    <div className="success-step-text">30-min video chat</div>
                  </div>
                </div>
                <div className="success-step">
                  <div className="success-step-num">3</div>
                  <div>
                    <div className="success-step-label">Proposal & timeline</div>
                    <div className="success-step-text">Clear next steps</div>
                  </div>
                </div>
              </div>

              <div className="success-actions">
                <Button variant="primary" onClick={onReset}>
                  Submit another project
                </Button>
                <Button as={Link} to="/portfolio" variant="secondary">
                  See our work
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}