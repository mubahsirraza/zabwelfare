
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminApp() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  const token = localStorage.getItem("zabwelfareAdminToken");

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/admin/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setAdmin(response.data.admin);
      } catch (error) {
        localStorage.removeItem("zabwelfareAdminToken");
        localStorage.removeItem("zabwelfareAdmin");
        setAdmin(null);
      } finally {
        setChecking(false);
      }
    };

    verifySession();
  }, [token]);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    navigate("/admin/dashboard", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/admin/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "zabwelfareAdminToken"
            )}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("zabwelfareAdminToken");
      localStorage.removeItem("zabwelfareAdmin");
      setAdmin(null);
      navigate("/admin", { replace: true });
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <p className="mt-4 text-sm text-slate-500">
            Verifying administrator session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          admin
            ? <Navigate to="/admin/dashboard" replace />
            : <AdminLogin onLogin={handleLogin} />
        }
      />

      <Route
        path="/dashboard"
        element={
          admin
            ? <AdminDashboard admin={admin} onLogout={handleLogout} />
            : <Navigate to="/admin" replace />
        }
      />

      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />
    </Routes>
  );
}
