// client/src/components/ErrorBoundary/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };  
  }

  static getDerivedStateFromError(error) {
   
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
   
    console.error("❌ Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>⚠️ Oops! Something went wrong</h1>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <button onClick={() => window.location.href = '/'}>🏠 Go Home</button>
        </div>
      ); 
    }

    return this.props.children;  
  }
}

export default ErrorBoundary;