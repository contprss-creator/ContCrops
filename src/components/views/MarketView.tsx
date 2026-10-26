'use client';

import { useState, useMemo } from 'react';
import {
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Share2,
  Ellipsis,
  Send,
  Heart,
  Leaf,
  Snowflake,
  Sun,
  Factory,
  Lightbulb,
  Truck,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';
import { CATEGORIES_LIST, GOVERNORATES_LIST } from '@/data/mockData';
import VerificationBadge from '@/components/ui/VerificationBadge';
import EditAdModal from '@/components/modals/EditAdModal';
import type { AdItem, AdComment } from '@/types';

// Helper to convert Arabic-Indic digits to Latin digits and parse numeric price
function parsePriceValue(priceStr: string): number | null {
  if (!priceStr) return null;
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let normalized = priceStr;
  arabicDigits.forEach((digit, i) => {
    normalized = normalized.replaceAll(digit, i.toString());
  });

  const isThousand = normalized.includes('ألف') || normalized.includes('الف');
  const match = normalized.match(/(\d+(?:[\.,]\d+)?)/);
  if (!match) return null;
  let val = parseFloat(match[1].replace(',', '.'));
  if (isNaN(val)) return null;
  if (isThousand) val *= 1000;
  return val;
}

const REGION_PRESETS = [
  'الكل',
  'البحيرة',
  'العاشر من رمضان',
  'القاهرة',
  'الإسكندرية',
  'أسوان',
  'الدقهلية',
  'الغربية',
  'الفيوم',
];

const PRICE_RANGE_PRESETS = [
  { label: 'الكل', min: null, max: null },
  { label: 'أقل من ١٠ ج', min: 0, max: 10 },
  { label: '١٠ - ٣٠ ج', min: 10, max: 30 },
  { label: '٣٠ - ٦٠ ج', min: 30, max: 60 },
  { label: 'أكثر من ٦٠ ج', min: 60, max: null },
];

export default function MarketView() {
  const {
    ads,
    selectedCategory,
    setSelectedCategory,
    adComments,
    openCommentAdIds,
    toggleCommentsDrawer,
    addAdComment,
    toggleAdCommentLike,
    setNewAdModalOpen,
    fellowshipStatus,
    toggleFellowship,
    openFellowProfile,
    openShareModal,
    showView,
    showToast,
    currentUser,
    isLoggedIn,
    isAdmin,
    deleteAd,
    updateAdComment,
    deleteAdComment,
  } = useApp();

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  const [deletingAd, setDeletingAd] = useState<AdItem | null>(null);
  const [editingComment, setEditingComment] = useState<{
    adId: string;
    commentId: string;
    text: string;
  } | null>(null);

  const canModifyAd = (ad: AdItem) => {
    if (!isLoggedIn) return false;
    if (isAdmin) return true;
    return (
      ad.owner === currentUser?.name ||
      ad.userName === currentUser?.name ||
      ad.ownerId === currentUser?.phone ||
      ad.owner === 'أنت'
    );
  };

  const canModifyComment = (ad: AdItem, comment: AdComment) => {
    if (!isLoggedIn) return false;
    if (isAdmin) return true;
    return (
      comment.userName === currentUser?.name ||
      comment.userName === 'أنت' ||
      canModifyAd(ad)
    );
  };

  // Advanced search and filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('الكل');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [activePricePreset, setActivePricePreset] = useState<string>('الكل');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'الكل') count++;
    if (selectedRegion !== 'الكل') count++;
    if (minPrice !== '' || maxPrice !== '' || activePricePreset !== 'الكل') count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedCategory, selectedRegion, minPrice, maxPrice, activePricePreset, searchQuery]);

  const handlePricePreset = (preset: typeof PRICE_RANGE_PRESETS[0]) => {
    setActivePricePreset(preset.label);
    setMinPrice(preset.min !== null ? preset.min.toString() : '');
    setMaxPrice(preset.max !== null ? preset.max.toString() : '');
  };

  const handleResetFilters = () => {
    setSelectedCategory('الكل');
    setSelectedRegion('الكل');
    setMinPrice('');
    setMaxPrice('');
    setActivePricePreset('الكل');
    setSearchQuery('');
    showToast('تمت إعادة ضبط جميع الفلاتر');
  };

  // Filtered ads logic
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      // 1. Category / Type filter
      if (selectedCategory !== 'الكل' && ad.category !== selectedCategory) {
        return false;
      }

      // 2. Region / Geographic filter
      if (selectedRegion !== 'الكل') {
        const adLoc = ad.location.toLowerCase();
        const targetRegion = selectedRegion.toLowerCase();
        if (!adLoc.includes(targetRegion)) {
          // Special cases like النوبارية -> البحيرة, برج العرب -> الإسكندرية
          if (targetRegion === 'البحيرة' && adLoc.includes('نوبارية')) {
            // pass
          } else if (targetRegion === 'الإسكندرية' && adLoc.includes('برج العرب')) {
            // pass
          } else {
            return false;
          }
        }
      }

      // 3. Price Range filter
      const parsedPrice = parsePriceValue(ad.price);
      if (parsedPrice !== null) {
        const min = minPrice !== '' ? parseFloat(minPrice) : null;
        const max = maxPrice !== '' ? parseFloat(maxPrice) : null;

        if (min !== null && !isNaN(min) && parsedPrice < min) {
          return false;
        }
        if (max !== null && !isNaN(max) && parsedPrice > max) {
          return false;
        }
      }

      // 4. Keyword text search filter (title, desc, location, userName)
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = ad.title.toLowerCase().includes(q);
        const matchesDesc = ad.desc.toLowerCase().includes(q);
        const matchesLoc = ad.location.toLowerCase().includes(q);
        const matchesUser = ad.userName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesUser) {
          return false;
        }
      }

      return true;
    });
  }, [ads, selectedCategory, selectedRegion, minPrice, maxPrice, searchQuery]);

  const handleSendComment = (adId: string) => {
    const text = commentInputs[adId];
    if (!text?.trim()) return;
    addAdComment(adId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [adId]: '' }));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'فريش':
        return <Leaf className="text-green-600" size={24} />;
      case 'مجمد':
        return <Snowflake className="text-sky-600" size={24} />;
      case 'مجفف':
        return <Sun className="text-amber-600" size={24} />;
      case 'تصنيع غذائي':
        return <Factory className="text-orange-600" size={24} />;
      case 'استشارات':
        return <Lightbulb className="text-violet-600" size={24} />;
      case 'نقل':
        return <Truck className="text-slate-600" size={24} />;
      default:
        return <Leaf className="text-green-600" size={24} />;
    }
  };

  return (
    <div id="view-market">
      <Header />
      <div className="max-w-[1280px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6 space-y-4">
        {/* Header */}
        <div
          id="view-market-header"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-extrabold">السوق</h1>
            <span className="bg-[#16a34a] text-white text-xs font-bold px-3 py-1 rounded-full">
              مجاني ١٠٠٪
            </span>
            <span className="hidden lg:inline text-sm text-gray-500">
              سوق C2C مباشر بدون وسيط
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showView('map')}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#16a34a] border border-emerald-200 rounded-xl px-3.5 py-2 text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <MapPin size={16} />
              <span>خريطة المحاصيل</span>
            </button>
            <button
              id="btn-open-new-ad"
              onClick={() => setNewAdModalOpen(true)}
              className="btn-primary bg-[#16a34a] text-white rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-[#15803d] transition shadow-2xs cursor-pointer"
            >
              + انشر إعلان
            </button>
          </div>
        </div>

        {/* SEARCH BAR & FILTER TOGGLE */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-2xs flex flex-col md:flex-row gap-2.5 items-stretch">
          {/* Main search input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالمحصول أو الصنف (مثال: طماطم، فراولة مجمدة، زبيب...)"
              className="w-full h-11 pr-10 pl-9 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/30 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Filter toggle button */}
          <button
            onClick={() => setIsFilterPanelOpen((prev) => !prev)}
            className={`h-11 px-5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition cursor-pointer shrink-0 ${
              isFilterPanelOpen || activeFiltersCount > 0
                ? 'bg-[#f0fdf4] text-[#15803d] border-[#16a34a]/30 shadow-2xs'
                : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span>تصفية متقدمة</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-[#16a34a] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* COLLAPSIBLE ADVANCED FILTERS PANEL */}
        {isFilterPanelOpen && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2 font-extrabold text-[15px] text-gray-900">
                <SlidersHorizontal size={16} className="text-[#16a34a]" />
                <span>خيارات التصفية المتقدمة</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>إعادة ضبط</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. Category / Type */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  نوع المحصول / القطاع
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['الكل', 'فريش', 'مجمد', 'مجفف', 'تصنيع غذائي', 'استشارات', 'نقل'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`h-8 px-3 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#16a34a] text-white border-[#16a34a]'
                            : 'bg-[#f9fafb] text-gray-600 border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* 2. Region / Location */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  المنطقة الجغرافية
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full h-10 px-3.5 bg-[#f9fafb] border border-gray-100 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#16a34a]/30 cursor-pointer"
                >
                  <option value="الكل">كل المحافظات والمناطق</option>
                  {REGION_PRESETS.filter((r) => r !== 'الكل').map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                  {GOVERNORATES_LIST.filter(
                    (g) => !REGION_PRESETS.includes(g)
                  ).map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-[11px] text-gray-400">
                  البحيرة، العاشر، الدلتا، الصعيد، الإسكندرية والقاهرة
                </div>
              </div>

              {/* 3. Price Range */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  نطاق السعر (جنيه مصري)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setActivePricePreset('مخصص');
                      }}
                      placeholder="الحد الأدنى"
                      className="w-full h-9 px-3 bg-[#f9fafb] border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-[#16a34a]/30"
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-bold">-</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setActivePricePreset('مخصص');
                      }}
                      placeholder="الحد الأقصى"
                      className="w-full h-9 px-3 bg-[#f9fafb] border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-[#16a34a]/30"
                    />
                  </div>
                </div>

                {/* Quick price range chips */}
                <div className="flex flex-wrap gap-1">
                  {PRICE_RANGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePricePreset(preset)}
                      className={`h-7 px-2.5 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                        activePricePreset === preset.label
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom confirmation & count */}
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                مطابق للتصفية:{' '}
                <strong className="text-[#16a34a] font-extrabold">
                  {filteredAds.length}
                </strong>{' '}
                من أصل {ads.length} إعلان
              </span>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="h-8 px-4 bg-[#16a34a] text-white rounded-lg text-xs font-bold hover:bg-[#15803d] transition cursor-pointer flex items-center gap-1.5"
              >
                <Check size={13} />
                <span>تطبيق التصفية</span>
              </button>
            </div>
          </div>
        )}

        {/* Categories Bar (horizontal tabs) */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-9 px-5 rounded-full text-sm font-bold whitespace-nowrap border transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-green-50 text-green-700 border-green-200 shadow-2xs'
                  : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results summary bar if filters are active */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#f0fdf4] border border-green-100 rounded-xl px-4 py-2 text-xs text-green-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold">التصفيات المطبقة:</span>
              {selectedCategory !== 'الكل' && (
                <span className="inline-flex items-center gap-1 bg-white border border-green-200 px-2 py-0.5 rounded-md font-bold text-green-700">
                  {selectedCategory}
                  <X
                    size={11}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => setSelectedCategory('الكل')}
                  />
                </span>
              )}
              {selectedRegion !== 'الكل' && (
                <span className="inline-flex items-center gap-1 bg-white border border-green-200 px-2 py-0.5 rounded-md font-bold text-green-700">
                  منطقة: {selectedRegion}
                  <X
                    size={11}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => setSelectedRegion('الكل')}
                  />
                </span>
              )}
              {(minPrice !== '' || maxPrice !== '') && (
                <span className="inline-flex items-center gap-1 bg-white border border-green-200 px-2 py-0.5 rounded-md font-bold text-green-700">
                  سعر: {minPrice || '0'} إلى {maxPrice || '∞'} ج
                  <X
                    size={11}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                      setActivePricePreset('الكل');
                    }}
                  />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-white border border-green-200 px-2 py-0.5 rounded-md font-bold text-green-700">
                  بحث: "{searchQuery}"
                  <X
                    size={11}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => setSearchQuery('')}
                  />
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-red-600 hover:underline font-bold text-[11px] cursor-pointer"
            >
              مسح الكل
            </button>
          </div>
        )}

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAds.map((ad) => {
            const commentsList = adComments[ad.id] || [];
            const isFellow = fellowshipStatus[ad.id] === 'fellow';
            const isSent = fellowshipStatus[ad.id] === 'sent';

            return (
              <div
                key={ad.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition"
              >
                {/* Author row */}
                <div className="p-4 flex items-start justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={() => openFellowProfile(ad.userName)}
                      className="w-10 h-10 rounded-2xl bg-[#f0fdf4] border border-green-100 flex items-center justify-center font-bold text-[#15803d] hover:bg-[#f0fdf4] hover:border-[#16a34a]/30 transition cursor-pointer"
                    >
                      {ad.userInitial}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => openFellowProfile(ad.userName)}
                          className="font-bold text-sm hover:text-[#16a34a] transition cursor-pointer text-right"
                        >
                          {ad.userName}
                        </button>
                        <VerificationBadge
                          role={ad.role}
                          stars={ad.userName.includes('الزراعي') ? 4.9 : 4.8}
                          size="sm"
                        />
                        <span className="text-[11px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-600">
                          {ad.role}
                        </span>
                        <button
                          id={`fellow-btn-${ad.id}`}
                          onClick={() => toggleFellowship(ad.id, ad.userName)}
                          className={`h-6 px-2.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                            isFellow
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : isSent
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          {isFellow ? '✓ زميل' : isSent ? 'جار الإرسال...' : '+ زميل'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          {ad.time}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-100">
                          {ad.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {canModifyAd(ad) ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingAd(ad)}
                        title="تعديل الإعلان"
                        className="h-7 px-2 bg-emerald-50 text-[#16a34a] hover:bg-emerald-100 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer border border-emerald-100 shadow-2xs"
                      >
                        <Pencil size={11} />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={() => setDeletingAd(ad)}
                        title="حذف الإعلان"
                        className="h-7 px-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer border border-red-100 shadow-2xs"
                      >
                        <Trash2 size={11} />
                        <span>حذف</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openShareModal(ad.id, 'ad')}
                      title="مشاركة"
                      className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
                    >
                      <Share2 size={14} />
                    </button>
                  )}
                </div>

                {/* Media area */}
                {ad.image ? (
                  <div className="mx-4 h-[160px] rounded-xl overflow-hidden border border-gray-100 relative">
                    <img
                      src={ad.image}
                      className="w-full h-40 object-cover"
                      alt={ad.title}
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold border border-gray-100">
                      {ad.qty}
                    </div>
                  </div>
                ) : (
                  <div className="mx-4 h-[160px] rounded-xl bg-gradient-to-br from-[#f0fdf4] via-emerald-50 to-green-100 border border-green-50 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold border border-gray-100">
                      {ad.qty}
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-2xs border border-gray-100 flex items-center justify-center">
                      {getCategoryIcon(ad.category)}
                    </div>
                    <div className="mt-2 text-xs text-green-800 font-bold">
                      {ad.category} • صورة توضيحية
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-[15px] leading-6 line-clamp-2">
                    {ad.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-6 mt-2 line-clamp-2">
                    {ad.desc}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-gray-700">
                      <MapPin size={12} className="text-[#16a34a]" />
                      {ad.location}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-gray-700">
                      {ad.qty}
                    </span>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-gray-400">السعر</div>
                      <div className="font-extrabold text-[#16a34a] text-[16px]">
                        {ad.price}
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {ad.likes} إعجاب • {commentsList.length || ad.comments} تعليق
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="px-3 py-3 border-t border-gray-50 flex gap-2">
                  <button
                    onClick={() => {
                      showToast(`تم فتح محادثة مع ${ad.userName}`);
                      showView('messages');
                    }}
                    className="flex-1 h-9 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Phone size={14} />
                    <span>تواصل</span>
                  </button>

                  <button
                    onClick={() => toggleCommentsDrawer(ad.id)}
                    className={`flex-1 h-9 rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      openCommentAdIds[ad.id]
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-100'
                    }`}
                  >
                    <MessageSquare size={14} />
                    <span>تعليق ({commentsList.length || ad.comments})</span>
                  </button>

                  <button
                    onClick={() => openShareModal(ad.id, 'ad')}
                    className="w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  >
                    <Share2 size={14} />
                  </button>
                </div>

                {/* Comments Drawer */}
                {openCommentAdIds[ad.id] && (
                  <div
                    id={`comments-${ad.id}`}
                    className="px-4 pb-4 pt-2 border-t border-gray-100 bg-[#f9fafb]/60"
                  >
                    <div className="space-y-3 max-h-[200px] overflow-auto pr-1">
                      {commentsList.map((c) => (
                        <div key={c.id} className="flex gap-2">
                          <button
                            onClick={() => openFellowProfile(c.userName)}
                            className="w-7 h-7 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[11px] font-bold shrink-0 hover:border-[#16a34a]/30 hover:text-[#16a34a] transition cursor-pointer"
                          >
                            {c.initial}
                          </button>
                          <div className="flex-1">
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-tr-sm px-3 py-2">
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => openFellowProfile(c.userName)}
                                  className="font-bold text-xs hover:text-[#16a34a] transition cursor-pointer text-right"
                                >
                                  {c.userName}
                                </button>
                                <span className="text-[10px] text-gray-400">
                                  {c.time}
                                </span>
                              </div>
                              {editingComment?.commentId === c.id ? (
                                <div className="mt-1.5 space-y-1.5">
                                  <input
                                    type="text"
                                    value={editingComment.text}
                                    onChange={(e) =>
                                      setEditingComment({
                                        ...editingComment,
                                        text: e.target.value,
                                      })
                                    }
                                    className="w-full h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#16a34a]"
                                  />
                                  <div className="flex items-center gap-1.5 justify-end">
                                    <button
                                      onClick={() => setEditingComment(null)}
                                      className="px-2 py-0.5 text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                      إلغاء
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (editingComment.text.trim()) {
                                          await updateAdComment(
                                            ad.id,
                                            c.id,
                                            editingComment.text.trim()
                                          );
                                          setEditingComment(null);
                                        }
                                      }}
                                      className="px-2.5 py-0.5 text-[10px] bg-[#16a34a] text-white font-bold rounded-md hover:bg-[#15803d] cursor-pointer"
                                    >
                                      حفظ
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs leading-6 mt-1 text-gray-700">
                                  {c.text}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 mr-1">
                              <button
                                onClick={() => toggleAdCommentLike(ad.id, c.id)}
                                className={`text-[11px] flex items-center gap-1 cursor-pointer ${
                                  c.liked ? 'text-red-500 font-bold' : 'text-gray-400'
                                }`}
                              >
                                <Heart
                                  size={10}
                                  fill={c.liked ? 'currentColor' : 'none'}
                                />
                                <span>{c.likes}</span>
                              </button>
                              {canModifyComment(ad, c) && (
                                <>
                                  <span className="text-[10px] text-gray-300">•</span>
                                  <button
                                    onClick={() =>
                                      setEditingComment({
                                        adId: ad.id,
                                        commentId: c.id,
                                        text: c.text,
                                      })
                                    }
                                    className="text-[10px] text-gray-500 hover:text-[#16a34a] flex items-center gap-0.5 cursor-pointer font-semibold"
                                  >
                                    <Pencil size={10} />
                                    <span>تعديل</span>
                                  </button>
                                  <span className="text-[10px] text-gray-300">•</span>
                                  <button
                                    onClick={() => {
                                      if (confirm('هل أنت متأكد من رغبتك في حذف هذا التعليق؟')) {
                                        deleteAdComment(ad.id, c.id);
                                      }
                                    }}
                                    className="text-[10px] text-red-500 hover:text-red-700 flex items-center gap-0.5 cursor-pointer font-semibold"
                                  >
                                    <Trash2 size={10} />
                                    <span>حذف</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {commentsList.length === 0 && (
                        <div className="text-center py-4 text-xs text-gray-400">
                          لا يوجد تعليقات بعد - كن أول من يعلق
                        </div>
                      )}
                    </div>

                    {/* Comment composer */}
                    <div className="mt-3 flex gap-2">
                      <input
                        value={commentInputs[ad.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [ad.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(ad.id);
                        }}
                        placeholder="اكتب تعليق..."
                        className="flex-1 h-9 px-4 bg-white border border-gray-100 rounded-full text-xs focus:outline-none focus:border-[#16a34a]/30"
                      />
                      <button
                        onClick={() => handleSendComment(ad.id)}
                        className="w-9 h-9 bg-[#16a34a] text-white rounded-full flex items-center justify-center hover:bg-[#15803d] transition cursor-pointer"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state when no filters match */}
        {filteredAds.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mx-auto mb-3">
              <Search size={22} />
            </div>
            <div className="font-extrabold text-[16px] text-gray-900">
              لا توجد إعلانات مطابقة لخيارات التصفية
            </div>
            <div className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-5">
              جرّب توسيع نطاق السعر، أو اختيار منطقة أخرى، أو مسح الفلاتر لعرض كافة
              إعلانات السوق.
            </div>
            <button
              onClick={handleResetFilters}
              className="mt-4 h-9 px-6 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw size={13} />
              <span>مسح جميع الفلاتر</span>
            </button>
          </div>
        )}

        {/* Edit Ad Modal */}
        <EditAdModal
          ad={editingAd}
          isOpen={!!editingAd}
          onClose={() => setEditingAd(null)}
        />

        {/* Delete Ad Confirmation Modal */}
        {deletingAd && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-right space-y-4 shadow-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    تأكيد حذف الإعلان
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    هذا الإجراء سيقوم بحذف الإعلان نهائياً.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-800 line-clamp-2">
                {deletingAd.title}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setDeletingAd(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={async () => {
                    const idToDelete = deletingAd.id;
                    setDeletingAd(null);
                    await deleteAd(idToDelete);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>تأكيد الحذف</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
