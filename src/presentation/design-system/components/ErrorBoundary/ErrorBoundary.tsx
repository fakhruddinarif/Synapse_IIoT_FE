import type { ReactNode } from "react";
import { Component } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Catches render errors and shows fallback UI. */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border border-default bg-elevated p-6 text-center text-sm text-secondary">
            Something went wrong. Please refresh.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
