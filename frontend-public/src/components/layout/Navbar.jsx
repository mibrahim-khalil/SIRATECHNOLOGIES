import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button.jsx";
import SearchPill from "../ui/SearchPill.jsx";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container header-row">
        {/* LEFT */}
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

        {/* MIDDLE */}
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
        </div>
      </div>
    </header>
  );
}