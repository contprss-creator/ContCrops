import { Loader2, Sprout } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      {/* Glow effect */}
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-4 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
        
        {/* Animated Brand Icon */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-600/25 mb-6 text-white">
          <Sprout className="w-10 h-10 animate-bounce" />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow">
            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
          </div>
        </div>

        {/* Brand name and Arabic text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ContCrops
        </h2>
        <p className="text-gray-500 text-sm font-medium mb-6">
          جاري تحميل السوق الزراعي المجاني...
        </p>

        {/* Pulse Bar indicator */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse w-3/4" />
        </div>

        <p className="text-xs text-gray-400 mt-4">
          من الأرض للمصنع للتصدير
        </p>
      </div>
    </div>
  );
}
