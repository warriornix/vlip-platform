import React from "react";

type ErrorBoundaryState = { hasError: boolean };

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "#fff", background: "#a64ca6" }}>
          <h2>Something went wrong in Dashboard.</h2>
          <p>Try refreshing or check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
