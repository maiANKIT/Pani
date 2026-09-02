import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet } from "lucide-react";
import TabHeader from "../../components/TabHeader.jsx";
import CameraCapture from "../../components/CameraCapture.jsx";
import { PrimaryButton } from "../../components/Buttons.jsx";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAlert } from "../../context/AlertContext.jsx";

export default function Upload() {
  const { token } = useAuth();
  const { notify, notifyError } = useAlert();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCapture(capturedFile, previewUrl) {
    setFile(capturedFile);
    setPreview(previewUrl);
  }

  function handleClear() {
    setFile(null);
    setPreview(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      notifyError("Please take a photo first.");
      return;
    }
    const form = new FormData();
    form.append("photo", file);
    form.append("location", location);
    form.append("description", description);

    setLoading(true);
    try {
      await api("/reports", { method: "POST", body: form, isForm: true, token });
      notify("Fill logged — waiting on a roommate to verify.");
      navigate("/app/pending");
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in">
      <TabHeader
        title="Log a fill"
        subtitle="Take a photo the moment the bottle's full — that's your proof it was you."
      />
      <div className="rounded-2xl bg-white border border-ink-900/10 p-6 sm:p-8 max-w-xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <span className="block text-xs font-medium text-ink-900/60 mb-1.5">Photo of the filled bottle</span>
            <CameraCapture capturedPreview={preview} onCapture={handleCapture} onClear={handleClear} />
          </div>

          <label className="block mb-5">
            <span className="block text-xs font-medium text-ink-900/60 mb-1.5">Where'd you fill it? (optional)</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. RO in the mess"
              className="w-full rounded-xl border border-ink-900/15 bg-paper-50 px-4 py-2.5 text-sm focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 transition-shadow"
            />
          </label>

          <label className="block mb-5">
            <span className="block text-xs font-medium text-ink-900/60 mb-1.5">Note (optional)</span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Anything your roommates should know?"
              className="w-full rounded-xl border border-ink-900/15 bg-paper-50 px-4 py-2.5 text-sm focus:border-moss-500 focus:ring-2 focus:ring-moss-500/20 transition-shadow"
            />
          </label>

          <PrimaryButton type="submit" disabled={loading} className="w-full">
            <Droplet className="w-4 h-4" /> {loading ? "Submitting…" : "Submit fill for verification"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
