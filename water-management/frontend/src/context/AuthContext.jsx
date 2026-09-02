import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("aquora_token"));
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On first load, if we have a token, fetch the current user.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const me = await api("/auth/me", { token });
        if (!cancelled) setUser(me);
      } catch (err) {
        if (!cancelled) {
          setToken(null);
          localStorage.removeItem("aquora_token");
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persistSession(data) {
    setToken(data.token);
    setUser(data);
    localStorage.setItem("aquora_token", data.token);
  }

  async function login(email, password) {
    const data = await api("/auth/login", { method: "POST", body: { email, password } });
    persistSession(data);
    return data;
  }

  async function register({ name, email, password, roomNumber }) {
    const data = await api("/auth/register", {
      method: "POST",
      body: { name, email, password, roomNumber },
    });
    persistSession(data);
    return data;
  }

  async function refreshMe() {
    const me = await api("/auth/me", { token });
    setUser(me);
    return me;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("aquora_token");
  }

  return (
    <AuthContext.Provider
      value={{ token, user, initializing, login, register, refreshMe, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
