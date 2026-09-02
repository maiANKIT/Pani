import React from "react";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-ink-900/10">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Logo size={24} />
          <span className="font-display font-semibold">Aquora</span>
        </div>
        <p className="text-xs text-ink-900/45 font-mono">Room-verified water reporting.</p>
      </div>
    </footer>
  );
}
