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

// PHASE 3
import ManageTeam from "./pages/ManageTeam";
import ManagePricing from "./pages/ManagePricing";
import ManageReviews from "./pages/ManageReviews";
import ManageAbout from "./pages/ManageAbout";

import AdminLayout from "./components/layout/AdminLayout";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark spinner-lg"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark spinner-lg"></div>
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />

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
        <Route path="pricing" element={<ManagePricing />} />
        <Route path="faqs" element={<ManageFAQs />} />
        <Route path="heroes" element={<ManageHeroes />} />

        {/* About Page */}
        <Route path="team" element={<ManageTeam />} />
        <Route path="reviews" element={<ManageReviews />} />
        <Route path="about" element={<ManageAbout />} />

        {/* Communication */}
        <Route path="leads" element={<ManageLeads />} />

        {/* System */}
        <Route path="site-settings" element={<SiteSettings />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}