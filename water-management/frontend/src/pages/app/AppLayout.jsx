import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, Droplet, Clock, XCircle, UserPlus, Shield, LogOut, Menu } from "lucide-react";
import Logo from "../../components/Logo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const BASE_TABS = [
  { to: "/app", end: true, label: "Fill log", icon: LayoutGrid },
  { to: "/app/upload", label: "Log a fill", icon: Droplet },
  { to: "/app/pending", label: "Awaiting verification", icon: Clock },
  { to: "/app/rejected", label: "Rejected", icon: XCircle },
  { to: "/app/members", label: "Pending roommates", icon: UserPlus },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = user?.isAdmin
    ? [...BASE_TABS, { to: "/app/admin", label: "Admin", icon: Shield }]
    : BASE_TABS;

  function handleLogout() {
    logout();
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-left transition-colors ${
      isActive ? "bg-paper-50/10 text-paper-50 font-medium" : "text-paper-200/60 hover:bg-paper-50/5 hover:text-paper-100"
    }`;

  return (
    <div className="min-h-screen bg-paper-100 flex">
      {/* SIDEBAR (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink-900 text-paper-50 p-5">
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <Logo size={28} />
          <span className="font-display font-semibold text-lg">Aquora</span>
        </div>
        <nav className="flex flex-col gap-1">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end} className={linkClass}>
              <t.icon className="w-4 h-4" /> {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-5 border-t border-paper-50/10">
          <div className="flex items-center gap-3 px-1 mb-3">
            <div className="w-9 h-9 rounded-full bg-moss-600 flex items-center justify-center font-display font-semibold text-sm">
              {(user?.name || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-paper-200/50 font-mono">Room {user?.roomNumber}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-paper-200/60 hover:text-paper-100 px-1">
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-ink-900 text-paper-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={24} />
          <span className="font-display font-semibold">Aquora</span>
        </div>
        <button onClick={() => setMobileOpen((v) => !v)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed top-[52px] inset-x-0 z-30 bg-ink-900 text-paper-50 px-4 pb-4">
          <nav className="flex flex-col gap-1">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} onClick={() => setMobileOpen(false)} className={linkClass}>
                <t.icon className="w-4 h-4" /> {t.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-left text-paper-200/60 mt-1"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </nav>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
