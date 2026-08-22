import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if we already have a saved session
  useEffect(() => {
    const token = localStorage.getItem("wm_token");
    const savedUser = localStorage.getItem("wm_user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data);
    return data;
  };

  const register = async (name, email, password, roomNumber) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      roomNumber,
    });
    saveSession(data);
    return data;
  };

  const saveSession = (data) => {
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      roomNumber: data.roomNumber,
      isVerified: data.isVerified,
      isAdmin: data.isAdmin || false,
    };
    localStorage.setItem("wm_token", data.token);
    localStorage.setItem("wm_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("wm_token");
    localStorage.removeItem("wm_user");
    setUser(null);
  };

  const refreshMe = async () => {
    const { data } = await api.get("/auth/me");
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      roomNumber: data.roomNumber,
      isVerified: data.isVerified,
      isAdmin: data.isAdmin || false,
    };
    localStorage.setItem("wm_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}