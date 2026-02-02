import { Component, type ReactNode } from "react";

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
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
          <div className="bg-white border-3 border-ink shadow-brutal-lg rounded p-8 max-w-md text-center">
            <div className="text-4xl mb-4">😵</div>
            <h1 className="font-heading font-bold text-2xl text-ink mb-2">
              Something went wrong
            </h1>
            <p className="text-ink/60 mb-4">
              An unexpected error occurred. Try refreshing the page.
            </p>
            {this.state.error && (
              <pre className="text-xs text-left bg-cream border-2 border-ink/20 rounded p-3 overflow-auto mb-4 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow text-ink border-3 border-ink shadow-brutal rounded px-6 py-3
                font-heading font-bold cursor-pointer transition-all duration-100
                hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
