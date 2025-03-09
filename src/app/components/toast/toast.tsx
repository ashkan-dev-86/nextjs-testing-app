"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useToastContext } from "@/contexts/toast.context";
import "./toast.scss";

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastContext();
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);
  const [exitingToasts, setExitingToasts] = useState<string[]>([]);

  const toastDismissal = useCallback(
    (toastId: string): void => {
      setExitingToasts((prev) => [...prev, toastId]);

      setTimeout(() => {
        removeToast(toastId);
        setVisibleToasts((prev) => prev.filter((id) => id !== toastId));
        setExitingToasts((prev) => prev.filter((id) => id !== toastId));
      }, 350);
    },
    [removeToast]
  );

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!visibleToasts.includes(toast.id)) {
        setVisibleToasts((prev) => [...prev, toast.id]);

        const timer = setTimeout(
          () => toastDismissal(toast.id),
          toast.duration || 5000
        );
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, visibleToasts, toastDismissal]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${
            exitingToasts.includes(toast.id) ? "exiting" : "visible"
          } ${visibleToasts.includes(toast.id) ? "visible" : "exiting"} ${
            toast.type
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
