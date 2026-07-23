import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    // response shape: { success, message, data: { token, user } }
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

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}