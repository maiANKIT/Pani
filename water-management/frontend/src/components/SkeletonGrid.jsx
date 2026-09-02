import React from "react";

export default function SkeletonGrid({ cols = 3, count }) {
  const n = count ?? (cols === 1 ? 3 : 6);
  return (
    <div className={`grid ${cols === 1 ? "" : "sm:grid-cols-2 lg:grid-cols-3"} gap-4`}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border border-ink-900/10 h-48 animate-pulse" />
      ))}
    </div>
  );
}
