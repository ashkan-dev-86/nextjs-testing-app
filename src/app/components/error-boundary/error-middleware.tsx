"use client";

import { useEffect } from 'react';
import { useError } from '@/contexts/error-boundary';

// Custom hook for global error boundary
export const useGlobalErrorHandler = () => {
  const { throwError } = useError();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
      // Prevent the default browser behavior
      event.preventDefault();
    };

    // Handle uncaught errors
    const handleError = (event: Error) => {
      setError(event.error || new Error(event.message));
      // Prevent the default browser behavior
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [setError]);
};