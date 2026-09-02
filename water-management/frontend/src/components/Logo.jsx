import React from "react";

export default function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#121A17" />
      <path
        d="M16 6C16 6 8.5 16.2 8.5 20.8C8.5 25.1 11.9 27.5 16 27.5C20.1 27.5 23.5 25.1 23.5 20.8C23.5 16.2 16 6 16 6Z"
        fill="#4F9377"
      />
    </svg>
  );
}
