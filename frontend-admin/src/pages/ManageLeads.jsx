import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Trash2,
  Inbox,
  Loader2,
  Eye,
  Reply,
  Archive,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
];

const STATUS_BADGE = {
  new: "badge-info",
  read: "badge-muted",
  replied: "badge-success",
  archived: "badge-warning",
};

export default function ManageLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, pagination.page]);

  async function loadLeads() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page);
      params.append("limit", 20);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (search.trim()) params.append("search", search.trim());

      const { data } = await client.get(`/contact?${params.toString()}`);
      const payload = data?.data || {};
      setLeads(payload.leads || []);
      setPagination(payload.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(lead) {
    setSelected(lead);
    setDetailOpen(true);
    // if new, mark as read via server (auto)
    if (lead.status === "new") {
      try {
        await client.get(`/contact/${lead._id}`);
        setLeads((prev) =>
          prev.map((l) => (l._id === lead._id ? { ...l, status: "read" } : l))
        );
      } catch {
        /* ignore */
      }
    }
  }

  function closeDetail() {
    setDetailOpen(false);
    setSelected(null);
  }

  async function updateStatus(id, status) {
    try {
      await client.patch(`/contact/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      // update local
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status } : l))
      );
      if (selected?._id === id) setSelected({ ...selected, status });
    } catch {
      toast.error("Update failed");
    }
  }

  function askDelete(lead) {
    setConfirmTarget(lead);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await client.delete(`/contact/${confirmTarget._id}`);
      toast.success("Lead deleted");
      setConfirmOpen(false);
      setConfirmTarget(null);
      if (selected?._id === confirmTarget._id) closeDetail();
      loadLeads();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    loadLeads();
  }

  function initials(name = "?") {
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function formatDate(d) {
    const date = new Date(d);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(d) {
    const date = new Date(d);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="list-toolbar">
        <form onSubmit={handleSearchSubmit} className="search-box">
          <Search size={16} className="search-box-icon" />
          <input
            className="search-box-input"
            placeholder="Search name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="chip-row">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`chip ${statusFilter === opt.value ? "chip-active" : ""}`}
              onClick={() => {
                setStatusFilter(opt.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2
            size={30}
            style={{
              color: "var(--mute)",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : leads.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <Inbox size={26} />
            </div>
            <div className="empty-title">
              {search || statusFilter !== "all"
                ? "No matches found"
                : "No leads yet"}
            </div>
            <div className="empty-sub">
              When someone submits the contact form on your public site, it will
              appear here.
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="lead-table">
              <div className="lead-table-head">
                <div>Contact</div>
                <div>Subject</div>
                <div>Status</div>
                <div>Date</div>
                <div style={{ textAlign: "right" }}>Actions</div>
              </div>

              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className={`lead-table-row ${
                    lead.status === "new" ? "lead-row-unread" : ""
                  }`}
                  onClick={() => openDetail(lead)}
                >
                  <div className="lead-contact">
                    <div className="lead-avatar">{initials(lead.name)}</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="lead-name">{lead.name}</div>
                      <div className="lead-email">{lead.email}</div>
                    </div>
                  </div>

                  <div className="lead-subject">
                    {lead.subject || (
                      <span className="text-mute">No subject</span>
                    )}
                    <div className="lead-preview">
                      {lead.message?.slice(0, 60)}
                      {lead.message?.length > 60 ? "..." : ""}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`badge ${STATUS_BADGE[lead.status] || "badge-muted"}`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="lead-date-col">
                    <div>{formatDate(lead.createdAt)}</div>
                    <div className="lead-time">{formatTime(lead.createdAt)}</div>
                  </div>

                  <div
                    className="lead-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn-icon-sm"
                      title="View details"
                      onClick={() => openDetail(lead)}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="btn-icon-sm"
                      title="Delete"
                      onClick={() => askDelete(lead)}
                      style={{ color: "var(--danger)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary btn-sm"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages} · {pagination.total}{" "}
                total
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={closeDetail}
        title="Lead Details"
        size="md"
      >
        {selected && (
          <div className="lead-detail">
            <div className="lead-detail-head">
              <div className="lead-avatar user-avatar-lg">
                {initials(selected.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="lead-detail-name">{selected.name}</div>
                <div className="lead-detail-meta">
                  <a href={`mailto:${selected.email}`} className="lead-contact-link">
                    <Mail size={13} /> {selected.email}
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="lead-contact-link">
                      <Phone size={13} /> {selected.phone}
                    </a>
                  )}
                </div>
              </div>
              <span
                className={`badge ${STATUS_BADGE[selected.status] || "badge-muted"}`}
              >
                {selected.status}
              </span>
            </div>

            {(selected.subject || selected.service) && (
              <div className="lead-detail-section">
                {selected.subject && (
                  <div>
                    <div className="lead-detail-label">Subject</div>
                    <div className="lead-detail-value">{selected.subject}</div>
                  </div>
                )}
                {selected.service && (
                  <div>
                    <div className="lead-detail-label">Interested in</div>
                    <div className="lead-detail-value">{selected.service}</div>
                  </div>
                )}
              </div>
            )}

            <div className="lead-detail-section">
              <div className="lead-detail-label">Message</div>
              <div className="lead-detail-message">{selected.message}</div>
            </div>

            <div className="lead-detail-section" style={{ borderBottom: 0 }}>
              <div className="lead-detail-label">Received</div>
              <div className="lead-detail-value">
                {new Date(selected.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="lead-detail-actions">
              <a
                href={`mailto:${selected.email}?subject=Re: ${
                  selected.subject || "Your inquiry"
                }`}
                className="btn btn-primary"
              >
                <Reply size={15} /> Reply via Email
              </a>

              {selected.status !== "replied" && (
                <button
                  className="btn btn-secondary"
                  onClick={() => updateStatus(selected._id, "replied")}
                >
                  <CheckCircle2 size={15} /> Mark Replied
                </button>
              )}

              {selected.status !== "archived" && (
                <button
                  className="btn btn-secondary"
                  onClick={() => updateStatus(selected._id, "archived")}
                >
                  <Archive size={15} /> Archive
                </button>
              )}

              <button
                className="btn btn-secondary"
                onClick={() => askDelete(selected)}
                style={{ color: "var(--danger)", marginLeft: "auto" }}
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this lead?"
        message="This message will be permanently removed."
        loading={deleting}
      />
    </div>
  );
}