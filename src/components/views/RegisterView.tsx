'use client';

import { useState } from 'react';
import {
  UserPlus,
  Eye,
  EyeOff,
  ChevronDown,
  MessageCircle,
  Bell,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  ACCOUNT_TYPES_LIST,
  GOVERNORATES_LIST,
} from '@/data/mockData';

export default function RegisterView() {
  const { register, showView, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [accountType, setAccountType] = useState('مزارع');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !phone.trim() || !password.trim()) {
      showToast('اكمل البيانات المطلوبة');
      return;
    }
    if (password !== confirm) {
      showToast('كلمة المرور غير متطابقة');
      return;
    }

    register({
      name: name.trim(),
      phone: phone.trim(),
      governorate: governorate || 'القاهرة',
      accountType,
      role: accountType,
      location: governorate || 'القاهرة',
    });
  };

  return (
    <div>
      {/* Standalone header */}
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
        <div className="w-full max-w-[520px]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-extrabold text-[20px]">
                C
              </div>
              <span className="font-extrabold text-xl">ContCrops</span>
            </div>
            <h1 className="text-[24px] font-extrabold">إنشاء حساب جديد</h1>
            <p className="text-sm text-gray-500 mt-1">
              انضم لسوق زراعي مجاني ١٠٠٪ من الأرض للتصدير
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  الاسم الكامل
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد محمد الزراعي"
                  className="mt-1.5 w-full h-11 px-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/40 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">رقم الهاتف</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="mt-1.5 w-full h-11 px-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/40 focus:bg-white transition ltr"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">
                    المحافظة
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full h-11 px-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/40 focus:bg-white transition appearance-none cursor-pointer"
                    >
                      <option value="">اختر المحافظة</option>
                      {GOVERNORATES_LIST.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700">
                    نوع الحساب
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full h-11 px-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/40 focus:bg-white transition appearance-none cursor-pointer"
                    >
                      {ACCOUNT_TYPES_LIST.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  نوع الحساب
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ACCOUNT_TYPES_LIST.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAccountType(type)}
                      className={`h-9 px-4 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        accountType === type
                          ? 'bg-[#f0fdf4] text-[#15803d] border-[#16a34a]/20 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">
                  كلمة المرور
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="٨ أحرف على الأقل"
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

              <div>
                <label className="text-xs font-bold text-gray-700">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  className="mt-1.5 w-full h-11 px-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/40 focus:bg-white transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                >
                  <UserPlus size={18} />
                  <span>إنشاء حساب</span>
                </button>
              </div>

              <div className="text-center text-xs text-gray-500 pt-2">
                عندك حساب؟{' '}
                <button
                  type="button"
                  onClick={() => showView('login')}
                  className="font-bold text-[#16a34a] hover:underline cursor-pointer"
                >
                  تسجيل دخول
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[11px] text-gray-400">
                  مجاني ١٠٠٪ بدون عمولة
                </span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
