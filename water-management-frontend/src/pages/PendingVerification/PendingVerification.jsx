import { useState, useEffect, useCallback } from "react";
import {
  Users,
  ImageIcon,
  Check,
  X,
  Loader2,
  MapPin,
  Calendar,
  Mail,
  AlertTriangle,
} from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./PendingVerification.css";

export default function PendingVerification() {
  const { user } = useAuth();
  const [tab, setTab] = useState("members"); // "members" | "reports"

  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [membersRes, reportsRes] = await Promise.all([
        api.get("/members/pending"),
        api.get("/reports/pending", { params: { limit: 50 } }),
      ]);
      setMembers(membersRes.data);
      setReports(reportsRes.data.reports);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load pending items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVerifyMember = async (id) => {
    setActioningId(id);
    try {
      await api.patch(`/members/${id}/verify`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify member.");
    } finally {
      setActioningId(null);
    }
  };

  const handleVerifyReport = async (id) => {
    setActioningId(id);
    try {
      await api.patch(`/reports/${id}/verify`, { action: "verify" });
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify report.");
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectReport = async (id) => {
    setActioningId(id);
    try {
      await api.patch(`/reports/${id}/verify`, {
        action: "reject",
        reason: rejectReason,
      });
      setReports((prev) => prev.filter((r) => r._id !== id));
      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reject report.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="pending-page">
      <h1 className="pending-title">Pending Verification</h1>

      <div className="pending-tabs">
        <button
          className={`pending-tab ${tab === "members" ? "active" : ""}`}
          onClick={() => setTab("members")}
        >
          <Users size={16} />
          Members
          {members.length > 0 && <span className="pending-count">{members.length}</span>}
        </button>
        <button
          className={`pending-tab ${tab === "reports" ? "active" : ""}`}
          onClick={() => setTab("reports")}
        >
          <ImageIcon size={16} />
          Reports
          {reports.length > 0 && <span className="pending-count">{reports.length}</span>}
        </button>
      </div>

      {loading && (
        <div className="pending-state">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading...</span>
        </div>
      )}

      {!loading && error && (
        <div className="pending-state error">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && tab === "members" && (
        <div className="pending-list">
          {members.length === 0 && (
            <div className="pending-empty">No pending members in your room.</div>
          )}
          {members.map((m) => (
            <div key={m._id} className="pending-item glass">
              <div className="pending-item-info">
                <span className="pending-item-name">{m.name}</span>
                <span className="pending-item-meta">
                  <Mail size={12} />
                  {m.email}
                </span>
              </div>
              <button
                className="pending-btn approve"
                onClick={() => handleVerifyMember(m._id)}
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
        <div className="pending-report-grid">
          {reports.length === 0 && (
            <div className="pending-empty">No pending reports in your room.</div>
          )}
          {reports.map((r) => {
            const isOwnUpload = r.uploadedBy?._id === user?._id;
            return (
              <div key={r._id} className="pending-report-card glass">
                {r.imageUrl && (
                  <img src={r.imageUrl} alt="" className="pending-report-img" />
                )}
                <div className="pending-report-body">
                  {r.description && <p>{r.description}</p>}
                  <div className="pending-report-meta">
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
                  <span className="pending-report-uploader">
                    By {r.uploadedBy?.name || "Unknown"}
                  </span>

                  {isOwnUpload ? (
                    <div className="pending-own-notice">
                      You can't verify your own upload
                    </div>
                  ) : rejectingId === r._id ? (
                    <div className="pending-reject-box">
                      <textarea
                        placeholder="Reason for rejecting (optional)"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={2}
                      />
                      <div className="pending-actions">
                        <button
                          className="pending-btn secondary"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="pending-btn reject"
                          onClick={() => handleRejectReport(r._id)}
                          disabled={actioningId === r._id}
                        >
                          {actioningId === r._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            "Confirm Reject"
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pending-actions">
                      <button
                        className="pending-btn reject"
                        onClick={() => setRejectingId(r._id)}
                        disabled={actioningId === r._id}
                      >
                        <X size={15} />
                        Reject
                      </button>
                      <button
                        className="pending-btn approve"
                        onClick={() => handleVerifyReport(r._id)}
                        disabled={actioningId === r._id}
                      >
                        {actioningId === r._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Check size={15} />
                        )}
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}