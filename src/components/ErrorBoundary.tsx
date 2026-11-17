import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Unexpected error occurred' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
          <div className="max-w-lg w-full rounded-2xl border border-sky-200 dark:border-slate-800 bg-sky-50/50 dark:bg-slate-900 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              حدث خطأ غير متوقع / Unexpected Error
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 break-words">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
            >
              إعادة تحميل الصفحة / Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
