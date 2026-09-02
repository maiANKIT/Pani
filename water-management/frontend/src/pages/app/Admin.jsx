import React, { useCallback, useEffect, useState } from "react";
import { Users, UserCheck, FolderOpen } from "lucide-react";
import TabHeader from "../../components/TabHeader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import SkeletonGrid from "../../components/SkeletonGrid.jsx";
import Pagination from "../../components/Pagination.jsx";
import ReportCard from "../../components/ReportCard.jsx";
import { PrimaryButton } from "../../components/Buttons.jsx";
import Gauge from "../../components/Gauge.jsx";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";

const SUBTABS = [
  { id: "users", label: "All users" },
  { id: "pending-members", label: "Pending members" },
  { id: "reports", label: "All reports" },
];

export default function Admin() {
  const { token } = useAuth();
  const { notify, notifyError } = useAlert();
  const [subtab, setSubtab] = useState("users");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (subtab === "users") {
        setUsers(await api("/admin/users", { token }));
      } else if (subtab === "pending-members") {
        setPendingMembers(await api("/admin/pending-members", { token }));
      } else if (subtab === "reports") {
        const qs = new URLSearchParams({ page, limit: 9 });
        if (statusFilter) qs.set("status", statusFilter);
        const data = await api(`/admin/reports?${qs}`, { token });
        setReports(data.reports);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtab, page, statusFilter, token]);

  useEffect(() => {
    load();
  }, [load]);

  async function verifyMember(id) {
    try {
      await api(`/admin/members/${id}/verify`, { method: "PATCH", token });
      notify("Member verified by admin.");
      load();
    } catch (err) {
      notifyError(err.message);
    }
  }

  async function deleteReport(id) {
    if (!confirm("Delete this report permanently?")) return;
    try {
      await api(`/admin/reports/${id}`, { method: "DELETE", token });
      notify("Report deleted.");
      load();
    } catch (err) {
      notifyError(err.message);
    }
  }

  return (
    <div className="fade-in">
      <TabHeader title="Admin" subtitle="Every room, every fill, one place." />

      <div className="flex gap-1 mb-6 bg-white border border-ink-900/10 rounded-full p-1 w-fit">
        {SUBTABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSubtab(t.id);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              subtab === t.id ? "bg-ink-900 text-paper-50" : "text-ink-900/60 hover:text-ink-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid cols={subtab === "reports" ? 3 : 1} />
      ) : subtab === "users" ? (
        users.length === 0 ? (
          <EmptyState icon={Users} title="No users yet" />
        ) : (
          <div className="rounded-2xl bg-white border border-ink-900/10 divide-y divide-ink-900/10 overflow-hidden">
            {users.map((u) => (
              <div key={u._id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full ${
                      u.isVerified ? "bg-moss-100 text-moss-700" : "bg-clay-100 text-clay-600"
                    } flex items-center justify-center font-display font-semibold text-sm shrink-0`}
                  >
                    {(u.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {u.name}{" "}
                      {u.isAdmin && (
                        <span className="ml-1 text-[10px] font-mono uppercase text-clay-600 bg-clay-100 rounded px-1.5 py-0.5">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-900/45 truncate font-mono">
                      Room {u.roomNumber} · {u.email}
                    </p>
                  </div>
                </div>
                {u.isVerified ? (
                  <Gauge status="verified" />
                ) : (
                  <PrimaryButton
                    onClick={() => verifyMember(u._id)}
                    className="bg-clay-500 hover:bg-clay-600 !px-4 !py-1.5 !text-xs shrink-0"
                  >
                    Verify
                  </PrimaryButton>
                )}
              </div>
            ))}
          </div>
        )
      ) : subtab === "pending-members" ? (
        pendingMembers.length === 0 ? (
          <EmptyState icon={UserCheck} title="Nobody waiting" subtitle="No pending members across any room." />
        ) : (
          <div className="rounded-2xl bg-white border border-ink-900/10 divide-y divide-ink-900/10 overflow-hidden">
            {pendingMembers.map((m) => (
              <div key={m._id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-xs text-ink-900/45 truncate font-mono">
                    Room {m.roomNumber} · {m.email}
                  </p>
                </div>
                <PrimaryButton
                  onClick={() => verifyMember(m._id)}
                  className="bg-clay-500 hover:bg-clay-600 !px-4 !py-1.5 !text-xs shrink-0"
                >
                  Verify
                </PrimaryButton>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          <div className="flex gap-2 mb-5">
            {["", "pending", "verified", "rejected"].map((s) => (
              <button
                key={s || "all"}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium border ${
                  statusFilter === s ? "bg-ink-900 text-paper-50 border-ink-900" : "border-ink-900/15 text-ink-900/60 hover:bg-ink-900/5"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
          {reports.length === 0 ? (
            <EmptyState icon={FolderOpen} title="No reports" subtitle="Nothing matches this filter yet." />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((r) => (
                  <ReportCard key={r._id} report={r} showDelete showRoom onDelete={deleteReport} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </>
      )}
    </div>
  );
}
