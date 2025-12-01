// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load from localStorage on first render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedRole = localStorage.getItem("role");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAdmin(savedRole === "admin");
      }
    } catch (err) {
      console.error("Error loading auth data from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    }
  }, []);

  // LOGIN FUNCTION
  const login = (userData) => {
    if (!userData || !userData.role || !userData.email) {
      console.error("Invalid login data:", userData);
      return;
    }

    setUser({ email: userData.email });
    setIsAdmin(userData.role === "admin");

    // Save to localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({ email: userData.email })
    );
    localStorage.setItem("role", userData.role);
  };

  // LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    setIsAdmin(false);

    // Remove from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
