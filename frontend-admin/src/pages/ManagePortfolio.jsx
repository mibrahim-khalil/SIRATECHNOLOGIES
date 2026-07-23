import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ImagePlus,
  Loader2,
  Briefcase,
  X,
  ExternalLink,
  Github,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const CATEGORIES = ["Web", "Mobile", "UI/UX", "Branding", "SEO", "Other"];

const EMPTY_FORM = {
  title: "",
  category: "Web",
  shortDescription: "",
  description: "",
  techStack: "",
  liveUrl: "",
  githubUrl: "",
  client: "",
  completedAt: "",
  isFeatured: false,
  isActive: true,
  order: 0,
};

export default function ManagePortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Cover
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  // Gallery (existing from DB + new files to add)
  const [existingGallery, setExistingGallery] = useState([]); // [{url, public_id}]
  const [removedGallery, setRemovedGallery] = useState([]); // public_ids to remove
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); // File[]
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]); // dataURLs

  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const { data } = await client.get("/portfolio/admin/all");
      setItems(data?.data?.portfolios || []);
    } catch (err) {
      toast.error("Failed to load portfolios");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setCoverFile(null);
    setCoverPreview("");
    setExistingGallery([]);
    setRemovedGallery([]);
    setNewGalleryFiles([]);
    setNewGalleryPreviews([]);
    setUploadProgress(0);
  }

  function openNew() {
    resetForm();
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      title: p.title || "",
      category: p.category || "Web",
      shortDescription: p.shortDescription || "",
      description: p.description || "",
      techStack: (p.techStack || []).join(", "),
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      client: p.client || "",
      completedAt: p.completedAt ? p.completedAt.slice(0, 10) : "",
      isFeatured: !!p.isFeatured,
      isActive: !!p.isActive,
      order: p.order || 0,
    });
    setCoverFile(null);
    setCoverPreview(p.coverImage?.url || "");
    setExistingGallery(p.gallery || []);
    setRemovedGallery([]);
    setNewGalleryFiles([]);
    setNewGalleryPreviews([]);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    resetForm();
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleGalleryAdd(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const valid = files.filter((f) => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > 5 * 1024 * 1024) return false;
      return true;
    });

    if (valid.length !== files.length) {
      toast.error("Some files skipped (non-image or > 5MB)");
    }

    const previews = valid.map((f) => URL.createObjectURL(f));
    setNewGalleryFiles((prev) => [...prev, ...valid]);
    setNewGalleryPreviews((prev) => [...prev, ...previews]);
    // reset input value so same file can be reselected later
    e.target.value = "";
  }

  function removeNewGallery(idx) {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  function toggleRemoveExisting(public_id) {
    setRemovedGallery((prev) =>
      prev.includes(public_id)
        ? prev.filter((id) => id !== public_id)
        : [...prev, public_id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.shortDescription || !form.description) {
      toast.error("Title, short description and description are required");
      return;
    }
    if (!editing && !coverFile) {
      toast.error("Cover image is required");
      return;
    }

    setSaving(true);
    setUploadProgress(0);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("shortDescription", form.shortDescription);
      fd.append("description", form.description);
      fd.append("liveUrl", form.liveUrl);
      fd.append("githubUrl", form.githubUrl);
      fd.append("client", form.client);
      if (form.completedAt) fd.append("completedAt", form.completedAt);
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isActive", String(form.isActive));
      fd.append("order", String(form.order || 0));

      const techArr = form.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      fd.append("techStack", JSON.stringify(techArr));

      if (coverFile) fd.append("coverImage", coverFile);
      newGalleryFiles.forEach((file) => fd.append("gallery", file));

      if (editing && removedGallery.length > 0) {
        fd.append("removeGalleryIds", JSON.stringify(removedGallery));
      }

      const url = editing ? `/portfolio/${editing._id}` : "/portfolio";
      const method = editing ? "put" : "post";

      await client[method](url, fd, {
        timeout: 300000, // 5 min for many images
        onUploadProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });

      toast.success(editing ? "Portfolio updated" : "Portfolio created");
      closeModal();
      await loadItems();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  async function handleToggleActive(p) {
    try {
      await client.patch(`/portfolio/${p._id}/toggle`);
      toast.success(p.isActive ? "Deactivated" : "Activated");
      loadItems();
    } catch {
      toast.error("Toggle failed");
    }
  }

  async function handleToggleFeatured(p) {
    try {
      await client.patch(`/portfolio/${p._id}/featured`);
      toast.success(p.isFeatured ? "Removed from featured" : "Marked featured");
      loadItems();
    } catch {
      toast.error("Toggle failed");
    }
  }

  function askDelete(p) {
    setConfirmTarget(p);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await client.delete(`/portfolio/${confirmTarget._id}`);
      toast.success("Portfolio deleted");
      setConfirmOpen(false);
      setConfirmTarget(null);
      loadItems();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = items.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="search-box">
          <Search size={16} className="search-box-icon" />
          <input
            className="search-box-input"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chip-row">
          <button
            className={`chip ${categoryFilter === "all" ? "chip-active" : ""}`}
            onClick={() => setCategoryFilter("all")}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${categoryFilter === c ? "chip-active" : ""}`}
              onClick={() => setCategoryFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2
            size={30}
            style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <Briefcase size={26} />
            </div>
            <div className="empty-title">
              {search || categoryFilter !== "all"
                ? "No matches"
                : "No projects yet"}
            </div>
            <div className="empty-sub">
              {search || categoryFilter !== "all"
                ? "Try clearing filters."
                : "Add your first project to showcase on the public site."}
            </div>
            {!search && categoryFilter === "all" && (
              <button className="btn btn-primary" onClick={openNew}>
                <Plus size={16} /> Add Project
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="pf-grid">
          {filtered.map((p) => (
            <div key={p._id} className="pf-card">
              <div className="pf-media">
                {p.coverImage?.url ? (
                  <img src={p.coverImage.url} alt={p.title} />
                ) : (
                  <div className="svc-media-fallback">
                    <Briefcase size={26} />
                  </div>
                )}
                <div className="pf-badges">
                  <span className="pf-cat">{p.category}</span>
                  {p.isFeatured && (
                    <span className="pf-featured">
                      <Star size={11} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>
                {!p.isActive && (
                  <span className="svc-status svc-status-off">Inactive</span>
                )}
              </div>

              <div className="svc-body">
                <div className="svc-title-row">
                  <h3 className="svc-title">{p.title}</h3>
                  {p.gallery?.length > 0 && (
                    <span className="svc-order">+{p.gallery.length}</span>
                  )}
                </div>
                <p className="svc-desc">{p.shortDescription}</p>

                {p.techStack?.length > 0 && (
                  <div className="svc-tags">
                    {p.techStack.slice(0, 3).map((t, i) => (
                      <span key={i} className="svc-tag">{t}</span>
                    ))}
                    {p.techStack.length > 3 && (
                      <span className="svc-tag">+{p.techStack.length - 3}</span>
                    )}
                  </div>
                )}

                {(p.liveUrl || p.githubUrl) && (
                  <div className="pf-links">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pf-link"
                      >
                        <ExternalLink size={12} /> Live
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pf-link"
                      >
                        <Github size={12} /> Code
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="svc-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => openEdit(p)}
                  title="Edit"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleToggleFeatured(p)}
                  title={p.isFeatured ? "Unfeature" : "Feature"}
                  style={{ color: p.isFeatured ? "#f59e0b" : "" }}
                >
                  <Star size={14} fill={p.isFeatured ? "currentColor" : "none"} />
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleToggleActive(p)}
                  title={p.isActive ? "Deactivate" : "Activate"}
                >
                  {p.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => askDelete(p)}
                  title="Delete"
                  style={{ color: "var(--danger)" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Edit Project" : "New Project"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="form-grid">
          {/* Cover */}
          <div className="field">
            <label className="label">Cover image *</label>
            <div className="image-uploader">
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="cover" />
                  <button
                    type="button"
                    className="image-remove"
                    onClick={() => {
                      setCoverPreview("");
                      setCoverFile(null);
                    }}
                    disabled={saving}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label className="image-drop">
                  <ImagePlus size={26} />
                  <span>Click to upload cover</span>
                  <small>PNG, JPG, WebP up to 5MB</small>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    hidden
                  />
                </label>
              )}
            </div>
            {coverPreview && (
              <label
                className="btn btn-secondary btn-sm"
                style={{ width: "fit-content", marginTop: 8 }}
              >
                <ImagePlus size={14} /> Replace cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  hidden
                />
              </label>
            )}
          </div>

          {/* Gallery */}
          <div className="field">
            <label className="label">Gallery (optional, multiple)</label>
            <div className="gallery-grid">
              {existingGallery.map((img) => {
                const marked = removedGallery.includes(img.public_id);
                return (
                  <div
                    key={img.public_id}
                    className={`gallery-item ${marked ? "gallery-item-removed" : ""}`}
                  >
                    <img src={img.url} alt="" />
                    <button
                      type="button"
                      className="image-remove"
                      onClick={() => toggleRemoveExisting(img.public_id)}
                      title={marked ? "Undo remove" : "Remove"}
                    >
                      <X size={12} />
                    </button>
                    {marked && <span className="gallery-item-tag">Removing</span>}
                  </div>
                );
              })}

              {newGalleryPreviews.map((src, i) => (
                <div key={i} className="gallery-item gallery-item-new">
                  <img src={src} alt="" />
                  <button
                    type="button"
                    className="image-remove"
                    onClick={() => removeNewGallery(i)}
                  >
                    <X size={12} />
                  </button>
                  <span className="gallery-item-tag gallery-tag-new">New</span>
                </div>
              ))}

              <label className="gallery-add">
                <ImagePlus size={20} />
                <span>Add images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryAdd}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Title *</label>
              <input
                className="control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. E-commerce Platform"
              />
            </div>
            <div className="field">
              <label className="label">Category *</label>
              <select
                className="control control-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="label">Short description *</label>
            <input
              className="control"
              maxLength={300}
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              placeholder="One-liner for cards"
            />
            <div className="hint">{form.shortDescription.length}/300</div>
          </div>

          <div className="field">
            <label className="label">Full description *</label>
            <textarea
              className="control control-textarea"
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed case study..."
            />
          </div>

          <div className="field">
            <label className="label">Tech stack (comma separated)</label>
            <input
              className="control"
              value={form.techStack}
              onChange={(e) => setForm({ ...form, techStack: e.target.value })}
              placeholder="React, Node.js, MongoDB, Stripe"
            />
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Live URL</label>
              <input
                className="control"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                placeholder="https://demo.example.com"
              />
            </div>
            <div className="field">
              <label className="label">GitHub URL</label>
              <input
                className="control"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Client name</label>
              <input
                className="control"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                placeholder="e.g. ABC Corp"
              />
            </div>
            <div className="field">
              <label className="label">Completed on</label>
              <input
                type="date"
                className="control"
                value={form.completedAt}
                onChange={(e) =>
                  setForm({ ...form, completedAt: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Display order</label>
              <input
                type="number"
                className="control"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="field">
              <label className="label">Options</label>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />
                  <span className="switch" />
                  <span>{form.isActive ? "Active" : "Inactive"}</span>
                </label>
                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                  />
                  <span className="switch" />
                  <span>Featured</span>
                </label>
              </div>
            </div>
          </div>

          {saving && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress">
              <div className="upload-progress-label">
                Uploading... {uploadProgress}%
              </div>
              <div className="upload-progress-track">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {saving && uploadProgress === 100 && (
            <div className="upload-progress-label" style={{ textAlign: "center" }}>
              ⏳ Processing images on server... please wait
            </div>
          )}

          <div className="form-foot">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <div className="spinner"></div>
                  <span style={{ marginLeft: 6 }}>Saving...</span>
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Create project"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this project?"
        message={`"${confirmTarget?.title}" will be permanently removed along with all images.`}
        loading={deleting}
      />
    </div>
  );
}