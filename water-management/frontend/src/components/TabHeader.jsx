import React from "react";

export default function TabHeader({ title, subtitle }) {
  return (
    <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-ink-900/55 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
