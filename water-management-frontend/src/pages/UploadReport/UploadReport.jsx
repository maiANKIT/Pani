import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, FileText, Send, Loader2, ImagePlus } from "lucide-react";
import api from "../../api/axios";
import CameraCapture from "../../components/CameraCapture/CameraCapture";
import "./UploadReport.css";

export default function UploadReport() {
  const navigate = useNavigate();

  const [photoBlob, setPhotoBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCameraConfirm = (blob) => {
    setPhotoBlob(blob);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhotoBlob(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoBlob) return;

    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("photo", photoBlob, "water-report.jpg");
      formData.append("description", description);
      formData.append("location", location);

      await api.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card glass">
        <div className="upload-header">
          <ImagePlus size={22} />
          <h1>Report a Water Issue</h1>
        </div>
        <p className="upload-subtitle">
          Take a photo directly with your camera — uploading from gallery isn't
          allowed, to keep reports authentic.
        </p>

        {!photoBlob ? (
          <CameraCapture onConfirm={handleCameraConfirm} />
        ) : (
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="upload-preview-frame">
              <img src={previewUrl} alt="Report preview" />
            </div>

            {error && <div className="upload-error">{error}</div>}

            <div className="upload-field">
              <FileText size={18} className="upload-field-icon" />
              <textarea
                placeholder="Describe the issue (e.g. leaking pipe near main gate)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="upload-field">
              <MapPin size={18} className="upload-field-icon" />
              <input
                type="text"
                placeholder="Location (e.g. Block A, near stairs)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="upload-actions">
              <button
                type="button"
                className="camera-btn secondary"
                onClick={handleRetake}
                disabled={submitting}
              >
                Retake Photo
              </button>
              <button type="submit" className="camera-btn primary" disabled={submitting}>
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}