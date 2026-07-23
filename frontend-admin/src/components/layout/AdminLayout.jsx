import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome, {user?.name} 👋</h1>
      <p style={{ color: "#64748b", marginTop: 8 }}>
        Logged in as: {user?.email}
      </p>
      <button
        className="btn btn-primary"
        style={{ marginTop: 20 }}
        onClick={logout}
      >
        Logout
      </button>
      <div style={{ marginTop: 30 }}>
        <Outlet />
      </div>
    </div>
  );
}