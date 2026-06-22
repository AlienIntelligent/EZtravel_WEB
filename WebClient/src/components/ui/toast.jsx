/* eslint-disable react-refresh/only-export-components, no-unused-vars, no-undef */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
















const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "info" }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
  {children}
  <ToastViewport toasts={toasts} dismiss={dismiss} />
</ToastContext.Provider>);

}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};






function ToastViewport({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm">
  {toasts.map((t) =>
      <ToastItem key={t.id} toast={t} dismiss={dismiss} />
      )}
</div>);

}

function ToastItem({
  toast,
  dismiss
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      dismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  const variantClasses = {
    info: "bg-slate-900 border-slate-800 text-white dark:bg-slate-50 dark:border-slate-200 dark:text-slate-950",
    success: "bg-green-500 border-green-600 text-white",
    warning: "bg-orange-500 border-orange-600 text-white",
    error: "bg-red-500 border-red-600 text-white",
    destructive: "bg-red-500 border-red-600 text-white"
  };

  return (
    <div
      role={toast.variant === "error" || toast.variant === "destructive" ? "alert" : "status"}
      className={cn(
        "flex justify-between items-start p-4 rounded-lg border shadow-lg transition-all transform duration-300 translate-y-0",
        variantClasses[toast.variant || "info"]
      )}>
      
  <div className="flex-1 mr-2">
    {toast.title && <h5 className="font-semibold text-sm">{toast.title}</h5>}
    {toast.description && <p className="text-xs mt-1 opacity-90">{toast.description}</p>}
  </div>
  <button
        onClick={() => dismiss(toast.id)}
        aria-label="Dong thong bao"
        title="Dong thong bao"
        className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer">
        
    <X className="w-4 h-4" />
  </button>
</div>);

}
