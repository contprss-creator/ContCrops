'use client';

import { useState } from 'react';
import {
  Pen,
  Star,
  MapPin,
  Phone,
  Award,
  Settings,
  LogOut,
  Package,
  Users,
  Plus,
  ShieldCheck,
  Bell,
  ArrowLeft,
  User,
  CheckCircle2,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';
import VerificationBadge, { isQualifiedForVerification } from '@/components/ui/VerificationBadge';
import VerificationModal from '@/components/ui/VerificationModal';

export default function ProfileView() {
  const {
    currentUser,
    ads,
    communityPosts,
    savedDocs,
    ratings,
    logout,
    setNewAdModalOpen,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ads' | 'posts' | 'docs' | 'ratings' | 'settings'>('ads');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [userRole, setUserRole] = useState(currentUser?.role || 'مزارع');
  const [userAccountType, setUserAccountType] = useState(currentUser?.accountType || 'مزارع');
  const [userVerifiedDocs, setUserVerifiedDocs] = useState<string[]>([
    'كارت الفلاح / الحيازة الزراعية الرسمية',
    'بطاقة الرقم القومي سارية',
    'فحص جودة المحصول ومتبقيات المبيدات',
  ]);
  const [userVerificationId, setUserVerificationId] = useState('CC-FAR-8492');
  const [userVerificationStatus, setUserVerificationStatus] = useState<'verified' | 'pending' | 'unverified'>('verified');

  const myAds = ads.filter(
    (a) => a.userName === currentUser?.name || a.userName === 'أنت'
  );
  const myReviews = ratings.filter((r) => r.fellowId === 'me');
  const avgRating = myReviews.length
    ? (myReviews.reduce((sum, r) => sum + r.stars, 0) / myReviews.length).toFixed(1)
    : '4.9';

  const isVerifiedPartner = isQualifiedForVerification({
    role: userRole,
    accountType: userAccountType,
    stars: parseFloat(avgRating),
    isVerified: userVerificationStatus === 'verified',
  });

  const handleVerificationComplete = (data: {
    role: string;
    accountType: string;
    verifiedDocuments: string[];
    verificationId: string;
  }) => {
    setUserRole(data.role);
    setUserAccountType(data.accountType);
    setUserVerifiedDocs(data.verifiedDocuments);
    setUserVerificationId(data.verificationId);
    setUserVerificationStatus('verified');
    showToast('تم اعتماد شارة الموثوقية وتوثيق الوثائق الرسمية بنجاح!');
  };

  return (
    <div>
      <Header />
      <div className="max-w-[1000px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-8">
            {/* Header info */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 border border-green-100 shadow-sm flex items-center justify-center text-3xl font-extrabold text-[#15803d] mx-auto">
                  {currentUser?.name ? currentUser.name[0] : 'أ'}
                </div>
                {/* Verification Badge Over Avatar */}
                {isVerifiedPartner && (
                  <div
                    className="absolute -top-2 -left-2 w-8 h-8 bg-emerald-600 text-white rounded-2xl border-2 border-white flex items-center justify-center shadow-md cursor-pointer"
                    onClick={() => setShowVerificationModal(true)}
                    title="شارة الموثوقية - انقر لإدارة وثائق التوثيق"
                  >
                    <ShieldCheck size={18} strokeWidth={2.5} />
                  </div>
                )}
                <button
                  onClick={() => showToast('تعديل الصورة قريباً')}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#16a34a] text-white rounded-2xl border-2 border-white flex items-center justify-center shadow-md hover:bg-[#15803d] cursor-pointer"
                >
                  <Pen size={14} />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h1 className="text-[22px] font-extrabold">
                    {currentUser?.name || 'أحمد الزراعي'}
                  </h1>
                  <VerificationBadge
                    role={userRole}
                    accountType={userAccountType}
                    stars={parseFloat(avgRating)}
                    isVerified={userVerificationStatus === 'verified'}
                    verificationStatus={userVerificationStatus}
                    verifiedDocuments={userVerifiedDocs}
                    verificationId={userVerificationId}
                    size="md"
                    showDetails
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-[#f0fdf4] text-[#15803d] border border-green-100 rounded-full text-xs font-bold">
                    {userRole} • حساب نشط
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-amber-50/60 border border-amber-100/60 px-2.5 py-0.5 rounded-full">
                    <Star size={12} className="text-amber-500" fill="currentColor" />
                    <span className="font-bold text-amber-900">{avgRating}</span>
                    <span className="text-gray-500">(١٢٨ تقييم)</span>
                  </span>
                  {isVerifiedPartner && (
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-[#16a34a]" />
                      <span>حساب موثق رسمي</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{currentUser?.location || 'البحيرة'} - النوبارية</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={12} />
                    <span>{currentUser?.phone || '01xxxxxxxxx'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={12} />
                    <span>عضو منذ ٢٠٢٣</span>
                  </span>
                </div>

                {/* Hero Verification Badge with Official Documents */}
                {isVerifiedPartner && (
                  <div className="mt-5 w-full max-w-xl mx-auto">
                    <VerificationBadge
                      role={userRole}
                      accountType={userAccountType}
                      stars={parseFloat(avgRating)}
                      isVerified={userVerificationStatus === 'verified'}
                      verificationStatus={userVerificationStatus}
                      verifiedDocuments={userVerifiedDocs}
                      verificationId={userVerificationId}
                      size="hero"
                      showDetails
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(true)}
                  className="h-10 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#15803d] border border-emerald-200 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>توثيق الحساب والوثائق الرسمية</span>
                </button>
                <button
                  onClick={() => showToast('تعديل الملف الشخصي')}
                  className="h-10 px-5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
                >
                  <Pen size={16} />
                  <span>تعديل</span>
                </button>
                <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                  <Settings size={18} />
                </button>
              </div>

              {/* Logout button */}
              <div className="flex flex-col items-center gap-3 mt-4 w-full">
                <button
                  onClick={logout}
                  className="bg-white border border-red-200 text-red-600 rounded-xl px-6 py-3 hover:bg-red-50 font-bold text-sm flex items-center gap-2 transition shadow-sm cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>🚪 تسجيل خروج</span>
                </button>
              </div>
            </div>

            {/* 3 Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { k: '١٢', v: 'إعلان', icon: Package },
                { k: '٨٩', v: 'زملاء', icon: Users },
                { k: '٤.٩', v: 'تقييم', icon: Star },
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

            {/* Profile Subtabs */}
            <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {[
                { id: 'ads' as const, label: 'إعلاناتي' },
                { id: 'posts' as const, label: 'منشوراتي' },
                { id: 'docs' as const, label: 'مستنداتي' },
                { id: 'ratings' as const, label: 'تقييماتي' },
                { id: 'settings' as const, label: 'إعدادات' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`h-9 px-5 rounded-full text-sm font-bold border whitespace-nowrap transition cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-[#16a34a] text-white border-[#16a34a] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Subtab Contents */}
            <div className="mt-6">
              {activeTab === 'ads' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {myAds.slice(0, 3).map((ad) => (
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
                        <div className="mt-2 flex gap-2">
                          <span className="text-[11px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-100">
                            {ad.category}
                          </span>
                          <span className="text-[11px] text-gray-400">{ad.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-[#f9fafb] border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-2">
                      <Plus size={18} />
                    </div>
                    <div className="font-bold text-sm">انشر إعلان جديد</div>
                    <div className="text-xs text-gray-500 mt-1">
                      يوصل لآلاف التجار والمصانع
                    </div>
                    <button
                      onClick={() => setNewAdModalOpen(true)}
                      className="mt-3 h-9 px-5 bg-[#16a34a] text-white rounded-full text-xs font-bold cursor-pointer hover:bg-[#15803d]"
                    >
                      انشر الآن
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="space-y-3">
                  {communityPosts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4"
                    >
                      <div className="text-sm leading-7">{post.text}</div>
                      <div className="text-[11px] text-gray-400 mt-2">
                        {post.time} • {post.likes} إعجاب
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4">
                  <div className="font-bold text-sm mb-3">
                    مستنداتي ({savedDocs.length})
                  </div>
                  <div className="space-y-2">
                    {savedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs">{doc.title}</div>
                          <div className="text-[11px] text-gray-500">
                            {doc.party} • {doc.date}
                          </div>
                        </div>
                        <button
                          onClick={() => showToast('عرض المستند')}
                          className="h-7 px-3 bg-gray-900 text-white rounded-full text-[11px] font-bold cursor-pointer"
                        >
                          عرض
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ratings' && (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                    <h3 className="font-extrabold text-[15px] flex items-center gap-2">
                      <span>تقييماتي</span>
                      <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-100 px-2.5 py-0.5 rounded-full">
                        ★ {avgRating} ({myReviews.length})
                      </span>
                    </h3>
                    <span className="text-[11px] text-gray-400">
                      تقييمات استلمتها من زملائك
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {myReviews.map((r) => (
                      <div
                        key={r.id}
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
                                  className="text-[10px] px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {myReviews.length === 0 && (
                      <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                        <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mx-auto mb-2">
                          <Star size={18} />
                        </div>
                        <div className="font-bold text-sm">لم تستلم تقييمات بعد</div>
                        <div className="text-xs text-gray-500 mt-1">
                          عندما يقيمك زملائك ستظهر هنا
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-3">
                  {[
                    { icon: User, label: 'تعديل البيانات الشخصية', desc: 'الاسم، الهاتف، المحافظة' },
                    { icon: ShieldCheck, label: 'الأمان وكلمة المرور', desc: 'تغيير كلمة المرور وتفعيل التحقق' },
                    { icon: Bell, label: 'إعدادات الإشعارات', desc: 'أسعار، رسائل، تعليقات' },
                    { icon: LogOut, label: 'تسجيل خروج', desc: 'الخروج من الحساب الحالي', danger: true },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.label}
                        onClick={() => (s.danger ? logout() : showToast(s.label))}
                        className={`w-full text-right bg-white border rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition cursor-pointer ${
                          s.danger ? 'border-red-100 hover:border-red-200' : 'border-gray-100'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            s.danger ? 'bg-red-50 text-red-600' : 'bg-[#f9fafb] text-gray-600'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-sm ${s.danger ? 'text-red-600' : ''}`}>
                            {s.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                        </div>
                        <ArrowLeft size={16} className="text-gray-300" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal for Document Upload & Badge Activation */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        currentUserRole={userRole}
        currentAccountType={userAccountType}
        isVerified={userVerificationStatus === 'verified'}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
}
