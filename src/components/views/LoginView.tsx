'use client';

import { useState } from 'react';
import {
  LogIn,
  Eye,
  EyeOff,
  ShieldCheck,
  MessageCircle,
  Bell,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginView() {
  const { login, showView, showToast } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      showToast('اكمل البيانات');
      return;
    }
    login(identifier, password);
  };

  return (
    <div>
      {/* Standalone minimal header */}
      <div
        className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 px-4 h-[64px] flex items-center justify-between"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <button
          onClick={() => showView('landing')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-extrabold">
            C
          </div>
          <span className="font-extrabold">ContCrops</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => showView('messages')}
            className="relative w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center cursor-pointer"
          >
            <MessageCircle size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button
            onClick={() => showView('notifications')}
            className="relative w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center cursor-pointer"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
              5
            </span>
          </button>
          <button
            onClick={() => showView('profile')}
            className="w-9 h-9 rounded-full bg-white border-2 border-[#16a34a]/20 flex items-center justify-center cursor-pointer"
          >
            <User size={16} />
          </button>
        </div>
      </div>

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 lg:p-8 bg-[#f9fafb]">
        <div className="w-full max-w-[440px]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-extrabold text-[20px]">
                C
              </div>
              <span className="font-extrabold text-xl">ContCrops</span>
            </div>
            <h1 className="text-[24px] font-extrabold">تسجيل دخول</h1>
            <p className="text-sm text-gray-500 mt-1">
              مرحباً بعودتك لسوق ContCrops
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  رقم الهاتف / البريد الإلكتروني
                </label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="01xxxxxxxxx أو example@mail.com"
                  className="mt-1.5 w-full h-11 px-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/40 focus:bg-white transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('سيتم إرسال رابط الاستعادة')}
                    className="text-[11px] text-[#16a34a] font-bold hover:underline cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="كلمة المرور"
                    className="w-full h-11 px-4 pl-11 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/40 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-200 text-[#16a34a] focus:ring-[#16a34a]/20"
                  />
                  <span className="text-xs font-bold text-gray-600">تذكرني</span>
                </label>

                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>آمن ومشفر</span>
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
              >
                <LogIn size={18} />
                <span>تسجيل دخول</span>
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gray-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[11px] text-gray-400">
                    أو تابع بـ
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => showToast('تسجيل Google قريباً')}
                  className="h-11 bg-white border border-gray-100 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-[10px] font-extrabold">
                    G
                  </span>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('تسجيل Facebook قريباً')}
                  className="h-11 bg-white border border-gray-100 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-extrabold">
                    f
                  </span>
                  <span>Facebook</span>
                </button>
              </div>

              <div className="text-center text-xs text-gray-500 pt-2">
                معندكش حساب؟{' '}
                <button
                  type="button"
                  onClick={() => showView('register')}
                  className="font-bold text-[#16a34a] hover:underline cursor-pointer"
                >
                  إنشاء حساب
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
