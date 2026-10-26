'use client';

import { useState, type ChangeEvent } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function NewAdModal() {
  const {
    newAdModalOpen,
    setNewAdModalOpen,
    newAdImage,
    setNewAdImage,
    addAd,
    showToast,
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('فريش');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState('');
  const [location, setLocation] = useState('');

  if (!newAdModalOpen) return null;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3145728) {
      showToast('الصورة كبيرة - الحد 3 ميجا');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewAdImage(result);
      try {
        (window as unknown as { newAdImageData: string }).newAdImageData = result;
      } catch {}
      showToast('تم تحميل الصورة ✓');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setNewAdImage(null);
    try {
      (window as unknown as { newAdImageData: null }).newAdImageData = null;
      const input = document.getElementById('ad-image-input') as HTMLInputElement | null;
      if (input) input.value = '';
    } catch {}
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast('اكتب عنوان الإعلان');
      return;
    }
    addAd({
      title,
      category,
      price,
      desc,
      qty,
      location,
      image: newAdImage || undefined,
    });
    // Reset form
    setTitle('');
    setCategory('فريش');
    setPrice('');
    setDesc('');
    setQty('');
    setLocation('');
  };

  const handleClose = () => {
    setNewAdModalOpen(false);
    setNewAdImage(null);
  };

  return (
    <div
      id="modal-new-ad"
      className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full lg:max-w-[520px] bg-white rounded-t-[28px] lg:rounded-2xl shadow-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-50 p-5 flex items-center justify-between rounded-t-[28px] lg:rounded-t-2xl z-10">
          <div className="font-extrabold text-lg">انشر إعلان جديد</div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-[#f0fdf4] border border-green-100 rounded-2xl p-3 text-xs leading-6 text-green-800">
            <span className="font-bold">مجاناً ١٠٠٪: </span>
            إعلانك يظهر فوراً لكل القطاعات من فريش لمجمد لمجفف لتصنيع لاستشارات لنقل
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">عنوان الإعلان</label>
            <input
              id="ad-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان الإعلان - فراولة فريش..."
              className="mt-1 w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-200"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">الفئة</label>
            <select
              id="ad-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-200 cursor-pointer"
            >
              <option value="فريش">فريش</option>
              <option value="مجمد">مجمد</option>
              <option value="مجفف">مجفف</option>
              <option value="تصنيع غذائي">تصنيع غذائي</option>
              <option value="استشارات">استشارات</option>
              <option value="نقل">نقل</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">السعر</label>
            <input
              id="ad-price-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="مثال: ٧.٥ ج / كجم"
              className="mt-1 w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-200"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">الوصف</label>
            <textarea
              id="ad-desc-textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="مواصفات، تعبئة، شهادات..."
              className="mt-1 w-full min-h-[80px] p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-green-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600">الكمية</label>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="٥ طن"
                className="mt-1 w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">الموقع</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="النوبارية - البحيرة"
                className="mt-1 w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="ad-image-input"
              className="w-full h-12 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer transition bg-[#f9fafb]"
            >
              <span>📷 تحميل صورة الإعلان (اختياري)</span>
              <input
                id="ad-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {newAdImage && (
              <div className="relative">
                <img
                  id="ad-image-preview"
                  src={newAdImage}
                  className="w-full h-40 object-cover rounded-xl border border-gray-100"
                  alt="معاينة"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white rounded-full flex items-center justify-center text-sm hover:bg-black cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-11 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              id="btn-submit-ad"
              type="button"
              onClick={handleSubmit}
              className="flex-[2] h-11 bg-[#16a34a] text-white rounded-xl text-sm font-bold hover:bg-[#15803d] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check size={16} />
              <span>نشر الإعلان</span>
            </button>
          </div>

          <div className="text-[11px] text-center text-gray-400">
            بالنشر توافق على أن التواصل مباشر بدون وسيط
          </div>
        </div>
      </div>
    </div>
  );
}
