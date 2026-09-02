import React, { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, AlertTriangle, Upload as UploadIcon } from "lucide-react";

/**
 * Live camera capture — opens the device camera in-page and captures a
 * still frame (no gallery/file picker). Falls back to the OS camera app
 * via a `capture` file input if getUserMedia isn't available or is denied.
 */
export default function CameraCapture({ capturedPreview, onCapture, onClear }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [facingMode, setFacingMode] = useState("environment");
  const [status, setStatus] = useState("idle"); // idle | starting | live | error
  const [errorMsg, setErrorMsg] = useState("");
  const [flashKey, setFlashKey] = useState(0); 

  useEffect(() => {
    let isMounted = true;
    let currentStream = null;

    async function startCamera() {
      // Clean up previous stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      setStatus("starting");
      setErrorMsg("");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });

        // If component unmounted or camera switched while waiting for user permission
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        currentStream = stream;
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // autoPlay handles playback, but a fallback play() handles edge cases
          videoRef.current.play().catch(() => {});
        }
        
        setStatus("live");
      } catch (err) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMsg(err.message || "Camera access was denied.");
      }
    }

    if (!capturedPreview) {
      startCamera();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [facingMode, capturedPreview]);

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setFlashKey((k) => k + 1);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    
    // Flip the image horizontally if taking a selfie so it mirrors correctly
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `report-${Date.now()}.jpg`, { type: "image/jpeg" });
        const previewUrl = URL.createObjectURL(blob);
        
        // Stop the camera explicitly right after capture
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        
        onCapture(file, previewUrl);
      },
      "image/jpeg",
      0.9
    );
  }

  function retake() {
    onClear();
  }

  function flip() {
    setFacingMode((m) => (m === "environment" ? "user" : "environment"));
  }

  function handleFallbackFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    onCapture(f, URL.createObjectURL(f));
  }

  if (capturedPreview) {
    return (
      <div>
        <div className="relative rounded-xl overflow-hidden border border-ink-900/15 bg-ink-900/5 aspect-[4/3] pop-in">
          <img src={capturedPreview} alt="Captured report" className="w-full h-full object-cover" />
        </div>
        <button
          type="button"
          onClick={retake}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium hover:bg-ink-900/5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retake photo
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden border border-ink-900/15 bg-black aspect-[4/3] flex items-center justify-center">
        {status === "error" ? (
          <div className="flex flex-col items-center gap-3 text-center px-6 py-8">
            <AlertTriangle className="w-6 h-6 text-clay-400" />
            <p className="text-sm text-paper-200/80">Couldn&apos;t access your camera. {errorMsg}</p>
            <label className="inline-flex items-center gap-1.5 rounded-full bg-moss-600 text-white px-4 py-2 text-xs font-medium hover:bg-moss-700 cursor-pointer">
              <UploadIcon className="w-3.5 h-3.5" /> Open device camera
              <input
                type="file"
                accept="image/*"
                capture="environment"
                required
                className="hidden"
                onChange={handleFallbackFile}
              />
            </label>
          </div>
        ) : (
          <>
            {/* Added autoPlay - crucial for iOS Safari to work properly */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
            />
            
            {status === "starting" && (
              <span className="absolute text-white/70 text-sm">Starting camera…</span>
            )}
            
            {status === "live" && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
              </span>
            )}
            
            <button
              type="button"
              onClick={flip}
              title="Switch camera"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            {flashKey > 0 && (
              <div key={flashKey} className="absolute inset-0 bg-white pointer-events-none animate-flash" />
            )}
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <button
        type="button"
        onClick={capture}
        disabled={status !== "live"}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
      >
        <Camera className="w-4 h-4" /> Take photo
      </button>
    </div>
  );
}