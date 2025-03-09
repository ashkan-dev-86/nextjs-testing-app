"use client";

import { createContext, useContext, useCallback } from "react";
import { useToast } from "../app/components/toast/toast.hook";

type ErrorContextType = {
  throwError: (error: Error | null) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const { showToast } = useToast(); // Use your existing toast context

  // Function to handle errors and display them in a toast
  const throwError = useCallback(
    (error: unknown) => {
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
