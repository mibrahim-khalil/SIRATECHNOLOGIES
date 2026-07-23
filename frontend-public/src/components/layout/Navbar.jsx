import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button.jsx";
import SearchPill from "../ui/SearchPill.jsx";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container header-row">
        {/* Brand */}
        <Link to="/" className="brand">
          <img
            src="/assets/logo.png"
            alt="SIRA Technologies"
            className="brand-logo"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="brand-text">SIRA Technologies</span>
        </Link>

        {/* Professional primary nav (core pages first) */}
        <nav className="header-links">
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
        </nav>

        {/* Right actions: utility links + search + CTA */}
        <div className="header-actions">
          {/* Use Link (NOT NavLink) so Help/Start don't both show active */}
          <div className="header-utility">
            <Link to="/contact" className="utility-link">
              Help
            </Link>
            <Link to="/contact" className="utility-link">
              Start a Project
            </Link>
          </div>

          <SearchPill placeholder="Search services" />

          <Button as={Link} to="/contact" variant="primary" className="quote-btn">
            Get a Quote
          </Button>
        </div>
      </div>
    </header>
  );
}