import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

/* Fallback settings if API is down */
const FALLBACK_SETTINGS = {
  siteName: "SIRA Technologies",
  logo: { url: null },
  favicon: { url: null },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Site settings (logo, favicon, brand name) — shared across admin
  const [siteSettings, setSiteSettings] = useState(FALLBACK_SETTINGS);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("sira_admin_token");
    const savedUser = localStorage.getItem("sira_admin_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("sira_admin_token");
        localStorage.removeItem("sira_admin_user");
      }
    }
    setLoading(false);
  }, []);

  // Fetch site settings once (whether logged in or not — needed for login page too)
  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const { data } = await client.get("/settings");
        if (!cancelled) {
          const s = data?.data?.settings;
          if (s) {
            setSiteSettings({
              ...FALLBACK_SETTINGS,
              ...s,
              logo: s.logo?.url ? s.logo : FALLBACK_SETTINGS.logo,
              favicon: s.favicon?.url ? s.favicon : FALLBACK_SETTINGS.favicon,
            });
          }
        }
      } catch (err) {
        console.warn("[AuthContext] Settings fetch failed:", err.message);
      }
    }

    loadSettings();
    return () => { cancelled = true; };
  }, []);

  // Dynamically set favicon and title
  useEffect(() => {
    const brandName = siteSettings?.siteName || "SIRA Technologies";
    document.title = `${brandName} · Admin`;

    if (siteSettings?.favicon?.url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = siteSettings.favicon.url;
    }
  }, [siteSettings]);

  const login = async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    const payload = data?.data || data;
    const newToken = payload.token;
    const newUser = payload.user;

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("sira_admin_token", newToken);
    localStorage.setItem("sira_admin_user", JSON.stringify(newUser));

    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sira_admin_token");
    localStorage.removeItem("sira_admin_user");
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("sira_admin_user", JSON.stringify(updated));
  };

  // Called after SiteSettings are updated in admin (to refresh logo in real-time)
  const refreshSettings = async () => {
    try {
      const { data } = await client.get("/settings");
      const s = data?.data?.settings;
      if (s) {
        setSiteSettings({
          ...FALLBACK_SETTINGS,
          ...s,
          logo: s.logo?.url ? s.logo : FALLBACK_SETTINGS.logo,
          favicon: s.favicon?.url ? s.favicon : FALLBACK_SETTINGS.favicon,
        });
      }
    } catch (err) {
      console.warn("[AuthContext] Refresh settings failed:", err.message);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    siteSettings,
    login,
    logout,
    updateUser,
    refreshSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}