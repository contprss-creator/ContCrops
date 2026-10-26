'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Store,
  Users,
  Zap,
  FileText,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';
import { CATEGORIES_LIST } from '@/data/mockData';

export default function LandingView() {
  const {
    showView,
    ads,
    isLoggedIn,
    setNewAdModalOpen,
    setSelectedCategory,
    openFellowProfile,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Right Hero / Main pitch */}
        <div className="flex-1 bg-[#f0fdf4] p-8 lg:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-white border border-green-100 rounded-full px-4 py-1.5 w-fit mb-6">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-800">
              منصة مجانية ١٠٠٪ لكل القطاع الزراعي
            </span>
          </div>

          <h1 className="text-4xl lg:text-[54px] leading-[1.1] font-extrabold tracking-tight">
            <span className="text-gray-900">سوق زراعي</span>
            <br />
            <span className="text-[#16a34a]">من الأرض للمصنع</span>
            <br />
            <span className="text-gray-900">للتصدير</span>
          </h1>

          <p className="mt-6 text-[17px] leading-8 text-gray-600 max-w-[520px]">
            ContCrops هو أول سوق C2C مجاني يغطي السلسلة كاملة: فريش، مجمد، مجفف، تصنيع غذائي، استشارات، ونقل مبرد. انشر إعلانك وتواصل مباشر بدون عمولة.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/market"
              onClick={(e) => {
                e.preventDefault();
                showView('market');
              }}
              className="h-12 px-7 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full font-bold text-[15px] flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Store size={18} />
              <span>دخول السوق مجاناً</span>
              <ArrowLeft size={18} />
            </Link>

            <Link
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                showView('services');
              }}
              className="h-12 px-7 bg-white border border-gray-200 rounded-full font-bold text-[15px] flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer"
            >
              <Users size={18} />
              <span>استكشف الخدمات</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-[420px]">
            <Link
              href="/market"
              onClick={(e) => {
                e.preventDefault();
                showView('market');
              }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-right hover:border-green-200 transition cursor-pointer"
            >
              <div className="font-extrabold text-xl text-gray-900">١٢٠٠+</div>
              <div className="text-xs text-gray-500 mt-1">إعلان نشط</div>
            </Link>
            <Link
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                showView('services');
              }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-right hover:border-green-200 transition cursor-pointer"
            >
              <div className="font-extrabold text-xl text-gray-900">٦ قطاعات</div>
              <div className="text-xs text-gray-500 mt-1">من الفريش للاستشارة</div>
            </Link>
            <Link
              href="/prices"
              onClick={(e) => {
                e.preventDefault();
                showView('prices');
              }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-right hover:border-green-200 transition cursor-pointer"
            >
              <div className="font-extrabold text-xl text-gray-900">صفر عمولة</div>
              <div className="text-xs text-gray-500 mt-1">أسعار فورية</div>
            </Link>
          </div>
        </div>

        {/* Left Side Highlights */}
        <div className="flex-1 bg-white p-6 lg:p-10 flex flex-col gap-4">
          {/* Live Ads Preview Card */}
          <div className="rounded-2xl bg-[#f9fafb] border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold">إعلانات حية الآن</span>
              <Link
                href="/market"
                onClick={(e) => {
                  e.preventDefault();
                  showView('market');
                }}
                className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-bold hover:bg-green-100 transition cursor-pointer"
              >
                تصفح كل الإعلانات ←
              </Link>
            </div>
            <div className="space-y-3">
              {ads.slice(0, 3).map((ad) => (
                <div
                  key={ad.id}
                  onClick={() => showView('market')}
                  className="bg-white rounded-2xl p-3 border border-gray-100 flex gap-3 hover:border-green-200 transition cursor-pointer group"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFellowProfile(ad.userName);
                    }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center font-bold text-green-800 shrink-0 hover:opacity-80 transition cursor-pointer"
                  >
                    {ad.userInitial}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm truncate group-hover:text-green-700 transition">
                      {ad.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {ad.location} • {ad.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2 Feature blocks */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  showView('login');
                } else {
                  setNewAdModalOpen(true);
                }
              }}
              className="rounded-2xl bg-[#16a34a] text-white p-5 text-right hover:bg-[#15803d] transition cursor-pointer"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Zap size={18} />
              </div>
              <div className="font-bold">انشر في ٣٠ ثانية</div>
              <div className="text-sm text-white/80 mt-1 leading-6">
                بدون تسجيل معقد، اكتب إعلانك ويظهر فوراً
              </div>
            </button>

            <button
              onClick={() => showView('docs')}
              className="rounded-2xl bg-gray-900 text-white p-5 text-right hover:bg-black transition cursor-pointer"
            >
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                <FileText size={18} />
              </div>
              <div className="font-bold">عقود جاهزة</div>
              <div className="text-sm text-white/60 mt-1 leading-6">
                إيصالات وعقود بيع وإيجار بضغطة زر
              </div>
            </button>
          </div>

          {/* Sectors coverage */}
          <div className="rounded-2xl border border-gray-100 p-5 bg-white">
            <div className="font-bold mb-3 flex items-center justify-between">
              <span>يغطي كل السلسلة</span>
              <span className="text-xs text-gray-400">اضغط للفلترة السريعة</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_LIST.slice(1).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    showView('market');
                  }}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-green-50 hover:text-green-700 hover:border-green-200 border border-gray-100 rounded-full text-xs font-medium transition cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
