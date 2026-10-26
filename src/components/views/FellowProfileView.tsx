'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Star,
  MapPin,
  UserPlus,
  MessageCircle,
  Phone,
  Package,
  Users,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';
import VerificationBadge, { isQualifiedForVerification } from '@/components/ui/VerificationBadge';

export default function FellowProfileView() {
  const {
    selectedFellow,
    previousView,
    showView,
    ads,
    ratings,
    openRatingModal,
    fellowshipStatus,
    toggleFellowship,
    showToast,
  } = useApp();

  const [subTab, setSubTab] = useState<'ads' | 'experience' | 'reviews'>('ads');

  const fellow = selectedFellow || {
    id: 'f1',
    name: 'أحمد منصور',
    spec: 'خبير جودة فريش',
    stars: 4.9,
    loc: 'المنصورة',
    initial: 'أ',
    jobs: 128,
    role: 'مهندس جودة',
    followers: 342,
    adsCount: 24,
    exp: '٨ سنوات خبرة',
    bio: 'مهندس زراعي متخصص في جودة الخضار الفريش للتصدير. اشتغلت مع ٣٠ مزرعة في الدلتا والنوبارية. بساعد المزارعين يوصلوا لمواصفات الاتحاد الأوروبي.',
    skills: ['فرز وتصنيف', 'تحليل متبقيات', 'شهادات GlobalGAP'],
    reviews: [],
    phone: '01012345678',
  };

  const fellowId = fellow.id;
  const isFellow = fellowshipStatus[fellowId] === 'fellow';
  const isSent = fellowshipStatus[fellowId] === 'sent';

  const fellowAds = ads.filter(
    (a) =>
      a.userName === fellow.name ||
      a.userName.includes(fellow.name.split(' ')[0] || '')
  );

  const dynamicReviews = ratings.filter((r) => r.fellowId === fellowId);
  const totalReviewsCount = dynamicReviews.length + (fellow.reviews?.length || 0);

  const dynAvg = dynamicReviews.length
    ? dynamicReviews.reduce((sum, r) => sum + r.stars, 0) / dynamicReviews.length
    : 0;
  const staticAvg = fellow.reviews?.length
    ? fellow.reviews.reduce((sum, r) => sum + r.stars, 0) / fellow.reviews.length
    : 0;

  const combinedAvg =
    dynamicReviews.length && fellow.reviews?.length
      ? ((dynAvg + staticAvg) / 2).toFixed(1)
      : dynAvg
      ? dynAvg.toFixed(1)
      : staticAvg
      ? staticAvg.toFixed(1)
      : fellow.stars?.toFixed(1) || '4.8';

  const isVerifiedPartner = isQualifiedForVerification({
    role: fellow.role,
    spec: fellow.spec,
    stars: parseFloat(combinedAvg),
    isVerified: fellow.isVerified ?? true,
  });

  return (
    <div id="view-fellow">
      <Header />
      <div className="max-w-[1000px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        <button
          onClick={() => showView(previousView || 'market')}
          className="mb-4 h-9 px-4 bg-white border border-gray-100 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm cursor-pointer"
        >
          <ArrowRight size={16} />
          <span>رجوع</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Official Verification Account Status Banner */}
          <div
            className={`px-6 py-2.5 text-xs font-black flex items-center justify-between border-b ${
              isVerifiedPartner
                ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white border-emerald-700 shadow-2xs'
                : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isVerifiedPartner ? (
                <>
                  <ShieldCheck size={17} strokeWidth={2.5} className="text-emerald-200" />
                  <span className="font-extrabold tracking-wide">
                    حالة الحساب: حساب موثق بالوثائق الرسمية ✓ (Verified Account)
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>حالة الحساب: قيد المراجعة والتوثيق</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold">
                {isVerifiedPartner ? 'موثق في شبكة ContCrops' : 'حساب غير معتمد'}
              </span>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div
                  id="fellow-profile-avatar"
                  className="w-28 h-28 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 border border-green-100 shadow-sm flex items-center justify-center text-3xl font-extrabold text-[#15803d] mx-auto"
                >
                  {fellow.initial || 'أ'}
                </div>
                {/* Verification Badge Over Avatar */}
                {isVerifiedPartner && (
                  <div
                    className="absolute -top-2 -left-2 w-8 h-8 bg-emerald-600 text-white rounded-2xl border-2 border-white flex items-center justify-center shadow-md cursor-pointer"
                    title="شارة الموثوقية - حساب موثق بالوثائق الرسمية"
                  >
                    <ShieldCheck size={18} strokeWidth={2.5} />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h1
                    id="fellow-profile-name"
                    className="text-[22px] font-extrabold flex items-center gap-2"
                  >
                    <span>{fellow.name}</span>
                  </h1>
                  <VerificationBadge
                    role={fellow.role}
                    spec={fellow.spec}
                    stars={parseFloat(combinedAvg)}
                    isVerified={fellow.isVerified ?? true}
                    size="md"
                    showDetails
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <span
                    id="fellow-profile-role"
                    className="px-3 py-1 bg-[#f0fdf4] text-[#15803d] border border-green-100 rounded-full text-xs font-bold"
                  >
                    {fellow.role || 'عضو'} • {fellow.spec || 'متخصص'}
                  </span>
                  <span
                    id="fellow-profile-location"
                    className="flex items-center gap-1 text-xs text-gray-500"
                  >
                    <MapPin size={12} />
                    <span>{fellow.loc || 'مصر'}</span>
                  </span>
                  {isVerifiedPartner && (
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-[#16a34a]" />
                      <span>حساب موثق رسمي</span>
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                  <span
                    onClick={() => openRatingModal(fellowId)}
                    className="inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200/80 px-3 py-1 rounded-full font-bold cursor-pointer hover:bg-yellow-100 transition shadow-2xs"
                    title="اضغط لتقييم"
                    data-rating-trigger="true"
                  >
                    <span className="text-amber-500">★</span>
                    <span>
                      {combinedAvg} ({totalReviewsCount || 24} تقييم)
                    </span>
                  </span>
                  {isVerifiedPartner && (
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck size={12} className="text-[#16a34a]" />
                      <span>موثق ومعتمد رسمياً</span>
                    </span>
                  )}
                </div>

                {/* Hero Verification Badge with Official Audited Documents */}
                {isVerifiedPartner && (
                  <div className="mt-5 w-full max-w-xl mx-auto">
                    <VerificationBadge
                      role={fellow.role}
                      spec={fellow.spec}
                      accountType={fellow.accountType}
                      stars={parseFloat(combinedAvg)}
                      isVerified={fellow.isVerified ?? true}
                      verificationStatus={fellow.verificationStatus || 'verified'}
                      verifiedDocuments={fellow.verifiedDocuments}
                      verificationId={fellow.verificationId}
                      verifiedAt={fellow.verifiedAt || '٢٠٢٣/١١/٢٠'}
                      size="hero"
                      showDetails
                    />
                  </div>
                )}

                <div
                  id="fellow-profile-bio"
                  className="mt-3 text-sm text-gray-600 leading-6 max-w-[520px] mx-auto"
                >
                  {fellow.bio || 'عضو نشط في ContCrops'}
                </div>
                <div id="fellow-profile-specialty" className="hidden">
                  {fellow.spec}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  {(fellow.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => toggleFellowship(fellowId, fellow.name)}
                  className={`h-10 px-5 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-sm cursor-pointer ${
                    isFellow
                      ? 'bg-[#f0fdf4] text-[#15803d] border border-green-100'
                      : 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                  }`}
                >
                  <UserPlus size={16} />
                  <span>
                    {isFellow ? 'زميلك' : isSent ? 'تم الإرسال' : 'إضافة زميل'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    showToast(`رسالة لـ ${fellow.name}`);
                    showView('messages');
                  }}
                  className="h-10 px-5 bg-white border border-gray-100 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>رسالة</span>
                </button>

                <button
                  onClick={() => openRatingModal(fellowId)}
                  className="h-10 px-4 py-2 bg-white border border-yellow-200 text-yellow-700 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-yellow-50 transition shadow-sm cursor-pointer"
                >
                  <span>تقييم الزميل</span>
                  <span className="text-[14px]">⭐</span>
                </button>

                <button
                  onClick={() => showToast(`اتصال بـ ${fellow.phone}`)}
                  className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  <Phone size={16} />
                </button>
              </div>
            </div>

            {/* 3 Stats */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { k: fellow.adsCount?.toString() || '٨', v: 'إعلان', icon: Package },
                { k: fellow.followers?.toString() || '١٢٠', v: 'متابع', icon: Users },
                { k: combinedAvg, v: 'تقييم', icon: Star },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.v}
                    className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#16a34a]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-lg leading-none">{s.k}</div>
                      <div className="text-[11px] text-gray-500 mt-1">{s.v}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {[
                { id: 'ads' as const, label: 'إعلاناته' },
                { id: 'experience' as const, label: 'الخبرة' },
                { id: 'reviews' as const, label: 'التقييمات' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSubTab(t.id)}
                  className={`h-9 px-5 rounded-full text-sm font-bold border whitespace-nowrap transition cursor-pointer ${
                    subTab === t.id
                      ? 'bg-[#16a34a] text-white border-[#16a34a] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="mt-6">
              {subTab === 'ads' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fellowAds.slice(0, 4).map((ad) => (
                    <div
                      key={ad.id}
                      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-3"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#f0fdf4] border border-green-50 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{ad.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {ad.location} • {ad.price}
                        </div>
                      </div>
                    </div>
                  ))}

                  {fellowAds.length === 0 && (
                    <div className="col-span-full bg-[#f9fafb] border border-dashed border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
                      لا يوجد إعلانات منشورة حالياً لهذا الزميل
                    </div>
                  )}
                </div>
              )}

              {subTab === 'experience' && (
                <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-5">
                  <div className="font-bold text-sm mb-2">الخبرة</div>
                  <div className="text-sm text-gray-600 leading-7">
                    {fellow.exp} - {fellow.bio}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(fellow.skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {subTab === 'reviews' && (
                <div className="space-y-3">
                  {dynamicReviews.map((r) => (
                    <div
                      key={r.id}
                      className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xs font-bold shrink-0">
                          {r.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">{r.userName}</span>
                            <span className="text-[11px] text-gray-400">{r.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={i < r.stars ? 'text-yellow-400' : 'text-gray-300'}
                              >
                                {i < r.stars ? '★' : '☆'}
                              </span>
                            ))}
                            <span className="text-[11px] text-gray-500 mr-1">
                              ({r.stars})
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 mt-2 leading-6">
                            {r.comment}
                          </div>
                          {r.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {r.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(fellow.reviews || []).map((r, idx) => (
                    <div
                      key={`old-${idx}`}
                      className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{r.user}</span>
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <Star size={12} fill="currentColor" />
                          <span>{r.stars}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2 leading-6">
                        {r.text}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">{r.time}</div>
                    </div>
                  ))}

                  {dynamicReviews.length === 0 && (fellow.reviews || []).length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-6">
                      لا يوجد تقييمات بعد - كن أول من يقيم
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ratings Summary Section */}
            <div className="mt-8" id="ratings-section">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    onClick={() => openRatingModal(fellowId)}
                    className="font-extrabold text-[15px] flex items-center gap-2 cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded-xl transition"
                    title="اضغط لتقييم"
                    data-rating-header="true"
                  >
                    <span>التقييمات ({totalReviewsCount || 24})</span>
                    <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-100 px-2.5 py-0.5 rounded-full">
                      ★ {combinedAvg}
                    </span>
                  </h3>
                  <button
                    onClick={() => openRatingModal(fellowId)}
                    className="h-8 px-4 bg-white border border-yellow-200 text-yellow-700 rounded-xl text-xs font-bold hover:bg-yellow-50 cursor-pointer"
                  >
                    + أضف تقييم
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
                  {dynamicReviews.map((r) => (
                    <div
                      key={`sec-${r.id}`}
                      className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xs font-bold shrink-0">
                        {r.initial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{r.userName}</span>
                          <span className="text-[11px] text-gray-400">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 mt-1 text-[14px]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={i < r.stars ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              {i < r.stars ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-700 mt-2 leading-6">
                          {r.comment}
                        </div>
                        {r.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {r.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 bg-white border border-gray-100 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {dynamicReviews.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mx-auto mb-2">
                        <Star size={18} />
                      </div>
                      <div className="text-sm font-bold">لا يوجد تقييمات بعد</div>
                      <div className="text-xs text-gray-500 mt-1">
                        كن أول من يقيم {fellow.name}
                      </div>
                      <button
                        onClick={() => openRatingModal(fellowId)}
                        className="mt-3 h-9 px-5 bg-[#16a34a] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#15803d]"
                      >
                        تقييم الزميل ⭐
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
