'use client';

import { useState, type ChangeEvent } from 'react';
import {
  Clock,
  Ellipsis,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Search,
  Users,
  UserCheck,
  Check,
  X,
  Lightbulb,
  MapPin,
  Pencil,
  Trash2,
  AlertTriangle,
  Eye,
  UserPlus,
} from 'lucide-react';
import Header from '@/components/ui/Header';
import { useApp } from '@/context/AppContext';
import VerificationBadge from '@/components/ui/VerificationBadge';
import type { CommunityPost } from '@/types';

export default function CommunityView() {
  const {
    currentUser,
    isLoggedIn,
    isAdmin,
    communityPosts,
    sharedItems,
    addPost,
    updatePost,
    deletePost,
    togglePostLike,
    addPostComment,
    updatePostComment,
    deletePostComment,
    openShareModal,
    myFellows,
    fellowRequests,
    fellowSuggestions,
    acceptFellowship,
    rejectFellowship,
    addSuggestedFellow,
    dismissSuggestion,
    removeMyFellow,
    openFellowProfile,
    showView,
    showToast,
  } = useApp();

  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [editingPostText, setEditingPostText] = useState('');
  const [deletingPost, setDeletingPost] = useState<CommunityPost | null>(null);
  const [editingPostComment, setEditingPostComment] = useState<{
    postId: string;
    commentIndex: number;
    text: string;
  } | null>(null);

  const canModifyPost = (post: CommunityPost) => {
    if (!isLoggedIn) return false;
    if (isAdmin) return true;
    return post.user === currentUser?.name || post.user === 'أنت';
  };

  const canModifyPostComment = (post: CommunityPost, commentUser: string) => {
    if (!isLoggedIn) return false;
    if (isAdmin) return true;
    return (
      commentUser === currentUser?.name ||
      commentUser === 'أنت' ||
      canModifyPost(post)
    );
  };

  const handleUserClick = (userName: string) => {
    if (currentUser?.name && (currentUser.name === userName || userName === 'أنت')) {
      showView('profile');
    } else {
      openFellowProfile(userName);
    }
  };

  const [mainTab, setMainTab] = useState<'posts' | 'fellows' | 'mine'>('posts');
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);

  const [openPostComments, setOpenPostComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Fellows sub-tab state
  const [fellowsFilter, setFellowsFilter] = useState<'all' | 'my' | 'requests' | 'suggestions'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3145728) {
      showToast('الصورة كبيرة جداً - الحد 3 ميجا');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setPostImage(event.target?.result as string);
      showToast('تم تحميل الصورة ✓');
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = () => {
    if (!postText.trim() && !postImage) {
      showToast('اكتب نص أو أضف صورة');
      return;
    }
    addPost(postText, postImage || undefined);
    setPostText('');
    setPostImage(null);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    addPostComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const searchResults = searchQuery.trim()
    ? [...myFellows, ...fellowRequests, ...fellowSuggestions].filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div>
      <Header />
      <div className="max-w-[720px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        <h1 className="text-[28px] font-extrabold mb-2">المجتمع</h1>
        <p className="text-sm text-gray-500 mb-5">
          نصائح، أسعار، وفرص يومية من زملاء القطاع
        </p>

        {/* Top 3 tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-5 flex gap-2">
          {[
            { id: 'posts' as const, label: 'المنشورات' },
            { id: 'fellows' as const, label: 'الزملاء' },
            {
              id: 'mine' as const,
              label: 'مشاركاتي',
              count: sharedItems.length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className={`flex-1 h-10 rounded-full text-sm font-bold border transition cursor-pointer ${
                mainTab === tab.id
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
              }`}
            >
              {tab.label} {tab.count ? `(${tab.count})` : ''}
            </button>
          ))}
        </div>

        {/* Posts Tab */}
        {mainTab === 'posts' && (
          <>
            {/* New Post Box */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-green-100 flex items-center justify-center font-bold text-green-800 shrink-0">
                  أ
                </div>
                <div className="flex-1">
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="شارك معلومة، سعر، أو اطلب مورد..."
                    className="w-full min-h-[70px] bg-gray-50 border border-gray-100 rounded-2xl p-3 text-sm focus:outline-none focus:border-green-200 resize-none"
                  />

                  {postImage && (
                    <div className="mt-3 relative">
                      <img
                        id="new-post-preview"
                        src={postImage}
                        className="w-full h-48 object-cover rounded-xl border border-gray-100"
                        alt="preview"
                      />
                      <button
                        onClick={() => setPostImage(null)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white rounded-full flex items-center justify-center text-sm hover:bg-black cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <label className="h-9 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer">
                        <span>📷 إضافة صورة</span>
                        <input
                          id="post-image-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <span className="text-xs text-gray-400 hidden lg:inline">
                        المجتمع مجاني ومفتوح للجميع
                      </span>
                    </div>

                    <button
                      onClick={handleCreatePost}
                      className="h-9 px-5 bg-[#16a34a] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#15803d] transition cursor-pointer"
                    >
                      <Send size={14} />
                      <span>نشر</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUserClick(post.user)}
                        className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition cursor-pointer shrink-0"
                      >
                        {post.initial}
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleUserClick(post.user)}
                            className="font-bold text-sm hover:text-green-700 transition cursor-pointer text-right"
                          >
                            {post.user}
                          </button>
                          <VerificationBadge
                            role={post.user.includes('الزراعي') ? 'مزارع' : post.user.includes('فروزن') ? 'مورد' : 'مزارع'}
                            stars={4.9}
                            size="sm"
                          />
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={12} />
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>

                    {canModifyPost(post) ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setEditingPostText(post.text);
                          }}
                          title="تعديل المنشور"
                          className="h-7 px-2 bg-emerald-50 text-[#16a34a] hover:bg-emerald-100 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer border border-emerald-100 shadow-2xs"
                        >
                          <Pencil size={11} />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => setDeletingPost(post)}
                          title="حذف المنشور"
                          className="h-7 px-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer border border-red-100 shadow-2xs"
                        >
                          <Trash2 size={11} />
                          <span>حذف</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openShareModal(null, 'post', post.id)}
                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
                      >
                        <Share2 size={14} />
                      </button>
                    )}
                  </div>

                  {post.image && (
                    <img
                      src={post.image}
                      className="w-full h-64 object-cover rounded-xl mt-3 mb-3 border border-gray-100"
                      alt="post"
                    />
                  )}

                  <div className="mt-3 text-[14px] leading-7 text-gray-800 whitespace-pre-wrap">
                    {post.text}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => togglePostLike(post.id)}
                      className={`h-8 px-3 rounded-full text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                        post.liked
                          ? 'bg-red-50 border-red-100 text-red-600'
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart
                        size={14}
                        fill={post.liked ? 'currentColor' : 'none'}
                      />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() =>
                        setOpenPostComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                      className={`h-8 px-3 rounded-full text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                        openPostComments[post.id]
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-gray-50 border-gray-100 text-gray-600'
                      }`}
                    >
                      <MessageCircle size={14} />
                      <span>{post.comments.length} تعليق</span>
                    </button>

                    <button
                      onClick={() => openShareModal(null, 'post', post.id)}
                      className="h-8 px-3 rounded-full text-xs font-bold bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-1.5 hover:bg-gray-100 cursor-pointer"
                    >
                      <Share2 size={14} />
                      <span>مشاركة</span>
                    </button>
                  </div>

                  {/* Comments */}
                  {openPostComments[post.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <div className="space-y-2">
                        {post.comments.map((c, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <button
                              onClick={() => handleUserClick(c.user)}
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold shrink-0 hover:bg-green-50 hover:text-green-700 transition cursor-pointer mt-0.5"
                            >
                              {c.user[0]}
                            </button>
                            <div className="flex-1">
                              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tr-sm px-3 py-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => handleUserClick(c.user)}
                                    className="font-bold hover:text-green-700 transition cursor-pointer text-right inline"
                                  >
                                    {c.user}
                                  </button>
                                </div>
                                {editingPostComment?.postId === post.id &&
                                editingPostComment?.commentIndex === idx ? (
                                  <div className="mt-1.5 space-y-1.5">
                                    <input
                                      type="text"
                                      value={editingPostComment.text}
                                      onChange={(e) =>
                                        setEditingPostComment({
                                          ...editingPostComment,
                                          text: e.target.value,
                                        })
                                      }
                                      className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#16a34a]"
                                    />
                                    <div className="flex items-center gap-1.5 justify-end">
                                      <button
                                        onClick={() => setEditingPostComment(null)}
                                        className="px-2 py-0.5 text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer"
                                      >
                                        إلغاء
                                      </button>
                                      <button
                                        onClick={async () => {
                                          if (editingPostComment.text.trim()) {
                                            await updatePostComment(
                                              post.id,
                                              idx,
                                              editingPostComment.text.trim()
                                            );
                                            setEditingPostComment(null);
                                          }
                                        }}
                                        className="px-2.5 py-0.5 text-[10px] bg-[#16a34a] text-white font-bold rounded-md hover:bg-[#15803d] cursor-pointer"
                                      >
                                        حفظ
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-0.5 text-gray-700">{c.text}</div>
                                )}
                              </div>
                              {canModifyPostComment(post, c.user) && (
                                <div className="flex items-center gap-2 mt-1 mr-2 text-[10px] text-gray-400">
                                  <button
                                    onClick={() =>
                                      setEditingPostComment({
                                        postId: post.id,
                                        commentIndex: idx,
                                        text: c.text,
                                      })
                                    }
                                    className="hover:text-[#16a34a] flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Pencil size={9} />
                                    <span>تعديل</span>
                                  </button>
                                  <span>•</span>
                                  <button
                                    onClick={() => {
                                      if (confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
                                        deletePostComment(post.id, idx);
                                      }
                                    }}
                                    className="hover:text-red-600 flex items-center gap-0.5 cursor-pointer text-red-500"
                                  >
                                    <Trash2 size={9} />
                                    <span>حذف</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {post.comments.length === 0 && (
                          <div className="text-xs text-gray-400 text-center py-2">
                            لا يوجد تعليقات بعد
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <input
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs({
                              ...commentInputs,
                              [post.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendComment(post.id);
                          }}
                          placeholder="اكتب تعليق..."
                          className="flex-1 h-9 px-4 bg-gray-50 border border-gray-100 rounded-full text-xs focus:outline-none focus:border-green-200"
                        />
                        <button
                          onClick={() => handleSendComment(post.id)}
                          className="w-9 h-9 bg-[#16a34a] text-white rounded-full flex items-center justify-center hover:bg-[#15803d] cursor-pointer"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Fellows Tab */}
        {mainTab === 'fellows' && (
          <div className="space-y-5">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-2 items-center">
              <div className="relative flex-1">
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) setFellowsFilter('all');
                  }}
                  placeholder="بحث عن زميل..."
                  className="w-full h-11 pr-10 pl-4 bg-[#f9fafb] border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#16a34a]/30 focus:bg-white transition"
                />
              </div>
              <button
                onClick={() => {
                  if (searchQuery) showToast(`بحث عن ${searchQuery}`);
                }}
                className="h-11 px-5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Search size={16} />
                <span>بحث</span>
              </button>
            </div>

            {/* Sub-filter tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'all' as const, label: 'الكل' },
                { id: 'my' as const, label: 'زملائي', count: myFellows.length },
                {
                  id: 'requests' as const,
                  label: 'طلبات الزمالة',
                  count: fellowRequests.length,
                  red: true,
                },
                {
                  id: 'suggestions' as const,
                  label: 'مقترحات زملاء',
                  count: fellowSuggestions.length,
                },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFellowsFilter(f.id)}
                  className={`h-9 px-4 rounded-full text-xs font-bold border whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
                    fellowsFilter === f.id
                      ? 'bg-[#f0fdf4] text-[#15803d] border-[#16a34a]/20 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <span>{f.label}</span>
                  {f.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        f.red && f.count > 0
                          ? 'bg-red-500 text-white border-red-500'
                          : fellowsFilter === f.id
                          ? 'bg-white text-[#16a34a] border-green-100'
                          : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}
                    >
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search results banner if searching */}
            {searchQuery.trim() && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Search size={16} className="text-[#16a34a]" />
                    <span>نتائج البحث عن "{searchQuery}"</span>
                    <span className="text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                      {searchResults.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    مسح
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-500">
                    لا يوجد نتائج مطابقة
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((f) => (
                      <div
                        key={f.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-3 hover:shadow-md transition"
                      >
                        <div className="w-11 h-11 rounded-full bg-[#f0fdf4] border border-green-100 flex items-center justify-center font-bold text-[#15803d] shrink-0">
                          {f.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm">{f.name}</span>
                            <VerificationBadge
                              role={f.role}
                              spec={f.spec}
                              stars={f.stars}
                              isVerified={f.isVerified}
                              size="sm"
                            />
                            <span className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full">
                              {f.role}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {f.spec} • {f.loc}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => openFellowProfile(f.id)}
                              className="h-8 px-3 bg-white border border-gray-100 rounded-full text-xs font-bold hover:bg-gray-50 cursor-pointer"
                            >
                              عرض
                            </button>
                            <button
                              onClick={() => addSuggestedFellow(f.id)}
                              className="h-8 px-4 bg-[#16a34a] text-white rounded-full text-xs font-bold hover:bg-[#15803d] cursor-pointer"
                            >
                              إضافة
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Fellows Section */}
            {(fellowsFilter === 'all' || fellowsFilter === 'my') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[15px] flex items-center gap-2">
                    <Users size={18} className="text-[#16a34a]" />
                    <span>زملائي</span>
                    <span className="text-[11px] bg-[#f0fdf4] text-[#15803d] border border-green-100 px-2.5 py-0.5 rounded-full">
                      {myFellows.length}
                    </span>
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    زملاء موثوقين تتواصل معهم مباشرة
                  </span>
                </div>

                {myFellows.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mx-auto mb-3">
                      <Users size={20} />
                    </div>
                    <div className="font-bold text-sm">لا يوجد زملاء بعد</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ابدأ بإضافة زملاء من المقترحات
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myFellows.map((f) => (
                      <div
                        key={f.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-green-100 transition"
                      >
                        <div className="flex gap-3">
                          <button
                            onClick={() => openFellowProfile(f.id)}
                            className="w-11 h-11 rounded-full bg-[#f0fdf4] border border-green-100 flex items-center justify-center font-bold text-[#15803d] shrink-0 hover:bg-green-100 transition cursor-pointer"
                          >
                            {f.initial}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => openFellowProfile(f.id)}
                                className="font-bold text-sm hover:text-[#16a34a] transition cursor-pointer text-right"
                              >
                                {f.name}
                              </button>
                              <VerificationBadge
                                role={f.role}
                                spec={f.spec}
                                stars={f.stars}
                                isVerified={f.isVerified}
                                size="sm"
                              />
                              <span className="text-[10px] px-2 py-0.5 bg-[#f0fdf4] text-[#15803d] border border-green-100 rounded-full">
                                {f.role}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <MapPin size={10} />
                                {f.loc}
                              </span>
                              <span>•</span>
                              <span>{f.spec}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => {
                              showToast(`رسالة لـ ${f.name}`);
                              showView('messages');
                            }}
                            className="flex-1 h-8 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <MessageCircle size={12} />
                            <span>رسالة</span>
                          </button>
                          <button
                            onClick={() => openFellowProfile(f.id)}
                            className="flex-1 h-8 bg-white border border-gray-100 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} />
                            <span>عرض</span>
                          </button>
                          <button
                            onClick={() => removeMyFellow(f.id)}
                            className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Requests Section */}
            {(fellowsFilter === 'all' || fellowsFilter === 'requests') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[15px] flex items-center gap-2">
                    <UserCheck size={18} className="text-[#16a34a]" />
                    <span>طلبات الزمالة</span>
                    {fellowRequests.length > 0 && (
                      <span className="text-[11px] bg-red-500 text-white px-2.5 py-0.5 rounded-full">
                        {fellowRequests.length} جديد
                      </span>
                    )}
                  </h3>
                </div>

                {fellowRequests.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center text-xs text-gray-500">
                    لا يوجد طلبات زمالة حالياً
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fellowRequests.map((f) => (
                      <div
                        key={f.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 border-r-4 border-r-amber-200 hover:shadow-md transition"
                      >
                        <div className="flex gap-3">
                          <button
                            onClick={() => openFellowProfile(f.id)}
                            className="w-11 h-11 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center font-bold text-amber-800 shrink-0 hover:bg-amber-100 transition cursor-pointer"
                          >
                            {f.initial}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => openFellowProfile(f.id)}
                                className="font-bold text-sm hover:text-[#16a34a] transition cursor-pointer text-right"
                              >
                                {f.name}
                              </button>
                              <VerificationBadge
                                role={f.role}
                                spec={f.spec}
                                stars={f.stars}
                                isVerified={f.isVerified}
                                size="sm"
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {f.role} • {f.spec}
                            </div>
                            <div className="mt-2 text-[11px] px-2.5 py-1 bg-[#f9fafb] border border-gray-100 rounded-full inline-flex items-center gap-1 text-gray-600">
                              <Users size={10} />
                              <span>لديكم {f.mutual || 1} زملاء مشتركين</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => acceptFellowship(f.id)}
                            className="flex-1 h-9 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <Check size={14} />
                            <span>قبول</span>
                          </button>
                          <button
                            onClick={() => rejectFellowship(f.id)}
                            className="flex-1 h-9 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                          >
                            رفض
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Suggestions Section */}
            {(fellowsFilter === 'all' || fellowsFilter === 'suggestions') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[15px] flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-500" />
                    <span>مقترحات زملاء</span>
                    <span className="text-[11px] bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">
                      {fellowSuggestions.length}
                    </span>
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    بناءً على موقعك وتخصصك
                  </span>
                </div>

                {fellowSuggestions.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center text-xs text-gray-500">
                    لا يوجد مقترحات حالياً
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fellowSuggestions.map((f) => (
                      <div
                        key={f.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-green-100 transition"
                      >
                        <div className="flex gap-3">
                          <button
                            onClick={() => openFellowProfile(f.id)}
                            className="w-11 h-11 rounded-full bg-[#f0fdf4] border border-green-100 flex items-center justify-center font-bold text-[#15803d] shrink-0 hover:bg-green-100 transition cursor-pointer"
                          >
                            {f.initial}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => openFellowProfile(f.id)}
                                className="font-bold text-sm truncate hover:text-[#16a34a] transition cursor-pointer text-right"
                              >
                                {f.name}
                              </button>
                              <VerificationBadge
                                role={f.role}
                                spec={f.spec}
                                stars={f.stars}
                                isVerified={f.isVerified}
                                size="sm"
                              />
                              <span className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full shrink-0">
                                {f.role}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 truncate">
                              {f.spec} • {f.loc}
                            </div>
                            <div className="mt-2 text-[11px] text-[#16a34a] bg-[#f0fdf4] border border-green-100 px-2.5 py-1 rounded-full inline-flex">
                              🌱 مزارع في {f.loc} مثلك - مقترح
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => addSuggestedFellow(f.id)}
                            className="flex-1 h-9 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <UserPlus size={14} />
                            <span>إضافة زميل</span>
                          </button>
                          <button
                            onClick={() => dismissSuggestion(f.id)}
                            className="h-9 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                          >
                            تجاهل
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* My Shared Items Tab */}
        {mainTab === 'mine' && (
          <div className="space-y-3">
            {sharedItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mx-auto mb-3">
                  <Share2 size={20} />
                </div>
                <div className="font-bold text-sm">لا يوجد مشاركات بعد</div>
                <div className="text-xs text-gray-500 mt-1">
                  شارك إعلانات من السوق لتظهر هنا
                </div>
                <button
                  onClick={() => showView('market')}
                  className="mt-4 h-9 px-5 bg-[#16a34a] text-white rounded-full text-xs font-bold cursor-pointer"
                >
                  تصفح السوق
                </button>
              </div>
            ) : (
              sharedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-bold text-sm">{item.title}</div>
                    <span className="text-[11px] text-gray-400">{item.time}</span>
                  </div>
                  <div className="text-xs text-gray-500 leading-6 mt-2">
                    {item.desc}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[11px] px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                      مشاركة
                    </span>
                    <span className="text-[11px] text-gray-400">
                      منشور أصلي: {item.sourceId}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Edit Post Modal */}
        {editingPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right space-y-4 shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                    <Pencil size={16} />
                  </div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    تعديل المنشور
                  </h3>
                </div>
                <button
                  onClick={() => setEditingPost(null)}
                  className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  نص المنشور
                </label>
                <textarea
                  rows={4}
                  value={editingPostText}
                  onChange={(e) => setEditingPostText(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#16a34a]"
                  placeholder="اكتب تعديلك..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={async () => {
                    if (editingPostText.trim()) {
                      await updatePost(editingPost.id, editingPostText.trim());
                      setEditingPost(null);
                    }
                  }}
                  className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <span>حفظ التعديل</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Post Confirmation Modal */}
        {deletingPost && (
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
                    تأكيد حذف المنشور
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    هل أنت متأكد من رغبتك في حذف هذا المنشور نهائياً؟
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-medium text-gray-700 line-clamp-2">
                {deletingPost.text}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setDeletingPost(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={async () => {
                    const idToDelete = deletingPost.id;
                    setDeletingPost(null);
                    await deletePost(idToDelete);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
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
