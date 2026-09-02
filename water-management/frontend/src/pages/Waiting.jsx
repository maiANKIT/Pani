import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hourglass } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { GhostButton } from "../components/Buttons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAlert } from "../context/AlertContext.jsx";

export default function Waiting() {
  const { user, refreshMe, logout } = useAuth();
  const { notify, notifyError } = useAlert();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  async function handleRefresh() {
    setChecking(true);
    try {
      const me = await refreshMe();
      if (me.isVerified) {
        notify("You're verified — welcome in.");
        navigate("/app");
      } else {
        notify("Still waiting on verification.");
      }
    } catch (err) {
      notifyError(err.message);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-clay-100 flex items-center justify-center mx-auto mb-6">
            <Hourglass className="w-7 h-7 text-clay-600" />
          </div>
          <h1 className="font-display text-2xl font-semibold mb-2">Waiting on verification</h1>
          <p className="text-ink-900/60 text-sm leading-relaxed mb-6">
            Your account for room <span className="font-mono font-medium text-ink-900">{user?.roomNumber}</span> is
            registered but not yet verified. Ask a verified member of your room to approve you — or, if you&apos;re
            the first person from this room, ask an admin.
          </p>
          <div className="flex justify-center gap-3">
            <GhostButton onClick={handleRefresh} disabled={checking}>
              {checking ? "Checking…" : "Refresh status"}
            </GhostButton>
            <GhostButton onClick={() => { logout(); navigate("/"); }}>Log out</GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}
