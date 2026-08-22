import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// requireVerified: if true, unverified users get redirected to a
// waiting screen instead of the page they asked for.
// adminOnly: if true, only isAdmin users get through.
export default function ProtectedRoute({
  children,
  requireVerified = false,
  adminOnly = false,
}) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" replace />;

  if (requireVerified && !user.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}