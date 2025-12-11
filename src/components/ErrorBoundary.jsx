import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Erro capturado pelo ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red" }}>
          <h2> Algo deu errado.</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

