import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import TabHeader from "../../components/TabHeader.jsx";
import ReportCard from "../../components/ReportCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import SkeletonGrid from "../../components/SkeletonGrid.jsx";
import Pagination from "../../components/Pagination.jsx";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";

export default function Rejected() {
  const { token } = useAuth();
  const { notifyError } = useAlert();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await api(`/reports/rejected?page=${page}&limit=9`, { token });
        if (!cancelled) {
          setReports(data.reports);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (!cancelled) notifyError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, token]);

  return (
    <div className="fade-in">
      <TabHeader title="Rejected" subtitle="Fills your room didn't confirm, and why." />
      {loading ? (
        <SkeletonGrid />
      ) : reports.length === 0 ? (
        <EmptyState icon={XCircle} title="Nothing rejected" subtitle="Rejected fills for your room will show up here." />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r) => (
              <ReportCard key={r._id} report={r} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
