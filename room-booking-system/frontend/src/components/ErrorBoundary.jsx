import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./ui/Button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-8 text-center">

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="bg-red-500/10 p-4 rounded-full">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-white mb-2">
              Something went wrong
            </h1>

            {/* Message */}
            <p className="text-zinc-400 mb-6">
              An unexpected error occurred. Try refreshing the page.
            </p>

            {/* Dev Error (development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 mb-6 text-left">
                <p className="text-xs text-red-400 font-mono break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw size={16} />
              Refresh Page
            </Button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;