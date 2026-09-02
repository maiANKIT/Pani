import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null); // { type: 'error' | 'success', message }

  const notify = useCallback((message) => setAlert({ type: "success", message }), []);
  const notifyError = useCallback((message) => setAlert({ type: "error", message }), []);
  const clear = useCallback(() => setAlert(null), []);

  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(clear, 3500);
    return () => clearTimeout(t);
  }, [alert, clear]);

  return (
    <AlertContext.Provider value={{ notify, notifyError }}>
      {children}
      {alert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] fade-in">
          <div
            className={`flex items-center gap-2 rounded-full ${
              alert.type === "error" ? "bg-rose-500" : "bg-moss-600"
            } text-paper-50 px-4 py-2 shadow-lg shadow-ink-950/20 text-sm`}
          >
            {alert.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{alert.message}</span>
            <button onClick={clear} className="ml-1 opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
