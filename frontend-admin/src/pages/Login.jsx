import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* Left brand panel */}
      <aside className="login-brand">
        <div className="login-brand-inner">
          <div className="login-logo">
            <ShieldCheck size={28} />
            <span>SIRA</span>
          </div>

          <h1 className="login-brand-title">
            Admin
            <br />
            Console
          </h1>

          <p className="login-brand-sub">
            Manage services, showcase portfolio, and track leads — all in one
            place.
          </p>

          <div className="login-brand-glow" />
        </div>
      </aside>

      {/* Right form panel */}
      <main className="login-form-wrap">
        <div className="login-form-card">
          <div style={{ marginBottom: 26 }}>
            <h2 className="login-title">Sign in</h2>
            <p className="login-sub">
              Use your administrator credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label className="label" htmlFor="email">
                Email
              </label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="control input-with-icon"
                  placeholder="admin@siratechnologies.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  className="control input-with-icon input-with-action"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPw((s) => !s)}
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", height: 48, marginTop: 6 }}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Sign in"}
            </button>
          </form>

          <p className="login-foot">
            Protected area · Access restricted to authorized personnel.
          </p>
        </div>
      </main>
    </div>
  );
}