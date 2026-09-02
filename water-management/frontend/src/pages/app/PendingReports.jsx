import React, { useCallback, useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import TabHeader from "../../components/TabHeader.jsx";
import ReportCard from "../../components/ReportCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import SkeletonGrid from "../../components/SkeletonGrid.jsx";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";

export default function PendingReports() {
  const { token, user } = useAuth();
  const { notify, notifyError } = useAlert();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/reports/pending?limit=30", { token });
      setReports(data.reports);
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleVerify(id) {
    try {
      await api(`/reports/${id}/verify`, { method: "PATCH", body: { action: "verify" }, token });
      notify("Fill verified — added to the log.");
      load();
    } catch (err) {
      notifyError(err.message);
    }
  }

  async function handleReject(id, reason) {
    try {
      await api(`/reports/${id}/verify`, { method: "PATCH", body: { action: "reject", reason }, token });
      notify("Fill rejected — moved to the Rejected tab.");
      load();
    } catch (err) {
      notifyError(err.message);
    }
  }

  return (
    <div className="fade-in">
      <TabHeader title="Awaiting verification" subtitle="Fills logged by your roommates, waiting to be confirmed." />
      {loading ? (
        <SkeletonGrid />
      ) : reports.length === 0 ? (
        <EmptyState icon={Inbox} title="Nothing waiting on you" subtitle="No pending fills for your room right now." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => (
            <ReportCard
              key={r._id}
              report={r}
              showVerify={r.uploadedBy?._id !== user?._id}
              onVerify={handleVerify}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
