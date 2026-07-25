import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, ImagePlus, Loader2, Rocket, X,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const EMPTY_FORM = { title: "", description: "", order: 0, isActive: true };

export default function ManagePopularBuilds() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await client.get("/popular-builds/admin/all");
      setItems(data?.data?.items || []);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      order: item.order || 0,
      isActive: item.isActive,
    });
    setFile(null);
    setPreview(item.image?.url || "");
    setModalOpen(true);
  }

  function close() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview("");
  }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Select an image");
    if (f.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.description) {
      return toast.error("Title and description are required");
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("order", String(form.order || 0));
      fd.append("isActive", String(form.isActive));
      if (file) fd.append("image", file);

      const url = editing ? `/popular-builds/${editing._id}` : "/popular-builds";
      const method = editing ? "put" : "post";
      await client[method](url, fd);

      toast.success(editing ? "Updated" : "Created");
      close();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(item) {
    try {
      await client.patch(`/popular-builds/${item._id}/toggle`);
      toast.success(item.isActive ? "Deactivated" : "Activated");
      load();
    } catch { toast.error("Failed"); }
  }

  function askDelete(item) { setTarget(item); setConfirmOpen(true); }

  async function doDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await client.delete(`/popular-builds/${target._id}`);
      toast.success("Deleted");
      setConfirmOpen(false);
      setTarget(null);
      load();
    } catch { toast.error("Failed"); } finally { setDeleting(false); }
  }

  return (
    <div>
      <div className="list-toolbar">
        <div className="text-mute" style={{ fontSize: 13, flex: 1 }}>
          {items.length} total · Shown on Home & Services pages
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add Build
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2 size={30} style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : items.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon"><Rocket size={26} /></div>
            <div className="empty-title">No popular builds yet</div>
            <div className="empty-sub">Add productized offerings like Landing Pages, Brand Kits.</div>
            <button className="btn btn-primary" onClick={openNew}>
              <Plus size={16} /> Add Build
            </button>
          </div>
        </div>
      ) : (
        <div className="svc-grid">
          {items.map((item) => (
            <div key={item._id} className="svc-card">
              <div className="svc-media">
                {item.image?.url ? (
                  <img src={item.image.url} alt={item.title} />
                ) : (
                  <div className="svc-media-fallback"><Rocket size={26} /></div>
                )}
                {!item.isActive && <span className="svc-status svc-status-off">Inactive</span>}
              </div>
              <div className="svc-body">
                <div className="svc-title-row">
                  <h3 className="svc-title">{item.title}</h3>
                  <span className="svc-order">#{item.order || 0}</span>
                </div>
                <p className="svc-desc">{item.description}</p>
              </div>
              <div className="svc-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>
                  <Pencil size={14} /> Edit
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => toggle(item)}>
                  {item.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => askDelete(item)} style={{ color: "var(--danger)" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={close} title={editing ? "Edit Build" : "New Build"} size="md">
        <form onSubmit={submit} className="form-grid">
          <div className="field">
            <label className="label">Image (optional)</label>
            <div className="image-uploader">
              {preview ? (
                <>
                  <img src={preview} alt="preview" />
                  <button type="button" className="image-remove"
                    onClick={() => { setPreview(""); setFile(null); }}>
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label className="image-drop">
                  <ImagePlus size={26} />
                  <span>Click to upload</span>
                  <small>PNG, JPG up to 5MB</small>
                  <input type="file" accept="image/*" onChange={onFile} hidden />
                </label>
              )}
            </div>
          </div>

          <div className="field">
            <label className="label">Title *</label>
            <input className="control" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Landing Pages" />
          </div>

          <div className="field">
            <label className="label">Description *</label>
            <textarea className="control control-textarea" rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Fast, modern landing pages..." />
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">Order</label>
              <input type="number" className="control" value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })} />
            </div>
            <div className="field">
              <label className="label">Status</label>
              <label className="switch-row">
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <span className="switch" />
                <span>{form.isActive ? "Active" : "Inactive"}</span>
              </label>
            </div>
          </div>

          <div className="form-foot">
            <button type="button" className="btn btn-secondary" onClick={close} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <div className="spinner"></div> : editing ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        title="Delete this build?"
        message={`"${target?.title}" will be permanently removed.`}
        loading={deleting}
      />
    </div>
  );
}