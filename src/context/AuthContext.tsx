"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // First check localStorage for saved credentials
      const savedCredentials = localStorage.getItem('userCredentials');
      if (savedCredentials) {
        try {
          const credentials = JSON.parse(savedCredentials);
          if (credentials.token && credentials.user) {
            setUser(credentials.user);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error parsing saved credentials:", error);
          localStorage.removeItem('userCredentials');
        }
      }

      // Fallback to API check
      const response = await axios.get("/api/auth/whoami");
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });

      if (response.data.success) {
        const userData = response.data.user;
        const token = response.data.token;

        // Save credentials to localStorage
        localStorage.setItem('userCredentials', JSON.stringify({
          username,
          token,
          user: userData,
          loginTime: new Date().toISOString()
        }));

        setUser(userData);
        toast.success("Login successful!");
      } else {
        throw new Error(response.data.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login failed (network/server error)";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = error.response.data?.error || "Invalid username or password";
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage credentials
      localStorage.removeItem('userCredentials');
      setUser(null);
      toast.success("Logged out successfully");
      // Redirect to login page
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
