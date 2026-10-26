'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  MessageCircle,
  Bell,
  Grid3x3,
  User,
  LogOut,
  MapPin,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import VerificationBadge, { isQualifiedForVerification } from '@/components/ui/VerificationBadge';

export default function Header() {
  const {
    mounted,
    isLoggedIn,
    isAdmin,
    currentUser,
    showView,
    logout,
    fellows,
    myFellows,
    fellowSuggestions,
    ads,
    openFellowProfile,
    unreadNotificationsCount,
  } = useApp();

  const authenticated = mounted && isLoggedIn;
  const adminActive = mounted && isAdmin;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Pool of members to search through
  const membersPool = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      role: string;
      spec: string;
      loc: string;
      initial: string;
      stars: number;
      isVerified?: boolean;
    }> = [];
    const seen = new Set<string>();

    const addMember = (
      id: string,
      name: string,
      role: string,
      spec: string,
      loc: string,
      initial: string,
      stars?: number,
      isVerified?: boolean
    ) => {
      if (!name || seen.has(name.trim())) return;
      seen.add(name.trim());
      const roleText = (role || '').toLowerCase();
      const defaultStars =
        stars ??
        (roleText.includes('مزارع') || roleText.includes('مورد') ? 4.9 : 4.8);

      list.push({
        id,
        name: name.trim(),
        role: role || 'عضو في المنصة',
        spec: spec || '',
        loc: loc || 'مصر',
        initial: initial || name.trim()[0] || 'ع',
        stars: defaultStars,
        isVerified: isVerified ?? true,
      });
    };

    [...fellows, ...myFellows, ...fellowSuggestions].forEach((f) => {
      addMember(f.id, f.name, f.role, f.spec, f.loc, f.initial, f.stars, f.isVerified);
    });

    ads.forEach((ad) => {
      const isFarmerOrSupplier =
        ad.role.includes('مزارع') ||
        ad.role.includes('مورد') ||
        ad.category.includes('فريش');
      addMember(
        `ad-user-${ad.userName}`,
        ad.userName,
        ad.role,
        ad.category,
        ad.location,
        ad.userInitial,
        isFarmerOrSupplier ? 4.9 : 4.7,
        true
      );
    });

    return list;
  }, [fellows, myFellows, fellowSuggestions, ads]);

  // Real-time member search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return membersPool
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.spec.toLowerCase().includes(q) ||
          m.loc.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchQuery, membersPool]);

  const handleSelectMember = (member: { id: string; name: string }) => {
    setSearchQuery('');
    setSearchDropdownOpen(false);
    if (
      currentUser?.name &&
      (currentUser.name === member.name || member.name === 'أنت')
    ) {
      showView('profile');
    } else {
      openFellowProfile(member.id || member.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        handleSelectMember(searchResults[0]);
      } else if (searchQuery.trim()) {
        showView('community');
        setSearchDropdownOpen(false);
      }
    } else if (e.key === 'Escape') {
      setSearchDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 px-4 lg:px-6 h-[64px] flex items-center justify-between gap-3"
      style={{ top: 'var(--safe-area-inset-top)' }}
    >
      <div className="flex items-center gap-3 flex-1 max-w-[560px]">
        {/* Desktop search with live member lookup */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 hidden lg:block"
        >
          <div className="relative">
            <Search
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setSearchDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="ابحث عن الأعضاء والزملاء (مثال: أحمد منصور، المنصورة...)"
              className="h-10 pr-10 pl-9 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm w-full focus:outline-none focus:border-[#16a34a]/30 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchDropdownOpen(false);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Member Search Results Dropdown */}
          {searchDropdownOpen && searchQuery.trim() && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-2.5 border-b border-gray-50 flex items-center justify-between text-xs text-gray-400 font-bold px-3 bg-gray-50/50">
                <span>نتائج البحث عن الأعضاء ({searchResults.length})</span>
                <span className="text-[10px] text-gray-400">
                  اضغط للتوجيه للبروفايل
                </span>
              </div>
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {searchResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectMember(m)}
                      className="w-full text-right p-3 hover:bg-[#f0fdf4] transition flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#15803d] border border-green-100 flex items-center justify-center font-bold text-sm group-hover:bg-[#16a34a] group-hover:text-white transition">
                          {m.initial}
                        </div>
                        {isQualifiedForVerification(m) && (
                          <div
                            className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#16a34a] text-white rounded-full border border-white flex items-center justify-center shadow-xs"
                            title="شارة الموثوقية"
                          >
                            <ShieldCheck size={9} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-gray-900 group-hover:text-[#16a34a] transition truncate">
                            {m.name}
                          </span>
                          <VerificationBadge
                            role={m.role}
                            stars={m.stars}
                            isVerified={m.isVerified}
                            size="sm"
                          />
                          <span className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-600 shrink-0">
                            {m.role}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1.5">
                          <MapPin size={11} className="text-gray-400 shrink-0" />
                          <span>{m.loc}</span>
                          {m.spec && <span>• {m.spec}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  <div>لا يوجد أعضاء مطابقين للاسم "{searchQuery}"</div>
                  <button
                    onClick={() => {
                      setSearchDropdownOpen(false);
                      showView('market');
                    }}
                    className="mt-2 text-[#16a34a] hover:underline font-bold block mx-auto cursor-pointer"
                  >
                    البحث في إعلانات السوق بدلاً من ذلك ←
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile brand button */}
        <button
          onClick={() => showView('landing')}
          className="lg:hidden flex items-center gap-2 cursor-pointer hover:opacity-90 transition text-right"
        >
          <div className="w-8 h-8 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-extrabold shadow-sm">
            C
          </div>
          <span className="font-extrabold text-sm text-gray-900">ContCrops</span>
        </button>

        {/* Mobile search bar with members dropdown */}
        <div className="lg:hidden relative flex-1">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setSearchDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="ابحث عن عضو..."
              className="h-9 pr-8 pl-6 bg-[#f9fafb] border border-gray-100 rounded-xl text-xs w-full focus:outline-none focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchDropdownOpen(false);
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {searchDropdownOpen && searchQuery.trim() && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              <div className="p-2 border-b border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-bold px-3">
                <span>نتائج الأعضاء ({searchResults.length})</span>
                <button
                  onClick={() => setSearchDropdownOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              </div>
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                  {searchResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectMember(m)}
                      className="w-full text-right p-2.5 hover:bg-[#f0fdf4] transition flex items-center gap-2.5 cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#15803d] border border-green-100 flex items-center justify-center font-bold text-xs">
                          {m.initial}
                        </div>
                        {isQualifiedForVerification(m) && (
                          <div
                            className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-[#16a34a] text-white rounded-full border border-white flex items-center justify-center shadow-xs"
                            title="شارة الموثوقية"
                          >
                            <ShieldCheck size={8} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-gray-900 truncate">
                            {m.name}
                          </span>
                          <VerificationBadge
                            role={m.role}
                            stars={m.stars}
                            isVerified={m.isVerified}
                            size="sm"
                          />
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {m.role} • {m.loc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-gray-500">
                  لا يوجد نتائج مطابقة
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!authenticated ? (
          <div id="header-guest" className="flex items-center gap-2">
            <Link
              href="/notifications"
              onClick={(e) => {
                e.preventDefault();
                showView('notifications');
              }}
              title="الإشعارات"
              className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition shadow-sm group cursor-pointer"
            >
              <Bell
                size={18}
                className="group-hover:text-[#16a34a] transition"
              />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                </span>
              )}
            </Link>
            <Link
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                showView('login');
              }}
              className="h-10 px-4 bg-white border border-gray-100 rounded-xl text-sm font-bold hover:bg-gray-50 transition cursor-pointer flex items-center justify-center"
            >
              تسجيل دخول
            </Link>
            <Link
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                showView('register');
              }}
              className="h-10 px-5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-sm font-bold shadow-sm transition cursor-pointer flex items-center justify-center"
            >
              إنشاء حساب
            </Link>
          </div>
        ) : (
          <div id="header-profile" className="relative flex items-center gap-2">
            {/* Messages button */}
            <Link
              href="/messages"
              onClick={(e) => {
                e.preventDefault();
                showView('messages');
              }}
              className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition shadow-sm group cursor-pointer"
            >
              <MessageCircle
                size={18}
                className="group-hover:text-[#16a34a] transition"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </Link>

            {/* Notifications button */}
            <Link
              href="/notifications"
              onClick={(e) => {
                e.preventDefault();
                showView('notifications');
              }}
              title="الإشعارات"
              className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition shadow-sm group cursor-pointer"
            >
              <Bell
                size={18}
                className="group-hover:text-[#16a34a] transition"
              />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in fade-in">
                  {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                </span>
              )}
            </Link>

            {/* Admin dashboard button */}
            {adminActive && (
              <Link
                id="btn-admin-dashboard"
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  showView('admin-dashboard');
                }}
                className="flex h-10 px-4 bg-gray-900 text-white rounded-xl text-sm font-bold items-center gap-2 hover:bg-black transition shadow-sm cursor-pointer"
              >
                <Grid3x3 size={16} />
                <span>لوحة التحكم</span>
              </Link>
            )}

            {/* User Avatar & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="profile-avatar-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-9 h-9 rounded-xl bg-green-100 text-[#16a34a] font-bold flex items-center justify-center border border-green-100 hover:bg-green-50 transition shadow-sm cursor-pointer"
              >
                {currentUser?.name ? currentUser.name[0] : 'م'}
              </button>

              {dropdownOpen && (
                <div
                  id="profile-dropdown"
                  className="absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 z-50"
                >
                  <div className="px-3 py-2 mb-1">
                    <div className="font-bold text-sm">
                      {currentUser?.name || 'أحمد الزراعي'}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {currentUser?.phone || ''}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      showView('profile');
                    }}
                    className="w-full text-right px-4 py-2 rounded-xl hover:bg-gray-50 text-sm font-bold flex items-center gap-2 transition cursor-pointer"
                  >
                    <User size={16} />
                    <span>الملف الشخصي</span>
                  </button>

                  {isAdmin && (
                    <button
                      id="dropdown-admin"
                      onClick={() => {
                        setDropdownOpen(false);
                        showView('admin-dashboard');
                      }}
                      className="w-full text-right px-4 py-2 rounded-xl hover:bg-gray-50 text-sm font-bold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Grid3x3 size={16} />
                      <span>لوحة التحكم</span>
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-right px-4 py-2 rounded-xl hover:bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>تسجيل خروج</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
