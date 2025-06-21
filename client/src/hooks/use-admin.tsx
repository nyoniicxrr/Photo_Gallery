import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createAdmin: (username: string, password: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest('POST', '/api/admin/login', {
        username,
        password
      });
      
      if (response.ok) {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const createAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest('POST', '/api/admin/create', {
        username,
        password
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, createAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}