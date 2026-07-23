import { useState } from "react";
import { User as UserIcon, Lock, Save, Eye, EyeOff, Mail } from "lucide-react";
import toast from "react-hot-toast";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  async function handleProfileSave(e) {
    e.preventDefault();
    if (!profile.name || !profile.email) {
      toast.error("Name and email are required");
      return;
    }
    setSavingProfile(true);
    try {
      const { data } = await client.put("/auth/me", profile);
      const updated = data?.data?.user;
      if (updated) updateUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (!pw.currentPassword || !pw.newPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (pw.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (pw.newPassword !== pw.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPw(true);
    try {
      await client.put("/auth/change-password", {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      toast.success("Password changed successfully");
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Change failed");
    } finally {
      setChangingPw(false);
    }
  }

  const initials = (user?.name || "A")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="settings-wrap">
      {/* Profile hero */}
      <div className="settings-hero">
        <div className="settings-hero-avatar">{initials}</div>
        <div>
          <div className="settings-hero-name">{user?.name}</div>
          <div className="settings-hero-role">
            <span className="badge badge-info">{user?.role}</span>
            <span className="text-mute" style={{ marginLeft: 8 }}>
              {user?.email}
            </span>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <UserIcon
                  size={16}
                  style={{ verticalAlign: -2, marginRight: 6 }}
                />
                Profile
              </div>
              <div className="card-sub">Update your name and email</div>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="form-grid">
            <div className="field">
              <label className="label">Full name</label>
              <input
                className="control"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label className="label">Email address</label>
              <input
                type="email"
                className="control"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <Save size={15} /> Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Password */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Lock size={16} style={{ verticalAlign: -2, marginRight: 6 }} />
                Change Password
              </div>
              <div className="card-sub">
                Use a strong password you don't reuse
              </div>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="form-grid">
            <div className="field">
              <label className="label">Current password</label>
              <div className="input-wrap">
                <input
                  type={showCurrent ? "text" : "password"}
                  className="control input-with-action"
                  value={pw.currentPassword}
                  onChange={(e) =>
                    setPw({ ...pw, currentPassword: e.target.value })
                  }
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowCurrent((s) => !s)}
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label className="label">New password</label>
              <div className="input-wrap">
                <input
                  type={showNew ? "text" : "password"}
                  className="control input-with-action"
                  value={pw.newPassword}
                  onChange={(e) =>
                    setPw({ ...pw, newPassword: e.target.value })
                  }
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowNew((s) => !s)}
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="hint">Minimum 6 characters</div>
            </div>

            <div className="field">
              <label className="label">Confirm new password</label>
              <input
                type={showNew ? "text" : "password"}
                className="control"
                value={pw.confirmPassword}
                onChange={(e) =>
                  setPw({ ...pw, confirmPassword: e.target.value })
                }
                autoComplete="new-password"
              />
              {pw.newPassword &&
                pw.confirmPassword &&
                pw.newPassword !== pw.confirmPassword && (
                  <div className="error-text">Passwords do not match</div>
                )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={changingPw}
              >
                {changingPw ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <Lock size={15} /> Update password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}