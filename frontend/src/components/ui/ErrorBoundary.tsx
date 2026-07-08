import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-primary">
          <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-secondary mb-8 max-w-md">
            An unexpected error occurred in the application. Please try refreshing the page.
          </p>
          <div className="bg-surface p-4 rounded-lg border border-border/20 text-left w-full max-w-2xl overflow-auto text-xs text-red-400 font-mono mb-8">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors"
          >
            Refresh Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
