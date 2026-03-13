import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE}/Isloggedin`, {
          withCredentials: true,
        });

        if (res.data.success && res.data.role === allowedRole) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRole]);

  if (loading) return <p>Checking login...</p>;

  if (!authorized) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
