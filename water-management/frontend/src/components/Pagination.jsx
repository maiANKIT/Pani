import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-full border border-ink-900/15 w-9 h-9 flex items-center justify-center disabled:opacity-30 hover:bg-ink-900/5"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-mono text-ink-900/60">
        {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-full border border-ink-900/15 w-9 h-9 flex items-center justify-center disabled:opacity-30 hover:bg-ink-900/5"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
