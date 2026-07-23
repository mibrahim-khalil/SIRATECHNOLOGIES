import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button.jsx";
import SearchPill from "../ui/SearchPill.jsx";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container header-row">
        {/* Left: brand */}
        <Link to="/" className="brand">
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

        {/* Middle: links exactly in your screenshot order */}
        <nav className="header-links" aria-label="Primary">
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

          {/* Use Link so these don't show active together */}
          <Link to="/contact" className="header-link">
            Help
          </Link>
          <Link to="/contact" className="header-link">
            Start a Project
          </Link>
        </nav>

        {/* Right: search + CTA */}
        <div className="header-actions">
          <SearchPill placeholder="Search services..." />
          <Button as={Link} to="/contact" variant="primary" className="quote-btn">
            Get a Quote
          </Button>
        </div>
      </div>
    </header>
  );
}