import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              An unexpected error occurred in the application. You can try reloading the page or returning home.
            </p>
            {this.state.error && (
              <div className="mt-4 overflow-x-auto rounded-md bg-slate-100 p-3 text-xs font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                {this.state.error.message || this.state.error.toString()}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Go Home
              </button>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:bg-red-500 dark:hover:bg-red-600 cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
