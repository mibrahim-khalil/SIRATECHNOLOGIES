import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext.jsx";

/* ---------- Icons (inline SVG, no extra deps) ---------- */
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
function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function IconGithub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function IconTwitter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/* ---------- Helpers ---------- */
function splitBrand(name = "") {
  const trimmed = name.trim();
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { strong: trimmed, rest: "" };
  return { strong: trimmed.slice(0, idx), rest: trimmed.slice(idx + 1) };
}

function normalizeWhatsapp(num = "") {
  const digits = num.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

/* ---------- Component ---------- */
export default function Footer() {
  const { settings } = useSite();

  const brand = splitBrand(settings?.siteName || "SIRA Technologies");
  const logoUrl = settings?.logo?.url || "/assets/logo.png";
  const year = new Date().getFullYear();

  const email = settings?.email || "";
  const phone = settings?.phone || "";
  const whatsappUrl = normalizeWhatsapp(settings?.whatsapp || "");
  const address = settings?.address || "";

  const social = settings?.social || {};
  const socialLinks = [
    { key: "linkedin", url: social.linkedin, Icon: IconLinkedIn, label: "LinkedIn" },
    { key: "github", url: social.github, Icon: IconGithub, label: "GitHub" },
    { key: "twitter", url: social.twitter, Icon: IconTwitter, label: "Twitter / X" },
    { key: "instagram", url: social.instagram, Icon: IconInstagram, label: "Instagram" },
    { key: "facebook", url: social.facebook, Icon: IconFacebook, label: "Facebook" },
    { key: "youtube", url: social.youtube, Icon: IconYoutube, label: "YouTube" },
  ].filter((s) => s.url);

  const description =
    settings?.shortDescription ||
    settings?.tagline ||
    "Digital solutions studio — modern websites, apps, AI, and automation.";

  const footerText =
    settings?.footerText ||
    `© ${year} ${settings?.siteName || "SIRA Technologies"}. All rights reserved.`;

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Top: 4 columns */}
        <div className="footer-top">
          {/* Brand column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <img
                src={logoUrl}
                alt={settings?.siteName || "SIRA"}
                className="footer-brand-logo"
                onError={(e) => {
                  if (
                    e.currentTarget.src !==
                    window.location.origin + "/assets/logo.png"
                  ) {
                    e.currentTarget.src = "/assets/logo.png";
                  } else {
                    e.currentTarget.style.display = "none";
                  }
                }}
              />
              <span className="footer-brand-text">
                <span className="footer-brand-strong">{brand.strong}</span>
                {brand.rest && ` ${brand.rest}`}
              </span>
            </Link>

            <p className="footer-desc">{description}</p>

            {socialLinks.length > 0 && (
              <div className="footer-socials">
                {socialLinks.map(({ key, url, Icon, label }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="footer-social"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Company column */}
          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/portfolio">Work</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources column */}
          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <ul className="footer-links">
              <li><Link to="/help">Help &amp; FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/start-project">Start a Project</Link></li>
            </ul>
          </div>

          {/* Contact column */}
          <div className="footer-col">
            <div className="footer-col-title">Get in touch</div>
            <ul className="footer-contact">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="footer-contact-item">
                    <span className="footer-contact-icon"><IconMail /></span>
                    <span>{email}</span>
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="footer-contact-item">
                    <span className="footer-contact-icon"><IconPhone /></span>
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              {whatsappUrl && (
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-item"
                  >
                    <span className="footer-contact-icon footer-contact-icon-wa">
                      <IconWhatsApp />
                    </span>
                    <span>WhatsApp</span>
                  </a>
                </li>
              )}
              {address && (
                <li className="footer-contact-item footer-contact-item-static">
                  <span className="footer-contact-icon"><IconMapPin /></span>
                  <span>{address}</span>
                </li>
              )}
              {!email && !phone && !whatsappUrl && !address && (
                <li className="footer-contact-empty">
                  Contact details coming soon.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-copy">{footerText}</div>
          <div className="footer-bottom-links">
            <Link to="/help">Privacy</Link>
            <span className="footer-dot" aria-hidden="true">·</span>
            <Link to="/help">Terms</Link>
            <span className="footer-dot" aria-hidden="true">·</span>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}