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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center p-6 text-center"
          dir="rtl"
        >
          <div className="bento-stage p-8 max-w-lg flex flex-col items-center gap-5">
            <div className="w-16 h-16 recessed-box flex items-center justify-center text-red-500">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-cairo font-bold text-ink">
              عذراً، حدث خطأ في النظام
            </h1>
            <p className="text-ink-secondary font-tajawal leading-relaxed text-sm">
              يرجى التحقق من الاتصال بالإنترنت أو إعدادات البيئة. إذا استمرت المشكلة، حاول تحديث الصفحة.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="tactile-pill px-6 py-3 font-cairo font-bold text-glow w-full"
            >
              تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
