'use client';

import { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, MapPin, Tag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { AdItem } from '@/types';
import { CATEGORIES_LIST, GOVERNORATES_LIST } from '@/data/mockData';

interface EditAdModalProps {
  ad: AdItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditAdModal({ ad, isOpen, onClose }: EditAdModalProps) {
  const { updateAd, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('فريش');
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('النوبارية - البحيرة');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ad) {
      setTitle(ad.title || '');
      setCategory(ad.category || 'فريش');
      setDesc(ad.desc || '');
      setQty(ad.qty || '');
      setPrice(ad.price || '');
      setLocation(ad.location || 'مصر');
      setImage(ad.image || null);
    }
  }, [ad]);

  if (!isOpen || !ad) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('يرجى كتابة عنوان الإعلان');
      return;
    }
    setLoading(true);
    const success = await updateAd(ad.id, {
      title: title.trim(),
      category,
      desc: desc.trim(),
      qty: qty.trim(),
      price: price.trim(),
      location: location.trim(),
      image: image || undefined,
    });
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-5 space-y-4 text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16a34a] flex items-center justify-center font-bold">
              <Tag size={18} />
            </div>
            <h3 className="font-extrabold text-base text-gray-900">
              تعديل الإعلان
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              عنوان الإعلان *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a] transition"
              placeholder="مثال: طماطم سلك فرز أول للتصدير"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                القطاع / التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a] transition bg-white"
              >
                {CATEGORIES_LIST.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                الموقع / المحافظة
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a] transition"
                placeholder="مثال: النوبارية - البحيرة"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                السعر
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a] transition"
                placeholder="مثال: ٧.٥ ج / كجم"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                الكمية المتاحة
              </label>
              <input
                type="text"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a] transition"
                placeholder="مثال: ٥ طن / يوم"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              تفاصيل ومواصفات المنتج
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a] transition"
              placeholder="اكتب تفاصيل الفرز، التعبئة، والشهادات المتوفرة..."
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
