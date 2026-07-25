import { useEffect, useState } from "react";
import { Save, ImagePlus, X, Loader2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";

const PAGES = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
  { id: "help", label: "Help" },
  { id: "start-project", label: "Start Project" },
];

const EMPTY = {
  title: "",
  subtitle: "",
  primaryCtaLabel: "",
  primaryCtaTo: "",
  secondaryCtaLabel: "",
  secondaryCtaTo: "",
};

export default function ManageHeroes() {
  const [activePage, setActivePage] = useState("home");
  const [hero, setHero] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHero(activePage);
  }, [activePage]);

  async function loadHero(page) {
    setLoading(true);
    try {
      const { data } = await client.get(`/heroes/${page}`);
      const h = data?.data?.hero;
      setHero(h);
      setForm({
        title: h?.title || "",
        subtitle: h?.subtitle || "",
        primaryCtaLabel: h?.primaryCtaLabel || "",
        primaryCtaTo: h?.primaryCtaTo || "",
        secondaryCtaLabel: h?.secondaryCtaLabel || "",
        secondaryCtaTo: h?.secondaryCtaTo || "",
      });
      setPreview(h?.image?.url || "");
      setFile(null);
    } catch {
      toast.error("Failed to load hero");
    } finally {
      setLoading(false);
    }
  }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Select an image");
    if (f.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function removeImage() {
    if (!hero?.image?.public_id) {
      setPreview("");
      setFile(null);
      return;
    }
    try {
      const { data } = await client.delete(`/heroes/${activePage}/image`);
      setHero(data?.data?.hero);
      setPreview("");
      setFile(null);
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove");
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title) return toast.error("Title is required");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("image", file);

      const { data } = await client.put(`/heroes/${activePage}`, fd);
      setHero(data?.data?.hero);
      setFile(null);
      toast.success("Hero saved!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Page selector */}
      <div className="ss-tabs" style={{ marginBottom: 20 }}>
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`ss-tab ${activePage === p.id ? "ss-tab-active" : ""}`}
            onClick={() => setActivePage(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2 size={30} style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  {PAGES.find((p) => p.id === activePage)?.label} · Hero Section
                </div>
                <div className="card-sub">
                  Top banner shown on the {activePage} page
                </div>
              </div>
            </div>

            <div className="form-grid">
              {/* Image */}
              <div className="field">
                <label className="label">Background image</label>
                <div className="ss-image-box">
                  {preview ? (
                    <>
                      <img src={preview} alt="hero" style={{ height: 200 }} />
                      <div className="ss-image-actions">
                        <label className="btn btn-secondary btn-sm">
                          <ImagePlus size={13} /> Replace
                          <input type="file" accept="image/*" onChange={onFile} hidden />
                        </label>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ color: "var(--danger)" }}
                          onClick={removeImage}
                        >
                          <X size={13} /> Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="image-drop" style={{ minHeight: 160 }}>
                      <ImageIcon size={22} />
                      <span>Upload hero background</span>
                      <small>Recommended: 1920x800 landscape</small>
                      <input type="file" accept="image/*" onChange={onFile} hidden />
                    </label>
                  )}
                </div>
              </div>

              <div className="field">
                <label className="label">Title *</label>
                <input className="control" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Build. Scale. Automate." />
              </div>

              <div className="field">
                <label className="label">Subtitle</label>
                <textarea className="control control-textarea" rows={2}
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="SIRA Technologies helps businesses design and build..." />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="label">Primary button label</label>
                  <input className="control" value={form.primaryCtaLabel}
                    onChange={(e) => setForm({ ...form, primaryCtaLabel: e.target.value })}
                    placeholder="Start a Project" />
                </div>
                <div className="field">
                  <label className="label">Primary button link</label>
                  <input className="control" value={form.primaryCtaTo}
                    onChange={(e) => setForm({ ...form, primaryCtaTo: e.target.value })}
                    placeholder="/start-project" />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="label">Secondary button label</label>
                  <input className="control" value={form.secondaryCtaLabel}
                    onChange={(e) => setForm({ ...form, secondaryCtaLabel: e.target.value })}
                    placeholder="See Work" />
                </div>
                <div className="field">
                  <label className="label">Secondary button link</label>
                  <input className="control" value={form.secondaryCtaTo}
                    onChange={(e) => setForm({ ...form, secondaryCtaTo: e.target.value })}
                    placeholder="/portfolio" />
                </div>
              </div>
            </div>
          </div>

          <div className="ss-save-bar">
            <div className="text-mute" style={{ fontSize: 13 }}>
              Editing hero for <strong>{PAGES.find((p) => p.id === activePage)?.label}</strong> page
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <><div className="spinner"></div><span style={{ marginLeft: 6 }}>Saving...</span></>
              ) : (
                <><Save size={15} /> Save hero</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}