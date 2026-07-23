import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button.jsx";
import SearchPill from "../ui/SearchPill.jsx";

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="container header-row">
          {/* LEFT: Brand */}
          <Link to="/" className="brand" onClick={closeMenu}>
            <img
              src="/assets/logo.png"
              alt="SIRA Technologies"
              className="brand-logo"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="brand-text">
              <span className="brand-text-strong">SIRA</span> Technologies
            </span>
          </Link>

          {/* CENTER: Desktop nav only */}
          <nav className="header-links" aria-label="Primary navigation">
            <NavLink to="/services" className="header-link">
              Services
            </NavLink>
            <NavLink to="/portfolio" className="header-link">
              Work
            </NavLink>
            <NavLink to="/pricing" className="header-link">
              Pricing
            </NavLink>
            <NavLink to="/about" className="header-link">
              About
            </NavLink>
            <NavLink to="/help" className="header-link">
              Help
            </NavLink>
            <NavLink to="/start-project" className="header-link">
              Start a Project
            </NavLink>
          </nav>

          {/* SEARCH: always visible, but on mobile it sits in the top row center */}
          <div className="header-search">
            <SearchPill placeholder="Search services..." />
          </div>

          {/* RIGHT: Quote (desktop only) + Hamburger (mobile only) */}
          <div className="header-actions">
            <Button
              as={Link}
              to="/start-project"
              variant="primary"
              className="quote-btn"
              onClick={closeMenu}
            >
              Get a Quote
            </Button>

            <button
              type="button"
              className="menu-btn"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Backdrop */}
      <div
        className={`drawer-backdrop ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      {/* Drawer */}
      <aside
        id="mobile-menu"
        className={`drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="drawer-head">
          <div style={{ fontWeight: 800, color: "var(--ink)" }}>Menu</div>
          <button type="button" className="menu-btn" aria-label="Close menu" onClick={closeMenu}>
            <CloseIcon />
          </button>
        </div>

        <nav className="drawer-nav" aria-label="Mobile navigation">
          <NavLink to="/services" className="drawer-link" onClick={closeMenu}>
            Services
          </NavLink>
          <NavLink to="/portfolio" className="drawer-link" onClick={closeMenu}>
            Work
          </NavLink>
          <NavLink to="/pricing" className="drawer-link" onClick={closeMenu}>
            Pricing
          </NavLink>
          <NavLink to="/about" className="drawer-link" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/help" className="drawer-link" onClick={closeMenu}>
            Help
          </NavLink>
          <NavLink to="/start-project" className="drawer-link" onClick={closeMenu}>
            Start a Project
          </NavLink>
        </nav>

        {/* Mobile CTA: Get a Quote INSIDE dropdown */}
        <div className="drawer-cta">
          <Button
            as={Link}
            to="/start-project"
            variant="primary"
            onClick={closeMenu}
            style={{ width: "100%" }}
          >
            Get a Quote
          </Button>
        </div>
      </aside>
    </>
  );
}