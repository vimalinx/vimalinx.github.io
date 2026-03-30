import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black px-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500/50 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              An unexpected error occurred. Try refreshing the page.
            </p>
            {this.state.error && (
              <pre className="mb-6 mx-auto max-w-lg overflow-auto rounded-lg bg-white/5 p-4 text-left text-xs text-gray-400">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}