import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  DollarSign,
  Check,
  X,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const EMPTY_FORM = {
  name: "",
  tagline: "",
  description: "",
  currency: "USD",
  monthlyPrice: 0,
  yearlyPrice: 0,
  isCustomPricing: false,
  customPriceLabel: "Custom",
  features: [{ text: "", included: true }],
  ctaText: "Get Started",
  ctaLink: "/contact",
  badge: "",
  isFeatured: false,
  accentColor: "#123A5A",
  order: 0,
  isActive: true,
};

const CURRENCIES = ["USD", "PKR", "EUR", "GBP", "AED"];
const CURRENCY_SYMBOLS = { USD: "$", PKR: "₨", EUR: "€", GBP: "£", AED: "د.إ" };

export default function ManagePricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await client.get("/pricing/admin/all");
      setPlans(data?.data?.plans || []);
    } catch {
      toast.error("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name || "",
      tagline: p.tagline || "",
      description: p.description || "",
      currency: p.currency || "USD",
      monthlyPrice: p.monthlyPrice || 0,
      yearlyPrice: p.yearlyPrice || 0,
      isCustomPricing: !!p.isCustomPricing,
      customPriceLabel: p.customPriceLabel || "Custom",
      features: p.features?.length ? p.features : [{ text: "", included: true }],
      ctaText: p.ctaText || "Get Started",
      ctaLink: p.ctaLink || "/contact",
      badge: p.badge || "",
      isFeatured: !!p.isFeatured,
      accentColor: p.accentColor || "#123A5A",
      order: p.order || 0,
      isActive: p.isActive,
    });
    setModalOpen(true);
  }

  function close() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function addFeature() {
    setForm({ ...form, features: [...form.features, { text: "", included: true }] });
  }

  function updateFeature(idx, patch) {
    const next = [...form.features];
    next[idx] = { ...next[idx], ...patch };
    setForm({ ...form, features: next });
  }

  function removeFeature(idx) {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name) {
      toast.error("Plan name is required");
      return;
    }

    const cleanFeatures = form.features.filter((f) => f.text.trim());

    setSaving(true);
    try {
      const payload = { ...form, features: cleanFeatures };

      if (editing) {
        await client.put(`/pricing/${editing._id}`, payload);
        toast.success("Plan updated");
      } else {
        await client.post("/pricing", payload);
        toast.success("Plan created");
      }
      close();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(p) {
    try {
      await client.patch(`/pricing/${p._id}/toggle`);
      toast.success(p.isActive ? "Deactivated" : "Activated");
      load();
    } catch {
      toast.error("Toggle failed");
    }
  }

  function askDelete(p) {
    setTarget(p);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await client.delete(`/pricing/${target._id}`);
      toast.success("Plan deleted");
      setConfirmOpen(false);
      setTarget(null);
      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const symbol = CURRENCY_SYMBOLS[form.currency] || "$";

  return (
    <div>
      <div className="list-toolbar">
        <div className="text-mute" style={{ fontSize: 13, flex: 1 }}>
          {plans.length} plans · Displayed on the Pricing page
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2 size={30} style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : plans.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <DollarSign size={26} />
            </div>
            <div className="empty-title">No pricing plans yet</div>
            <div className="empty-sub">Create your first pricing tier.</div>
            <button className="btn btn-primary" onClick={openNew}>
              <Plus size={16} /> Add Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="pricing-grid">
          {plans.map((p) => {
            const sym = CURRENCY_SYMBOLS[p.currency] || "$";
            return (
              <div
                key={p._id}
                className={`pricing-card ${p.isFeatured ? "pricing-card-featured" : ""}`}
                style={p.isFeatured ? { borderColor: p.accentColor } : {}}
              >
                {p.badge && (
                  <div className="pricing-badge" style={{ background: p.accentColor }}>
                    {p.badge}
                  </div>
                )}

                <div className="pricing-head">
                  <h3 className="pricing-name">{p.name}</h3>
                  {p.tagline && <p className="pricing-tagline">{p.tagline}</p>}
                </div>

                <div className="pricing-price">
                  {p.isCustomPricing ? (
                    <span className="pricing-price-custom">{p.customPriceLabel}</span>
                  ) : (
                    <>
                      <span className="pricing-price-value">
                        {sym}{p.monthlyPrice}
                      </span>
                      <span className="pricing-price-cycle">/mo</span>
                    </>
                  )}
                </div>

                {p.features?.length > 0 && (
                  <ul className="pricing-features">
                    {p.features.slice(0, 5).map((f, i) => (
                      <li key={i} className={f.included ? "" : "pricing-feature-excluded"}>
                        {f.included ? (
                          <Check size={14} style={{ color: "var(--success)" }} />
                        ) : (
                          <X size={14} style={{ color: "var(--mute)" }} />
                        )}
                        <span>{f.text}</span>
                      </li>
                    ))}
                    {p.features.length > 5 && (
                      <li style={{ color: "var(--mute)", fontSize: 12 }}>
                        +{p.features.length - 5} more...
                      </li>
                    )}
                  </ul>
                )}

                <div className="pricing-meta">
                  <span className="svc-order">#{p.order || 0}</span>
                  {!p.isActive && <span className="badge badge-muted">Inactive</span>}
                  {p.isFeatured && (
                    <span className="badge badge-warning">
                      <Star size={11} /> Featured
                    </span>
                  )}
                </div>

                <div className="svc-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => toggle(p)}>
                    {p.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => askDelete(p)}
                    style={{ color: "var(--danger)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={close}
        title={editing ? "Edit Pricing Plan" : "New Pricing Plan"}
        size="lg"
      >
        <form onSubmit={submit} className="form-grid">
          <div className="grid-2">
            <div className="field">
              <label className="label">Plan name *</label>
              <input
                className="control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Starter, Pro, Enterprise..."
              />
            </div>
            <div className="field">
              <label className="label">Tagline</label>
              <input
                className="control"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Perfect for small teams"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <textarea
              className="control control-textarea"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description..."
            />
          </div>

          {/* Pricing section */}
          <div className="card" style={{ padding: 16, background: "var(--soft-cloud)" }}>
            <div className="label" style={{ marginBottom: 12 }}>💰 Pricing</div>

            <div className="field" style={{ marginBottom: 10 }}>
              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={form.isCustomPricing}
                  onChange={(e) => setForm({ ...form, isCustomPricing: e.target.checked })}
                />
                <span className="switch" />
                <span>Use custom pricing (e.g. "Contact us")</span>
              </label>
            </div>

            {form.isCustomPricing ? (
              <div className="field">
                <label className="label">Custom label</label>
                <input
                  className="control"
                  value={form.customPriceLabel}
                  onChange={(e) => setForm({ ...form, customPriceLabel: e.target.value })}
                  placeholder="Custom, Contact Us, etc."
                />
              </div>
            ) : (
              <div className="grid-2">
                <div className="field">
                  <label className="label">Currency</label>
                  <select
                    className="control control-select"
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{CURRENCY_SYMBOLS[c]} {c}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Monthly ({symbol})</label>
                  <input
                    type="number"
                    className="control"
                    value={form.monthlyPrice}
                    onChange={(e) => setForm({ ...form, monthlyPrice: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="field">
                  <label className="label">Yearly ({symbol}) — optional</label>
                  <input
                    type="number"
                    className="control"
                    value={form.yearlyPrice}
                    onChange={(e) => setForm({ ...form, yearlyPrice: Number(e.target.value) || 0 })}
                  />
                  <div className="hint">Leave 0 to hide yearly toggle</div>
                </div>
              </div>
            )}
          </div>

          {/* Features editor */}
          <div className="field">
            <label className="label">Features</label>
            <div className="feature-list">
              {form.features.map((f, idx) => (
                <div key={idx} className="feature-row">
                  <label className="switch-row" style={{ height: 44 }}>
                    <input
                      type="checkbox"
                      checked={f.included}
                      onChange={(e) => updateFeature(idx, { included: e.target.checked })}
                    />
                    <span className="switch" />
                  </label>
                  <input
                    className="control"
                    value={f.text}
                    onChange={(e) => updateFeature(idx, { text: e.target.value })}
                    placeholder="Feature description..."
                  />
                  <button
                    type="button"
                    className="btn-icon-sm"
                    onClick={() => removeFeature(idx)}
                    style={{ color: "var(--danger)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={addFeature}
              style={{ marginTop: 8, width: "fit-content" }}
            >
              <Plus size={14} /> Add feature
            </button>
            <div className="hint">Toggle checkbox: ✓ included / ✗ excluded</div>
          </div>

          {/* CTA */}
          <div className="grid-2">
            <div className="field">
              <label className="label">CTA button text</label>
              <input
                className="control"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                placeholder="Get Started"
              />
            </div>
            <div className="field">
              <label className="label">CTA link</label>
              <input
                className="control"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                placeholder="/contact"
              />
            </div>
          </div>

          {/* Display */}
          <div className="grid-2">
            <div className="field">
              <label className="label">Badge (optional)</label>
              <input
                className="control"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="MOST POPULAR, BEST VALUE..."
              />
            </div>
            <div className="field">
              <label className="label">Accent color</label>
              <input
                type="color"
                className="control"
                style={{ padding: 4, height: 44 }}
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
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
              {saving ? <div className="spinner"></div> : editing ? "Save changes" : "Create plan"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        title="Delete this pricing plan?"
        message={`"${target?.name}" will be permanently removed.`}
        loading={deleting}
      />
    </div>
  );
}