// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";


const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/Buyer-login" replace />;
  }

  // Logged in but role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Allowed, render nested route
  return <Outlet />;
};

export default ProtectedRoute;
