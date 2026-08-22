import { MapPin, User, CheckCircle2, ImageOff, Calendar } from "lucide-react";
import "./ReportCard.css";

export default function ReportCard({ report }) {
  const date = new Date(report.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="report-card glass">
      <div className="report-image-wrap">
        {report.imageDeleted || !report.imageUrl ? (
          <div className="report-image-placeholder">
            <ImageOff size={28} />
            <span>Image auto-removed after 3 days</span>
          </div>
        ) : (
          <img
            src={report.imageUrl}
            alt={report.description || "Water report"}
            className="report-image"
            loading="lazy"
          />
        )}
        <span className="report-status-badge">
          <CheckCircle2 size={13} />
          Verified
        </span>
      </div>

      <div className="report-body">
        {report.description && (
          <p className="report-description">{report.description}</p>
        )}

        <div className="report-meta">
          {report.location && (
            <span className="report-meta-item">
              <MapPin size={13} />
              {report.location}
            </span>
          )}
          <span className="report-meta-item">
            <Calendar size={13} />
            {date}
          </span>
        </div>

        <div className="report-footer">
          <span className="report-meta-item">
            <User size={13} />
            By {report.uploadedBy?.name || "Unknown"}
          </span>
          {report.verifiedBy?.name && (
            <span className="report-verified-by">
              Verified by {report.verifiedBy.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}