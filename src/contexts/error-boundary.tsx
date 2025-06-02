"use client";

import { createContext, useContext, useCallback, useEffect } from "react";
import { useToast } from "../app/components/toast/toast.hook";

type ErrorContextType = {
  throwError: (error: Error | string) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const { showToast } = useToast(); // Use your existing toast context

  // Function to handle errors and display them in a toast
  const throwError = useCallback(
    (error: Error | string) => {
      let errorMessage = "An unexpected error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      showToast(errorMessage, "error"); // Display error in toast

      console.error(error); // Log the error for debugging
    },
    [showToast]
  );

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      handleError(
        event instanceof Error
          ? event.reason
          : new ErrorEvent(String(event.reason))
      );

      // Prevent the default browser behavior
      event.preventDefault();
    };

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      throwError(new Error(event.message));
      // Prevent the default browser behavior
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleRejection
      );

      window.removeEventListener("error", handleError);
    };
  }, [throwError]);

  return (
    <ErrorContext.Provider value={{ throwError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
