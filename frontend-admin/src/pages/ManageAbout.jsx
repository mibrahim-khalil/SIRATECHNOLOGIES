import { useEffect, useState } from "react";
import {
  FileText,
  Target,
  BarChart3,
  Heart,
  Users,
  Megaphone,
  Loader2,
  Save,
  ImagePlus,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";

const TABS = [
  { id: "hero", label: "Hero", icon: FileText },
  { id: "story", label: "Story & Mission", icon: Target },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "values", label: "Core Values", icon: Heart },
  { id: "team", label: "Team Section", icon: Users },
  { id: "cta", label: "CTA", icon: Megaphone },
];

export default function ManageAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [about, setAbout] = useState(null);

  const [form, setForm] = useState({
    heading: "",
    subheading: "",
    storyTitle: "",
    storyContent: "",
    mission: "",
    vision: "",
    stats: [],
    values: [],
    teamSectionTitle: "",
    teamSectionSubtitle: "",
    ctaTitle: "",
    ctaSubtitle: "",
    ctaButtonText: "",
    ctaButtonLink: "",
  });

  const [storyFile, setStoryFile] = useState(null);
  const [storyPreview, setStoryPreview] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await client.get("/about");
      const a = data?.data?.about || {};
      setAbout(a);
      setForm({
        heading: a.heading || "",
        subheading: a.subheading || "",
        storyTitle: a.storyTitle || "",
        storyContent: a.storyContent || "",
        mission: a.mission || "",
        vision: a.vision || "",
        stats: a.stats || [],
        values: a.values || [],
        teamSectionTitle: a.teamSectionTitle || "",
        teamSectionSubtitle: a.teamSectionSubtitle || "",
        ctaTitle: a.ctaTitle || "",
        ctaSubtitle: a.ctaSubtitle || "",
        ctaButtonText: a.ctaButtonText || "",
        ctaButtonLink: a.ctaButtonLink || "",
      });
      setStoryPreview(a.storyImage?.url || "");
    } catch {
      toast.error("Failed to load about content");
    } finally {
      setLoading(false);
    }
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Select an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Under 5MB please");
    setStoryFile(file);
    setStoryPreview(URL.createObjectURL(file));
  }

  async function removeStoryImage() {
    try {
      const { data } = await client.delete("/about/image/story");
      setAbout(data?.data?.about);
      setStoryPreview("");
      setStoryFile(null);
      toast.success("Story image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  }

  // Stats CRUD
  function addStat() {
    setForm({ ...form, stats: [...form.stats, { label: "", value: "", icon: "TrendingUp" }] });
  }
  function updateStat(i, patch) {
    const next = [...form.stats];
    next[i] = { ...next[i], ...patch };
    setForm({ ...form, stats: next });
  }
  function removeStat(i) {
    setForm({ ...form, stats: form.stats.filter((_, idx) => idx !== i) });
  }

  // Values CRUD
  function addValue() {
    setForm({ ...form, values: [...form.values, { title: "", description: "", icon: "Heart" }] });
  }
  function updateValue(i, patch) {
    const next = [...form.values];
    next[i] = { ...next[i], ...patch };
    setForm({ ...form, values: next });
  }
  function removeValue(i) {
    setForm({ ...form, values: form.values.filter((_, idx) => idx !== i) });
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (Array.isArray(form[k])) {
          fd.append(k, JSON.stringify(form[k]));
        } else {
          fd.append(k, form[k]);
        }
      });
      if (storyFile) fd.append("storyImage", storyFile);

      const { data } = await client.put("/about", fd);
      setAbout(data?.data?.about);
      setStoryFile(null);
      toast.success("About content saved!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <Loader2 size={30} style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className="settings-wrap">
      <div className="ss-tabs">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              className={`ss-tab ${activeTab === t.id ? "ss-tab-active" : ""}`}
              onClick={() => setActiveTab(t.id)}
              type="button"
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={submit}>
        {/* HERO */}
        {activeTab === "hero" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Hero Section</div>
                <div className="card-sub">Top banner on the About page</div>
              </div>
            </div>
            <div className="form-grid">
              <div className="field">
                <label className="label">Heading</label>
                <input
                  className="control"
                  value={form.heading}
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  placeholder="About SIRA Technologies"
                />
              </div>
              <div className="field">
                <label className="label">Subheading</label>
                <input
                  className="control"
                  value={form.subheading}
                  onChange={(e) => setForm({ ...form, subheading: e.target.value })}
                  placeholder="Building the future, one line of code at a time"
                />
              </div>
            </div>
          </div>
        )}

        {/* STORY & MISSION */}
        {activeTab === "story" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Story, Mission & Vision</div>
                <div className="card-sub">Company narrative</div>
              </div>
            </div>
            <div className="form-grid">
              <div className="field">
                <label className="label">Story title</label>
                <input
                  className="control"
                  value={form.storyTitle}
                  onChange={(e) => setForm({ ...form, storyTitle: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="label">Story content</label>
                <textarea
                  className="control control-textarea"
                  rows={6}
                  value={form.storyContent}
                  onChange={(e) => setForm({ ...form, storyContent: e.target.value })}
                  placeholder="Tell the story of your company..."
                />
              </div>
              <div className="field">
                <label className="label">Story image</label>
                <div className="ss-image-box">
                  {storyPreview ? (
                    <>
                      <img src={storyPreview} alt="story" style={{ height: 200 }} />
                      <div className="ss-image-actions">
                        <label className="btn btn-secondary btn-sm">
                          <ImagePlus size={13} /> Replace
                          <input type="file" accept="image/*" onChange={handleImage} hidden />
                        </label>
                        {about?.storyImage?.url && !storyFile && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: "var(--danger)" }}
                            onClick={removeStoryImage}
                          >
                            <X size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <label className="image-drop">
                      <ImagePlus size={22} />
                      <span>Upload story image</span>
                      <input type="file" accept="image/*" onChange={handleImage} hidden />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="label">Mission</label>
                  <textarea
                    className="control control-textarea"
                    rows={4}
                    value={form.mission}
                    onChange={(e) => setForm({ ...form, mission: e.target.value })}
                    placeholder="Our mission is..."
                  />
                </div>
                <div className="field">
                  <label className="label">Vision</label>
                  <textarea
                    className="control control-textarea"
                    rows={4}
                    value={form.vision}
                    onChange={(e) => setForm({ ...form, vision: e.target.value })}
                    placeholder="Our vision is..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        {activeTab === "stats" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Stats / Numbers</div>
                <div className="card-sub">Impressive numbers shown on About page</div>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addStat}>
                <Plus size={14} /> Add stat
              </button>
            </div>

            {form.stats.length === 0 ? (
              <div className="empty">
                <div className="empty-sub">No stats added yet. Click "Add stat" to get started.</div>
              </div>
            ) : (
              <div className="form-grid">
                {form.stats.map((s, i) => (
                  <div key={i} className="dynamic-row">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
                      <div className="field">
                        <label className="label">Value</label>
                        <input
                          className="control"
                          value={s.value}
                          onChange={(e) => updateStat(i, { value: e.target.value })}
                          placeholder="50+"
                        />
                      </div>
                      <div className="field">
                        <label className="label">Label</label>
                        <input
                          className="control"
                          value={s.label}
                          onChange={(e) => updateStat(i, { label: e.target.value })}
                          placeholder="Projects delivered"
                        />
                      </div>
                      <div className="field">
                        <label className="label">Icon</label>
                        <input
                          className="control"
                          value={s.icon}
                          onChange={(e) => updateStat(i, { icon: e.target.value })}
                          placeholder="TrendingUp"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-icon-sm"
                        onClick={() => removeStat(i)}
                        style={{ color: "var(--danger)", marginBottom: 2 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VALUES */}
        {activeTab === "values" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Core Values</div>
                <div className="card-sub">What your company stands for</div>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addValue}>
                <Plus size={14} /> Add value
              </button>
            </div>

            {form.values.length === 0 ? (
              <div className="empty">
                <div className="empty-sub">No values added yet.</div>
              </div>
            ) : (
              <div className="form-grid">
                {form.values.map((v, i) => (
                  <div key={i} className="dynamic-row">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10 }}>
                      <div className="field">
                        <label className="label">Title</label>
                        <input
                          className="control"
                          value={v.title}
                          onChange={(e) => updateValue(i, { title: e.target.value })}
                          placeholder="Innovation"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-icon-sm"
                        onClick={() => removeValue(i)}
                        style={{ color: "var(--danger)", alignSelf: "end", marginBottom: 2 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid-2">
                      <div className="field">
                        <label className="label">Icon</label>
                        <input
                          className="control"
                          value={v.icon}
                          onChange={(e) => updateValue(i, { icon: e.target.value })}
                          placeholder="Heart, Lightbulb, Shield..."
                        />
                      </div>
                      <div className="field">
                        <label className="label">Description</label>
                        <input
                          className="control"
                          value={v.description}
                          onChange={(e) => updateValue(i, { description: e.target.value })}
                          placeholder="We embrace new ideas..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TEAM */}
        {activeTab === "team" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Team Section Labels</div>
                <div className="card-sub">Text shown above the team grid (manage team in "Team Members")</div>
              </div>
            </div>
            <div className="form-grid">
              <div className="field">
                <label className="label">Section title</label>
                <input
                  className="control"
                  value={form.teamSectionTitle}
                  onChange={(e) => setForm({ ...form, teamSectionTitle: e.target.value })}
                  placeholder="Meet Our Team"
                />
              </div>
              <div className="field">
                <label className="label">Section subtitle</label>
                <input
                  className="control"
                  value={form.teamSectionSubtitle}
                  onChange={(e) => setForm({ ...form, teamSectionSubtitle: e.target.value })}
                  placeholder="The brilliant minds behind SIRA..."
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        {activeTab === "cta" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Call to Action</div>
                <div className="card-sub">Bottom CTA section on About page</div>
              </div>
            </div>
            <div className="form-grid">
              <div className="field">
                <label className="label">CTA title</label>
                <input
                  className="control"
                  value={form.ctaTitle}
                  onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
                  placeholder="Ready to work with us?"
                />
              </div>
              <div className="field">
                <label className="label">CTA subtitle</label>
                <textarea
                  className="control control-textarea"
                  rows={2}
                  value={form.ctaSubtitle}
                  onChange={(e) => setForm({ ...form, ctaSubtitle: e.target.value })}
                  placeholder="Let's build something amazing together."
                />
              </div>
              <div className="grid-2">
                <div className="field">
                  <label className="label">Button text</label>
                  <input
                    className="control"
                    value={form.ctaButtonText}
                    onChange={(e) => setForm({ ...form, ctaButtonText: e.target.value })}
                    placeholder="Get in touch"
                  />
                </div>
                <div className="field">
                  <label className="label">Button link</label>
                  <input
                    className="control"
                    value={form.ctaButtonLink}
                    onChange={(e) => setForm({ ...form, ctaButtonLink: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="ss-save-bar">
          <div className="text-mute" style={{ fontSize: 13 }}>
            Changes apply to the About page immediately
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <><div className="spinner"></div><span style={{ marginLeft: 6 }}>Saving...</span></>
            ) : (
              <><Save size={15} /> Save all changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}