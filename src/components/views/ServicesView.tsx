'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Store,
  Star,
  MapPin,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';
import { SERVICES_CATEGORIES } from '@/data/mockData';

export default function ServicesView() {
  const {
    ads,
    fellows,
    openFellowProfile,
    toggleFellowship,
    fellowshipStatus,
    showView,
    setSelectedCategory,
    showToast,
  } = useApp();

  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sectorSubTab, setSectorSubTab] = useState<'colleagues' | 'ads'>('colleagues');

  const sectorAds = selectedSector
    ? ads.filter((ad) => ad.category === selectedSector)
    : [];

  return (
    <div>
      <Header />
      <div className="max-w-[1280px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        {!selectedSector ? (
          <>
            <div className="mb-6">
              <h1 className="text-[28px] font-extrabold">الخدمات</h1>
              <p className="text-sm text-gray-500 mt-1">
                اختر قطاع وشوف الزملاء والإعلانات المتخصصة - كله مجاني
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedSector(cat.id)}
                    className="text-right bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-green-100 transition group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.color}`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-xs bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                        {cat.count}
                      </span>
                    </div>

                    <div className="mt-4 font-extrabold text-[16px] group-hover:text-[#16a34a] transition">
                      {cat.label}
                    </div>
                    <div className="text-[13px] text-gray-500 leading-6 mt-1">
                      {cat.desc}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-bold text-[#16a34a]">
                      <span>استكشاف</span>
                      <ArrowLeft size={16} />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => setSelectedSector(null)}
              className="mb-4 h-9 px-4 bg-white border border-gray-100 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <ArrowRight size={16} />
              <span>رجوع للخدمات</span>
            </button>

            {/* Sector Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
                  <Store size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-lg">{selectedSector}</div>
                  <div className="text-xs text-gray-500">
                    {sectorAds.length} إعلان نشط • {fellows.length} زميل متخصص
                  </div>
                </div>
              </div>

              <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100">
                <button
                  onClick={() => setSectorSubTab('colleagues')}
                  className={`h-8 px-5 rounded-full text-sm font-bold transition cursor-pointer ${
                    sectorSubTab === 'colleagues'
                      ? 'bg-white shadow-sm border border-gray-100 text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  الزملاء
                </button>
                <button
                  onClick={() => setSectorSubTab('ads')}
                  className={`h-8 px-5 rounded-full text-sm font-bold transition cursor-pointer ${
                    sectorSubTab === 'ads'
                      ? 'bg-white shadow-sm border border-gray-100 text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  الإعلانات
                </button>
              </div>
            </div>

            {/* Colleagues or Ads */}
            {sectorSubTab === 'colleagues' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {fellows.map((fellow) => {
                  const isFellow = fellowshipStatus[fellow.id] === 'fellow';
                  const isSent = fellowshipStatus[fellow.id] === 'sent';

                  return (
                    <div
                      key={fellow.id}
                      onClick={() => openFellowProfile(fellow.id)}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-green-100 cursor-pointer transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#f0fdf4] border border-green-100 flex items-center justify-center font-bold text-green-800">
                          {fellow.initial}
                        </div>
                        <div>
                          <div className="font-bold text-sm group-hover:text-[#16a34a] transition">
                            {fellow.name}
                          </div>
                          <div className="text-xs text-gray-500">{fellow.spec}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100">
                          <Star size={12} fill="currentColor" />
                          <span>{fellow.stars}</span>
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <MapPin size={12} />
                          <span>{fellow.loc}</span>
                        </span>
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        {fellow.jobs} مهمة مكتملة
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFellowship(fellow.id, fellow.name);
                          }}
                          className={`flex-1 h-8 rounded-full text-xs font-bold border transition cursor-pointer ${
                            isFellow
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : isSent
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          {isFellow ? '✓ زميل' : isSent ? 'مرسل...' : '+ زميل'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`تواصل مع ${fellow.name}`);
                            showView('messages');
                          }}
                          className="flex-1 h-8 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-black transition cursor-pointer"
                        >
                          تواصل
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {sectorAds.length ? (
                  sectorAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
                    >
                      <div className="font-bold text-sm">{ad.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {ad.location} • {ad.price}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory(ad.category);
                          showView('market');
                        }}
                        className="mt-3 h-8 px-4 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 cursor-pointer"
                      >
                        شوف في السوق
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
                    لا يوجد إعلانات في هذا القطاع حالياً، كن أول من ينشر
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
