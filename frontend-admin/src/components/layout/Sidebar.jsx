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
  Users,
  DollarSign,
  Star,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Content",
    items: [
      { to: "/services", label: "Services", icon: Wrench },
      { to: "/portfolio", label: "Portfolio", icon: Briefcase },
      { to: "/popular-builds", label: "Popular Builds", icon: Rocket },
      { to: "/process", label: "Process Steps", icon: ListChecks },
      { to: "/addons", label: "Add-ons", icon: PlusCircle },
      { to: "/pricing", label: "Pricing Plans", icon: DollarSign },
      { to: "/faqs", label: "FAQs", icon: HelpCircle },
      { to: "/heroes", label: "Page Heroes", icon: Image },
    ],
  },
  {
    label: "About Page",
    items: [
      { to: "/team", label: "Team Members", icon: Users },
      { to: "/reviews", label: "Reviews", icon: Star },
      { to: "/about", label: "About Content", icon: FileText },
    ],
  },
  {
    label: "Communication",
    items: [{ to: "/leads", label: "Leads", icon: Inbox }],
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
  const { siteSettings } = useAuth();

  const logoUrl = siteSettings?.logo?.url;
  const siteName = siteSettings?.siteName || "SIRA Technologies";
  const shortName = siteName.split(" ")[0].toUpperCase();

  return (
    <>
      <div className={`sidebar-backdrop ${open ? "open" : ""}`} onClick={onClose} />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Dynamic Brand */}
        <div className="sidebar-brand">
          <div className={`sidebar-brand-logo ${logoUrl ? "has-image" : ""}`}>
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} />
            ) : (
              <ShieldCheck size={20} />
            )}
          </div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">{shortName}</div>
            <div className="sidebar-brand-role">Admin Console</div>
          </div>
        </div>

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

        <div className="sidebar-foot">
          <div className="sidebar-foot-tag">
            <span className="live-dot" />
          </div>
        </div>
      </aside>
    </>
  );
}