"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, X } from "lucide-react";

const NotificationContext = createContext(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }
  return context;
}

function ToastItem({ toast, onClose }) {
  const toneStyles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
    info: "border-slate-200 bg-white text-slate-700",
  };

  const toneIcons = {
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${toneStyles[toast.tone]}`}
    >
      <div className="mt-0.5">{toneIcons[toast.tone]}</div>
      <div className="flex-1 text-sm font-medium">{toast.message}</div>
      <button
        onClick={() => onClose(toast.id)}
        className="rounded-full p-1 transition hover:bg-black/5"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({
    open: false,
    message: "",
    resolve: null,
  });

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, tone = "info", duration = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({ open: true, message, resolve });
    });
  }, []);

  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      addToast(message || "Something happened", "warning", 4000);
      return undefined;
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [addToast]);

  const value = useMemo(
    () => ({
      addToast,
      confirm,
      success: (message, duration) => addToast(message, "success", duration),
      warning: (message, duration) => addToast(message, "warning", duration),
      error: (message, duration) => addToast(message, "error", duration),
    }),
    [addToast, confirm],
  );

  const closeConfirm = (accepted) => {
    if (confirmState.resolve) {
      confirmState.resolve(accepted);
    }
    setConfirmState({ open: false, message: "", resolve: null });
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {confirmState.open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2C2523]/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#F5EFEB] bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2C2523]">
                  Confirmation
                </h3>
                <p className="text-sm text-[#6F625C]">{confirmState.message}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => closeConfirm(false)}
                className="rounded-xl border border-[#E8DFDA] px-4 py-2 text-sm font-semibold text-[#4A3728] transition hover:bg-[#F8F3EF]"
              >
                Cancel
              </button>
              <button
                onClick={() => closeConfirm(true)}
                className="rounded-xl bg-[#E0A996] px-4 py-2 text-sm font-semibold text-[#2C2523] transition hover:bg-[#CF9581]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed right-4 top-4 z-[75] flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
