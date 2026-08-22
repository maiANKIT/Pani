import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Waves,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ReportCard from "../../components/ReportCard/ReportCard";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.isVerified) {
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/reports", {
          params: { page, limit: 9 },
        });
        setReports(data.reports);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [page, user?.isVerified]);

  if (!user?.isVerified) {
    return (
      <div className="dashboard-page">
        <div className="waiting-card glass">
          <Clock3 size={36} />
          <h2>Waiting for verification</h2>
          <p>
            You're registered under Room {user?.roomNumber}. An existing
            verified member of your room needs to approve you before you can
            view or upload reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            <Waves size={24} />
            Room {user.roomNumber} Dashboard
          </h1>
          <p className="dashboard-subtitle">Verified water reports from your room</p>
        </div>

        <div className="dashboard-actions">
          <Link to="/verify" className="dashboard-action-btn secondary">
            <ClipboardCheck size={16} />
            Pending Verifications
          </Link>
          <Link to="/upload" className="dashboard-action-btn primary">
            <Plus size={16} />
            Report Issue
          </Link>
        </div>
      </div>

      {loading && (
        <div className="dashboard-state">
          <Loader2 size={22} className="animate-spin" />
          <span>Loading reports...</span>
        </div>
      )}

      {!loading && error && (
        <div className="dashboard-state error">
          <AlertTriangle size={22} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="dashboard-state">
          <span>No verified reports yet in your room.</span>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <>
          <div className="dashboard-grid">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="dashboard-pagination">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
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