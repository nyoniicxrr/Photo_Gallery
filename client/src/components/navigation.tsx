import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Upload, Lock, LogOut } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import AdminLogin from "@/components/admin-login";

export default function Navigation() {
  const [location] = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAdmin, logout } = useAdmin();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/gallery", label: "Gallery" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-primary/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-xl font-bold text-white cursor-pointer">
                Portfolio Pro
              </h1>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`pb-1 transition-colors ${
                      location === item.path
                        ? "text-white border-b-2 border-blue-500"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Link href="/gallery">
                  <Button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </Link>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowAdminLogin(true)}
                variant="outline"
                className="border-gray-600 hover:bg-gray-700 text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
          </div>
        </div>
      </div>
      <AdminLogin 
        open={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
      />
    </nav>
  );
}
