import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import client from "../../api/client";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

/**
 * A generic CRUD admin page for simple text-based content.
 *
 * Props:
 *   apiPath        - "/faqs"  (backend base path)
 *   singular       - "FAQ"    (display name singular)
 *   plural         - "FAQs"   (display name plural)
 *   fields         - array of field configs (see below)
 *   emptyIcon      - Lucide icon component for empty state
 *   emptyTitle     - Title when empty
 *   defaultValues  - initial form state
 *   getPreview     - fn(item) → string shown in list
 *   getTitle       - fn(item) → title shown in list
 *
 * Field config: { name, label, type, placeholder, required, hint, options, rows, max }
 */
export default function SimpleCrudPage({
  apiPath,
  singular,
  plural,
  fields,
  emptyIcon: EmptyIcon,
  emptyTitle,
  defaultValues,
  getTitle,
  getPreview,
  getMeta,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultValues);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await client.get(`${apiPath}/admin/all`);
      setItems(data?.data?.items || []);
    } catch (err) {
      toast.error(`Failed to load ${plural.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(defaultValues);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    // Build form values from item
    const values = { ...defaultValues };
    Object.keys(defaultValues).forEach((k) => {
      if (item[k] !== undefined) values[k] = item[k];
    });
    setForm(values);
    setModalOpen(true);
  }

  function close() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(defaultValues);
  }

  async function submit(e) {
    e.preventDefault();
    // Validate required
    for (const f of fields) {
      if (f.required && !form[f.name]?.toString().trim()) {
        toast.error(`${f.label} is required`);
        return;
      }
    }

    setSaving(true);
    try {
      if (editing) {
        await client.put(`${apiPath}/${editing._id}`, form);
        toast.success(`${singular} updated`);
      } else {
        await client.post(apiPath, form);
        toast.success(`${singular} created`);
      }
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
      await client.patch(`${apiPath}/${item._id}/toggle`);
      toast.success(item.isActive ? "Deactivated" : "Activated");
      load();
    } catch {
      toast.error("Toggle failed");
    }
  }

  function askDelete(item) {
    setTarget(item);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await client.delete(`${apiPath}/${target._id}`);
      toast.success(`${singular} deleted`);
      setConfirmOpen(false);
      setTarget(null);
      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="list-toolbar">
        <div className="text-mute" style={{ fontSize: 13, flex: 1 }}>
          {items.length} total · Manage {plural.toLowerCase()} shown on public site
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add {singular}
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2
            size={30}
            style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }}
          />
        </div>
      ) : items.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <EmptyIcon size={26} />
            </div>
            <div className="empty-title">{emptyTitle}</div>
            <div className="empty-sub">
              Add your first {singular.toLowerCase()} to display on the public site.
            </div>
            <button className="btn btn-primary" onClick={openNew}>
              <Plus size={16} /> Add {singular}
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {items.map((item, idx) => (
            <div
              key={item._id}
              className="crud-row"
              style={{ borderBottom: idx === items.length - 1 ? 0 : undefined }}
            >
              <div className="crud-row-order">
                <GripVertical size={14} />
                <span>#{item.order || 0}</span>
              </div>

              <div className="crud-row-body">
                <div className="crud-row-title">
                  {getTitle(item)}
                  {!item.isActive && (
                    <span className="badge badge-muted" style={{ marginLeft: 8 }}>
                      Inactive
                    </span>
                  )}
                  {getMeta && (
                    <span className="badge badge-info" style={{ marginLeft: 6 }}>
                      {getMeta(item)}
                    </span>
                  )}
                </div>
                {getPreview && (
                  <div className="crud-row-preview">{getPreview(item)}</div>
                )}
              </div>

              <div className="crud-row-actions">
                <button
                  className="btn-icon-sm"
                  onClick={() => openEdit(item)}
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="btn-icon-sm"
                  onClick={() => toggle(item)}
                  title={item.isActive ? "Deactivate" : "Activate"}
                >
                  {item.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  className="btn-icon-sm"
                  onClick={() => askDelete(item)}
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

      <Modal
        open={modalOpen}
        onClose={close}
        title={editing ? `Edit ${singular}` : `New ${singular}`}
        size="md"
      >
        <form onSubmit={submit} className="form-grid">
          {fields.map((f) => (
            <div key={f.name} className="field">
              <label className="label">
                {f.label} {f.required && "*"}
              </label>

              {f.type === "textarea" ? (
                <textarea
                  className="control control-textarea"
                  rows={f.rows || 4}
                  maxLength={f.max}
                  value={form[f.name] || ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                />
              ) : f.type === "select" ? (
                <select
                  className="control control-select"
                  value={form[f.name] || ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                >
                  {f.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : f.type === "number" ? (
                <input
                  type="number"
                  className="control"
                  value={form[f.name] ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, [f.name]: Number(e.target.value) || 0 })
                  }
                  placeholder={f.placeholder}
                />
              ) : f.type === "toggle" ? (
                <label className="switch-row">
                  <input
                    type="checkbox"
                    checked={!!form[f.name]}
                    onChange={(e) =>
                      setForm({ ...form, [f.name]: e.target.checked })
                    }
                  />
                  <span className="switch" />
                  <span>{form[f.name] ? "Active" : "Inactive"}</span>
                </label>
              ) : (
                <input
                  type={f.type || "text"}
                  className="control"
                  maxLength={f.max}
                  value={form[f.name] || ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                />
              )}

              {f.hint && <div className="hint">{f.hint}</div>}
              {f.max && form[f.name] && (
                <div className="hint">
                  {form[f.name].length}/{f.max}
                </div>
              )}
            </div>
          ))}

          <div className="form-foot">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={close}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <div className="spinner"></div>
              ) : editing ? (
                "Save changes"
              ) : (
                `Create ${singular.toLowerCase()}`
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        title={`Delete this ${singular.toLowerCase()}?`}
        message="This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}