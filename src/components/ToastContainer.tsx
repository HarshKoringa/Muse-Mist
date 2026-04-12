"use client";

import { useToast } from "@/lib/toast-context";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
            backdrop-blur-sm pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300
            ${
              toast.type === "success"
                ? "bg-green-50 text-green-900 border border-green-200"
                : toast.type === "error"
                  ? "bg-red-50 text-red-900 border border-red-200"
                  : "bg-blue-50 text-blue-900 border border-blue-200"
            }
          `}
        >
          {toast.type === "success" && (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {toast.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}

          <span className="text-sm font-medium">{toast.message}</span>

          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
