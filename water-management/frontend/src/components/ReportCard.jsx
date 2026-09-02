import React, { useState } from "react";
import { ImageOff, Check, X, Trash2 } from "lucide-react";
import Gauge from "./Gauge.jsx";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ReportCard({
  report,
  showVerify = false,
  showDelete = false,
  showRoom = false,
  onVerify,
  onReject,
  onDelete,
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="rounded-2xl bg-white border border-ink-900/10 overflow-hidden">
      <div className="h-40 bg-moss-50 flex items-center justify-center overflow-hidden">
        {report.imageDeleted || !report.imageUrl ? (
          <div className="flex flex-col items-center text-ink-900/30 text-xs gap-1.5">
            <ImageOff className="w-6 h-6" />
            Photo expired
          </div>
        ) : (
          <img
            src={report.imageUrl}
            alt={report.location || "Report photo"}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-sm font-medium leading-snug">{report.location || "Bottle fill"}</p>
          <Gauge status={report.status} />
        </div>
        <p className="text-sm text-ink-900/55 leading-relaxed mb-3">
          {report.description || "No note added."}
        </p>
        <div className="flex items-center justify-between text-xs text-ink-900/45 font-mono">
          <span>
            {showRoom ? `Room ${report.roomNumber} · ` : ""}
            {report.uploadedBy?.name ?? "Unknown"}
          </span>
          <span>{formatDate(report.createdAt)}</span>
        </div>

        {report.status === "rejected" && report.rejectionReason && (
          <p className="mt-2 text-xs text-rose-600 bg-rose-100 rounded-lg px-2.5 py-1.5">
            {report.rejectionReason}
          </p>
        )}

        {(showVerify || showDelete) && (
          <div className="mt-4 pt-4 border-t border-ink-900/10">
            {showVerify && !rejecting && (
              <div className="flex gap-2">
                <button
                  onClick={() => onVerify?.(report._id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-moss-600 text-paper-50 px-3 py-2 text-xs font-medium hover:bg-moss-700"
                >
                  <Check className="w-3.5 h-3.5" /> Verify
                </button>
                <button
                  onClick={() => setRejecting(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-ink-900/15 px-3 py-2 text-xs font-medium hover:bg-ink-900/5"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            )}
            {showVerify && rejecting && (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="w-full rounded-lg border border-ink-900/15 px-3 py-1.5 text-xs focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onReject?.(report._id, reason);
                      setRejecting(false);
                      setReason("");
                    }}
                    className="flex-1 rounded-full bg-rose-500 text-paper-50 px-3 py-1.5 text-xs font-medium hover:bg-rose-600"
                  >
                    Confirm reject
                  </button>
                  <button
                    onClick={() => setRejecting(false)}
                    className="rounded-full border border-ink-900/15 px-3 py-1.5 text-xs font-medium hover:bg-ink-900/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {showDelete && !rejecting && (
              <button
                onClick={() => onDelete?.(report._id)}
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-500/30 text-rose-600 px-3 py-2 text-xs font-medium hover:bg-rose-100"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
