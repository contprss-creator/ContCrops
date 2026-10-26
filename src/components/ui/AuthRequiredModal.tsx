'use client';

import { Lock, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AuthRequiredModal() {
  const {
    authRequiredModalOpen,
    pendingView,
    closeAuthModal,
    showView,
  } = useApp();

  if (!authRequiredModalOpen) return null;

  return (
    <div
      id="auth-required-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeAuthModal}
      />
      <div className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] border border-green-100 text-[#16a34a] flex items-center justify-center mx-auto mb-4">
          <Lock size={26} />
        </div>

        <h3 className="font-extrabold text-[18px]">سجل دخولك للمتابعة</h3>
        <p className="text-sm text-gray-500 leading-6 mt-2">
          لازم تسجل دخول عشان تشوف الصفحة دي وتستخدم كل مميزات ContCrops مجاناً
        </p>

        {pendingView && (
          <div className="mt-3 text-[11px] px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full inline-block">
            الصفحة المطلوبة: {pendingView}
          </div>
        )}

        <div className="mt-6 space-y-2.5">
          <button
            onClick={() => {
              closeAuthModal();
              showView('login');
            }}
            className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogIn size={18} />
            <span>تسجيل دخول</span>
          </button>

          <button
            onClick={() => {
              closeAuthModal();
              showView('register');
            }}
            className="w-full h-11 bg-white border border-gray-100 rounded-xl font-bold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus size={18} />
            <span>إنشاء حساب مجاناً</span>
          </button>

          <button
            onClick={() => {
              closeAuthModal();
              showView('landing');
            }}
            className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            الصفحة الرئيسية
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 justify-center text-[11px] text-gray-400">
          <ShieldCheck size={12} />
          <span>آمن ومجاني ١٠٠٪ بدون عمولة</span>
        </div>
      </div>
    </div>
  );
}
