import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Wrench,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const EMPTY_FORM = {
  title: "",
  shortDescription: "",
  description: "",
  icon: "Code",
  features: "",
  order: 0,
  isActive: true,
};

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const { data } = await client.get("/services/admin/all");
      setServices(data?.data?.services || []);
    } catch (err) {
      console.error("Load services failed:", err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  }

  function openEdit(service) {
    setEditing(service);
    setForm({
      title: service.title || "",
      shortDescription: service.shortDescription || "",
      description: service.description || "",
      icon: service.icon || "Code",
      features: (service.features || []).join(", "),
      order: service.order || 0,
      isActive: service.isActive,
    });
    setImageFile(null);
    setImagePreview(service.image?.url || "");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return; // don't close while uploading
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
  }

  function handleImageChange(e) {
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
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.shortDescription || !form.description) {
      toast.error("Title, short description and description are required");
      return;
    }

    setSaving(true);
    setUploadProgress(0);

    // Debug log
    console.log("📤 Starting submit...");

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("shortDescription", form.shortDescription);
      fd.append("description", form.description);
      fd.append("icon", form.icon || "Code");
      fd.append("order", String(form.order || 0));
      fd.append("isActive", String(form.isActive));

      const featuresArr = form.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      fd.append("features", JSON.stringify(featuresArr));

      if (imageFile) {
        fd.append("image", imageFile);
        console.log("📎 Attached image:", imageFile.name, imageFile.size, "bytes");
      }

      const url = editing ? `/services/${editing._id}` : "/services";
      const method = editing ? "put" : "post";

      console.log(`📡 ${method.toUpperCase()} ${url}`);

      const response = await client[method](url, fd, {
        timeout: 60000, // 60 seconds for image upload
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
            console.log(`⬆️  Upload progress: ${percent}%`);
          }
        },
      });

      console.log("✅ Response:", response.data);

      toast.success(editing ? "Service updated" : "Service created");
      closeModal();
      await loadServices();
    } catch (err) {
      console.error("❌ Save failed:", err);
      console.error("Response:", err?.response);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Save failed — check console";
      toast.error(msg);
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  async function handleToggle(service) {
    try {
      await client.patch(`/services/${service._id}/toggle`);
      toast.success(
        service.isActive ? "Service deactivated" : "Service activated"
      );
      loadServices();
    } catch {
      toast.error("Toggle failed");
    }
  }

  function askDelete(service) {
    setConfirmTarget(service);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await client.delete(`/services/${confirmTarget._id}`);
      toast.success("Service deleted");
      setConfirmOpen(false);
      setConfirmTarget(null);
      loadServices();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header actions */}
      <div className="list-toolbar">
        <div className="search-box">
          <Search size={16} className="search-box-icon" />
          <input
            className="search-box-input"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Grid */}
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
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <Wrench size={26} />
            </div>
            <div className="empty-title">
              {search ? "No matches found" : "No services yet"}
            </div>
            <div className="empty-sub">
              {search
                ? "Try a different search term."
                : "Create your first service to display on the public website."}
            </div>
            {!search && (
              <button className="btn btn-primary" onClick={openNew}>
                <Plus size={16} /> Create Service
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="svc-grid">
          {filtered.map((s) => (
            <div key={s._id} className="svc-card">
              <div className="svc-media">
                {s.image?.url ? (
                  <img src={s.image.url} alt={s.title} />
                ) : (
                  <div className="svc-media-fallback">
                    <Wrench size={28} />
                  </div>
                )}
                {!s.isActive && (
                  <span className="svc-status svc-status-off">Inactive</span>
                )}
              </div>

              <div className="svc-body">
                <div className="svc-title-row">
                  <h3 className="svc-title">{s.title}</h3>
                  <span className="svc-order">#{s.order || 0}</span>
                </div>
                <p className="svc-desc">{s.shortDescription}</p>

                {s.features?.length > 0 && (
                  <div className="svc-tags">
                    {s.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="svc-tag">
                        {f}
                      </span>
                    ))}
                    {s.features.length > 3 && (
                      <span className="svc-tag">+{s.features.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="svc-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => openEdit(s)}
                  title="Edit"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleToggle(s)}
                  title={s.isActive ? "Deactivate" : "Activate"}
                >
                  {s.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => askDelete(s)}
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
        title={editing ? "Edit Service" : "New Service"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="form-grid">
          {/* Image upload */}
          <div className="field">
            <label className="label">Cover image</label>
            <div className="image-uploader">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview" />
                  <button
                    type="button"
                    className="image-remove"
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                    }}
                    aria-label="Remove"
                    disabled={saving}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label className="image-drop">
                  <ImagePlus size={26} />
                  <span>Click to upload</span>
                  <small>PNG, JPG up to 5MB</small>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              )}
            </div>
            {imagePreview && (
              <label
                className="btn btn-secondary btn-sm"
                style={{ width: "fit-content", marginTop: 8 }}
              >
                <ImagePlus size={14} /> Replace image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            )}
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Title *</label>
              <input
                className="control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Web Development"
              />
            </div>
            <div className="field">
              <label className="label">Icon name</label>
              <input
                className="control"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g. Code (lucide-react name)"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Short description *</label>
            <input
              className="control"
              maxLength={250}
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              placeholder="One-liner shown on cards"
            />
            <div className="hint">{form.shortDescription.length}/250</div>
          </div>

          <div className="field">
            <label className="label">Full description *</label>
            <textarea
              className="control control-textarea"
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Detailed explanation..."
            />
          </div>

          <div className="field">
            <label className="label">Features (comma separated)</label>
            <input
              className="control"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="React, Node.js, MongoDB"
            />
            <div className="hint">
              Bullet points shown under the service description.
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
              <div className="hint">Lower number appears first.</div>
            </div>
            <div className="field">
              <label className="label">Status</label>
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
            </div>
          </div>

          {/* Upload progress bar */}
          {saving && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress">
              <div className="upload-progress-label">
                Uploading image... {uploadProgress}%
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
              ⏳ Processing on server... please wait
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
                "Create service"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this service?"
        message={`"${confirmTarget?.title}" will be permanently removed along with its image.`}
        loading={deleting}
      />
    </div>
  );
}