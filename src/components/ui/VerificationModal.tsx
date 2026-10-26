'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Upload,
  FileText,
  Building2,
  Wheat,
  X,
  FileCheck,
  Clock,
  Sparkles,
  AlertCircle,
  Trash2,
} from 'lucide-react';

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: string;
  currentAccountType?: string;
  isVerified?: boolean;
  onVerificationComplete: (data: {
    role: string;
    accountType: string;
    verifiedDocuments: string[];
    verificationId: string;
  }) => void;
}

interface DocUploadState {
  id: string;
  label: string;
  required: boolean;
  fileName?: string;
  fileSize?: string;
  docNumber?: string;
  status: 'empty' | 'uploaded' | 'approved';
}

export default function VerificationModal({
  isOpen,
  onClose,
  currentUserRole = 'مزارع',
  currentAccountType = 'مزارع',
  isVerified = true,
  onVerificationComplete,
}: VerificationModalProps) {
  const initialCategory =
    currentUserRole.includes('مصنع') ||
    currentAccountType === 'مصنع' ||
    currentUserRole.includes('تصنيع')
      ? 'factory'
      : 'farmer';

  const [category, setCategory] = useState<'farmer' | 'factory'>(initialCategory);

  // Farmer docs state
  const [farmerDocs, setFarmerDocs] = useState<DocUploadState[]>([
    {
      id: 'farmer-tenure',
      label: 'كارت الفلاح / الحيازة الزراعية الرسمية',
      required: true,
      status: 'approved',
      fileName: 'cart-alfellah-verified.pdf',
      fileSize: '1.4 ميجابايت',
      docNumber: 'حيازة رقم: ٨٤٩٢٠/البحيرة',
    },
    {
      id: 'farmer-id',
      label: 'بطاقة الرقم القومي سارية (الوجهين)',
      required: true,
      status: 'approved',
      fileName: 'national-id-card.jpg',
      fileSize: '850 كيلوبايت',
      docNumber: 'الرقم القومي: ٢٨٩١٠١٥XXXXXXX',
    },
    {
      id: 'farmer-lab',
      label: 'شهادة فحص متبقيات المبيدات وجودة المحصول',
      required: false,
      status: 'approved',
      fileName: 'pesticide-test-report.pdf',
      fileSize: '2.1 ميجابايت',
      docNumber: 'تقرير معملي: LAB-EG-2024',
    },
  ]);

  // Factory docs state
  const [factoryDocs, setFactoryDocs] = useState<DocUploadState[]>([
    {
      id: 'factory-cr',
      label: 'السجل التجاري الصناعي ساري الصلاحية',
      required: true,
      status: 'approved',
      fileName: 'commercial-register-2024.pdf',
      fileSize: '2.8 ميجابايت',
      docNumber: 'سجل تجاري رقم: ٤٨٩٢١',
    },
    {
      id: 'factory-tax',
      label: 'البطاقة الضريبية ورقم التسجيل الضريبي',
      required: true,
      status: 'approved',
      fileName: 'tax-card-active.pdf',
      fileSize: '1.2 ميجابايت',
      docNumber: 'ملف ضريبي: ٩١٢-٣٠٤-٥٥٠',
    },
    {
      id: 'factory-nfsa',
      label: 'شهادة القيد بالهيئة القومية لسلامة الغذاء (NFSA)',
      required: true,
      status: 'approved',
      fileName: 'nfsa-food-safety-cert.pdf',
      fileSize: '3.4 ميجابايت',
      docNumber: 'ترخيص سلامة غذاء: NFSA-EG-882',
    },
    {
      id: 'factory-license',
      label: 'رخصة التشغيل ومطابقة المواصفات القياسية',
      required: false,
      status: 'approved',
      fileName: 'industrial-license.pdf',
      fileSize: '1.9 ميجابايت',
      docNumber: 'رخصة صناعية: IND-LIC-4410',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDocs = category === 'farmer' ? farmerDocs : factoryDocs;
  const setDocs = category === 'farmer' ? setFarmerDocs : setFactoryDocs;

  const handleSimulateUpload = (docId: string) => {
    setActiveUploadId(docId);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                status: 'approved',
                fileName:
                  category === 'farmer'
                    ? `وثيقة_مزارع_${docId.split('-')[1]}.pdf`
                    : `وثيقة_مصنع_${docId.split('-')[1]}.pdf`,
                fileSize: '1.5 ميجابايت',
              }
            : d
        )
      );
      setActiveUploadId(null);
    }, 600);
  };

  const handleRemoveDoc = (docId: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: 'empty', fileName: undefined, fileSize: undefined }
          : d
      )
    );
  };

  const handleSubmitVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const docsList = currentDocs
        .filter((d) => d.status === 'approved')
        .map((d) => d.label);

      const generatedId =
        category === 'farmer'
          ? `CC-FRM-${Math.floor(1000 + Math.random() * 9000)}`
          : `CC-FAC-${Math.floor(1000 + Math.random() * 9000)}`;

      onVerificationComplete({
        role: category === 'farmer' ? 'مزارع' : 'مصنع',
        accountType: category === 'farmer' ? 'مزارع' : 'مصنع',
        verifiedDocuments: docsList,
        verificationId: generatedId,
      });
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 lg:p-7 shadow-2xl border border-gray-100 relative space-y-6 text-right max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck size={26} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">
                  توثيق الحساب وطلب شارة الموثوقية
                </h3>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  رسمي معتمد
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                قم برفع الوثائق الرسمية لتمييز حسابك بـ "شارة الموثوقية" كـ مزارع أو مصنع موثوق
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div>
          <label className="text-xs font-black text-gray-700 mb-2 block">
            اختر قطاع ونوع التوثيق المطلوب للحساب:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCategory('farmer')}
              className={`p-3.5 rounded-2xl border-2 transition cursor-pointer text-right flex items-center gap-3 ${
                category === 'farmer'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-2xs'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  category === 'farmer'
                    ? 'bg-[#16a34a] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Wheat size={18} />
              </div>
              <div>
                <div className="font-black text-sm">مزارع موثوق</div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  حيازة زراعية • كارت فلاح
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategory('factory')}
              className={`p-3.5 rounded-2xl border-2 transition cursor-pointer text-right flex items-center gap-3 ${
                category === 'factory'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-2xs'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  category === 'factory'
                    ? 'bg-[#16a34a] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Building2 size={18} />
              </div>
              <div>
                <div className="font-black text-sm">مصنع ومحطة موثقة</div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  سجل تجاري • سلامة الغذاء
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Requirements Banner */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
          <Sparkles size={18} className="text-[#16a34a] shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <strong>مزايا شارة الموثوقية:</strong> تمنحك شارة خضراء رسمية تظهر بجانب اسمك في
            صفحة البروفايل، ونتائج البحث، وقائمة الإعلانات لتعزيز ثقة كبار التجار والمصدرين.
          </div>
        </div>

        {/* Documents Upload Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-gray-800">
            <span>الوثائق الرسمية المطلوبة:</span>
            <span className="text-emerald-700 font-bold">
              {currentDocs.filter((d) => d.status === 'approved').length} من {currentDocs.length} وثائق مكتملة
            </span>
          </div>

          <div className="space-y-2.5">
            {currentDocs.map((doc) => {
              const isApproved = doc.status === 'approved';
              const isUploadingThis = activeUploadId === doc.id;

              return (
                <div
                  key={doc.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    isApproved
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-gray-200 bg-[#f9fafb]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        {isApproved ? (
                          <CheckCircle2 size={18} className="text-[#16a34a]" />
                        ) : (
                          <FileText size={18} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-gray-900">
                            {doc.label}
                          </span>
                          {doc.required && (
                            <span className="text-[10px] text-red-500 font-bold">
                              *إلزامي
                            </span>
                          )}
                        </div>

                        {isApproved && (
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-emerald-700">
                            <span className="font-bold text-gray-700 truncate">
                              {doc.fileName}
                            </span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                            {doc.docNumber && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-gray-600">{doc.docNumber}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isApproved ? (
                        <>
                          <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-md">
                            معتمد ✓
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            title="حذف الوثيقة"
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 flex items-center justify-center transition cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(doc.id)}
                          disabled={isUploadingThis}
                          className="h-8 px-3 bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
                        >
                          <Upload size={13} className={isUploadingThis ? 'animate-bounce' : ''} />
                          <span>{isUploadingThis ? 'جاري الفحص...' : 'رفع الوثيقة'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck size={14} className="text-[#16a34a]" />
            <span>بياناتك وتراخيصك مشفرة ومحمية وفق معايير الخصوصية</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmitVerification}
              disabled={isSubmitting}
              className="h-10 px-6 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl text-xs font-black hover:opacity-95 transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>جاري الاعتماد...</span>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  <span>تأكيد الوثائق وتفعيل شارة الموثوقية</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
