import { createContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../lib/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    // Initialize from localStorage on first render
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");

    if (token && adminData) {
      try {
        return JSON.parse(adminData);
      } catch (error) {
        console.error("Error parsing admin data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login({ email, password });
    const { token, admin: adminData } = response.data;

    // Store token and admin data
    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdmin(adminData);

    return adminData;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setAdmin(null);
  }, []);

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
