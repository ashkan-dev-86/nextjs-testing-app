"use client";

// import React, { ReactNode } from "react";
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
    errorMiddleware(error, errorInfo.componentStack as string);
    this.setState({ hasError: true });
    this.props.showToast(error.message, "error");
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// export default function Error({ error }) {
//   const { showToast } = useToast();

//   //  Customize the error message for the toast
//   const errorMessage = error.message || "An unexpected error occurred.";
//   showToast(errorMessage, "error");

//   return (
//     <div>
//       <h1>Something went wrong!</h1>
//       <p>An error occurred. Please try again later.</p>
//     </div>
//   );
// }
