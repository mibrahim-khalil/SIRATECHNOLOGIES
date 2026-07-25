import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageServices from "./pages/ManageServices";
import ManagePortfolio from "./pages/ManagePortfolio";
import ManagePopularBuilds from "./pages/ManagePopularBuilds";
import ManageProcess from "./pages/ManageProcess";
import ManageAddons from "./pages/ManageAddons";
import ManageFAQs from "./pages/ManageFAQs";
import ManageHeroes from "./pages/ManageHeroes";
import ManageLeads from "./pages/ManageLeads";
import SiteSettings from "./pages/SiteSettings";
import Settings from "./pages/Settings";
import AdminLayout from "./components/layout/AdminLayout";

/**
 * Protects admin routes — redirects to /login if not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark spinner-lg"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Redirects to dashboard if already logged in (used on /login)
 */
function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark spinner-lg"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />

      {/* Protected routes (inside AdminLayout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Content */}
        <Route path="services" element={<ManageServices />} />
        <Route path="portfolio" element={<ManagePortfolio />} />
        <Route path="popular-builds" element={<ManagePopularBuilds />} />
        <Route path="process" element={<ManageProcess />} />
        <Route path="addons" element={<ManageAddons />} />
        <Route path="faqs" element={<ManageFAQs />} />
        <Route path="heroes" element={<ManageHeroes />} />

        {/* Communication */}
        <Route path="leads" element={<ManageLeads />} />

        {/* System */}
        <Route path="site-settings" element={<SiteSettings />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}