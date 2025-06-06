"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log("Login credentials:", credentials);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      console.log("Login response:", data);

      const userData = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        phone_number: data.phone_number,
        address: data.address,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const register = async (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
