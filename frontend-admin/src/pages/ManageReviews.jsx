import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Star,
  Check,
  X,
  ImagePlus,
  MessageSquareQuote,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const EMPTY_FORM = {
  name: "",
  role: "",
  company: "",
  email: "",
  rating: 5,
  message: "",
  projectType: "",
  isFeatured: false,
  order: 0,
  isActive: true,
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    load();
  }, [filter]);

  async function load() {
    setLoading(true);
    try {
      const query = filter !== "all" ? `?status=${filter}` : "";
      const { data } = await client.get(`/reviews/admin/all${query}`);
      setReviews(data?.data?.reviews || []);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setAvatarFile(null);
    setAvatarPreview("");
    setModalOpen(true);
  }

  function openEdit(r) {
    setEditing(r);
    setForm({
      name: r.name || "",
      role: r.role || "",
      company: r.company || "",
      email: r.email || "",
      rating: r.rating || 5,
      message: r.message || "",
      projectType: r.projectType || "",
      isFeatured: !!r.isFeatured,
      order: r.order || 0,
      isActive: r.isActive,
    });
    setAvatarFile(null);
    setAvatarPreview(r.avatar?.url || "");
    setModalOpen(true);
  }

  function close() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setAvatarFile(null);
    setAvatarPreview("");
  }

  function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Select an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Under 5MB please");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Name and message are required");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (avatarFile) fd.append("avatar", avatarFile);

      const url = editing ? `/reviews/${editing._id}` : "/reviews";
      const method = editing ? "put" : "post";

      await client[method](url, fd, { timeout: 60000 });

      toast.success(editing ? "Review updated" : "Review created");
      close();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function approve(r) {
    try {
      await client.patch(`/reviews/${r._id}/approve`);
      toast.success("Review approved & published");
      load();
    } catch {
      toast.error("Approval failed");
    }
  }

  async function reject(r) {
    try {
      await client.patch(`/reviews/${r._id}/reject`);
      toast.success("Review rejected");
      load();
    } catch {
      toast.error("Reject failed");
    }
  }

  async function toggle(r) {
    try {
      await client.patch(`/reviews/${r._id}/toggle`);
      toast.success(r.isActive ? "Deactivated" : "Activated");
      load();
    } catch {
      toast.error("Toggle failed");
    }
  }

  async function toggleFeatured(r) {
    try {
      await client.patch(`/reviews/${r._id}/featured`);
      toast.success(r.isFeatured ? "Unfeatured" : "Featured");
      load();
    } catch {
      toast.error("Failed");
    }
  }

  function askDelete(r) {
    setTarget(r);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await client.delete(`/reviews/${target._id}`);
      toast.success("Review deleted");
      setConfirmOpen(false);
      setTarget(null);
      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div>
      <div className="list-toolbar">
        <div className="chip-row">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`chip ${filter === f.value ? "chip-active" : ""}`}
              onClick={() => setFilter(f.value)}
              type="button"
            >
              {f.label}
              {f.value === "pending" && pendingCount > 0 && (
                <span className="chip-count">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add Review
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2 size={30} style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <MessageSquareQuote size={26} />
            </div>
            <div className="empty-title">
              {filter === "pending" ? "No pending reviews" : "No reviews yet"}
            </div>
            <div className="empty-sub">
              {filter === "pending"
                ? "New public submissions will appear here."
                : "Add your first testimonial."}
            </div>
          </div>
        </div>
      ) : (
        <div className="review-grid">
          {reviews.map((r) => (
            <div key={r._id} className={`review-card ${r.status === "pending" ? "review-card-pending" : ""}`}>
              {r.status === "pending" && (
                <div className="review-pending-tag">⏳ Awaiting approval</div>
              )}

              <div className="review-head">
                <div className="review-avatar">
                  {r.avatar?.url ? (
                    <img src={r.avatar.url} alt={r.name} />
                  ) : (
                    <div className="review-avatar-fallback">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="review-name">
                    {r.name}
                    {r.isFeatured && (
                      <Star size={13} style={{ color: "#f59e0b", marginLeft: 6, fill: "#f59e0b" }} />
                    )}
                  </div>
                  <div className="review-meta">
                    {r.role}{r.role && r.company && " · "}{r.company}
                  </div>
                  <div className="review-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        style={{
                          color: i < r.rating ? "#f59e0b" : "var(--hairline)",
                          fill: i < r.rating ? "#f59e0b" : "none",
                        }}
                      />
                    ))}
                    <span style={{ marginLeft: 4, fontSize: 12, color: "var(--mute)" }}>
                      {r.rating}/5
                    </span>
                  </div>
                </div>
              </div>

              <p className="review-message">"{r.message}"</p>

              <div className="review-tags">
                {r.projectType && <span className="svc-tag">{r.projectType}</span>}
                <span className={`svc-tag ${r.source === "public" ? "svc-tag-info" : ""}`}>
                  {r.source === "public" ? "Public submission" : "Admin added"}
                </span>
                {!r.isActive && <span className="badge badge-muted">Hidden</span>}
              </div>

              <div className="review-actions">
                {r.status === "pending" ? (
                  <>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => approve(r)}
                      style={{ flex: 1 }}
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => reject(r)}
                      style={{ color: "var(--danger)" }}
                    >
                      <X size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => toggleFeatured(r)}
                      title={r.isFeatured ? "Unfeature" : "Feature"}
                      style={{ color: r.isFeatured ? "#f59e0b" : undefined }}
                    >
                      <Star size={14} fill={r.isFeatured ? "#f59e0b" : "none"} />
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => toggle(r)}>
                      {r.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </>
                )}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => askDelete(r)}
                  style={{ color: "var(--danger)" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={close}
        title={editing ? "Edit Review" : "New Review"}
        size="md"
      >
        <form onSubmit={submit} className="form-grid">
          <div className="field">
            <label className="label">Avatar (optional)</label>
            <div className="image-uploader" style={{ aspectRatio: "1", maxWidth: 140 }}>
              {avatarPreview ? (
                <>
                  <img src={avatarPreview} alt="preview" />
                  <button
                    type="button"
                    className="image-remove"
                    onClick={() => {
                      setAvatarPreview("");
                      setAvatarFile(null);
                    }}
                    disabled={saving}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label className="image-drop">
                  <User size={22} />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleAvatar} hidden />
                </label>
              )}
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Name *</label>
              <input
                className="control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Smith"
              />
            </div>
            <div className="field">
              <label className="label">Rating *</label>
              <select
                className="control control-select"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{"★".repeat(n)}{"☆".repeat(5 - n)} ({n})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Role</label>
              <input
                className="control"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="CEO, Marketing Manager..."
              />
            </div>
            <div className="field">
              <label className="label">Company</label>
              <input
                className="control"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Email</label>
              <input
                type="email"
                className="control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
              />
            </div>
            <div className="field">
              <label className="label">Project type</label>
              <input
                className="control"
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                placeholder="Web Development, Mobile App..."
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Review message *</label>
            <textarea
              className="control control-textarea"
              rows={4}
              maxLength={1000}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Working with SIRA was fantastic..."
            />
            <div className="hint">{form.message.length}/1000</div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Display order</label>
              <input
                type="number"
                className="control"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="field">
              <label className="label">Options</label>
              <div style={{ display: "flex", gap: 16, alignItems: "center", height: 44 }}>
                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  />
                  <span className="switch" />
                  <span>Featured</span>
                </label>
                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span className="switch" />
                  <span>Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-foot">
            <button type="button" className="btn btn-secondary" onClick={close} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <div className="spinner"></div> : editing ? "Save changes" : "Create review"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        title="Delete this review?"
        message={`Review from "${target?.name}" will be permanently removed.`}
        loading={deleting}
      />
    </div>
  );
}