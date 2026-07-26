import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, ChevronDown, HelpCircle, Sparkles, Package, Zap } from "lucide-react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";
import client from "../api/client.js";

/* ---------- Currency symbols ---------- */
const CURRENCY_SYMBOLS = {
  USD: "$",
  PKR: "₨",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
};

/* ---------- Billing cycle types ---------- */
const CYCLES = { MONTHLY: "monthly", YEARLY: "yearly" };

/* ---------- Helper: calc yearly savings % ---------- */
function calcSavings(monthlyPrice, yearlyPrice) {
  if (!monthlyPrice || !yearlyPrice) return 0;
  const monthlyTotal = monthlyPrice * 12;
  if (yearlyPrice >= monthlyTotal) return 0;
  const savings = ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;
  return Math.round(savings);
}

/* ---------- Billing Toggle ---------- */
function BillingToggle({ cycle, onChange, avgSavings }) {
  return (
    <div className="pricing-toggle-wrap">
      <div className="pricing-toggle">
        <button
          type="button"
          className={`pricing-toggle-btn ${cycle === CYCLES.MONTHLY ? "active" : ""}`}
          onClick={() => onChange(CYCLES.MONTHLY)}
        >
          Monthly
        </button>
        <button
          type="button"
          className={`pricing-toggle-btn ${cycle === CYCLES.YEARLY ? "active" : ""}`}
          onClick={() => onChange(CYCLES.YEARLY)}
        >
          Yearly
          {avgSavings > 0 && (
            <span className="pricing-toggle-save">Save {avgSavings}%</span>
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------- Pricing Card ---------- */
function PricingCard({ plan, cycle }) {
  const symbol = CURRENCY_SYMBOLS[plan.currency] || "$";
  const hasYearly = plan.yearlyPrice > 0;
  const activeCycle = hasYearly ? cycle : CYCLES.MONTHLY;
  const displayPrice =
    activeCycle === CYCLES.YEARLY ? plan.yearlyPrice : plan.monthlyPrice;
  const priceUnit = activeCycle === CYCLES.YEARLY ? "/yr" : "/mo";

  const cardStyle = plan.isFeatured
    ? {
        borderColor: plan.accentColor || "var(--brand)",
      }
    : {};

  return (
    <div
      className={`plan-card ${plan.isFeatured ? "plan-card-featured" : ""}`}
      style={cardStyle}
    >
      {plan.badge && (
        <div
          className="plan-badge"
          style={{
            background: plan.accentColor
              ? `linear-gradient(135deg, ${plan.accentColor} 0%, ${plan.accentColor}dd 100%)`
              : undefined,
          }}
        >
          <Sparkles size={12} />
          {plan.badge}
        </div>
      )}

      <div className="plan-head">
        <div className="plan-name">{plan.name}</div>
        {plan.tagline && <div className="plan-tagline">{plan.tagline}</div>}
      </div>

      {/* Price display */}
      <div className="plan-price-block">
        {plan.isCustomPricing ? (
          <>
            <div className="plan-price-custom">
              {plan.customPriceLabel || "Custom"}
            </div>
            <div className="plan-price-unit">Get a personalized quote</div>
          </>
        ) : (
          <>
            <div className="plan-price">
              <span className="plan-price-currency">{symbol}</span>
              <span className="plan-price-value">
                {displayPrice.toLocaleString()}
              </span>
              <span className="plan-price-unit">{priceUnit}</span>
            </div>
            {activeCycle === CYCLES.YEARLY && hasYearly && (
              <div className="plan-price-hint">
                {symbol}
                {Math.round(plan.yearlyPrice / 12).toLocaleString()}/mo billed yearly
              </div>
            )}
            {!hasYearly && cycle === CYCLES.YEARLY && (
              <div className="plan-price-hint">Monthly billing only</div>
            )}
          </>
        )}
      </div>

      {plan.description && (
        <div className="plan-description">{plan.description}</div>
      )}

      {/* Features */}
      {plan.features?.length > 0 && (
        <ul className="plan-features">
          {plan.features.map((f, i) => (
            <li
              key={i}
              className={!f.included ? "plan-feature-excluded" : ""}
            >
              <span
                className={
                  f.included ? "plan-check plan-check-yes" : "plan-check plan-check-no"
                }
              >
                {f.included ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  <X size={12} strokeWidth={3} />
                )}
              </span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <div className="plan-cta">
        <Button
          as={Link}
          to={plan.ctaLink || "/contact"}
          variant={plan.isFeatured ? "primary" : "secondary"}
          style={{
            width: "100%",
            ...(plan.isFeatured && plan.accentColor
              ? { background: plan.accentColor, borderColor: plan.accentColor }
              : {}),
          }}
        >
          {plan.ctaText || "Get Started"}
        </Button>
      </div>
    </div>
  );
}

/* ---------- Addon Card ---------- */
function AddonCard({ addon }) {
  return (
    <div className="addon-card">
      <div className="addon-card-head">
        <div className="addon-card-icon">
          <Zap size={18} />
        </div>
        <div className="addon-card-price">{addon.price}</div>
      </div>
      <div className="addon-card-title">{addon.title}</div>
      <div className="addon-card-text">{addon.description}</div>
    </div>
  );
}

/* ---------- FAQ Accordion Item ---------- */
function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? "faq-item-open" : ""}`}>
      <button
        type="button"
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{faq.question}</span>
        <span className="faq-icon">
          <ChevronDown size={18} />
        </span>
      </button>
      <div className="faq-answer" aria-hidden={!isOpen}>
        <div className="faq-answer-inner">{faq.answer}</div>
      </div>
    </div>
  );
}

/* ---------- Empty State ---------- */
function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="services-empty">
      <div className="services-empty-icon">
        <Icon size={40} />
      </div>
      <div className="services-empty-title">{title}</div>
      <div className="services-empty-text">{text}</div>
      <Button as={Link} to="/contact" variant="primary">
        Get in touch
      </Button>
    </div>
  );
}

/* ============================================
   MAIN PRICING PAGE
   ============================================ */
export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const [addons, setAddons] = useState([]);
  const [addonsLoading, setAddonsLoading] = useState(true);

  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [openFaqId, setOpenFaqId] = useState(null);

  const [cycle, setCycle] = useState(CYCLES.MONTHLY);

  // Load pricing plans
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/pricing");
        if (!cancelled) {
          const list = data?.data?.plans || [];
          setPlans(list);
        }
      } catch (err) {
        console.warn("[Pricing] Plans fetch failed:", err.message);
      } finally {
        if (!cancelled) setPlansLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load addons
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/addons");
        if (!cancelled) {
          const list = data?.data?.items || data?.data?.addons || [];
          setAddons(list);
        }
      } catch (err) {
        console.warn("[Pricing] Addons fetch failed:", err.message);
      } finally {
        if (!cancelled) setAddonsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load pricing FAQs
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/faqs?category=pricing");
        if (!cancelled) {
          const list = data?.data?.items || data?.data?.faqs || [];
          setFaqs(list);
        }
      } catch (err) {
        console.warn("[Pricing] FAQs fetch failed:", err.message);
      } finally {
        if (!cancelled) setFaqsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Calculate average savings across all plans (for the toggle badge)
  const avgSavings = (() => {
    const savings = plans
      .filter((p) => !p.isCustomPricing && p.monthlyPrice && p.yearlyPrice)
      .map((p) => calcSavings(p.monthlyPrice, p.yearlyPrice));
    if (savings.length === 0) return 0;
    return Math.round(savings.reduce((a, b) => a + b, 0) / savings.length);
  })();

  // Show toggle only if at least one plan has yearly pricing
  const hasAnyYearly = plans.some((p) => p.yearlyPrice > 0);

  return (
    <>
      {/* HERO — dynamic */}
      <PageHero
        pageKey="pricing"
        title="Simple, transparent pricing"
        subtitle="Choose the plan that fits your needs. No hidden fees, cancel anytime."
        image="/assets/pricing-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Contact Sales"
        secondaryCtaTo="/contact"
      />

      {/* ============ PLANS ============ */}
      <section className="section">
        <div className="container">
          <div className="pricing-head-center">
            <h2 className="pricing-h2">Choose your plan</h2>
            <p className="pricing-sub">
              Flexible packages designed to scale with your business.
            </p>
          </div>

          {/* Billing toggle */}
          {hasAnyYearly && !plansLoading && plans.length > 0 && (
            <BillingToggle
              cycle={cycle}
              onChange={setCycle}
              avgSavings={avgSavings}
            />
          )}

          {plansLoading ? (
            <div className="plans-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="plan-card">
                  <div className="skeleton skeleton-line" style={{ width: 100 }} />
                  <div className="skeleton skeleton-line" style={{ width: "80%", marginTop: 8 }} />
                  <div className="skeleton" style={{ height: 60, width: "60%", marginTop: 20, borderRadius: 8 }} />
                  <div style={{ marginTop: 20 }}>
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="skeleton skeleton-line" style={{ marginTop: 10 }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : plans.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Pricing plans coming soon"
              text="We're finalizing our pricing packages. In the meantime, contact us for a custom quote."
            />
          ) : (
            <div
              className="plans-grid"
              style={{
                gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, minmax(0, 1fr))`,
              }}
            >
              {plans.map((plan) => (
                <PricingCard key={plan._id} plan={plan} cycle={cycle} />
              ))}
            </div>
          )}

          <div className="pricing-note">
            💡 All prices are exclusive of applicable taxes. Custom features can be
            added on request.
          </div>
        </div>
      </section>

      {/* ============ ADD-ONS ============ */}
      {(addonsLoading || addons.length > 0) && (
        <section className="section addons-section-bg">
          <div className="container">
            <div className="pricing-head-center">
              <h2 className="pricing-h2">Boost with add-ons</h2>
              <p className="pricing-sub">
                Extra services to complement any plan.
              </p>
            </div>

            {addonsLoading ? (
              <div className="addons-grid-new">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="addon-card">
                    <div className="skeleton skeleton-line" style={{ width: 80 }} />
                    <div className="skeleton skeleton-line" style={{ marginTop: 14 }} />
                    <div className="skeleton skeleton-line" style={{ width: "80%" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="addons-grid-new">
                {addons.map((addon) => (
                  <AddonCard key={addon._id} addon={addon} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ CTA BANNER ============ */}
      <section className="section">
        <div className="container">
          <div className="svc-cta-banner">
            <div className="svc-cta-content">
              <div className="svc-cta-title">Need a custom quote?</div>
              <div className="svc-cta-text">
                Tell us your requirements and we'll build a package that fits
                your budget and timeline perfectly.
              </div>
            </div>
            <div className="svc-cta-actions">
              <Button as={Link} to="/start-project" variant="primary">
                Get Custom Quote
              </Button>
              <Button as={Link} to="/contact" variant="secondary">
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING FAQs ============ */}
      {(faqsLoading || faqs.length > 0) && (
        <section className="section">
          <div className="container">
            <div className="services-head-center">
              <div className="svc-faq-badge">
                <HelpCircle size={16} />
                <span>Pricing FAQ</span>
              </div>
              <h2 className="pricing-h2">Common pricing questions</h2>
              <p className="pricing-sub">
                Everything you need to know before choosing a plan.
              </p>
            </div>

            {faqsLoading ? (
              <div className="faq-list">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="faq-item">
                    <div style={{ padding: "18px 20px" }}>
                      <div className="skeleton skeleton-line" style={{ width: "60%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="faq-list">
                {faqs.map((faq) => (
                  <FaqItem
                    key={faq._id}
                    faq={faq}
                    isOpen={openFaqId === faq._id}
                    onToggle={() =>
                      setOpenFaqId(openFaqId === faq._id ? null : faq._id)
                    }
                  />
                ))}
              </div>
            )}

            <div className="svc-faq-footer">
              <div className="text-mute">Still have questions?</div>
              <Button as={Link} to="/help" variant="secondary">
                See all FAQs
              </Button>
              <Button as={Link} to="/contact" variant="primary">
                Contact us
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}