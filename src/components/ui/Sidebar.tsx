'use client';

import Link from 'next/link';
import {
  House,
  Store,
  Users,
  ChartColumn,
  MessageCircle,
  FileText,
  Bell,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Grid3x3,
  MapPin,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Sidebar() {
  const {
    mounted,
    currentView,
    isLoggedIn,
    isAdmin,
    showView,
    logout,
    setNewAdModalOpen,
  } = useApp();

  const authenticated = mounted && isLoggedIn;
  const adminActive = mounted && isAdmin;

  const mainNavItems = [
    { id: 'landing', label: 'الرئيسية', icon: House, href: '/' },
    { id: 'market', label: 'السوق', icon: Store, badge: 'مجاني', href: '/market' },
    { id: 'map', label: 'الخريطة التفاعلية', icon: MapPin, badge: 'جديد', href: '/map' },
    { id: 'services', label: 'الخدمات', icon: Users, href: '/services' },
    { id: 'prices', label: 'أسعار', icon: ChartColumn, href: '/prices' },
    { id: 'community', label: 'مجتمع', icon: MessageCircle, href: '/community' },
    { id: 'docs', label: 'مستندات', icon: FileText, href: '/docs' },
  ];

  return (
    <aside
      className="hidden lg:flex w-[280px] shrink-0 bg-white border-l border-gray-100 flex-col sticky top-0 h-screen"
      style={{ top: 'var(--safe-area-inset-top)' }}
    >
      {/* Brand header */}
      <div className="p-6 border-b border-gray-50">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            showView('landing');
          }}
          className="flex items-center gap-2.5 text-right w-full hover:opacity-90 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-extrabold text-[18px] shadow-sm">
            C
          </div>
          <div>
            <div className="font-extrabold leading-none text-gray-900">ContCrops</div>
            <div className="text-[11px] text-gray-500 mt-1">سوق زراعي مجاني ١٠٠٪</div>
          </div>
        </Link>

        {/* Live indicator */}
        <div className="mt-4 bg-[#f0fdf4] border border-green-100 rounded-2xl p-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
          <div className="text-xs">
            <span className="font-bold text-green-800">مباشر: </span>
            <span className="text-green-700">٢٤٣ مستخدم الآن</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-auto">
        {mainNavItems.map((item) => {
          const isActive =
            currentView === item.id || (currentView === 'doc-editor' && item.id === 'docs');
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                showView(item.id);
              }}
              className={`w-full h-11 px-4 rounded-full flex items-center gap-3 text-sm font-bold transition text-right cursor-pointer ${
                isActive
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="mr-auto text-[10px] bg-[#16a34a] text-white px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Account section */}
        <div className="pt-3 mt-3 border-t border-gray-50 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold text-gray-400">الحساب</div>
          {authenticated ? (
            <>
              <Link
                href="/profile"
                onClick={(e) => {
                  e.preventDefault();
                  showView('profile');
                }}
                className={`w-full h-11 px-4 rounded-full flex items-center gap-3 text-sm font-bold transition text-right cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User size={18} />
                <span>الملف الشخصي</span>
              </Link>

              {adminActive && (
                <Link
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    showView('admin-dashboard');
                  }}
                  className={`w-full h-11 px-4 rounded-full flex items-center gap-3 text-sm font-bold transition text-right cursor-pointer ${
                    currentView === 'admin-dashboard'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Grid3x3 size={18} />
                  <span>لوحة الإدارة</span>
                </Link>
              )}

              <Link
                href="/messages"
                onClick={(e) => {
                  e.preventDefault();
                  showView('messages');
                }}
                className={`w-full h-11 px-4 rounded-full flex items-center gap-3 text-sm font-bold transition text-right cursor-pointer ${
                  currentView === 'messages'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageCircle size={18} />
                <span>الرسائل</span>
                <span className="mr-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  3
                </span>
              </Link>

              <Link
                href="/notifications"
                onClick={(e) => {
                  e.preventDefault();
                  showView('notifications');
                }}
                className={`w-full h-11 px-4 rounded-full flex items-center gap-3 text-sm font-bold transition text-right cursor-pointer ${
                  currentView === 'notifications'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell size={18} />
                <span>الإشعارات</span>
                <span className="mr-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  5
                </span>
              </Link>

              <button
                onClick={logout}
                className="w-full h-11 px-4 rounded-full flex items-center gap-3 text-sm font-bold transition text-right text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut size={18} />
                <span>تسجيل خروج</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  showView('login');
                }}
                className={`w-full h-11 px-4 rounded-full flex items-center gap-3 text-sm font-bold transition text-right cursor-pointer ${
                  currentView === 'login'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LogIn size={18} />
                <span>تسجيل دخول</span>
              </Link>

              <Link
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  showView('register');
                }}
                className={`w-full h-11 px-4 rounded-full flex items-center gap-3 text-sm font-bold transition text-right cursor-pointer ${
                  currentView === 'register'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <UserPlus size={18} />
                <span>إنشاء حساب</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Promo banner */}
      <div className="p-4 border-t border-gray-50">
        <div className="bg-gray-900 text-white rounded-2xl p-4">
          <div className="text-sm font-bold">انشر إعلانك مجاناً</div>
          <div className="text-xs text-white/60 mt-1 leading-6">من الفريش للتصدير في ٣٠ ثانية</div>
          <button
            onClick={() => {
              if (!isLoggedIn) {
                showView('login');
              } else {
                setNewAdModalOpen(true);
              }
            }}
            className="mt-3 w-full h-9 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-gray-100 transition cursor-pointer"
          >
            انشر الآن
          </button>
        </div>
      </div>
    </aside>
  );
}
