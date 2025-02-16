"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { IToast } from "./models/toast";

interface ToastContextType {
  addToast: (message: Omit<IToast, "id">) => void;
  removeToast: (id: string) => void;
  toasts: IToast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = useCallback((message: Omit<IToast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...message, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((IToast) => IToast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }

  return context;
};
