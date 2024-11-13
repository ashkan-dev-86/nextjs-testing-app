'use client';

import React, { Component, ReactNode, ErrorInfo } from "react";
import errorMiddleware from "./error-middleware";
// import { useToast } from "../toast/toast.hook";
import { ToastType } from "../toast/models/toast";

interface IErrorBoundaryProps {
  children: ReactNode;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  // private toast = useToast();

  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.showToast(error.message, "error");
    errorMiddleware(error, errorInfo.componentStack as string);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;