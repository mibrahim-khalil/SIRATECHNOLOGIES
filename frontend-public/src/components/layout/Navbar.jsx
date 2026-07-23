import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button.jsx";
import SearchPill from "../ui/SearchPill.jsx";

function DotsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="18" cy="12" r="1.8" fill="currentColor" />
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
          {/* LEFT */}
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

          {/* MIDDLE (desktop only) */}
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

          {/* RIGHT */}
          <div className="header-actions">
            <SearchPill placeholder="Search services..." />

            <Button as={Link} to="/start-project" variant="primary" className="quote-btn">
              Get a Quote
            </Button>

            {/* Mobile menu button (3 dots) */}
            <button
              type="button"
              className="menu-btn"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <DotsIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`drawer-backdrop ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <aside
        id="mobile-menu"
        className={`drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="drawer-head">
          <div style={{ fontWeight: 800, color: "var(--ink)" }}>Menu</div>
          <button type="button" className="menu-btn" aria-label="Close menu" onClick={closeMenu}>
            <DotsIcon />
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

        <div className="drawer-cta">
          <Button as={Link} to="/start-project" variant="primary" onClick={closeMenu} style={{ width: "100%" }}>
            Start a Project
          </Button>
        </div>
      </aside>
    </>
  );
}