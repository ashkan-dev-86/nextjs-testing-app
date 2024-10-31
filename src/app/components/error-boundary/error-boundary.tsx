import React, { Component, ReactNode, ErrorInfo } from "react";
import errorMiddleware from "./error-middleware";
import { useToast } from "../toast/toast.hook";

interface IErrorBoundaryProps {
  children: ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  private toast = useToast();
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorMiddleware(error, errorInfo.componentStack as string);
    this.setState({
      ...this.state,
      error,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.toast.showToast((this.state.error?.message ?? 'Something went wrong'), );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
