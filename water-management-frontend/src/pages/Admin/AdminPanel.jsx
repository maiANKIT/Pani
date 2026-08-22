import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Users,
  UserCheck,
  ImageIcon,
  Check,
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";
import api from "../../api/axios";
import "./AdminPanel.css";

const REPORT_FILTERS = ["all", "pending", "verified", "rejected"];

export default function AdminPanel() {
  const [tab, setTab] = useState("users"); // users | pending | reports

  const [users, setUsers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportFilter, setReportFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const fetchUsers = useCallback(async () => {
    const { data } = await api.get("/admin/users");
    setUsers(data);
  }, []);

  const fetchPendingMembers = useCallback(async () => {
    const { data } = await api.get("/admin/pending-members");
    setPendingMembers(data);
  }, []);

  const fetchReports = useCallback(async () => {
    const { data } = await api.get("/admin/reports", {
      params: {
        page,
        limit: 9,
        ...(reportFilter !== "all" && { status: reportFilter }),
      },
    });
    setReports(data.reports);
    setTotalPages(data.totalPages);
  }, [page, reportFilter]);

  const loadTab = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "users") await fetchUsers();
      else if (tab === "pending") await fetchPendingMembers();
      else if (tab === "reports") await fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || "Could not load data.");
    } finally {
      setLoading(false);
    }
  }, [tab, fetchUsers, fetchPendingMembers, fetchReports]);

  useEffect(() => {
    loadTab();
  }, [loadTab]);

  useEffect(() => {
    setPage(1);
  }, [reportFilter]);

  const handleVerify = async (id) => {
    setActioningId(id);
    try {
      await api.patch(`/admin/members/${id}/verify`);
      setPendingMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify.");
    } finally {
      setActioningId(null);
    }
  };

  const handleDeleteReport = async (id) => {
    setActioningId(id);
    try {
      await api.delete(`/admin/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete report.");
    } finally {
      setActioningId(null);
    }
  };

  const groupedByRoom = users.reduce((acc, u) => {
    (acc[u.roomNumber] = acc[u.roomNumber] || []).push(u);
    return acc;
  }, {});

  return (
    <div className="admin-page">
      <h1 className="admin-title">
        <ShieldCheck size={22} />
        Admin Panel
      </h1>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === "users" ? "active" : ""}`}
          onClick={() => setTab("users")}
        >
          <Users size={15} />
          All Users
        </button>
        <button
          className={`admin-tab ${tab === "pending" ? "active" : ""}`}
          onClick={() => setTab("pending")}
        >
          <UserCheck size={15} />
          Pending Members
          {pendingMembers.length > 0 && (
            <span className="admin-count">{pendingMembers.length}</span>
          )}
        </button>
        <button
          className={`admin-tab ${tab === "reports" ? "active" : ""}`}
          onClick={() => setTab("reports")}
        >
          <ImageIcon size={15} />
          Reports
        </button>
      </div>

      {loading && (
        <div className="admin-state">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading...</span>
        </div>
      )}

      {!loading && error && (
        <div className="admin-state error">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && tab === "users" && (
        <div className="admin-room-groups">
          {Object.keys(groupedByRoom).length === 0 && (
            <div className="admin-empty">No users found.</div>
          )}
          {Object.entries(groupedByRoom).map(([room, roomUsers]) => (
            <div key={room} className="admin-room-group glass">
              <h3>Room {room}</h3>
              <div className="admin-user-list">
                {roomUsers.map((u) => (
                  <div key={u._id} className="admin-user-row">
                    <div>
                      <span className="admin-user-name">{u.name}</span>
                      <span className="admin-user-email">{u.email}</span>
                    </div>
                    <span
                      className={`admin-badge ${u.isVerified ? "verified" : "unverified"}`}
                    >
                      {u.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && tab === "pending" && (
        <div className="admin-list">
          {pendingMembers.length === 0 && (
            <div className="admin-empty">No pending members across any room.</div>
          )}
          {pendingMembers.map((m) => (
            <div key={m._id} className="admin-item glass">
              <div>
                <span className="admin-user-name">{m.name}</span>
                <span className="admin-user-email">
                  {m.email} · Room {m.roomNumber}
                </span>
              </div>
              <button
                className="admin-btn approve"
                onClick={() => handleVerify(m._id)}
                disabled={actioningId === m._id}
              >
                {actioningId === m._id ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                Verify
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && tab === "reports" && (
        <>
          <div className="admin-filters">
            {REPORT_FILTERS.map((f) => (
              <button
                key={f}
                className={`admin-filter-chip ${reportFilter === f ? "active" : ""}`}
                onClick={() => setReportFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="admin-report-grid">
            {reports.length === 0 && (
              <div className="admin-empty">No reports found.</div>
            )}
            {reports.map((r) => (
              <div key={r._id} className="admin-report-card glass">
                {r.imageUrl ? (
                  <img src={r.imageUrl} alt="" className="admin-report-img" />
                ) : (
                  <div className="admin-report-img-placeholder">Image removed</div>
                )}
                <div className="admin-report-body">
                  <span className={`admin-badge status-${r.status}`}>{r.status}</span>
                  {r.description && <p>{r.description}</p>}
                  <div className="admin-report-meta">
                    {r.location && (
                      <span>
                        <MapPin size={12} /> {r.location}
                      </span>
                    )}
                    <span>
                      <Calendar size={12} />{" "}
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <span className="admin-report-uploader">
                    Room {r.uploadedBy?.roomNumber} · {r.uploadedBy?.name}
                  </span>
                  <button
                    className="admin-btn delete"
                    onClick={() => handleDeleteReport(r._id)}
                    disabled={actioningId === r._id}
                  >
                    {actioningId === r._id ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                <ChevronLeft size={16} />
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}