import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Waiting from "./pages/Waiting.jsx";
import AppLayout from "./pages/app/AppLayout.jsx";
import Feed from "./pages/app/Feed.jsx";
import Upload from "./pages/app/Upload.jsx";
import PendingReports from "./pages/app/PendingReports.jsx";
import Rejected from "./pages/app/Rejected.jsx";
import PendingMembers from "./pages/app/PendingMembers.jsx";
import Admin from "./pages/app/Admin.jsx";

function ProtectedRoute({ children, requireVerified = true }) {
  const { user, token, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-50 text-ink-900/50 text-sm">
        Loading…
      </div>
    );
  }
  if (!token || !user) return <Navigate to="/login" replace />;
  if (requireVerified && !user.isVerified) return <Navigate to="/waiting" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user?.isAdmin) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/waiting"
        element={
          <ProtectedRoute requireVerified={false}>
            <Waiting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Feed />} />
        <Route path="upload" element={<Upload />} />
        <Route path="pending" element={<PendingReports />} />
        <Route path="rejected" element={<Rejected />} />
        <Route path="members" element={<PendingMembers />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
