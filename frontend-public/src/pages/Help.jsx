import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  ChevronDown,
  Mail,
  MessageCircle,
  Send,
  HelpCircle,
  Sparkles,
  Package,
  DollarSign,
  Settings,
  Headphones,
  BookOpen,
  Loader2,
} from "lucide-react";
import PageHero from "../components/ui/PageHero.jsx";
import Button from "../components/ui/Button.jsx";
import client from "../api/client.js";
import { useSite } from "../context/SiteContext.jsx";

/* ---------- Category display config ---------- */
const CATEGORY_META = {
  all: { label: "All questions", icon: Sparkles },
  general: { label: "General", icon: BookOpen },
  services: { label: "Services", icon: Package },
  pricing: { label: "Pricing", icon: DollarSign },
  process: { label: "Process", icon: Settings },
  support: { label: "Support", icon: Headphones },
  help: { label: "Help", icon: HelpCircle },
};

const POPULAR_SEARCHES = ["pricing", "timeline", "payment", "revisions", "support"];

/* ---------- WhatsApp helper ---------- */
function normalizeWhatsapp(num = "") {
  const digits = num.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

/* ---------- Highlight matching text ---------- */
function highlightText(text = "", query = "") {
  if (!query.trim() || !text) return text;

  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="faq-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ---------- FAQ Accordion Item (with highlighting) ---------- */
function FaqItem({ faq, isOpen, onToggle, query }) {
  const categoryMeta = CATEGORY_META[faq.category] || CATEGORY_META.general;
  const CategoryIcon = categoryMeta.icon;

  return (
    <div className={`faq-item ${isOpen ? "faq-item-open" : ""}`}>
      <button
        type="button"
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="faq-q-content">
          <span className="faq-q-text">
            {highlightText(faq.question, query)}
          </span>
          <span className="faq-q-cat" title={categoryMeta.label}>
            <CategoryIcon size={11} />
            <span>{categoryMeta.label}</span>
          </span>
        </div>
        <span className="faq-icon">
          <ChevronDown size={18} />
        </span>
      </button>
      <div className="faq-answer" aria-hidden={!isOpen}>
        <div className="faq-answer-inner">
          {highlightText(faq.answer, query)}
        </div>
      </div>
    </div>
  );
}

/* ---------- Quick Contact Card ---------- */
function ContactCard({ icon: Icon, iconColor, title, text, ctaLabel, ctaHref, external = false }) {
  const Wrapper = external ? "a" : Link;
  const wrapperProps = external
    ? { href: ctaHref, target: "_blank", rel: "noopener noreferrer" }
    : { to: ctaHref };

  return (
    <Wrapper {...wrapperProps} className="help-contact-card">
      <div className="help-contact-icon" style={{ background: iconColor }}>
        <Icon size={22} />
      </div>
      <div className="help-contact-body">
        <div className="help-contact-title">{title}</div>
        <div className="help-contact-text">{text}</div>
      </div>
      <div className="help-contact-cta">{ctaLabel} →</div>
    </Wrapper>
  );
}

/* ============================================
   MAIN HELP PAGE
   ============================================ */
export default function Help() {
  const { settings } = useSite();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [openFaqId, setOpenFaqId] = useState(null);

  // Load ALL FAQs
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.get("/faqs");
        if (!cancelled) {
          const list = data?.data?.items || data?.data?.faqs || [];
          setFaqs(list);
        }
      } catch (err) {
        console.warn("[Help] FAQs fetch failed:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Build categories dynamically from actual FAQ data (only show categories with FAQs)
  const availableCategories = useMemo(() => {
    const counts = { all: faqs.length };
    faqs.forEach((f) => {
      const cat = f.category || "general";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Preserve preferred order
    const preferred = ["all", "general", "services", "pricing", "process", "support", "help"];
    const result = [];
    preferred.forEach((cat) => {
      if (counts[cat] > 0) {
        result.push({
          key: cat,
          ...CATEGORY_META[cat],
          count: counts[cat],
        });
      }
    });
    return result;
  }, [faqs]);

  // Filter FAQs by category + search
  const filtered = useMemo(() => {
    let list = faqs;

    // Category filter (skipped if searching — search spans all)
    if (activeCategory !== "all" && !search.trim()) {
      list = list.filter((f) => (f.category || "general") === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.question?.toLowerCase().includes(q) ||
          f.answer?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [faqs, activeCategory, search]);

  // Contact info from settings
  const email = settings?.email || "";
  const whatsappUrl = normalizeWhatsapp(settings?.whatsapp || "");
  const responseTime = settings?.responseTime || "24-48 hours";

  const searchIsActive = search.trim().length > 0;

  // Reset open FAQ when filters change
  useEffect(() => {
    setOpenFaqId(null);
  }, [activeCategory, search]);

  function handlePopularClick(term) {
    setSearch(term);
    // Scroll to FAQ section
    setTimeout(() => {
      document.getElementById("help-faq-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  return (
    <>
      <PageHero
        pageKey="help"
        title="How can we help?"
        subtitle="Find quick answers, get in touch, or start your project. We're here to help."
        image="/assets/help-hero.jpg"
        primaryCtaLabel="Start a Project"
        primaryCtaTo="/start-project"
        secondaryCtaLabel="Contact"
        secondaryCtaTo="/contact"
      />

      {/* ============ BIG SEARCH ============ */}
      <section className="section help-search-section">
        <div className="container">
          <div className="help-search-wrap">
            <div className="help-search-input-wrap">
              <Search size={22} className="help-search-icon" />
              <input
                type="text"
                className="help-search-input"
                placeholder="Search for answers... (e.g. pricing, timeline, refunds)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus={false}
              />
              {search && (
                <button
                  type="button"
                  className="help-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="help-search-popular">
              <span className="help-search-popular-label">Popular:</span>
              <div className="help-search-popular-chips">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="help-popular-chip"
                    onClick={() => handlePopularClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUICK CONTACT CARDS ============ */}
      <section className="section">
        <div className="container">
          <div className="help-head-center">
            <h2 className="help-h2">Get in touch instantly</h2>
            <p className="help-sub">
              Prefer to talk to a human? Reach us via your favorite channel.
            </p>
          </div>

          <div className="help-contact-grid">
            {email && (
              <ContactCard
                icon={Mail}
                iconColor="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
                title="Email us"
                text={`${email} — We reply within ${responseTime}`}
                ctaLabel="Send email"
                ctaHref={`mailto:${email}`}
                external
              />
            )}

            {whatsappUrl && (
              <ContactCard
                icon={MessageCircle}
                iconColor="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                title="WhatsApp us"
                text="Chat with us for the fastest response during business hours."
                ctaLabel="Start chat"
                ctaHref={whatsappUrl}
                external
              />
            )}

            <ContactCard
              icon={Send}
              iconColor="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
              title="Start a project"
              text="Ready to build something? Send us your requirements."
              ctaLabel="Get a quote"
              ctaHref="/start-project"
            />
          </div>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className="section help-faq-section-bg" id="help-faq-section">
        <div className="container">
          <div className="help-head-center">
            <div className="svc-faq-badge">
              <HelpCircle size={16} />
              <span>Knowledge base</span>
            </div>
            <h2 className="help-h2">Frequently asked questions</h2>
            <p className="help-sub">
              Everything you need to know about our services, process, and pricing.
            </p>
          </div>

          {/* Category tabs — hidden when searching */}
          {!searchIsActive && !loading && availableCategories.length > 1 && (
            <div className="help-tabs-wrap">
              <div className="help-tabs">
                {availableCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      className={`help-tab ${activeCategory === cat.key ? "help-tab-active" : ""}`}
                      onClick={() => setActiveCategory(cat.key)}
                    >
                      <Icon size={15} />
                      <span>{cat.label}</span>
                      <span className="help-tab-count">{cat.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search results header */}
          {searchIsActive && !loading && (
            <div className="help-search-results-header">
              <div>
                {filtered.length === 0 ? (
                  <>
                    No results for <strong>"{search}"</strong>
                  </>
                ) : (
                  <>
                    {filtered.length} {filtered.length === 1 ? "result" : "results"} for{" "}
                    <strong>"{search}"</strong>
                  </>
                )}
              </div>
              <button
                type="button"
                className="help-search-reset"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>
          )}

          {/* FAQ list */}
          {loading ? (
            <div className="faq-list" style={{ marginTop: 24 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="faq-item">
                  <div style={{ padding: "20px" }}>
                    <div className="skeleton skeleton-line" style={{ width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="help-empty">
              <div className="help-empty-icon">
                <Search size={40} />
              </div>
              <div className="help-empty-title">
                {searchIsActive ? "No matches found" : "No questions yet"}
              </div>
              <div className="help-empty-text">
                {searchIsActive
                  ? "Try a different search term, or contact us directly."
                  : "We're building up our knowledge base. In the meantime, feel free to contact us."}
              </div>
              <div className="help-empty-actions">
                {searchIsActive && (
                  <Button variant="secondary" onClick={() => setSearch("")}>
                    Clear search
                  </Button>
                )}
                <Button as={Link} to="/contact" variant="primary">
                  Ask a question
                </Button>
              </div>
            </div>
          ) : (
            <div className="faq-list" style={{ marginTop: 24 }}>
              {filtered.map((faq) => (
                <FaqItem
                  key={faq._id}
                  faq={faq}
                  isOpen={openFaqId === faq._id}
                  onToggle={() =>
                    setOpenFaqId(openFaqId === faq._id ? null : faq._id)
                  }
                  query={search}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ STILL NEED HELP CTA ============ */}
      <section className="section">
        <div className="container">
          <div className="svc-cta-banner">
            <div className="svc-cta-content">
              <div className="svc-cta-title">Still need help?</div>
              <div className="svc-cta-text">
                Can't find what you're looking for? Our team is ready to answer
                any question — big or small.
              </div>
            </div>
            <div className="svc-cta-actions">
              <Button as={Link} to="/contact" variant="primary">
                Contact Support
              </Button>
              <Button as={Link} to="/start-project" variant="secondary">
                Start a Project
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}