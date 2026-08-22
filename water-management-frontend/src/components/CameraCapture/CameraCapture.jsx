import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, RotateCcw, Check, SwitchCamera, AlertCircle } from "lucide-react";
import "./CameraCapture.css";

// Renders a live camera feed and lets the user snap a photo. There is
// intentionally NO file-picker fallback here — this component only ever
// produces a photo taken through the device camera at that moment,
// never an existing image from the gallery.
export default function CameraCapture({ onConfirm }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [facingMode, setFacingMode] = useState("environment"); // back camera by default
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null); // { blob, previewUrl }
  const [starting, setStarting] = useState(true);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError("");
    setStarting(true);
    stopStream();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Camera access was denied. Please allow camera permission to continue.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Could not access the camera. " + err.message);
      }
    } finally {
      setStarting(false);
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (!capturedImage) startCamera();
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => stopStream, [stopStream]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        const previewUrl = URL.createObjectURL(blob);
        setCapturedImage({ blob, previewUrl });
        stopStream();
      },
      "image/jpeg",
      0.9
    );
  };

  const handleRetake = () => {
    if (capturedImage?.previewUrl) URL.revokeObjectURL(capturedImage.previewUrl);
    setCapturedImage(null);
  };

  const handleUsePhoto = () => {
    onConfirm(capturedImage.blob);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  if (capturedImage) {
    return (
      <div className="camera-capture">
        <div className="camera-frame">
          <img src={capturedImage.previewUrl} alt="Captured" className="camera-preview-img" />
        </div>
        <div className="camera-controls">
          <button className="camera-btn secondary" onClick={handleRetake}>
            <RotateCcw size={18} />
            Retake
          </button>
          <button className="camera-btn primary" onClick={handleUsePhoto}>
            <Check size={18} />
            Use Photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="camera-capture">
      <div className="camera-frame">
        {error ? (
          <div className="camera-error">
            <AlertCircle size={28} />
            <p>{error}</p>
            <button className="camera-btn secondary" onClick={startCamera}>
              Try Again
            </button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
        )}
        {starting && !error && <div className="camera-loading">Starting camera...</div>}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!error && (
        <div className="camera-controls">
          <button className="camera-btn icon-only" onClick={toggleFacingMode} title="Switch camera">
            <SwitchCamera size={18} />
          </button>
          <button className="camera-btn capture" onClick={handleCapture} disabled={starting}>
            <Camera size={20} />
            Capture
          </button>
        </div>
      )}
    </div>
  );
}