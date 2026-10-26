'use client';

import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { RATING_TAGS } from '@/data/mockData';

export default function RatingModal() {
  const {
    ratingModalOpen,
    currentRatingFellowId,
    closeRatingModal,
    submitRating,
    selectedFellow,
    fellows,
    myFellows,
    fellowRequests,
    fellowSuggestions,
  } = useApp();

  const [stars, setStars] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (ratingModalOpen) {
      setStars(0);
      setComment('');
      setSelectedTags([]);
      const timer = setTimeout(() => {
        try {
          document.getElementById('rating-comment')?.focus();
        } catch {}
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [ratingModalOpen]);

  if (!ratingModalOpen) return null;

  const pool = [...fellows, ...myFellows, ...fellowRequests, ...fellowSuggestions];
  const fellow =
    pool.find((f) => f.id === currentRatingFellowId) ||
    selectedFellow || {
      id: currentRatingFellowId || 'unknown',
      name: 'زميل',
      initial: 'أ',
    };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getStarLabel = (count: number) => {
    switch (count) {
      case 1:
        return 'سيء';
      case 2:
        return 'مقبول';
      case 3:
        return 'جيد';
      case 4:
        return 'جيد جداً';
      case 5:
        return 'ممتاز';
      default:
        return 'اضغط على النجوم للتقييم';
    }
  };

  const handleSubmit = () => {
    submitRating(fellow.id, stars, comment, selectedTags);
  };

  return (
    <div
      id="rating-modal"
      className="fixed inset-0 z-[85] flex items-end lg:items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeRatingModal}
      />
      <div className="relative w-full max-w-[460px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="font-extrabold text-[16px] flex items-center gap-2">
            <Star size={18} className="text-yellow-500" fill="currentColor" />
            <span>تقييم الزميل</span>
          </div>
          <button
            onClick={closeRatingModal}
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-3 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] border border-green-100 flex items-center justify-center font-bold text-[#15803d]">
            {fellow.initial || 'أ'}
          </div>
          <div>
            <div className="font-bold text-sm">{fellow.name || 'زميل'}</div>
            <div className="text-[11px] text-gray-500">
              اكتب تجربتك مع هذا الزميل - تقييمك يساعد الآخرين
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-bold text-gray-700 mb-2">كم نجمة تعطيه؟</div>
          <div className="flex items-center justify-center gap-2 bg-[#f9fafb] border border-gray-100 rounded-2xl p-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                data-star={s}
                onClick={() => setStars(s)}
                className={`text-[36px] leading-none transition-transform hover:scale-110 cursor-pointer ${
                  s <= stars ? 'text-yellow-400' : 'text-gray-300'
                }`}
                title={`${s} نجوم`}
              >
                {s <= stars ? '★' : '☆'}
              </button>
            ))}
          </div>
          <div className="text-center text-[11px] text-gray-400 mt-2">
            {getStarLabel(stars)}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-bold text-gray-700 mb-2">اكتب كومنت تقييم</div>
          <textarea
            id="rating-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="مثال: تعامل محترم والتزام بالمواعيد، أنصح بالتعامل معه..."
            className="w-full min-h-[100px] p-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm leading-6 focus:outline-none focus:border-yellow-200 focus:bg-white transition resize-none"
            autoFocus
          />
          <div className="text-[11px] text-gray-400 mt-1 text-left">
            {comment.length} حرف
          </div>
        </div>

        <div className="mb-5">
          <div className="text-xs font-bold text-gray-700 mb-2">
            وسوم سريعة (اختياري)
          </div>
          <div className="flex flex-wrap gap-2">
            {RATING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`h-8 px-3 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                  selectedTags.includes(tag)
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                }`}
              >
                {tag} {selectedTags.includes(tag) ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={closeRatingModal}
            className="flex-1 h-11 bg-white border border-gray-100 rounded-xl text-sm font-bold hover:bg-gray-50 transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[2] h-11 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
          >
            <Star size={16} />
            <span>إرسال التقييم</span>
          </button>
        </div>

        <div className="mt-3 text-[11px] text-center text-gray-400">
          تقييمك سيظهر في قسم التقييمات فوراً • مجاني
        </div>
      </div>
    </div>
  );
}
