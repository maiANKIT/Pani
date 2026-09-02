import React from "react";
import { Droplets } from "lucide-react";
import Navbar from "./Navbar.jsx";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-paper-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white border border-ink-900/10 shadow-xl shadow-ink-950/5 p-8 sm:p-10">
            <div className="w-11 h-11 rounded-xl bg-ink-900 flex items-center justify-center mb-5">
              <Droplets className="w-5 h-5 text-moss-300" />
            </div>
            <h1 className="font-display text-2xl font-semibold mb-1.5">{title}</h1>
            <p className="text-sm text-ink-900/55 mb-7">{subtitle}</p>
            {children}
          </div>
          {footer && <p className="text-center text-sm text-ink-900/55 mt-6">{footer}</p>}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-ink-900/60 mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-ink-900/15 bg-paper-50 px-4 py-2.5 text-sm focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 transition-shadow"
      />
    </label>
  );
}
