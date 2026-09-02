import React, { useId } from "react";

/**
 * Signature element: a droplet whose fill level literally encodes a
 * report's status. Empty = rejected, half = pending, full = verified.
 */
export default function Gauge({ status }) {
  const id = useId();
  const levels = { pending: 50, verified: 100, rejected: 8 };
  const colors = { pending: "#C97B3E", verified: "#3D7A63", rejected: "#B3543F" };
  const labels = { pending: "Pending", verified: "Verified", rejected: "Rejected" };
  const level = levels[status] ?? 50;
  const color = colors[status] ?? "#3D7A63";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/5 pl-1.5 pr-2.5 py-1">
      <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
        <clipPath id={`clip-${id}`}>
          <rect x="0" y={24 - (24 * level) / 100} width="24" height={(24 * level) / 100} />
        </clipPath>
        <path
          d="M12 2C12 2 5 11.5 5 16a7 7 0 0 0 14 0C19 11.5 12 2 12 2Z"
          fill="#00000014"
        />
        <path
          d="M12 2C12 2 5 11.5 5 16a7 7 0 0 0 14 0C19 11.5 12 2 12 2Z"
          fill={color}
          clipPath={`url(#clip-${id})`}
        />
      </svg>
      <span className="font-mono text-[11px] tracking-wide uppercase" style={{ color }}>
        {labels[status] || status}
      </span>
    </span>
  );
}
