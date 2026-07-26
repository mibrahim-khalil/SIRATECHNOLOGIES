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
  Users,
  X,
  Linkedin,
  Github,
  Twitter,
  Globe,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const EMPTY_FORM = {
  name: "",
  role: "",
  bio: "",
  email: "",
  social: {
    linkedin: "",
    github: "",
    twitter: "",
    website: "",
  },
  order: 0,
  isActive: true,
};

export default function ManageTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await client.get("/team/admin/all");
      setMembers(data?.data?.members || []);
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview("");
    setModalOpen(true);
  }

  function openEdit(m) {
    setEditing(m);
    setForm({
      name: m.name || "",
      role: m.role || "",
      bio: m.bio || "",
      email: m.email || "",
      social: {
        linkedin: m.social?.linkedin || "",
        github: m.social?.github || "",
        twitter: m.social?.twitter || "",
        website: m.social?.website || "",
      },
      order: m.order || 0,
      isActive: m.isActive,
    });
    setPhotoFile(null);
    setPhotoPreview(m.photo?.url || "");
    setModalOpen(true);
  }

  function close() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview("");
    setUploadProgress(0);
  }

  function handlePhoto(e) {
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
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast.error("Name and role are required");
      return;
    }

    setSaving(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("bio", form.bio || "");
      fd.append("email", form.email || "");
      fd.append("order", String(form.order || 0));
      fd.append("isActive", String(form.isActive));
      fd.append("social", JSON.stringify(form.social));

      if (photoFile) fd.append("photo", photoFile);

      const url = editing ? `/team/${editing._id}` : "/team";
      const method = editing ? "put" : "post";

      await client[method](url, fd, {
        timeout: 60000,
        onUploadProgress: (e) => {
          if (e.total) {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      toast.success(editing ? "Member updated" : "Member added");
      close();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  async function toggle(m) {
    try {
      await client.patch(`/team/${m._id}/toggle`);
      toast.success(m.isActive ? "Deactivated" : "Activated");
      load();
    } catch {
      toast.error("Toggle failed");
    }
  }

  function askDelete(m) {
    setTarget(m);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await client.delete(`/team/${target._id}`);
      toast.success("Member removed");
      setConfirmOpen(false);
      setTarget(null);
      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="list-toolbar">
        <div className="search-box">
          <Search size={16} className="search-box-icon" />
          <input
            className="search-box-input"
            placeholder="Search team by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <Loader2 size={30} style={{ color: "var(--mute)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <Users size={26} />
            </div>
            <div className="empty-title">
              {search ? "No matches" : "No team members yet"}
            </div>
            <div className="empty-sub">
              {search ? "Try a different search." : "Add your first team member."}
            </div>
            {!search && (
              <button className="btn btn-primary" onClick={openNew}>
                <Plus size={16} /> Add Member
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="team-grid">
          {filtered.map((m) => (
            <div key={m._id} className="team-card">
              <div className="team-photo">
                {m.photo?.url ? (
                  <img src={m.photo.url} alt={m.name} />
                ) : (
                  <div className="team-photo-fallback">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {!m.isActive && (
                  <span className="svc-status svc-status-off">Inactive</span>
                )}
              </div>

              <div className="team-body">
                <div className="team-name-row">
                  <h3 className="team-name">{m.name}</h3>
                  <span className="svc-order">#{m.order || 0}</span>
                </div>
                <div className="team-role">{m.role}</div>
                {m.bio && <p className="team-bio">{m.bio}</p>}

                <div className="team-socials">
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="team-social">
                      <Mail size={14} />
                    </a>
                  )}
                  {m.social?.linkedin && (
                    <a href={m.social.linkedin} target="_blank" rel="noreferrer" className="team-social">
                      <Linkedin size={14} />
                    </a>
                  )}
                  {m.social?.github && (
                    <a href={m.social.github} target="_blank" rel="noreferrer" className="team-social">
                      <Github size={14} />
                    </a>
                  )}
                  {m.social?.twitter && (
                    <a href={m.social.twitter} target="_blank" rel="noreferrer" className="team-social">
                      <Twitter size={14} />
                    </a>
                  )}
                  {m.social?.website && (
                    <a href={m.social.website} target="_blank" rel="noreferrer" className="team-social">
                      <Globe size={14} />
                    </a>
                  )}
                </div>
              </div>

              <div className="svc-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>
                  <Pencil size={14} /> Edit
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => toggle(m)}>
                  {m.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => askDelete(m)}
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
        title={editing ? "Edit Team Member" : "New Team Member"}
        size="lg"
      >
        <form onSubmit={submit} className="form-grid">
          <div className="field">
            <label className="label">Photo</label>
            <div className="image-uploader" style={{ aspectRatio: "1", maxWidth: 200 }}>
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="preview" />
                  <button
                    type="button"
                    className="image-remove"
                    onClick={() => {
                      setPhotoPreview("");
                      setPhotoFile(null);
                    }}
                    disabled={saving}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label className="image-drop">
                  <ImagePlus size={22} />
                  <span>Upload photo</span>
                  <small>Square, PNG/JPG</small>
                  <input type="file" accept="image/*" onChange={handlePhoto} hidden />
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
                placeholder="John Doe"
              />
            </div>
            <div className="field">
              <label className="label">Role *</label>
              <input
                className="control"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Founder & CEO"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Bio</label>
            <textarea
              className="control control-textarea"
              rows={3}
              maxLength={500}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Short bio shown on the About page..."
            />
            <div className="hint">{form.bio.length}/500</div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <input
              type="email"
              className="control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label"><Linkedin size={13} style={{ verticalAlign: -2, marginRight: 6 }} />LinkedIn</label>
              <input
                className="control"
                value={form.social.linkedin}
                onChange={(e) => setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="field">
              <label className="label"><Github size={13} style={{ verticalAlign: -2, marginRight: 6 }} />GitHub</label>
              <input
                className="control"
                value={form.social.github}
                onChange={(e) => setForm({ ...form, social: { ...form.social, github: e.target.value } })}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="field">
              <label className="label"><Twitter size={13} style={{ verticalAlign: -2, marginRight: 6 }} />Twitter</label>
              <input
                className="control"
                value={form.social.twitter}
                onChange={(e) => setForm({ ...form, social: { ...form.social, twitter: e.target.value } })}
                placeholder="https://twitter.com/..."
              />
            </div>
            <div className="field">
              <label className="label"><Globe size={13} style={{ verticalAlign: -2, marginRight: 6 }} />Website</label>
              <input
                className="control"
                value={form.social.website}
                onChange={(e) => setForm({ ...form, social: { ...form.social, website: e.target.value } })}
                placeholder="https://..."
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
              <label className="label">Status</label>
              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <span className="switch" />
                <span>{form.isActive ? "Active" : "Inactive"}</span>
              </label>
            </div>
          </div>

          {saving && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress">
              <div className="upload-progress-label">Uploading... {uploadProgress}%</div>
              <div className="upload-progress-track">
                <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="form-foot">
            <button type="button" className="btn btn-secondary" onClick={close} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><div className="spinner"></div><span style={{ marginLeft: 6 }}>Saving...</span></> : editing ? "Save changes" : "Add member"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        title="Remove this team member?"
        message={`"${target?.name}" will be permanently removed.`}
        loading={deleting}
      />
    </div>
  );
}