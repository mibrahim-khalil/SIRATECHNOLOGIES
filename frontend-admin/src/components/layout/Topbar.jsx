import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const PAGE_TITLES = {
  "/": { title: "Dashboard", sub: "Overview of your business at a glance" },
  "/services": { title: "Services", sub: "Manage services shown on public site" },
  "/portfolio": { title: "Portfolio", sub: "Manage projects & case studies" },
  "/popular-builds": { title: "Popular Builds", sub: "Productized offerings shown on Home & Services" },
  "/process": { title: "Process Steps", sub: "'How we work' section" },
  "/addons": { title: "Add-ons", sub: "Pricing add-ons" },
  "/faqs": { title: "FAQs", sub: "Frequently asked questions" },
  "/heroes": { title: "Page Heroes", sub: "Top banner for each public page" },
  "/leads": { title: "Leads", sub: "Contact form submissions" },
  "/site-settings": { title: "Site Settings", sub: "Global content, contact info, and branding" },
  "/settings": { title: "Account Settings", sub: "Profile & password" },
};

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const page = PAGE_TITLES[location.pathname] || {
    title: "Admin",
    sub: "",
  };

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const initials = (user?.name || "A")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="topbar-title">{page.title}</h1>
          {page.sub && <p className="topbar-sub">{page.sub}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="user-menu" ref={menuRef}>
          <button
            className="user-btn"
            onClick={() => setMenuOpen((s) => !s)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <ChevronDown size={16} className="user-caret" />
          </button>

          {menuOpen && (
            <div className="user-panel" role="menu">
              <div className="user-panel-head">
                <div className="user-avatar user-avatar-lg">{initials}</div>
                <div>
                  <div className="user-panel-name">{user?.name}</div>
                  <div className="user-panel-email">{user?.email}</div>
                </div>
              </div>

              <button
                className="user-panel-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
              >
                <UserIcon size={16} />
                My Profile
              </button>

              <button
                className="user-panel-item user-panel-item-danger"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}