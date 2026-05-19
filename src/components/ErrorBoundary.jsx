import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#022c22] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
          <div className="bg-[#064e3b] border border-red-500/30 rounded-2xl p-8 max-w-lg shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-cairo font-bold text-white mb-4">عذراً، حدث خطأ في النظام</h1>
            <p className="text-gray-400 font-cairo mb-8 leading-relaxed">
              يرجى التحقق من الاتصال بالإنترنت أو إعدادات قاعدة البيانات. إذا استمرت المشكلة، حاول تحديث الصفحة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#4caf50] hover:bg-[#2e7d32] text-white rounded-xl font-cairo font-bold transition-colors w-full"
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
