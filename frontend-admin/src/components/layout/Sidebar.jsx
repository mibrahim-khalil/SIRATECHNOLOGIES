import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  Briefcase,
  Inbox,
  Settings as SettingsIcon,
  Globe,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/services", label: "Services", icon: Wrench },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/leads", label: "Leads", icon: Inbox },
  { to: "/site-settings", label: "Site Settings", icon: Globe },
  { to: "/settings", label: "Account", icon: SettingsIcon },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">
            <ShieldCheck size={20} />
          </div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">SIRA</div>
            <div className="sidebar-brand-role">Admin Console</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Overview</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-foot">
          <div className="sidebar-foot-tag">
            v1.0 · Live
            <span className="live-dot" />
          </div>
        </div>
      </aside>
    </>
  );
}