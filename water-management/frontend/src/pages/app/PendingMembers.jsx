import React, { useCallback, useEffect, useState } from "react";
import { Users, Check } from "lucide-react";
import TabHeader from "../../components/TabHeader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import SkeletonGrid from "../../components/SkeletonGrid.jsx";
import { PrimaryButton } from "../../components/Buttons.jsx";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";

export default function PendingMembers() {
  const { token } = useAuth();
  const { notify, notifyError } = useAlert();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/members/pending", { token });
      setMembers(data);
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
      await api(`/members/${id}/verify`, { method: "PATCH", token });
      notify("Member verified.");
      load();
    } catch (err) {
      notifyError(err.message);
    }
  }

  return (
    <div className="fade-in">
      <TabHeader title="Pending roommates" subtitle="Roommates waiting to be let into the fill rotation." />
      {loading ? (
        <SkeletonGrid cols={1} />
      ) : members.length === 0 ? (
        <EmptyState icon={Users} title="No one waiting" subtitle="Everyone in your room is already verified." />
      ) : (
        <div className="rounded-2xl bg-white border border-ink-900/10 divide-y divide-ink-900/10 overflow-hidden">
          {members.map((m) => (
            <div key={m._id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-clay-100 text-clay-600 flex items-center justify-center font-display font-semibold text-sm shrink-0">
                  {(m.name || "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-xs text-ink-900/45 truncate">{m.email}</p>
                </div>
              </div>
              <PrimaryButton onClick={() => handleVerify(m._id)} className="bg-moss-600 hover:bg-moss-700 shrink-0 !px-4 !py-2">
                <Check className="w-3.5 h-3.5" /> Verify
              </PrimaryButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
