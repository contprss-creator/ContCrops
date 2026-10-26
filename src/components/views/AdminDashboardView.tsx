'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Grid3x3,
  Users,
  Package,
  ChartColumn,
  UserCheck,
  FileText,
  MessageCircle,
  Settings,
  Search,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';
import type { AdminSettings } from '@/types';

export default function AdminDashboardView() {
  const {
    showView,
    logout,
    adminUsers,
    adminAds,
    adminPrices,
    communityPosts,
    savedDocs,
    fellowRequests,
    fellows,
    myFellows,
    adminSettings,
    selectedAdminAdIds,
    toggleSelectAdminAd,
    toggleAdminUserStatus,
    deleteAdminUser,
    approveAdminAd,
    rejectAdminAd,
    deleteAdminAd,
    bulkDeleteAdminAds,
    deleteAdminPrice,
    deleteAdminPost,
    deleteAdminDoc,
    toggleAdminSetting,
    showToast,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    | 'overview'
    | 'users'
    | 'ads'
    | 'fellows'
    | 'prices'
    | 'docs'
    | 'community'
    | 'settings'
  >('overview');

  const [userSearch, setUserSearch] = useState('');
  const [fellowSubTab, setFellowSubTab] = useState<'requests' | 'list' | 'reports'>('requests');

  const filteredUsers = adminUsers.filter(
    (u) =>
      !userSearch ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch)
  );

  const sectionsList = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: Grid3x3 },
    { id: 'users' as const, label: 'المستخدمين', icon: Users },
    { id: 'ads' as const, label: 'الإعلانات', icon: Package },
    { id: 'fellows' as const, label: 'الزملاء', icon: UserCheck },
    { id: 'prices' as const, label: 'الأسعار', icon: ChartColumn },
    { id: 'docs' as const, label: 'المستندات', icon: FileText },
    { id: 'community' as const, label: 'المجتمع', icon: MessageCircle },
    { id: 'settings' as const, label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div id="view-admin-dashboard" className="min-h-screen bg-[#f9fafb]">
      <Header />
      <div className="max-w-[1280px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        {/* Top bar banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => showView('market')}
              className="h-10 px-4 bg-white border border-gray-100 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm cursor-pointer"
            >
              <ArrowRight size={16} />
              <span>رجوع للسوق</span>
            </button>
            <h1 className="text-[24px] font-extrabold flex items-center gap-2">
              <Grid3x3 size={22} className="text-[#16a34a]" />
              <span>لوحة تحكم المدير</span>
            </h1>
            <span className="bg-[#16a34a] text-white text-[11px] px-2.5 py-1 rounded-full font-bold">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              مسجل كـ مدير: 01000000000
            </span>
            <button
              onClick={logout}
              className="h-9 px-4 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold hover:bg-red-100 transition cursor-pointer"
            >
              خروج
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: 'إجمالي المستخدمين',
              value: adminUsers.length,
              icon: Users,
              color: 'bg-blue-50 text-blue-600',
            },
            {
              label: 'الإعلانات',
              value: adminAds.length,
              icon: Package,
              color: 'bg-green-50 text-green-600',
            },
            {
              label: 'أسعار اليوم',
              value: adminPrices.length,
              icon: ChartColumn,
              color: 'bg-amber-50 text-amber-600',
            },
            {
              label: 'طلبات الزمالة',
              value: fellowRequests.length,
              icon: UserCheck,
              color: 'bg-violet-50 text-violet-600',
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div className="font-extrabold text-xl">{stat.value}</div>
                  <div className="text-[11px] text-gray-500">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
          {/* Admin Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 h-fit">
            <div className="text-[11px] font-bold text-gray-400 px-3 py-2">
              الأقسام
            </div>
            {sectionsList.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    showToast(`قسم ${sec.label}`);
                  }}
                  className={`w-full h-11 px-4 rounded-xl flex items-center gap-3 text-sm font-bold transition text-right mb-1 cursor-pointer ${
                    isActive
                      ? 'bg-[#f0fdf4] text-[#15803d] border border-green-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Admin Content Area */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-h-[500px]">
            {/* Overview */}
            {activeSection === 'overview' && (
              <div className="space-y-5">
                <h2 className="font-extrabold text-lg">نظرة عامة</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4">
                    <div className="font-bold text-sm mb-2">آخر الإعلانات</div>
                    {adminAds.slice(0, 3).map((ad) => (
                      <div
                        key={ad.id}
                        className="py-2 border-b border-gray-100 last:border-0 flex justify-between items-center"
                      >
                        <span className="text-xs font-bold">
                          {ad.title.slice(0, 30)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            ad.status === 'نشط'
                              ? 'bg-green-50 text-green-700 border-green-100'
                              : ad.status === 'مرفوض'
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}
                        >
                          {ad.status || 'نشط'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4">
                    <div className="font-bold text-sm mb-2">المستخدمين الجدد</div>
                    {adminUsers.slice(0, 3).map((u) => (
                      <div
                        key={u.id}
                        className="py-2 border-b border-gray-100 last:border-0 flex justify-between items-center"
                      >
                        <span className="text-xs font-bold">{u.name}</span>
                        <span className="text-[10px] text-gray-500">
                          {u.accountType} • {u.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#16a34a] text-white rounded-2xl p-5">
                  <div className="font-bold">مرحباً مدير ContCrops</div>
                  <div className="text-sm text-white/80 mt-1 leading-6">
                    يمكنك إدارة المستخدمين والإعلانات والأسعار من هنا. كل العمليات متزامنة وتعمل بسلاسة.
                  </div>
                </div>
              </div>
            )}

            {/* Users */}
            {activeSection === 'users' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-extrabold text-lg">
                    المستخدمين ({adminUsers.length})
                  </h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="بحث بالاسم أو الهاتف..."
                        className="h-9 pr-8 pl-3 bg-[#f9fafb] border border-gray-100 rounded-xl text-xs w-[200px] focus:outline-none focus:border-green-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="text-right py-2 px-3">الاسم</th>
                        <th className="text-right py-2 px-3">الهاتف</th>
                        <th className="text-right py-2 px-3">النوع</th>
                        <th className="text-right py-2 px-3">الحالة</th>
                        <th className="text-right py-2 px-3">إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-t border-gray-50">
                          <td className="py-2 px-3 font-bold">{u.name}</td>
                          <td className="py-2 px-3">{u.phone}</td>
                          <td className="py-2 px-3">{u.accountType}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full border text-[10px] ${
                                u.status === 'نشط'
                                  ? 'bg-green-50 text-green-700 border-green-100'
                                  : 'bg-red-50 text-red-600 border-red-100'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 flex gap-1">
                            <button
                              onClick={() => toggleAdminUserStatus(u.id)}
                              className="h-7 px-3 bg-white border border-gray-100 rounded-full font-bold hover:bg-gray-50 cursor-pointer"
                            >
                              {u.status === 'نشط' ? 'إيقاف' : 'تفعيل'}
                            </button>
                            <button
                              onClick={() => deleteAdminUser(u.id)}
                              className="h-7 px-3 bg-red-50 text-red-600 border border-red-100 rounded-full font-bold hover:bg-red-100 cursor-pointer"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ads */}
            {activeSection === 'ads' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-extrabold text-lg">
                    الإعلانات ({adminAds.length})
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={bulkDeleteAdminAds}
                      className="h-8 px-4 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold hover:bg-red-100 cursor-pointer"
                    >
                      حذف المحدد ({selectedAdminAdIds.length})
                    </button>
                    <button
                      onClick={() => showView('market')}
                      className="h-8 px-4 bg-white border border-gray-100 rounded-full text-xs font-bold hover:bg-gray-50 cursor-pointer"
                    >
                      عرض السوق
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {adminAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-3 flex gap-3 items-start"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAdminAdIds.includes(ad.id)}
                        onChange={() => toggleSelectAdminAd(ad.id)}
                        className="mt-1 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-xs">{ad.title}</div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          {ad.owner || ad.userName} • {ad.category} • {ad.price} •{' '}
                          {ad.date || ad.time}
                          {ad.reports !== undefined && ad.reports > 0 && (
                            <span className="text-red-600">
                              {' '}
                              • {ad.reports} بلاغات
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full border ${
                            ad.status === 'نشط'
                              ? 'bg-green-50 text-green-700 border-green-100'
                              : ad.status === 'مرفوض'
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}
                        >
                          {ad.status || 'نشط'}
                        </span>
                        {ad.status !== 'نشط' && (
                          <button
                            onClick={() => approveAdminAd(ad.id)}
                            className="h-6 px-2 bg-[#16a34a] text-white rounded-full text-[10px] font-bold hover:bg-[#15803d] cursor-pointer"
                          >
                            موافقة
                          </button>
                        )}
                        {ad.status !== 'مرفوض' && (
                          <button
                            onClick={() => rejectAdminAd(ad.id)}
                            className="h-6 px-2 bg-white border border-gray-100 rounded-full text-[10px] font-bold hover:bg-gray-50 cursor-pointer"
                          >
                            رفض
                          </button>
                        )}
                        <button
                          onClick={() => deleteAdminAd(ad.id)}
                          className="h-6 px-2 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-bold hover:bg-red-100 cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prices */}
            {activeSection === 'prices' && (
              <div>
                <h2 className="font-extrabold text-lg mb-4">
                  الأسعار ({adminPrices.length})
                </h2>
                <div className="space-y-2">
                  {adminPrices.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#f9fafb] border border-gray-100 rounded-xl p-3 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-xs">{p.crop}</span>{' '}
                        <span className="text-[11px] text-gray-500">
                          • {p.cat} • {p.price} ج • {p.source || 'سوق العبور'}
                        </span>
                      </div>
                      <button
                        onClick={() => p.id && deleteAdminPrice(p.id)}
                        className="h-7 px-3 bg-white border border-gray-100 rounded-full text-[11px] font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community */}
            {activeSection === 'community' && (
              <div>
                <h2 className="font-extrabold text-lg mb-4">
                  منشورات المجتمع ({communityPosts.length})
                </h2>
                <div className="space-y-2">
                  {communityPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-[#f9fafb] border border-gray-100 rounded-xl p-3 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-xs">{post.user}</div>
                        <div className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                          {post.text}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteAdminPost(post.id)}
                        className="h-7 px-3 bg-white border border-gray-100 rounded-full text-[11px] font-bold text-red-600 ml-3 hover:bg-red-50 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Docs */}
            {activeSection === 'docs' && (
              <div>
                <h2 className="font-extrabold text-lg mb-4">
                  المستندات ({savedDocs.length})
                </h2>
                <div className="space-y-2">
                  {savedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-[#f9fafb] border border-gray-100 rounded-xl p-3 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-xs">{doc.title}</span>{' '}
                        <span className="text-[11px] text-gray-500">
                          • {doc.party} • {doc.date}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteAdminDoc(doc.id)}
                        className="h-7 px-3 bg-white border border-gray-100 rounded-full text-[11px] font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fellows */}
            {activeSection === 'fellows' && (
              <div>
                <h2 className="font-extrabold text-lg mb-4">الزملاء - الطلبات</h2>
                <div className="flex gap-2 mb-4">
                  {[
                    { id: 'requests' as const, label: 'طلبات' },
                    { id: 'list' as const, label: 'قائمة الزملاء' },
                    { id: 'reports' as const, label: 'بلاغات' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFellowSubTab(tab.id)}
                      className={`h-8 px-4 rounded-full text-xs font-bold border cursor-pointer ${
                        fellowSubTab === tab.id
                          ? 'bg-[#f0fdf4] text-[#15803d] border-green-100'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 text-xs text-gray-600">
                  {fellowSubTab === 'requests' && (
                    <div>
                      طلبات الزمالة الحالية: {fellowRequests.length} - يمكنك قبولها أو
                      رفضها من تبويب المجتمع.
                    </div>
                  )}
                  {fellowSubTab === 'list' && (
                    <div>إجمالي الزملاء المسجلين: {myFellows.length + fellows.length}</div>
                  )}
                  {fellowSubTab === 'reports' && (
                    <div>لا يوجد بلاغات على الزملاء حالياً.</div>
                  )}
                </div>
              </div>
            )}

            {/* Settings */}
            {activeSection === 'settings' && (
              <div className="space-y-4">
                <h2 className="font-extrabold text-lg">الإعدادات</h2>
                {[
                  { key: 'allowRegister' as keyof AdminSettings, label: 'السماح بالتسجيل الجديد' },
                  { key: 'requireAdApproval' as keyof AdminSettings, label: 'يتطلب موافقة الإعلانات' },
                  { key: 'allowComments' as keyof AdminSettings, label: 'السماح بالتعليقات' },
                  { key: 'showPrices' as keyof AdminSettings, label: 'إظهار الأسعار للجميع' },
                  { key: 'maintenance' as keyof AdminSettings, label: 'وضع الصيانة' },
                ].map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between bg-[#f9fafb] border border-gray-100 rounded-xl p-3"
                  >
                    <span className="text-sm font-bold">{s.label}</span>
                    <button
                      onClick={() => toggleAdminSetting(s.key)}
                      className={`w-12 h-7 rounded-full flex items-center px-1 transition cursor-pointer ${
                        adminSettings[s.key]
                          ? 'bg-[#16a34a] justify-end'
                          : 'bg-gray-200 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => showToast('تم حفظ الإعدادات')}
                    className="h-10 px-6 bg-[#16a34a] text-white rounded-xl text-sm font-bold hover:bg-[#15803d] transition cursor-pointer"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={() => showView('market')}
                    className="h-10 px-6 bg-white border border-gray-100 rounded-xl text-sm font-bold hover:bg-gray-50 transition cursor-pointer"
                  >
                    رجوع للسوق
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
