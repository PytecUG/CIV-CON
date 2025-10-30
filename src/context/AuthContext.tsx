import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import type { User } from "@/types/user";

const API_BASE = "https://civcon.onrender.com";


interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData?: User) => Promise<void>;
  logout: (silent?: boolean) => void;
  refreshUser: () => Promise<void>;
}


/* Context */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* Provider */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  /* Helper: Decode JWT and check expiration */
  const isTokenExpired = (token: string): boolean => {
    try {
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));
      const exp = payload.exp * 1000; // convert seconds to ms
      return Date.now() > exp;
    } catch {
      return true;
    }
  };

  /* Refresh user data from /auth/me */
  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      console.warn("Token expired — auto logout");
      logout(true);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch /auth/me:", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* Login: store token and optionally accept user info for instant update */
  const login = async (jwtToken: string, userData?: User) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    if (userData) {
      // Immediately set user without waiting for /auth/me
      setUser(userData);
      setLoading(false);
    } else {
      // fallback: fetch user if not provided
      await refreshUser();
    }
  };

  /* Logout: clear token + toast + redirect */
  const logout = (silent = false) => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    if (!silent) toast.success(" Logged out successfully.");
    navigate("/signin", { replace: true });
  };

  /* Auto-refresh user & periodic token check */
  useEffect(() => {
    refreshUser();

    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        console.warn("Session expired — logging out");
        logout(true);
      }
    }, 60_000); // every 60 seconds

    return () => clearInterval(interval);
  }, [token]);

  /* Provide context to children */
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen text-muted-foreground">
          Loading user session...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

/* Hook */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
};