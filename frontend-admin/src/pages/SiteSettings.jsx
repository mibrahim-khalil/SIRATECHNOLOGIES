import { useEffect, useState } from "react";
import {
  Building2,
  Phone,
  Share2,
  Search,
  Save,
  ImagePlus,
  Loader2,
  X,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";

const TABS = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "seo", label: "SEO / Meta", icon: Search },
];

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("company");

  const [settings, setSettings] = useState(null);

  // Local form state
  const [form, setForm] = useState({
    siteName: "",
    tagline: "",
    shortDescription: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    responseTime: "",
    footerText: "",
    social: {
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
      facebook: "",
      youtube: "",
    },
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  });

  // Image files (only new uploads)
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState("");
  const [ogFile, setOgFile] = useState(null);
  const [ogPreview, setOgPreview] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const { data } = await client.get("/settings");
      const s = data?.data?.settings || {};
      setSettings(s);
      setForm({
        siteName: s.siteName || "",
        tagline: s.tagline || "",
        shortDescription: s.shortDescription || "",
        email: s.email || "",
        phone: s.phone || "",
        whatsapp: s.whatsapp || "",
        address: s.address || "",
        responseTime: s.responseTime || "",
        footerText: s.footerText || "",
        social: {
          linkedin: s.social?.linkedin || "",
          github: s.social?.github || "",
          twitter: s.social?.twitter || "",
          instagram: s.social?.instagram || "",
          facebook: s.social?.facebook || "",
          youtube: s.social?.youtube || "",
        },
        seo: {
          metaTitle: s.seo?.metaTitle || "",
          metaDescription: s.seo?.metaDescription || "",
          keywords: s.seo?.keywords || [],
        },
      });
      setLogoPreview(s.logo?.url || "");
      setFaviconPreview(s.favicon?.url || "");
      setOgPreview(s.seo?.ogImage?.url || "");
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  function handleImage(setFile, setPreview) {
    return (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }
      setFile(file);
      setPreview(URL.createObjectURL(file));
    };
  }

  async function removeImageServer(type, setPreview, setFile) {
    try {
      const { data } = await client.delete(`/settings/image/${type}`);
      const s = data?.data?.settings;
      setSettings(s);
      setPreview("");
      setFile(null);
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("siteName", form.siteName);
      fd.append("tagline", form.tagline);
      fd.append("shortDescription", form.shortDescription);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("whatsapp", form.whatsapp);
      fd.append("address", form.address);
      fd.append("responseTime", form.responseTime);
      fd.append("footerText", form.footerText);
      fd.append("social", JSON.stringify(form.social));
      fd.append("seo", JSON.stringify(form.seo));

      if (logoFile) fd.append("logo", logoFile);
      if (faviconFile) fd.append("favicon", faviconFile);
      if (ogFile) fd.append("ogImage", ogFile);

      const { data } = await client.put("/settings", fd);
      const s = data?.data?.settings;
      setSettings(s);
      setLogoFile(null);
      setFaviconFile(null);
      setOgFile(null);
      toast.success("Settings saved!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <Loader2
          size={30}
          style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  return (
    <div className="settings-wrap">
      {/* Tabs */}
      <div className="ss-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`ss-tab ${activeTab === tab.id ? "ss-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ==================== COMPANY ==================== */}
        {activeTab === "company" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Company Information</div>
                <div className="card-sub">Basic branding shown across the site</div>
              </div>
            </div>

            <div className="form-grid">
              <div className="grid-2">
                <div className="field">
                  <label className="label">Site name</label>
                  <input
                    className="control"
                    value={form.siteName}
                    onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                    placeholder="SIRA Technologies"
                  />
                </div>
                <div className="field">
                  <label className="label">Tagline</label>
                  <input
                    className="control"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="Build. Scale. Automate."
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Short description</label>
                <textarea
                  className="control control-textarea"
                  rows={3}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Digital solutions company focused on building innovative..."
                />
              </div>

              <div className="field">
                <label className="label">Footer text</label>
                <input
                  className="control"
                  value={form.footerText}
                  onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                  placeholder="© SIRA Technologies. All rights reserved."
                />
              </div>

              <div className="grid-2">
                {/* Logo */}
                <div className="field">
                  <label className="label">Logo</label>
                  <div className="ss-image-box">
                    {logoPreview ? (
                      <>
                        <img src={logoPreview} alt="logo" />
                        <div className="ss-image-actions">
                          <label className="btn btn-secondary btn-sm">
                            <ImagePlus size={13} /> Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImage(setLogoFile, setLogoPreview)}
                              hidden
                            />
                          </label>
                          {settings?.logo?.url && !logoFile && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ color: "var(--danger)" }}
                              onClick={() =>
                                removeImageServer("logo", setLogoPreview, setLogoFile)
                              }
                            >
                              <X size={13} /> Remove
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <label className="image-drop">
                        <ImagePlus size={22} />
                        <span>Upload logo</span>
                        <small>PNG, SVG recommended</small>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImage(setLogoFile, setLogoPreview)}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Favicon */}
                <div className="field">
                  <label className="label">Favicon</label>
                  <div className="ss-image-box">
                    {faviconPreview ? (
                      <>
                        <img src={faviconPreview} alt="favicon" />
                        <div className="ss-image-actions">
                          <label className="btn btn-secondary btn-sm">
                            <ImagePlus size={13} /> Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImage(setFaviconFile, setFaviconPreview)}
                              hidden
                            />
                          </label>
                          {settings?.favicon?.url && !faviconFile && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ color: "var(--danger)" }}
                              onClick={() =>
                                removeImageServer(
                                  "favicon",
                                  setFaviconPreview,
                                  setFaviconFile
                                )
                              }
                            >
                              <X size={13} /> Remove
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <label className="image-drop">
                        <ImagePlus size={22} />
                        <span>Upload favicon</span>
                        <small>32x32 or 64x64 PNG</small>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImage(setFaviconFile, setFaviconPreview)}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CONTACT ==================== */}
        {activeTab === "contact" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Contact Information</div>
                <div className="card-sub">Public contact details shown on the site</div>
              </div>
            </div>

            <div className="form-grid">
              <div className="grid-2">
                <div className="field">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="hello@siratechnologies.com"
                  />
                </div>
                <div className="field">
                  <label className="label">Phone</label>
                  <input
                    className="control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="label">WhatsApp number</label>
                  <input
                    className="control"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="923001234567 (no + or spaces)"
                  />
                  <div className="hint">Used to build wa.me link</div>
                </div>
                <div className="field">
                  <label className="label">Response time</label>
                  <input
                    className="control"
                    value={form.responseTime}
                    onChange={(e) => setForm({ ...form, responseTime: e.target.value })}
                    placeholder="24-48 hours"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Address</label>
                <textarea
                  className="control control-textarea"
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Your business address (optional)"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== SOCIAL ==================== */}
        {activeTab === "social" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Social Links</div>
                <div className="card-sub">Shown in header, footer, and contact page</div>
              </div>
            </div>

            <div className="form-grid">
              <SocialField
                icon={Linkedin}
                label="LinkedIn"
                value={form.social.linkedin}
                onChange={(v) =>
                  setForm({ ...form, social: { ...form.social, linkedin: v } })
                }
                placeholder="https://linkedin.com/in/..."
              />
              <SocialField
                icon={Github}
                label="GitHub"
                value={form.social.github}
                onChange={(v) =>
                  setForm({ ...form, social: { ...form.social, github: v } })
                }
                placeholder="https://github.com/..."
              />
              <SocialField
                icon={Twitter}
                label="Twitter / X"
                value={form.social.twitter}
                onChange={(v) =>
                  setForm({ ...form, social: { ...form.social, twitter: v } })
                }
                placeholder="https://twitter.com/..."
              />
              <SocialField
                icon={Instagram}
                label="Instagram"
                value={form.social.instagram}
                onChange={(v) =>
                  setForm({ ...form, social: { ...form.social, instagram: v } })
                }
                placeholder="https://instagram.com/..."
              />
              <SocialField
                icon={Facebook}
                label="Facebook"
                value={form.social.facebook}
                onChange={(v) =>
                  setForm({ ...form, social: { ...form.social, facebook: v } })
                }
                placeholder="https://facebook.com/..."
              />
              <SocialField
                icon={Youtube}
                label="YouTube"
                value={form.social.youtube}
                onChange={(v) =>
                  setForm({ ...form, social: { ...form.social, youtube: v } })
                }
                placeholder="https://youtube.com/@..."
              />
            </div>
          </div>
        )}

        {/* ==================== SEO ==================== */}
        {activeTab === "seo" && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">SEO / Meta</div>
                <div className="card-sub">Search engines and social sharing</div>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label">Meta title</label>
                <input
                  className="control"
                  value={form.seo.metaTitle}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      seo: { ...form.seo, metaTitle: e.target.value },
                    })
                  }
                  placeholder="SIRA Technologies • Build. Scale. Automate."
                />
                <div className="hint">Recommended: 50-60 characters</div>
              </div>

              <div className="field">
                <label className="label">Meta description</label>
                <textarea
                  className="control control-textarea"
                  rows={3}
                  value={form.seo.metaDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      seo: { ...form.seo, metaDescription: e.target.value },
                    })
                  }
                  placeholder="Short description shown in search results (150-160 chars)"
                />
                <div className="hint">
                  {form.seo.metaDescription.length}/160 characters
                </div>
              </div>

              <div className="field">
                <label className="label">Keywords (comma separated)</label>
                <input
                  className="control"
                  value={form.seo.keywords.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      seo: {
                        ...form.seo,
                        keywords: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="web development, MERN, UI/UX, AI"
                />
              </div>

              <div className="field">
                <label className="label">Open Graph image</label>
                <div className="ss-image-box">
                  {ogPreview ? (
                    <>
                      <img src={ogPreview} alt="og" />
                      <div className="ss-image-actions">
                        <label className="btn btn-secondary btn-sm">
                          <ImagePlus size={13} /> Replace
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage(setOgFile, setOgPreview)}
                            hidden
                          />
                        </label>
                        {settings?.seo?.ogImage?.url && !ogFile && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: "var(--danger)" }}
                            onClick={() =>
                              removeImageServer("ogImage", setOgPreview, setOgFile)
                            }
                          >
                            <X size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <label className="image-drop">
                      <ImagePlus size={22} />
                      <span>Upload OG image</span>
                      <small>1200x630 recommended</small>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage(setOgFile, setOgPreview)}
                        hidden
                      />
                    </label>
                  )}
                </div>
                <div className="hint">Shown when link is shared on social media</div>
              </div>
            </div>
          </div>
        )}

        {/* Save button - sticky bottom */}
        <div className="ss-save-bar">
          <div className="text-mute" style={{ fontSize: 13 }}>
            Changes apply immediately to the public website
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <div className="spinner"></div>
                <span style={{ marginLeft: 6 }}>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} /> Save all changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function SocialField({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <div className="field">
      <label className="label">
        <Icon size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
        {label}
      </label>
      <input
        className="control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}