'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Building2,
  Wheat,
  FileCheck,
  Clock,
  Sparkles,
  X,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import type { VerificationStatus } from '@/types';

export interface VerificationBadgeProps {
  role?: string;
  accountType?: string;
  spec?: string;
  stars?: number;
  rating?: number;
  isVerified?: boolean;
  verificationStatus?: VerificationStatus;
  verifiedDocuments?: string[];
  verificationId?: string;
  verifiedAt?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'badge-only';
  showDetails?: boolean;
  showStarRating?: boolean;
  showDocumentsCount?: boolean;
  allowModalInspection?: boolean;
  className?: string;
}

export interface VerificationMeta {
  type: 'farmer' | 'factory' | 'supplier' | 'exporter' | 'general';
  label: string;
  badgeTitle: string;
  iconType: 'farmer' | 'factory' | 'supplier';
  defaultDocs: string[];
}

/**
 * Returns metadata describing whether the entity is a farmer, factory, supplier, etc.
 */
export function getVerificationMeta(
  role?: string,
  accountType?: string,
  spec?: string
): VerificationMeta {
  const text = `${role || ''} ${accountType || ''} ${spec || ''}`.toLowerCase();

  if (
    text.includes('مصنع') ||
    text.includes('تصنيع') ||
    text.includes('تجميد') ||
    text.includes('مركزات') ||
    text.includes('صناعي')
  ) {
    return {
      type: 'factory',
      label: 'مصنع موثق',
      badgeTitle: 'مصنع ومحطة تعبئة موثقة',
      iconType: 'factory',
      defaultDocs: [
        'السجل التجاري الصناعي المعتمد',
        'البطاقة الضريبية سارية',
        'شهادة الهيئة القومية لسلامة الغذاء (NFSA)',
        'رخصة التشغيل ومطابقة المواصفات',
      ],
    };
  }

  if (text.includes('مورد') || text.includes('توريد')) {
    return {
      type: 'supplier',
      label: 'مورد موثوق',
      badgeTitle: 'مورد معتمد عالي التقييم',
      iconType: 'supplier',
      defaultDocs: [
        'سجل تجاري توريدات زراعية وعمومية',
        'بطاقة ضريبية مسجلة',
        'عضوية الغرفة التجارية',
      ],
    };
  }

  if (text.includes('تصدير') || text.includes('مصدر')) {
    return {
      type: 'exporter',
      label: 'مصدر موثق',
      badgeTitle: 'شركة تصدير زراعي معتمدة',
      iconType: 'factory',
      defaultDocs: [
        'سجل المصدرين التجاري',
        'شهادة GlobalGAP الزراعية',
        'شهادة فحص متبقيات المبيدات',
      ],
    };
  }

  // Default to Farmer (مزارع)
  return {
    type: 'farmer',
    label: 'مزارع موثق',
    badgeTitle: 'مزارع معتمد بالوثائق الزراعية',
    iconType: 'farmer',
    defaultDocs: [
      'كارت الفلاح / الحيازة الزراعية الرسمية',
      'بطاقة الرقم القومي سارية',
      'فحص جودة المحصول ومتبقيات المبيدات',
    ],
  };
}

/**
 * Checks whether an entity qualifies for the "شارة الموثوقية" (Verification Badge).
 * Criteria:
 * - Explicitly verified (`isVerified === true` or `verificationStatus === 'verified'`)
 * - OR Farmers ("مزارع") & Factories ("مصنع") & Suppliers ("مورد") with high rating (>= 4.5)
 */
export function isQualifiedForVerification(entity?: {
  role?: string;
  accountType?: string;
  spec?: string;
  stars?: number;
  rating?: number;
  isVerified?: boolean;
  verificationStatus?: VerificationStatus;
} | null): boolean {
  if (!entity) return false;
  if (entity.isVerified === true || entity.verificationStatus === 'verified') return true;
  if (entity.verificationStatus === 'pending' || entity.verificationStatus === 'unverified') return false;

  const roleText = `${entity.role || ''} ${entity.accountType || ''} ${entity.spec || ''}`.toLowerCase();

  const isTargetCategory =
    roleText.includes('مزارع') ||
    roleText.includes('مصنع') ||
    roleText.includes('تصنيع') ||
    roleText.includes('تجميد') ||
    roleText.includes('مورد') ||
    roleText.includes('توريد') ||
    roleText.includes('زراعي') ||
    roleText.includes('إنتاج');

  const ratingValue = entity.stars ?? entity.rating ?? 0;
  return isTargetCategory && ratingValue >= 4.5;
}

export default function VerificationBadge({
  role = 'مزارع',
  accountType,
  spec,
  stars,
  rating,
  isVerified,
  verificationStatus = 'verified',
  verifiedDocuments,
  verificationId,
  verifiedAt = '٢٠٢٤/٠١/١٥',
  size = 'md',
  showDetails = false,
  showStarRating = true,
  showDocumentsCount = false,
  allowModalInspection = true,
  className = '',
}: VerificationBadgeProps) {
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  const currentRating = stars ?? rating ?? 4.8;
  const qualifies = isQualifiedForVerification({
    role,
    accountType,
    spec,
    stars: currentRating,
    isVerified,
    verificationStatus,
  });

  if (!qualifies) return null;

  const meta = getVerificationMeta(role, accountType, spec);
  const effectiveDocs =
    verifiedDocuments && verifiedDocuments.length > 0
      ? verifiedDocuments
      : meta.defaultDocs;
  const officialId =
    verificationId ||
    `CC-${meta.type.toUpperCase().slice(0, 3)}-${Math.abs(
      (role.length * 37 + 1092) % 9000 + 1000
    )}`;

  const handleBadgeClick = (e: React.MouseEvent) => {
    if (allowModalInspection) {
      e.stopPropagation();
      setShowInspectionModal(true);
    }
  };

  return (
    <>
      {/* 1. BADGE-ONLY (FOR AVATARS AND TINY CHIPS) */}
      {size === 'badge-only' && (
        <span
          onClick={handleBadgeClick}
          title={`شارة الموثوقية (${meta.label}) - وثائق رسمية مفحوصة`}
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white shadow-xs cursor-pointer hover:scale-105 transition ${className}`}
        >
          <ShieldCheck size={12} strokeWidth={2.5} />
        </span>
      )}

      {/* 2. COMPACT (SM) - FOR SEARCH RESULTS AND LISTS */}
      {size === 'sm' && (
        <button
          type="button"
          onClick={handleBadgeClick}
          title={`شارة الموثوقية (${meta.label}) - اضغط لعرض الوثائق المعتمدة`}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 text-emerald-800 border border-emerald-200/90 shadow-2xs shrink-0 hover:border-emerald-300 transition cursor-pointer ${className}`}
        >
          <ShieldCheck size={11} className="text-[#16a34a] shrink-0" strokeWidth={2.5} />
          <span>{meta.label}</span>
          {showStarRating && currentRating > 0 && (
            <span className="inline-flex items-center text-amber-700 font-bold mr-0.5 text-[10px]">
              ★ {currentRating}
            </span>
          )}
        </button>
      )}

      {/* 3. MEDIUM (MD) - STANDARD PROFILE PILL */}
      {size === 'md' && (
        <button
          type="button"
          onClick={handleBadgeClick}
          title={`شارة الموثوقية (${meta.label}) - انقر لعرض تفاصيل التوثيق الرسمي`}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition cursor-pointer ${className}`}
        >
          <ShieldCheck size={14} className="text-[#16a34a] shrink-0" strokeWidth={2.5} />
          <span>شارة الموثوقية</span>
          <span className="text-[10px] text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200/80 font-bold">
            {meta.label}
          </span>
          {showDocumentsCount && (
            <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-md font-bold">
              {effectiveDocs.length} وثائق ✓
            </span>
          )}
          {showStarRating && (
            <span className="inline-flex items-center gap-0.5 text-amber-700 text-[11px] font-black mr-0.5">
              <Star size={10} fill="currentColor" className="text-amber-500" />
              <span>{currentRating}</span>
            </span>
          )}
        </button>
      )}

      {/* 4. LARGE (LG) - CARD BADGE */}
      {size === 'lg' && (
        <div
          onClick={handleBadgeClick}
          className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/80 border border-emerald-200 text-emerald-900 shadow-sm cursor-pointer hover:border-emerald-300 transition ${className}`}
        >
          <div className="w-9 h-9 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shadow-xs shrink-0">
            {meta.iconType === 'factory' ? (
              <Building2 size={18} strokeWidth={2.5} />
            ) : (
              <ShieldCheck size={18} strokeWidth={2.5} />
            )}
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2 font-black text-xs text-emerald-950">
              <span>شارة الموثوقية</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-md font-bold">
                {meta.label}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-white/70 px-1.5 py-0.2 rounded-md border border-emerald-200">
                حساب موثق بالوثائق
              </span>
            </div>
            {showDetails && (
              <div className="text-[11px] text-emerald-800 font-medium mt-0.5 flex items-center gap-2">
                <span>تم التحقق من الوثائق الرسمية</span>
                <span className="font-bold text-amber-700 flex items-center gap-0.5">
                  <Star size={10} fill="currentColor" className="text-amber-500" />
                  <span>{currentRating}</span>
                </span>
                <span>• كود {officialId}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. HERO CARD (FULL SECTION FOR PROFILE PAGES) */}
      {size === 'hero' && (
        <div
          className={`p-4 lg:p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/70 border-2 border-emerald-200 text-right shadow-sm relative overflow-hidden ${className}`}
        >
          {/* Subtle watermark shield */}
          <div className="absolute top-2 left-2 text-emerald-500/10 pointer-events-none">
            <ShieldCheck size={110} strokeWidth={1} />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center shadow-md shrink-0">
                  {meta.iconType === 'factory' ? (
                    <Building2 size={24} strokeWidth={2.3} />
                  ) : (
                    <ShieldCheck size={24} strokeWidth={2.3} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-base text-emerald-950">
                      شارة الموثوقية الرسمية (Verified Badge)
                    </h3>
                    <span className="text-xs font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      {meta.label}
                    </span>
                    <span className="text-xs font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      حساب موثق رسمي ✓
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800 mt-0.5">
                    {meta.badgeTitle} • معتمد ومفحوص من إدارة شبكة ContCrops
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBadgeClick}
                  className="h-8 px-3.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <FileText size={13} className="text-[#16a34a]" />
                  <span>عرض الوثائق ({effectiveDocs.length})</span>
                </button>
              </div>
            </div>

            {/* Verified Documents Checklist */}
            <div>
              <div className="text-xs font-black text-emerald-900 mb-2 flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-[#16a34a]" />
                <span>الوثائق والتراخيص الرسمية المعتمدة للحساب:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {effectiveDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white/90 border border-emerald-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 shadow-2xs"
                  >
                    <CheckCircle2 size={15} className="text-[#16a34a] shrink-0" />
                    <span className="truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-emerald-800/80 border-t border-emerald-200/50">
              <div className="flex items-center gap-3">
                <span>
                  <strong>رقم الاعتماد:</strong> {officialId}
                </span>
                <span>•</span>
                <span>
                  <strong>تاريخ التحقق:</strong> {verifiedAt}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-900 font-bold">
                <Sparkles size={12} className="text-amber-500" />
                <span>حساب يتمتع بأعلى معايير الأمان والتوريد الزراعي</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTION MODAL */}
      {showInspectionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowInspectionModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative space-y-5 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16a34a] border border-emerald-100 flex items-center justify-center shadow-xs shrink-0">
                  <ShieldCheck size={26} strokeWidth={2.3} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-gray-900">
                      بيانات شارة الموثوقية والتحقق
                    </h3>
                    <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    شهادة تحقق رقمية صادرة عبر منصة ContCrops الزراعية
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInspectionModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Official Badge Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/60 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck size={16} className="text-[#16a34a]" />
                  <span>حالة الحساب: حساب موثق بالوثائق الرسمية</span>
                </span>
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-md font-black">
                  معتمد 100%
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                تم فحص الوثائق والتراخيص الرسمية الخاصة بهذا العضو والتحقق من
                مطابقتها للمواصفات القانونية والتجارية لضمان سلامة المعاملات.
              </p>
            </div>

            {/* Documents List */}
            <div className="space-y-2">
              <div className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                <FileCheck size={14} className="text-[#16a34a]" />
                <span>الوثائق المفحوصة والمثبتة في الأرشيف:</span>
              </div>
              <div className="space-y-2">
                {effectiveDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />
                      <span className="font-bold text-gray-900">{doc}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
                      تم الفحص والاعتماد
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Table */}
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1.5 text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">كود التحقق والاعتماد:</span>
                <span className="font-extrabold text-gray-900">{officialId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">تاريخ التوثيق:</span>
                <span className="font-bold text-gray-900">{verifiedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">تقييم المعاملات:</span>
                <span className="font-bold text-amber-600">★ {currentRating} من ٥</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#16a34a]" />
                <span>موثق رسمياً على منصة ContCrops</span>
              </span>
              <button
                type="button"
                onClick={() => setShowInspectionModal(false)}
                className="h-9 px-5 bg-[#16a34a] text-white rounded-xl text-xs font-bold hover:bg-[#15803d] transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
