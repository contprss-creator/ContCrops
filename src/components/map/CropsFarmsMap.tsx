'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Filter,
  Layers,
  Search,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sprout,
  Store,
  RefreshCw,
  LocateFixed,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { AdItem, Fellow } from '@/types';
import VerificationBadge from '@/components/ui/VerificationBadge';

interface MapMarkerData {
  id: string;
  type: 'ad' | 'farm';
  title: string;
  subTitle: string;
  category: string;
  cropType: string;
  price?: string;
  qty?: string;
  location: string;
  phone?: string;
  rating?: number;
  isVerified?: boolean;
  lat: number;
  lng: number;
  originalAd?: AdItem;
  originalFellow?: Fellow;
}

export default function CropsFarmsMap() {
  const { ads, fellows, showView, openFellowProfile, setActiveConversationId } = useApp();

  const [selectedCropCategory, setSelectedCropCategory] = useState<string>('الكل');
  const [selectedSpecificCrop, setSelectedSpecificCrop] = useState<string>('الكل');
  const [selectedEntityType, setSelectedEntityType] = useState<'all' | 'ads' | 'farms'>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItem, setActiveItem] = useState<MapMarkerData | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    'AIzaSyCqtMyag7appcXfXTbEGC4g4b_Kozm4yvw';

  // Quota exceeded listener (per Google Maps Platform skill guidelines)
  useEffect(() => {
    const handleQuotaError = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaError);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaError);
    };
  }, []);

  // Request user geolocation for "الخريطة القريبة مني"
  const handleLocateUser = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation failed or permission denied:', error.message);
          // Default Egypt center
          setUserLocation({ lat: 30.0444, lng: 31.2357 });
        }
      );
    }
  };

  // Convert Ads and Fellows to unified map markers
  const allMarkers = useMemo<MapMarkerData[]>(() => {
    const list: MapMarkerData[] = [];

    // Add Ads with locations
    ads.forEach((ad) => {
      if (ad.lat && ad.lng) {
        list.push({
          id: `ad-${ad.id}`,
          type: 'ad',
          title: ad.title,
          subTitle: `${ad.userName} • ${ad.role}`,
          category: ad.category || 'فريش',
          cropType: ad.cropType || (ad.category === 'فريش' ? 'طماطم' : 'محصول متنوع'),
          price: ad.price,
          qty: ad.qty,
          location: ad.location,
          phone: '01012345678',
          isVerified: true,
          lat: ad.lat,
          lng: ad.lng,
          originalAd: ad,
        });
      }
    });

    // Add Fellows / Farms with locations
    fellows.forEach((f) => {
      if (f.lat && f.lng) {
        const crops = f.cropSpecialty?.join('، ') || 'محاصيل زراعية متنوعة';
        list.push({
          id: `farm-${f.id}`,
          type: 'farm',
          title: f.name,
          subTitle: f.spec,
          category: f.accountType === 'مصنع' ? 'تصنيع غذائي' : 'فريش',
          cropType: crops,
          location: f.loc,
          phone: f.phone,
          rating: f.stars,
          isVerified: f.isVerified,
          lat: f.lat,
          lng: f.lng,
          originalFellow: f,
        });
      }
    });

    return list;
  }, [ads, fellows]);

  // Specific crops list for quick filtering
  const cropList = ['الكل', 'طماطم', 'فراولة', 'بطاطس', 'مانجو', 'تمور', 'بصل', 'برتقال وموالح', 'أعشاب'];

  // Categories list
  const categoryList = ['الكل', 'فريش', 'مجمد', 'مجفف', 'تصنيع غذائي'];

  // Governorates list
  const governorateList = [
    'الكل',
    'البحيرة',
    'الشرقية',
    'الإسكندرية',
    'الدقهلية',
    'الإسماعيلية',
    'الجيزة',
    'الفيوم',
    'أسوان',
    'القاهرة',
  ];

  // Filtered markers
  const filteredMarkers = useMemo(() => {
    return allMarkers.filter((m) => {
      // Entity type filter
      if (selectedEntityType === 'ads' && m.type !== 'ad') return false;
      if (selectedEntityType === 'farms' && m.type !== 'farm') return false;

      // Category filter
      if (selectedCropCategory !== 'الكل') {
        if (!m.category.includes(selectedCropCategory)) return false;
      }

      // Specific crop filter
      if (selectedSpecificCrop !== 'الكل') {
        const searchTarget = `${m.title} ${m.cropType} ${m.subTitle}`.toLowerCase();
        if (!searchTarget.includes(selectedSpecificCrop.toLowerCase())) {
          return false;
        }
      }

      // Governorate filter
      if (selectedGovernorate !== 'الكل') {
        if (!m.location.includes(selectedGovernorate)) return false;
      }

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const combined = `${m.title} ${m.cropType} ${m.subTitle} ${m.location}`.toLowerCase();
        if (!combined.includes(q)) return false;
      }

      return true;
    });
  }, [
    allMarkers,
    selectedEntityType,
    selectedCropCategory,
    selectedSpecificCrop,
    selectedGovernorate,
    searchQuery,
  ]);

  const handleOpenDetails = (marker: MapMarkerData) => {
    if (marker.type === 'ad') {
      showView('market');
    } else if (marker.originalFellow) {
      openFellowProfile(marker.originalFellow.id);
    }
  };

  const handleContact = (marker: MapMarkerData) => {
    setActiveConversationId('1');
    showView('messages');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f9fafb] text-right font-sans" dir="rtl">
      {/* Quota Exceeded Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Header & Filter Controls Bar */}
      <div className="bg-white border-b border-gray-100 p-4 md:px-6 shadow-xs z-10 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center font-bold">
                <MapPin size={20} />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-gray-900">
                  خريطة المحاصيل والمزارع التفاعلية
                </h1>
                <p className="text-xs text-gray-500">
                  استكشف أماكن الحصاد، المزارع المعتمدة، وشحنات المحاصيل الزراعية القريبة منك
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleLocateUser}
              className="h-9 px-3 bg-white border border-gray-200 hover:border-[#16a34a] hover:text-[#16a34a] text-gray-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <LocateFixed size={14} />
              <span>موقعي الحالي</span>
            </button>

            <button
              onClick={() => {
                setSelectedCropCategory('الكل');
                setSelectedSpecificCrop('الكل');
                setSelectedEntityType('all');
                setSelectedGovernorate('الكل');
                setSearchQuery('');
              }}
              className="h-9 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-xl flex items-center gap-1 transition cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>إعادة ضبط</span>
            </button>
          </div>
        </div>

        {/* Filter Badges & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-1">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بمحصول، مزرعة، أو منطقة..."
              className="w-full h-9 pr-9 pl-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#16a34a] transition"
            />
          </div>

          {/* Entity Type Selection */}
          <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedEntityType('all')}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                selectedEntityType === 'all'
                  ? 'bg-white text-gray-900 font-bold shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              الكل ({allMarkers.length})
            </button>
            <button
              onClick={() => setSelectedEntityType('ads')}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                selectedEntityType === 'ads'
                  ? 'bg-white text-[#16a34a] font-bold shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Sprout size={12} />
              <span>إعلانات</span>
            </button>
            <button
              onClick={() => setSelectedEntityType('farms')}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                selectedEntityType === 'farms'
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Store size={12} />
              <span>مزارع</span>
            </button>
          </div>

          {/* Governorate Selection */}
          <div className="relative">
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:bg-white focus:outline-none focus:border-[#16a34a] transition cursor-pointer"
            >
              <option value="الكل">جميع المحافظات الزراعية</option>
              {governorateList.slice(1).map((gov) => (
                <option key={gov} value={gov}>
                  محافظة {gov}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Category Selection */}
          <div className="relative">
            <select
              value={selectedCropCategory}
              onChange={(e) => setSelectedCropCategory(e.target.value)}
              className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:bg-white focus:outline-none focus:border-[#16a34a] transition cursor-pointer"
            >
              <option value="الكل">كل قطاعات التصنيف</option>
              {categoryList.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  قطاع {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Crop Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-gray-400 font-semibold shrink-0 ml-1">تصفية المحصول:</span>
          {cropList.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedSpecificCrop(crop)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSpecificCrop === crop
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Content Area with Side List on Desktop */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Map Container */}
        <div className="flex-1 h-[450px] md:h-auto min-h-[450px] relative">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={userLocation || { lat: 30.3, lng: 31.0 }}
              defaultZoom={8}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {/* User Location Marker if available */}
              {userLocation && (
                <AdvancedMarker position={userLocation} title="موقعك الحالي">
                  <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse" />
                </AdvancedMarker>
              )}

              {/* Markers for Ads and Farms */}
              {filteredMarkers.map((marker) => (
                <AdvancedMarker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => setActiveItem(marker)}
                  title={marker.title}
                >
                  {marker.type === 'ad' ? (
                    <Pin
                      background="#16a34a"
                      borderColor="#14532d"
                      glyphColor="#ffffff"
                      scale={1.05}
                    />
                  ) : (
                    <Pin
                      background="#2563eb"
                      borderColor="#1e3a8a"
                      glyphColor="#ffffff"
                      scale={1.1}
                    />
                  )}
                </AdvancedMarker>
              ))}

              {/* Info Window */}
              {activeItem && (
                <InfoWindow
                  position={{ lat: activeItem.lat, lng: activeItem.lng }}
                  onCloseClick={() => setActiveItem(null)}
                >
                  <div className="p-2 max-w-[280px] text-right font-sans" dir="rtl">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          activeItem.type === 'ad'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        {activeItem.type === 'ad' ? 'إعلان محصول' : 'مزرعة معتمدة'}
                      </span>
                      {activeItem.isVerified && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <ShieldCheck size={12} />
                          <span>موثق</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-xs text-gray-900 leading-snug mb-1">
                      {activeItem.title}
                    </h3>

                    <p className="text-[11px] text-gray-500 mb-2">
                      {activeItem.subTitle}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-2 text-[11px] space-y-1 mb-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">الموقع:</span>
                        <span className="font-semibold text-gray-800">{activeItem.location}</span>
                      </div>
                      {activeItem.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">السعر:</span>
                          <span className="font-bold text-[#16a34a]">{activeItem.price}</span>
                        </div>
                      )}
                      {activeItem.qty && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">الكمية:</span>
                          <span className="font-semibold text-gray-800">{activeItem.qty}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">المحصول:</span>
                        <span className="font-bold text-gray-800">{activeItem.cropType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenDetails(activeItem)}
                        className="flex-1 py-1.5 px-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold rounded-lg transition text-center cursor-pointer shadow-xs"
                      >
                        عرض التفاصيل
                      </button>
                      <button
                        onClick={() => handleContact(activeItem)}
                        className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[#16a34a] text-gray-700 hover:text-[#16a34a] flex items-center justify-center transition cursor-pointer"
                        title="مراسلة فورية"
                      >
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs border border-gray-100 rounded-xl p-2.5 shadow-md text-xs space-y-1.5 z-10 hidden sm:block">
            <div className="font-bold text-gray-900 text-[11px] mb-1">دليل الخريطة</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#16a34a]" />
              <span className="text-gray-600 text-[11px]">إعلانات المحاصيل المتاحة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-gray-600 text-[11px]">مزارع ومحطات تجميد معتمدة</span>
            </div>
          </div>
        </div>

        {/* Sidebar List of Filtered Items */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-r border-gray-100 flex flex-col max-h-[400px] md:max-h-none overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-700 bg-gray-50/50">
            <span>النتائج على الخريطة ({filteredMarkers.length})</span>
            <span className="text-[11px] text-[#16a34a]">محدث لحظياً</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-2 space-y-1">
            {filteredMarkers.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 space-y-2">
                <MapPin className="mx-auto text-gray-300" size={32} />
                <p>لا توجد مزارع أو إعلانات مطابقة للتصفية المختارة.</p>
                <button
                  onClick={() => {
                    setSelectedCropCategory('الكل');
                    setSelectedSpecificCrop('الكل');
                    setSelectedEntityType('all');
                    setSelectedGovernorate('الكل');
                    setSearchQuery('');
                  }}
                  className="text-[#16a34a] font-bold underline"
                >
                  إلغاء التصفية
                </button>
              </div>
            ) : (
              filteredMarkers.map((marker) => {
                const isSelected = activeItem?.id === marker.id;
                return (
                  <div
                    key={marker.id}
                    onClick={() => setActiveItem(marker)}
                    className={`p-3 rounded-xl border transition cursor-pointer text-right ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-200 shadow-xs'
                        : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            marker.type === 'ad'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}
                        >
                          {marker.type === 'ad' ? 'إعلان محصول' : 'مزرعة'}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500">
                          {marker.category}
                        </span>
                      </div>
                      {marker.price && (
                        <span className="font-bold text-xs text-[#16a34a]">
                          {marker.price}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs text-gray-900 mb-1 line-clamp-1">
                      {marker.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span className="truncate">{marker.location}</span>
                      <span className="text-gray-400">{marker.cropType}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
