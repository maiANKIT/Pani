import React from "react";

export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-900/15 py-16 flex flex-col items-center text-center px-6">
      <div className="w-12 h-12 rounded-xl bg-ink-900/5 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-ink-900/40" />
      </div>
      <p className="font-display font-semibold mb-1">{title}</p>
      {subtitle && <p className="text-sm text-ink-900/50 max-w-xs">{subtitle}</p>}
    </div>
  );
}
