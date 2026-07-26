import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

/**
 * Fallback data — used if API is down so the site NEVER breaks.
 */
const FALLBACK_SETTINGS = {
  siteName: "SIRA Technologies",
  tagline: "Build. Scale. Automate.",
  shortDescription: "",
  logo: { url: "/assets/logo.png" },
  favicon: { url: "/favicon.ico" },
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  responseTime: "24-48 hours",
  social: {
    linkedin: "",
    github: "",
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },
  seo: {
    metaTitle: "SIRA Technologies • Build. Scale. Automate.",
    metaDescription: "",
    keywords: [],
  },
  footerText: "© SIRA Technologies. All rights reserved.",
};

const SiteContext = createContext({
  settings: FALLBACK_SETTINGS,
  services: [],
  loading: true,
  refresh: () => {},
});

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      // Fetch in parallel
      const [settingsRes, servicesRes] = await Promise.allSettled([
        client.get("/settings"),
        client.get("/services"),
      ]);

      // Settings
      if (settingsRes.status === "fulfilled") {
        const s = settingsRes.value?.data?.data?.settings;
        if (s) {
          // Merge with fallback so missing fields don't crash
          setSettings({
            ...FALLBACK_SETTINGS,
            ...s,
            social: { ...FALLBACK_SETTINGS.social, ...(s.social || {}) },
            seo: { ...FALLBACK_SETTINGS.seo, ...(s.seo || {}) },
            logo: s.logo?.url ? s.logo : FALLBACK_SETTINGS.logo,
          });
        }
      } else {
        console.warn("[SiteContext] Settings fetch failed — using fallback");
      }

      // Services
      if (servicesRes.status === "fulfilled") {
        const list = servicesRes.value?.data?.data?.services || [];
        setServices(list);
      }
    } catch (err) {
      console.error("[SiteContext] Load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  // Dynamically update <title> and <favicon> whenever settings load
  useEffect(() => {
    // Title
    const title =
      settings?.seo?.metaTitle ||
      `${settings?.siteName || "SIRA"} • ${settings?.tagline || ""}`;
    document.title = title.trim().replace(/\s*•\s*$/, "");

    // Favicon
    if (settings?.favicon?.url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.favicon.url;
    }

    // Meta description
    if (settings?.seo?.metaDescription) {
      let meta = document.querySelector("meta[name='description']");
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = settings.seo.metaDescription;
    }
  }, [settings]);

  return (
    <SiteContext.Provider
      value={{ settings, services, loading, refresh: loadAll }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}