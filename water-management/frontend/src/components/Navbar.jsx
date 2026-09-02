import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { PrimaryButton, GhostButton } from "./Buttons.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <Link to={user ? "/app" : "/"} className="flex items-center gap-2.5">
        <Logo size={30} />
        <span className="font-display font-semibold text-lg tracking-tight">Aquora</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm text-ink-900/70">
        <a href="#how" className="hover:text-ink-900 transition-colors">
          How it works
        </a>
      </nav>
      <div className="flex items-center gap-3">
        {user ? (
          <Link to="/app">
            <PrimaryButton>Open dashboard</PrimaryButton>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <GhostButton>Sign in</GhostButton>
            </Link>
            <Link to="/register">
              <PrimaryButton>Get started</PrimaryButton>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
