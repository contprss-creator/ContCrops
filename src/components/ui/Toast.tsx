'use client';

import {
  MessageCircle,
  UserCheck,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Toast() {
  const { toast, dismissToast } = useApp();

  if (!toast) {
    return null;
  }

  // Rich Message Toast
  if (toast.type === 'message') {
    return (
      <div
        id="toast"
        className="fixed bottom-[88px] lg:bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-[440px] bg-gray-900 text-white rounded-2xl shadow-2xl border border-[#16a34a]/30 p-3.5 flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      >
        <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <MessageCircle size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="font-extrabold text-xs text-green-400">
              {toast.title || 'رسالة جديدة'}
            </span>
            <button
              onClick={dismissToast}
              className="text-gray-400 hover:text-white p-1 cursor-pointer transition"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-xs text-gray-200 mt-1 line-clamp-2 leading-5">
            {toast.message}
          </p>

          {toast.onAction && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => {
                  toast.onAction?.();
                  dismissToast();
                }}
                className="h-7 px-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <span>{toast.actionLabel || 'فتح المحادثة'}</span>
                <ArrowLeft size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Rich Request Accepted Toast
  if (toast.type === 'request') {
    return (
      <div
        id="toast"
        className="fixed bottom-[88px] lg:bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-[440px] bg-gray-900 text-white rounded-2xl shadow-2xl border border-green-500/30 p-3.5 flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      >
        <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <UserCheck size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="font-extrabold text-xs text-green-400">
              {toast.title || 'تم قبول الطلب'}
            </span>
            <button
              onClick={dismissToast}
              className="text-gray-400 hover:text-white p-1 cursor-pointer transition"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-xs text-gray-200 mt-1 line-clamp-2 leading-5">
            {toast.message}
          </p>

          {toast.onAction && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => {
                  toast.onAction?.();
                  dismissToast();
                }}
                className="h-7 px-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <span>{toast.actionLabel || 'عرض التفاصيل'}</span>
                <ArrowLeft size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard Pill Toast (Default & Success)
  return (
    <div
      id="toast"
      className="fixed bottom-[88px] lg:bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-gray-900 text-white px-5 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span>{toast.message}</span>
      <button
        onClick={dismissToast}
        className="text-gray-400 hover:text-white mr-1 cursor-pointer"
      >
        <X size={13} />
      </button>
    </div>
  );
}
