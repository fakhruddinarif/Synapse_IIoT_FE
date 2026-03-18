/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */

import React, { Component } from "react";
import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console or error reporting service
    console.error("ErrorBoundary caught:", error);
    console.error("Error Info:", errorInfo);
  }

  retry = () => {
    this.setState({ error: null, hasError: false });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.retry) || (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              <h1 className="text-2xl font-bold text-center mt-4 text-red-900 dark:text-red-100">
                Something went wrong
              </h1>

              <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>

              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
                  <code>{this.state.error?.stack}</code>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={this.retry}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (globalThis.location.href = "/")}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Async Error Boundary for API calls
 */
export function useErrorHandler() {
  return (error: Error | null, retry?: () => void) => {
    if (error) {
      // Can be used with form submissions, API calls, etc
      return {
        message: error.message,
        retry,
      };
    }
  };
}
