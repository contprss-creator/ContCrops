'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for diagnostics
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div
      className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center p-6 text-center"
      dir="rtl"
    >
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
          <AlertCircle className="w-8 h-8" />
        </div>

        {/* Title & Description in Arabic */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          عذراً، حدث خطأ غير متوقع
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          واجه النظام مشكلة تقنية بسيطة أثناء تحميل الصفحة أو معالجة طلبك. يمكنك المحاولة مجدداً أو العودة للصفحة الرئيسية.
        </p>

        {error?.digest && (
          <div
            className="w-full bg-gray-50 rounded-xl p-3 mb-6 text-xs text-gray-500 font-mono text-center"
            suppressHydrationWarning
          >
            رمز الخطأ: {error.digest}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>

          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            الصفحة الرئيسية
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        ContCrops • منصة زراعية متكاملة
      </p>
    </div>
  );
}
