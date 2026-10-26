'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';
import { DOC_TEMPLATES } from '@/data/mockData';

export default function DocsView() {
  const {
    selectedDocTemplateId,
    setSelectedDocTemplateId,
    savedDocs,
    saveNewDoc,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState({
    party1: '',
    party2: '',
    amount: '',
    date: '',
    notes: '',
  });

  const [docNumber, setDocNumber] = useState('849201');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: prev.date || new Date().toISOString().split('T')[0],
    }));
    setDocNumber(Date.now().toString().slice(-6));
  }, [selectedDocTemplateId]);

  const selectedTemplate = DOC_TEMPLATES.find((t) => t.id === selectedDocTemplateId);

  const handleSave = () => {
    if (!selectedDocTemplateId) return;
    saveNewDoc({
      id: Date.now().toString(),
      title: selectedTemplate?.title || 'مستند',
      date: new Date().toLocaleDateString('ar-EG'),
      party: formData.party2 || 'بدون اسم',
    });
  };

  return (
    <div>
      <Header />
      <div className="max-w-[1280px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        <h1 className="text-[28px] font-extrabold mb-2">المستندات</h1>
        <p className="text-sm text-gray-500 mb-6">
          نماذج جاهزة - املأ البيانات وشوف المعاينة الحية للطباعة
        </p>

        {!selectedDocTemplateId ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DOC_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedDocTemplateId(tmpl.id)}
                  className="text-right bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-green-200 hover:shadow-md transition group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">
                    {tmpl.icon}
                  </div>
                  <div className="mt-4 font-bold group-hover:text-[#16a34a] transition">
                    {tmpl.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{tmpl.desc}</div>
                  <div className="mt-4 text-xs font-bold text-[#16a34a] flex items-center gap-1">
                    <span>استخدام النموذج</span>
                    <ArrowLeft size={14} />
                  </div>
                </button>
              ))}
            </div>

            {/* Saved Docs Table */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50 font-bold flex items-center justify-between">
                <span>مستنداتي</span>
                <span className="text-xs bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                  {savedDocs.length} مستند
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs">
                    <tr>
                      <th className="text-right py-3 px-5">العنوان</th>
                      <th className="text-right py-3 px-5">الطرف</th>
                      <th className="text-right py-3 px-5">التاريخ</th>
                      <th className="text-right py-3 px-5">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedDocs.map((doc) => (
                      <tr key={doc.id} className="border-t border-gray-50">
                        <td className="py-3 px-5 font-bold">{doc.title}</td>
                        <td className="py-3 px-5 text-gray-600">{doc.party}</td>
                        <td className="py-3 px-5 text-gray-500 text-xs">{doc.date}</td>
                        <td className="py-3 px-5">
                          <button
                            onClick={() => showToast('تحميل PDF جاهز للطباعة')}
                            className="h-7 px-3 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-black transition cursor-pointer"
                          >
                            طباعة
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
              <button
                onClick={() => setSelectedDocTemplateId(null)}
                className="mb-4 h-8 px-4 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-100"
              >
                <ArrowRight size={14} />
                <span>رجوع</span>
              </button>

              <div className="font-bold mb-4">{selectedTemplate?.title}</div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    الطرف الأول (البائع / المسلم)
                  </label>
                  <input
                    type="text"
                    value={formData.party1}
                    onChange={(e) => setFormData({ ...formData, party1: e.target.value })}
                    className="mt-1 w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:border-green-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">
                    الطرف الثاني (المشتري / المستلم)
                  </label>
                  <input
                    type="text"
                    value={formData.party2}
                    onChange={(e) => setFormData({ ...formData, party2: e.target.value })}
                    className="mt-1 w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:border-green-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">
                    المبلغ / الكمية
                  </label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1 w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:border-green-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">التاريخ</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full h-10 px-4 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:border-green-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">ملاحظات</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-1 w-full min-h-[80px] p-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-green-200 resize-none"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full h-11 bg-[#16a34a] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#15803d] transition cursor-pointer"
                >
                  <FileCheck size={18} />
                  <span>حفظ وطباعة</span>
                </button>
              </div>
            </div>

            {/* Live A4 Paper Preview */}
            <div className="bg-[#f9fafb] rounded-2xl border border-gray-100 p-6 lg:p-10 flex justify-center overflow-auto">
              <div className="a4-paper w-full max-w-[680px] min-h-[800px] rounded-lg p-10 relative">
                <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-extrabold">
                        C
                      </div>
                      <span className="font-extrabold text-lg">ContCrops</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      منصة زراعية مجانية • contcrops.com
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold text-xl">{selectedTemplate?.title}</div>
                    <div className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
                      رقم المستند: #{docNumber}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] text-gray-400 font-bold">الطرف الأول</div>
                      <div className="font-bold mt-1 text-[15px]">
                        {formData.party1 || '................................'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 font-bold">المبلغ / الكمية</div>
                      <div className="font-bold mt-1">
                        {formData.amount || '................................'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] text-gray-400 font-bold">الطرف الثاني</div>
                      <div className="font-bold mt-1 text-[15px]">
                        {formData.party2 || '................................'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 font-bold">التاريخ</div>
                      <div className="font-bold mt-1" suppressHydrationWarning>
                        {formData.date || '—'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="text-[11px] text-gray-400 font-bold mb-2">البيان</div>
                  <div className="min-h-[120px] border border-dashed border-gray-200 rounded-xl p-4 text-sm leading-7 bg-gray-50/50">
                    {formData.notes ||
                      'سيتم كتابة تفاصيل العملية هنا بشكل تلقائي عند ملء النموذج...'}
                  </div>
                </div>

                <div className="mt-12 flex justify-between">
                  <div className="text-center">
                    <div className="w-32 h-20 border border-dashed border-gray-300 rounded-xl mx-auto" />
                    <div className="text-xs mt-2 font-bold">توقيع الطرف الأول</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 border border-gray-200 rounded-xl flex items-center justify-center text-[10px] text-gray-400">
                      QR
                      <br />
                      للتحقق
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">
                      موثق عبر ContCrops
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-32 h-20 border border-dashed border-gray-300 rounded-xl mx-auto" />
                    <div className="text-xs mt-2 font-bold">توقيع الطرف الثاني</div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-10 right-10 text-[10px] text-gray-400 border-t border-gray-100 pt-3 flex justify-between">
                  <span>تم إنشاء المستند عبر منصة ContCrops المجانية</span>
                  <span>مجاني ١٠٠٪ بدون عمولة</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
