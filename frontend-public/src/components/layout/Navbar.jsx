import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button.jsx";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="container nav-inner">
        <div className="nav-left">
          <Link to="/" className="brand display" style={{ textDecoration: "none" }}>
            SIRA
          </Link>

          <nav className="nav-links">
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/portfolio">Work</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button as={Link} to="/contact" variant="secondary">
            Contact
          </Button>
          <Button as={Link} to="/contact">
            Get a Quote
          </Button>
        </div>
      </div>
    </div>
  );
}