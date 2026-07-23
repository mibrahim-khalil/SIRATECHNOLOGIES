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
          <span className="brand-text">SIRA Technologies</span>
        </Link>

        {/* Center: links in your required order */}
        <nav className="header-links">
          {/* 1 */}
          <NavLink to="/contact" className="header-link">
            Help
          </NavLink>

          {/* 2 */}
          <NavLink to="/contact" className="header-link">
            Start a Project
          </NavLink>

          {/* 3 */}
          <NavLink to="/pricing" className="header-link">
            Pricing
          </NavLink>

          {/* 4 */}
          <NavLink to="/services" className="header-link">
            Services
          </NavLink>

          {/* 5 */}
          <NavLink to="/portfolio" className="header-link">
            Work
          </NavLink>

          {/* 6 */}
          <NavLink to="/about" className="header-link">
            About
          </NavLink>
        </nav>

        {/* Right: search + CTA */}
        <div className="header-actions">
          <SearchPill placeholder="Search services" />
          <Button as={Link} to="/contact" variant="primary" className="quote-btn">
            Get a Quote
          </Button>
        </div>
      </div>
    </header>
  );
}