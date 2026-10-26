'use client';

import { Share2, X, User, Link2, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ShareModal() {
  const {
    shareModal,
    closeShareModal,
    shareToProfile,
    copyShareLink,
    shareWhatsApp,
    shareFacebook,
    shareTwitter,
    ads,
    communityPosts,
  } = useApp();

  if (!shareModal.open) return null;

  const targetAd = ads.find((a) => a.id === shareModal.adId);
  const targetPost =
    shareModal.source === 'post'
      ? communityPosts.find((p) => p.id === shareModal.postId)
      : null;
  const previewText =
    targetAd?.title ||
    targetPost?.text.slice(0, 60) ||
    'مشاركة من ContCrops';

  return (
    <div
      id="share-modal"
      className="fixed inset-0 z-[80] flex items-end lg:items-center justify-center p-4"
    >
      <div
        data-share-backdrop
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeShareModal}
      />
      <div
        data-share-inner
        className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 animate-[bounce_0.2s_ease]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-extrabold text-[16px] flex items-center gap-2">
            <Share2 size={18} className="text-[#16a34a]" />
            <span>مشاركة الإعلان</span>
          </div>
          <button
            onClick={closeShareModal}
            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-3 text-xs text-gray-600 leading-6 mb-4">
          {previewText}
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={shareToProfile}
            className="h-11 w-full bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <User size={16} />
            <span>مشاركة على بروفايلك</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={copyShareLink}
              className="h-11 bg-white border border-gray-100 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <Link2 size={16} />
              <span>نسخ الرابط</span>
            </button>

            <button
              onClick={shareWhatsApp}
              className="h-11 bg-[#25D366] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#128C7E] transition cursor-pointer"
            >
              <MessageCircle size={16} />
              <span>واتساب</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={shareFacebook}
              className="h-11 bg-[#1877F2] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="font-extrabold">f</span>
              <span>فيسبوك</span>
            </button>

            <button
              onClick={shareTwitter}
              className="h-11 bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>𝕏 تويتر</span>
            </button>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-center text-gray-400">
          المشاركة مجانية • ContCrops
        </div>
      </div>
    </div>
  );
}
