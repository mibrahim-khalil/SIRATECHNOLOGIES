import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Briefcase,
  Inbox,
  Star,
  TrendingUp,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import client from "../api/client";

function StatCard({ icon: Icon, label, value, hint, tint, to }) {
  return (
    <Link to={to} className={`stat-card stat-tint-${tint}`}>
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={20} />
        </div>
        <ArrowUpRight size={16} className="stat-arrow" />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </Link>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    portfolios: 0,
    featured: 0,
    leadsTotal: 0,
    leadsUnread: 0,
    leadsReplied: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [servicesRes, portfoliosRes, leadsStatsRes, leadsListRes] =
        await Promise.all([
          client.get("/services/admin/all"),
          client.get("/portfolio/admin/all"),
          client.get("/contact/stats/overview"),
          client.get("/contact?limit=5"),
        ]);

      const services = servicesRes.data?.data?.services || [];
      const portfolios = portfoliosRes.data?.data?.portfolios || [];
      const leadStats = leadsStatsRes.data?.data || {};
      const leads = leadsListRes.data?.data?.leads || [];

      setStats({
        services: services.length,
        portfolios: portfolios.length,
        featured: portfolios.filter((p) => p.isFeatured).length,
        leadsTotal: leadStats.total || 0,
        leadsUnread: leadStats.unread || 0,
        leadsReplied: leadStats.replied || 0,
      });
      setRecentLeads(leads);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <Loader2
          size={32}
          className="spin"
          style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Stats grid */}
      <div className="stats-grid">
        <StatCard
          icon={Wrench}
          label="Services"
          value={stats.services}
          hint="Active offerings"
          tint="blue"
          to="/services"
        />
        <StatCard
          icon={Briefcase}
          label="Portfolio Projects"
          value={stats.portfolios}
          hint={`${stats.featured} featured`}
          tint="purple"
          to="/portfolio"
        />
        <StatCard
          icon={Inbox}
          label="Total Leads"
          value={stats.leadsTotal}
          hint={`${stats.leadsUnread} unread`}
          tint="amber"
          to="/leads"
        />
        <StatCard
          icon={TrendingUp}
          label="Replied"
          value={stats.leadsReplied}
          hint="Handled inquiries"
          tint="green"
          to="/leads"
        />
      </div>

      {/* Recent leads */}
      <div className="card mt-24">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Leads</div>
            <div className="card-sub">Latest inquiries from public site</div>
          </div>
          <Link to="/leads" className="btn btn-secondary btn-sm">
            View all
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <Inbox size={26} />
            </div>
            <div className="empty-title">No leads yet</div>
            <div className="empty-sub">
              When someone submits the contact form, it will appear here.
            </div>
          </div>
        ) : (
          <div className="lead-list">
            {recentLeads.map((lead) => (
              <div key={lead._id} className="lead-row">
                <div className="lead-avatar">
                  {lead.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="lead-meta">
                  <div className="lead-name">
                    {lead.name}
                    {lead.status === "new" && (
                      <span className="badge badge-info" style={{ marginLeft: 8 }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="lead-email">{lead.email}</div>
                </div>
                <div className="lead-msg">{lead.subject || lead.message?.slice(0, 60)}</div>
                <div className="lead-date">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="quick-actions mt-24">
        <div>
          <div className="card-title" style={{ marginBottom: 4 }}>
            Quick Actions
          </div>
          <div className="text-mute" style={{ fontSize: 13 }}>
            Jump straight into managing your content
          </div>
        </div>
        <div className="flex gap-12" style={{ flexWrap: "wrap" }}>
          <Link to="/services" className="btn btn-primary">
            <Wrench size={16} /> Add Service
          </Link>
          <Link to="/portfolio" className="btn btn-secondary">
            <Briefcase size={16} /> Add Project
          </Link>
          <Link to="/leads" className="btn btn-secondary">
            <Inbox size={16} /> View Leads
          </Link>
        </div>
      </div>
    </div>
  );
}