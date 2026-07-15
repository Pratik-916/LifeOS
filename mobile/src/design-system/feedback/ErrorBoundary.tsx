import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GlobalErrorScreen } from './GlobalErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

import { logger } from '../../utils/logger';

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in ErrorBoundary', error, { errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return <GlobalErrorScreen error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}
