import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  Briefcase,
  Inbox,
  Settings as SettingsIcon,
  Globe,
  HelpCircle,
  PlusCircle,
  ListChecks,
  Rocket,
  Image,
  ShieldCheck,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/services", label: "Services", icon: Wrench },
      { to: "/portfolio", label: "Portfolio", icon: Briefcase },
      { to: "/popular-builds", label: "Popular Builds", icon: Rocket },
      { to: "/process", label: "Process Steps", icon: ListChecks },
      { to: "/addons", label: "Add-ons", icon: PlusCircle },
      { to: "/faqs", label: "FAQs", icon: HelpCircle },
      { to: "/heroes", label: "Page Heroes", icon: Image },
    ],
  },
  {
    label: "Communication",
    items: [
      { to: "/leads", label: "Leads", icon: Inbox },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/site-settings", label: "Site Settings", icon: Globe },
      { to: "/settings", label: "Account", icon: SettingsIcon },
    ],
  },
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
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: 10 }}>
              <div className="sidebar-nav-label">{group.label}</div>
              {group.items.map((item) => {
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
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
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