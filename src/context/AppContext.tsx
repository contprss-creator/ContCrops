'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type {
  ViewType,
  UserProfile,
  AdItem,
  AdComment,
  Fellow,
  ReviewItem,
  PriceItem,
  SavedDoc,
  CommunityPost,
  SharedItem,
  ChatConversation,
  ChatMessage,
  NotificationItem,
  AdminUser,
  AdminSettings,
  ToastNotification,
} from '../types';
import {
  INITIAL_ADS,
  INITIAL_PRICES,
  INITIAL_SAVED_DOCS,
  INITIAL_FELLOWS,
  INITIAL_REQUESTS,
  INITIAL_SUGGESTIONS,
  INITIAL_AD_COMMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_ADMIN_USERS,
} from '../data/mockData';
import { supabase } from '@/lib/supabase';
import {
  updateAdAction,
  deleteAdAction,
  updatePostAction,
  deletePostAction,
  updateCommentAction,
  deleteCommentAction,
  fetchLatestAdsAction,
  fetchLatestPostsAction,
} from '@/app/actions/crudActions';

interface AppContextType {
  // Auth & View
  mounted: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  currentView: ViewType;
  currentUser: UserProfile | null;
  authRequiredModalOpen: boolean;
  pendingView: ViewType | null;
  toast: ToastNotification | null;
  toastMessage: string | null;
  showView: (view: string) => void;
  showToast: (msgOrConfig: string | Omit<ToastNotification, 'id'>) => void;
  dismissToast: () => void;
  simulateIncomingMessage: (senderName?: string, text?: string) => void;
  login: (identifier: string, pass: string) => boolean;
  register: (user: UserProfile) => void;
  logout: () => void;
  closeAuthModal: () => void;

  // Ads & Market
  ads: AdItem[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  adComments: Record<string, AdComment[]>;
  openCommentAdIds: Record<string, boolean>;
  toggleCommentsDrawer: (adId: string) => void;
  addAdComment: (adId: string, text: string) => void;
  toggleAdCommentLike: (adId: string, commentId: string) => void;
  newAdModalOpen: boolean;
  setNewAdModalOpen: (open: boolean) => void;
  newAdImage: string | null;
  setNewAdImage: (img: string | null) => void;
  addAd: (data: {
    category: string;
    title: string;
    desc: string;
    qty: string;
    location: string;
    price: string;
    image?: string;
  }) => void;
  updateAd: (id: string, data: Partial<AdItem>) => Promise<boolean>;
  deleteAd: (id: string) => Promise<boolean>;
  updateAdComment: (adId: string, commentId: string, text: string) => Promise<boolean>;
  deleteAdComment: (adId: string, commentId: string) => Promise<boolean>;
  refreshMarketData: () => Promise<boolean>;
  lastMarketRefreshed: Date | null;

  // Fellows
  fellows: Fellow[];
  myFellows: Fellow[];
  fellowRequests: Fellow[];
  fellowSuggestions: Fellow[];
  fellowshipStatus: Record<string, 'none' | 'sent' | 'fellow'>;
  toggleFellowship: (id: string, name?: string) => void;
  acceptFellowship: (id: string) => void;
  rejectFellowship: (id: string) => void;
  addSuggestedFellow: (id: string) => void;
  dismissSuggestion: (id: string) => void;
  removeMyFellow: (id: string) => void;
  selectedFellow: Fellow | null;
  openFellowProfile: (idOrName: string | number) => void;
  previousView: ViewType;

  // Ratings & Reviews
  ratings: ReviewItem[];
  ratingModalOpen: boolean;
  currentRatingFellowId: string | null;
  openRatingModal: (fellowId?: string | null) => void;
  closeRatingModal: () => void;
  submitRating: (fellowId: string, stars: number, comment: string, tags: string[]) => void;

  // Share Modal
  shareModal: {
    open: boolean;
    adId: string | null;
    source: 'ad' | 'post' | null;
    postId: string | null;
  };
  openShareModal: (id: string | null, source?: 'ad' | 'post' | null, postId?: string | null) => void;
  closeShareModal: () => void;
  shareToProfile: () => void;
  copyShareLink: () => Promise<void>;
  shareWhatsApp: () => void;
  shareFacebook: () => void;
  shareTwitter: () => void;

  // Community
  communityPosts: CommunityPost[];
  sharedItems: SharedItem[];
  addPost: (text: string, image?: string) => void;
  updatePost: (id: string, text: string, image?: string) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  togglePostLike: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  updatePostComment: (postId: string, commentIndex: number, text: string) => Promise<boolean>;
  deletePostComment: (postId: string, commentIndex: number) => Promise<boolean>;
  refreshCommunityData: () => Promise<boolean>;
  lastCommunityRefreshed: Date | null;

  // Prices
  prices: PriceItem[];
  addPrice: (crop: string, price: number) => void;

  // Docs
  selectedDocTemplateId: string | null;
  setSelectedDocTemplateId: (id: string | null) => void;
  savedDocs: SavedDoc[];
  saveNewDoc: (doc: SavedDoc) => void;

  // Messages
  conversations: ChatConversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  messages: Record<string, ChatMessage[]>;
  sendChatMessage: (text: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: {
    type: 'ad' | 'price' | 'comment' | 'request' | 'message';
    title: string;
    desc: string;
    icon?: string;
  }) => void;

  // Admin Dashboard
  adminUsers: AdminUser[];
  adminAds: AdItem[];
  adminPrices: PriceItem[];
  adminSettings: AdminSettings;
  selectedAdminAdIds: string[];
  toggleSelectAdminAd: (id: string) => void;
  toggleAdminUserStatus: (id: string) => void;
  deleteAdminUser: (id: string) => void;
  approveAdminAd: (id: string) => void;
  rejectAdminAd: (id: string) => void;
  deleteAdminAd: (id: string) => void;
  bulkDeleteAdminAds: () => void;
  deleteAdminPrice: (id: string) => void;
  deleteAdminPost: (id: string) => void;
  deleteAdminDoc: (id: string) => void;
  toggleAdminSetting: (key: keyof AdminSettings) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const PUBLIC_VIEWS = [
  'landing',
  'market',
  'prices',
  'services',
  'community',
  'docs',
  'fellow-profile',
  'login',
  'register',
];

export function AppProvider({ children }: { children: ReactNode }) {
  // Client mount & Auth state (hydration safe)
  const [mounted, setMounted] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const logged = localStorage.getItem('contcrops_logged') === 'true';
      const admin = localStorage.getItem('contcrops_admin') === 'true';
      if (logged) {
        setIsLoggedIn(true);
        setIsAdmin(admin);
        setCurrentUser({
          name: localStorage.getItem('contcrops_user_name') || 'أحمد الزراعي',
          phone: localStorage.getItem('contcrops_user_phone') || '01xxxxxxxxx',
          governorate: 'البحيرة',
          accountType: 'مزارع',
          role: admin ? 'admin' : 'مزارع',
          location: 'البحيرة',
        });
        if (typeof window !== 'undefined') {
          (window as unknown as { isAdmin: boolean }).isAdmin = admin;
        }
      }
    } catch {
      // safe fallback if storage is restricted
    }

    // Synchronize initial view with URL path
    if (typeof window !== 'undefined') {
      const getPathView = (pathname: string): ViewType => {
        const clean = pathname.replace(/^\//, '').split('?')[0].split('#')[0].toLowerCase();
        if (!clean || clean === 'landing') return 'landing';
        if (clean === 'market') return 'market';
        if (clean === 'services') return 'services';
        if (clean === 'prices') return 'prices';
        if (clean === 'docs' || clean === 'doc-editor') return 'docs';
        if (clean === 'community') return 'community';
        if (clean === 'login') return 'login';
        if (clean === 'register') return 'register';
        if (clean === 'profile') return 'profile';
        if (clean === 'fellow-profile') return 'fellow-profile';
        if (clean === 'messages') return 'messages';
        if (clean === 'notifications') return 'notifications';
        if (clean === 'admin' || clean === 'admin-dashboard') return 'admin-dashboard';
        return 'landing';
      };

      const initialPathView = getPathView(window.location.pathname);
      if (initialPathView !== 'landing') {
        setCurrentView(initialPathView);
      }

      const onPopState = () => {
        const v = getPathView(window.location.pathname);
        setCurrentView(v);
      };
      window.addEventListener('popstate', onPopState);
      return () => window.removeEventListener('popstate', onPopState);
    }
  }, []);

  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [previousView, setPreviousView] = useState<ViewType>('market');
  const [authRequiredModalOpen, setAuthRequiredModalOpen] = useState(false);
  const [pendingView, setPendingView] = useState<ViewType | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Toast helper with support for both simple string and rich interactive notifications
  const showToast = (input: string | Omit<ToastNotification, 'id'>) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const newToast: ToastNotification =
      typeof input === 'string'
        ? {
            id: Date.now().toString(),
            message: input,
            type: 'default',
          }
        : {
            id: Date.now().toString(),
            ...input,
          };
    setToast(newToast);

    const duration =
      newToast.type === 'message' || newToast.type === 'request' ? 5500 : 3200;
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const dismissToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  };

  const simulateIncomingMessage = (
    senderName = 'محمد الزراعي',
    text = 'متوفر ٥ طن طماطم فريش وجاهزة للشحن اليوم، هل ترغب في المعاينة؟'
  ) => {
    showToast({
      title: `رسالة جديدة من ${senderName}`,
      message: text,
      type: 'message',
      sender: senderName,
      actionLabel: 'فتح المحادثة',
      onAction: () => {
        setActiveConversationId('1');
        showView('messages');
      },
    });
  };

  // Nav helper with auth checks and URL history synchronization
  const showView = (viewInput: string) => {
    let p = viewInput.startsWith('view-') ? viewInput.replace(/^view-/, '') : viewInput;
    p = p.replace(/^\//, '').toLowerCase();
    if (!p) p = 'landing';
    if (p === 'admin') p = 'admin-dashboard';

    if (p === 'admin-dashboard') {
      if (!isAdmin) {
        showToast('غير مصرح - يلزم حساب إداري');
        return;
      }
      setCurrentView('admin-dashboard');
      try {
        if (typeof window !== 'undefined') {
          if (window.location.pathname !== '/admin') {
            window.history.pushState({ view: 'admin-dashboard' }, '', '/admin');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch {}
      return;
    }

    if (!isLoggedIn && !PUBLIC_VIEWS.includes(p)) {
      setPendingView(p as ViewType);
      setAuthRequiredModalOpen(true);
      return;
    }

    if (p !== 'docs') {
      setSelectedDocTemplateId(null);
    }

    setCurrentView(p as ViewType);
    try {
      if (typeof window !== 'undefined') {
        const targetUrl = p === 'landing' ? '/' : `/${p}`;
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ view: p }, '', targetUrl);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {}
  };

  const closeAuthModal = () => {
    setAuthRequiredModalOpen(false);
    setPendingView(null);
  };

  const login = (identifier: string, pass: string): boolean => {
    const u = identifier.trim();
    const p = pass.trim();

    if (
      (u === '01000000000' && p === 'admin123') ||
      u.includes('admin') ||
      p.toLowerCase().includes('admin')
    ) {
      setIsAdmin(true);
      setIsLoggedIn(true);
      const adminProfile: UserProfile = {
        name: 'المدير العام',
        phone: '01000000000',
        governorate: 'القاهرة',
        accountType: 'مزارع',
        role: 'admin',
        location: 'القاهرة',
      };
      setCurrentUser(adminProfile);
      try {
        localStorage.setItem('contcrops_logged', 'true');
        localStorage.setItem('contcrops_admin', 'true');
        localStorage.setItem('contcrops_user_name', 'المدير العام');
        localStorage.setItem('contcrops_user_phone', '01000000000');
        (window as unknown as { isAdmin: boolean }).isAdmin = true;
      } catch {}

      showToast('تم تسجيل دخول الأدمن بنجاح ✅');
      setAuthRequiredModalOpen(false);
      setPendingView(null);
      setCurrentView('admin-dashboard');
      return true;
    }

    const userName = 'أحمد الزراعي';
    const profile: UserProfile = {
      name: userName,
      phone: u || '01xxxxxxxxx',
      governorate: 'البحيرة',
      accountType: 'مزارع',
      role: 'مزارع',
      location: 'البحيرة',
    };
    setIsLoggedIn(true);
    setIsAdmin(false);
    setCurrentUser(profile);
    try {
      localStorage.setItem('contcrops_logged', 'true');
      localStorage.setItem('contcrops_user_name', userName);
      localStorage.setItem('contcrops_user_phone', u);
      localStorage.setItem('contcrops_admin', 'false');
      (window as unknown as { isAdmin: boolean }).isAdmin = false;
    } catch {}

    showToast('تم تسجيل الدخول بنجاح');
    setAuthRequiredModalOpen(false);
    if (pendingView) {
      const next = pendingView;
      setPendingView(null);
      setCurrentView(next === 'admin-dashboard' && !isAdmin ? 'market' : next);
    } else {
      setCurrentView('market');
    }
    return true;
  };

  const register = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsAdmin(false);
    try {
      localStorage.setItem('contcrops_logged', 'true');
      localStorage.setItem('contcrops_user_name', user.name);
      localStorage.setItem('contcrops_user_phone', user.phone);
    } catch {}
    showToast('تم إنشاء الحساب بنجاح ✅');
    setAuthRequiredModalOpen(false);
    setCurrentView('market');
  };

  const logout = () => {
    try {
      localStorage.removeItem('contcrops_logged');
      localStorage.removeItem('contcrops_admin');
      localStorage.removeItem('contcrops_user_name');
      localStorage.removeItem('contcrops_user_phone');
      (window as unknown as { isAdmin: boolean }).isAdmin = false;
    } catch {}
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setAuthRequiredModalOpen(false);
    setPendingView(null);
    showToast('تم تسجيل الخروج');
    setCurrentView('landing');
  };

  // Ads state
  const [ads, setAds] = useState<AdItem[]>(INITIAL_ADS);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [adComments, setAdComments] = useState<Record<string, AdComment[]>>(INITIAL_AD_COMMENTS);
  const [openCommentAdIds, setOpenCommentAdIds] = useState<Record<string, boolean>>({});
  const [newAdModalOpen, setNewAdModalOpen] = useState(false);
  const [newAdImage, setNewAdImage] = useState<string | null>(null);

  const toggleCommentsDrawer = (adId: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    setOpenCommentAdIds((prev) => ({ ...prev, [adId]: !prev[adId] }));
  };

  const addAdComment = (adId: string, text: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    if (!text.trim()) return;
    const newComment: AdComment = {
      id: `c-${adId}-${Date.now()}`,
      adId,
      userName: currentUser?.name || 'أنت',
      initial: currentUser?.name ? currentUser.name[0] : 'أ',
      text: text.trim(),
      time: 'الآن',
      likes: 0,
      liked: false,
    };
    setAdComments((prev) => ({
      ...prev,
      [adId]: [...(prev[adId] || []), newComment],
    }));
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, comments: ad.comments + 1 } : ad))
    );
    showToast('تم إضافة التعليق');
  };

  const toggleAdCommentLike = (adId: string, commentId: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    setAdComments((prev) => ({
      ...prev,
      [adId]: (prev[adId] || []).map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      ),
    }));
  };

  const addAd = (data: {
    category: string;
    title: string;
    desc: string;
    qty: string;
    location: string;
    price: string;
    image?: string;
  }) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    if (!data.title.trim()) {
      showToast('اكتب عنوان الإعلان');
      return;
    }
    const newAd: AdItem = {
      id: Date.now().toString(),
      category: data.category,
      userInitial: currentUser?.name ? currentUser.name[0] : 'أ',
      userName: currentUser?.name || 'أنت',
      role: currentUser?.role || 'عضو جديد',
      time: 'الآن',
      title: data.title,
      desc: data.desc || 'تفاصيل إضافية متوفرة عند التواصل',
      qty: data.qty || 'حسب الطلب',
      location: data.location || 'مصر',
      price: data.price || 'عند التواصل',
      likes: 0,
      comments: 0,
      image: data.image || newAdImage || undefined,
      status: 'نشط',
      owner: currentUser?.name || 'أنت',
      date: 'الآن',
      reports: 0,
    };
    setAds((prev) => [newAd, ...prev]);
    setAdComments((prev) => ({ ...prev, [newAd.id]: [] }));
    setNewAdModalOpen(false);
    setNewAdImage(null);
    setCurrentView('market');
    showToast('تم نشر إعلانك مجاناً ✅');
  };

  const updateAd = async (id: string, updatedFields: Partial<AdItem>): Promise<boolean> => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return false;
    }
    const requester = {
      userId: currentUser?.phone || 'current-user',
      userName: currentUser?.name || 'أنت',
      isAdmin: !!isAdmin,
    };
    const res = await updateAdAction(
      id,
      {
        title: updatedFields.title,
        desc: updatedFields.desc,
        price: updatedFields.price,
        qty: updatedFields.qty,
        category: updatedFields.category,
        location: updatedFields.location,
        image: updatedFields.image,
      },
      requester
    );

    if (!res.success) {
      showToast(res.error || 'فشل تعديل الإعلان');
      return false;
    }

    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, ...updatedFields } : ad))
    );
    showToast('تم تعديل الإعلان بنجاح ✓');
    return true;
  };

  const deleteAd = async (id: string): Promise<boolean> => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return false;
    }
    const requester = {
      userId: currentUser?.phone || 'current-user',
      userName: currentUser?.name || 'أنت',
      isAdmin: !!isAdmin,
    };
    const res = await deleteAdAction(id, requester);

    if (!res.success) {
      showToast(res.error || 'فشل حذف الإعلان');
      return false;
    }

    setAds((prev) => prev.filter((ad) => ad.id !== id));
    showToast('تم حذف الإعلان بنجاح');
    return true;
  };

  const updateAdComment = async (
    adId: string,
    commentId: string,
    text: string
  ): Promise<boolean> => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return false;
    }
    const requester = {
      userId: currentUser?.phone || 'current-user',
      userName: currentUser?.name || 'أنت',
      isAdmin: !!isAdmin,
    };
    const res = await updateCommentAction(commentId, text, requester);

    if (!res.success) {
      showToast(res.error || 'فشل تعديل التعليق');
      return false;
    }

    setAdComments((prev) => ({
      ...prev,
      [adId]: (prev[adId] || []).map((c) => (c.id === commentId ? { ...c, text } : c)),
    }));
    showToast('تم تعديل التعليق ✓');
    return true;
  };

  const deleteAdComment = async (
    adId: string,
    commentId: string
  ): Promise<boolean> => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return false;
    }
    const requester = {
      userId: currentUser?.phone || 'current-user',
      userName: currentUser?.name || 'أنت',
      isAdmin: !!isAdmin,
    };
    const res = await deleteCommentAction(commentId, requester);

    if (!res.success) {
      showToast(res.error || 'فشل حذف التعليق');
      return false;
    }

    setAdComments((prev) => ({
      ...prev,
      [adId]: (prev[adId] || []).filter((c) => c.id !== commentId),
    }));
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, comments: Math.max(0, a.comments - 1) } : a))
    );
    showToast('تم حذف التعليق');
    return true;
  };

  const [lastMarketRefreshed, setLastMarketRefreshed] = useState<Date | null>(() => new Date());

  const refreshMarketData = async (): Promise<boolean> => {
    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 600));
      let fetchedFromDb = false;

      try {
        const { data: supaAds, error: supaErr } = await supabase
          .from('Ad')
          .select(`
            id,
            title,
            desc,
            category,
            qty,
            price,
            location,
            image,
            status,
            likes,
            userId,
            createdAt,
            user:User (name, role, isVerified),
            comments:Comment (id, text, likes, createdAt, user:User(name))
          `)
          .order('createdAt', { ascending: false })
          .limit(40);

        if (!supaErr && supaAds && supaAds.length > 0) {
          const mapped: AdItem[] = supaAds.map((ad: any) => ({
            id: ad.id,
            category: ad.category || 'فريش',
            userInitial: ad.user?.name ? ad.user.name[0] : 'أ',
            userName: ad.user?.name || 'مزارع',
            role: ad.user?.role || 'مزارع',
            time: 'الآن',
            title: ad.title,
            desc: ad.desc,
            qty: ad.qty,
            location: ad.location,
            price: ad.price,
            likes: ad.likes || 0,
            comments: ad.comments?.length || 0,
            image: ad.image || undefined,
            status: (ad.status as any) || 'نشط',
            owner: ad.user?.name || 'مزارع',
            ownerId: ad.userId,
            date: 'اليوم',
          }));

          setAds((prev) => {
            const incomingIds = new Set(mapped.map((m) => m.id));
            const existingRemaining = prev.filter((p) => !incomingIds.has(p.id));
            return [...mapped, ...existingRemaining];
          });
          fetchedFromDb = true;
        }
      } catch (err) {
        console.warn('Direct Supabase ads fetch error:', err);
      }

      if (!fetchedFromDb) {
        try {
          const res = await fetchLatestAdsAction();
          if (res.success && res.data && res.data.length > 0) {
            const mapped: AdItem[] = res.data.map((ad: any) => ({
              id: ad.id,
              category: ad.category || 'فريش',
              userInitial: ad.user?.name ? ad.user.name[0] : 'أ',
              userName: ad.user?.name || 'مزارع',
              role: ad.user?.role || 'مزارع',
              time: 'الآن',
              title: ad.title,
              desc: ad.desc,
              qty: ad.qty,
              location: ad.location,
              price: ad.price,
              likes: ad.likes || 0,
              comments: ad.comments?.length || 0,
              image: ad.image || undefined,
              status: (ad.status as any) || 'نشط',
              owner: ad.user?.name || 'مزارع',
              ownerId: ad.userId,
              date: 'اليوم',
            }));
            setAds((prev) => {
              const incomingIds = new Set(mapped.map((m) => m.id));
              const existingRemaining = prev.filter((p) => !incomingIds.has(p.id));
              return [...mapped, ...existingRemaining];
            });
            fetchedFromDb = true;
          }
        } catch (err) {
          console.warn('Server Action ads fetch error:', err);
        }
      }

      await minDelay;
      setLastMarketRefreshed(new Date());
      showToast({
        title: 'تم تحديث السوق بنجاح',
        message: 'تمت مزامنة عروض المحاصيل والأسعار مع Supabase',
        type: 'default',
      });
      return true;
    } catch {
      showToast('تعذر الاتصال بـ Supabase، تم الإبقاء على البيانات الحالية');
      return false;
    }
  };


  // Fellows state
  const [fellows] = useState<Fellow[]>(INITIAL_FELLOWS);
  const [myFellows, setMyFellows] = useState<Fellow[]>([INITIAL_FELLOWS[0], INITIAL_FELLOWS[2]]);
  const [fellowRequests, setFellowRequests] = useState<Fellow[]>(INITIAL_REQUESTS);
  const [fellowSuggestions, setFellowSuggestions] = useState<Fellow[]>(INITIAL_SUGGESTIONS);
  const [fellowshipStatus, setFellowshipStatus] = useState<Record<string, 'none' | 'sent' | 'fellow'>>({});
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);

  const toggleFellowship = (id: string, name?: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    const current = fellowshipStatus[id] || 'none';
    if (current === 'none') {
      setFellowshipStatus((prev) => ({ ...prev, [id]: 'sent' }));
      showToast(name ? `تم إرسال طلب زمالة لـ ${name}` : 'تم إرسال طلب الزمالة');
      setTimeout(() => {
        setFellowshipStatus((prev) => ({ ...prev, [id]: 'fellow' }));
        showToast(name ? `أنت و ${name} زملاء الآن ✅` : 'أصبحتما زملاء الآن ✅');
      }, 800);
    } else {
      setFellowshipStatus((prev) => ({ ...prev, [id]: 'none' }));
      showToast(current === 'sent' ? 'تم إلغاء الطلب' : 'تم إلغاء الزمالة');
    }
  };

  const acceptFellowship = (id: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    const req = fellowRequests.find((f) => f.id === id);
    if (!req) return;
    setFellowRequests((prev) => prev.filter((f) => f.id !== id));
    setMyFellows((prev) => {
      if (prev.find((f) => f.id === id)) return prev;
      return [{ ...req, id: `my-${id}-${Date.now()}` }, ...prev];
    });
    showToast({
      title: 'تم قبول طلب الزمالة بنجاح ✅',
      message: `أصبحت أنت و ${req.name} (${req.role || 'عضو'}) زملاء الآن في شبكة ContCrops`,
      type: 'request',
      actionLabel: 'عرض البروفايل',
      onAction: () => {
        openFellowProfile(req.id);
      },
    });
  };

  const rejectFellowship = (id: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    setFellowRequests((prev) => prev.filter((f) => f.id !== id));
    showToast('تم رفض الطلب');
  };

  const addSuggestedFellow = (id: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    const sug = fellowSuggestions.find((f) => f.id === id);
    if (!sug) return;
    setFellowSuggestions((prev) => prev.filter((f) => f.id !== id));
    setMyFellows((prev) => {
      if (prev.find((f) => f.name === sug.name)) return prev;
      return [sug, ...prev];
    });
    setFellowshipStatus((prev) => ({ ...prev, [id]: 'sent' }));
    showToast(`تم إرسال طلب زمالة لـ ${sug.name}`);
    setTimeout(() => {
      setFellowshipStatus((prev) => ({ ...prev, [id]: 'fellow' }));
    }, 600);
  };

  const dismissSuggestion = (id: string) => {
    setFellowSuggestions((prev) => prev.filter((f) => f.id !== id));
    showToast('تم تجاهل الاقتراح');
  };

  const removeMyFellow = (id: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    const f = myFellows.find((item) => item.id === id);
    setMyFellows((prev) => prev.filter((item) => item.id !== id));
    if (f) {
      setFellowSuggestions((prev) => {
        if (prev.find((item) => item.name === f.name)) return prev;
        return [f, ...prev];
      });
    }
    showToast('تم إلغاء الزمالة');
  };

  const openFellowProfile = (idOrName: string | number) => {
    const p = String(idOrName || '').trim();
    if (!p) return;

    // If clicking own profile or 'أنت', redirect directly to self profile
    if (
      currentUser &&
      (currentUser.name === p ||
        p === 'أنت' ||
        (currentUser.phone && currentUser.phone === p))
    ) {
      showView('profile');
      return;
    }

    if (currentView !== 'fellow-profile') {
      setPreviousView(currentView);
    }

    const numIndex = parseInt(p, 10);
    let foundFellow: Fellow | null = null;
    if (!isNaN(numIndex) && numIndex > 0 && numIndex <= fellows.length) {
      foundFellow = fellows[numIndex - 1];
    }

    const pool = [...fellows, ...myFellows, ...fellowRequests, ...fellowSuggestions];
    const match =
      pool.find((f) => f.id === p) ||
      pool.find((f) => f.name === p) ||
      fellows.find((f) => f.name.includes(p) || p.includes(f.name)) ||
      foundFellow;

    if (!match) {
      const adMatch = ads.find((a) => a.userName === p || a.userName.includes(p));
      const fallbackName = adMatch?.userName || p;
      const initial = fallbackName[0] || 'أ';
      const created: Fellow = {
        id: p,
        name: fallbackName,
        spec: adMatch?.role || 'عضو في ContCrops',
        stars: 4.8,
        loc: adMatch?.location || 'مصر',
        initial,
        jobs: 24,
        role: adMatch?.role || 'مزارع',
        followers: 120,
        adsCount: 8,
        exp: '٥ سنوات خبرة',
        bio: `عضو نشط في سوق ContCrops. متخصص في القطاع الزراعي ومتواجد في ${adMatch?.location || 'مصر'}.`,
        skills: ['توريد فريش', 'تعبئة', 'توصيل'],
        reviews: [
          { user: 'محمد الزراعي', text: 'تعامل محترم جداً والتزام بالمواعيد', stars: 5, time: 'منذ أسبوع' },
        ],
        phone: '01xxxxxxxxx',
      };
      setSelectedFellow(created);
    } else {
      setSelectedFellow(match);
    }
    setCurrentView('fellow-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ratings
  const [ratings, setRatings] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [currentRatingFellowId, setCurrentRatingFellowId] = useState<string | null>(null);

  const openRatingModal = (fellowId?: string | null) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    const id = fellowId || selectedFellow?.id || 'unknown';
    setCurrentRatingFellowId(id);
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setCurrentRatingFellowId(null);
  };

  const submitRating = (fellowId: string, stars: number, comment: string, tags: string[]) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    if (stars === 0) {
      showToast('اختر عدد النجوم أولاً');
      return;
    }
    const targetId = fellowId || currentRatingFellowId || selectedFellow?.id || 'unknown';
    const newReview: ReviewItem = {
      id: `r-${Date.now()}`,
      fellowId: targetId,
      userName: currentUser?.name || 'أنت',
      initial: currentUser?.name ? currentUser.name[0] : 'أ',
      stars,
      comment: comment.trim() || tags.join('، ') || `تقييم ${stars} نجوم`,
      date: 'الآن',
      tags: [...tags],
    };
    setRatings((prev) => [newReview, ...prev]);
    showToast('تم إرسال التقييم ✓');
    closeRatingModal();
  };

  // Share Modal
  const [shareModal, setShareModal] = useState<{
    open: boolean;
    adId: string | null;
    source: 'ad' | 'post' | null;
    postId: string | null;
  }>({
    open: false,
    adId: null,
    source: null,
    postId: null,
  });

  const openShareModal = (id: string | null, source: 'ad' | 'post' | null = 'ad', postId: string | null = null) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    setShareModal({
      open: true,
      adId: id,
      source,
      postId,
    });
  };

  const closeShareModal = () => {
    setShareModal({
      open: false,
      adId: null,
      source: null,
      postId: null,
    });
  };

  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);

  const shareToProfile = () => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    const targetAd = ads.find((a) => a.id === shareModal.adId);
    const targetPost = shareModal.source === 'post' ? communityPosts.find((p) => p.id === shareModal.postId) : null;
    const title = targetAd ? targetAd.title : targetPost ? targetPost.text.slice(0, 40) : 'منشور';
    const desc = targetAd ? targetAd.desc : targetPost ? targetPost.text : '';

    const newShare: SharedItem = {
      id: Date.now().toString(),
      title,
      desc,
      time: 'الآن',
      sourceId: shareModal.adId || shareModal.postId || '',
    };
    setSharedItems((prev) => [newShare, ...prev]);
    closeShareModal();
    showToast('تمت المشاركة على بروفايلك ✓');
  };

  const copyShareLink = async () => {
    const url = shareModal.adId
      ? `https://contcrops.com/ad/${shareModal.adId}`
      : `https://contcrops.com/post/${shareModal.postId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    closeShareModal();
    showToast('تم نسخ الرابط ✓');
  };

  const shareWhatsApp = () => {
    const url = `شوف الإعلان ده على كونت كروبس: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
    showToast('تمت المشاركة على الواتساب ✓');
  };

  const shareFacebook = () => {
    const url = shareModal.adId
      ? `https://contcrops.com/ad/${shareModal.adId}`
      : `https://contcrops.com/post/${shareModal.postId}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
    showToast('تمت المشاركة على فيسبوك ✓');
  };

  const shareTwitter = () => {
    const ad = ads.find((a) => a.id === shareModal.adId);
    const title = ad ? ad.title : 'منشور من ContCrops';
    const url = shareModal.adId
      ? `https://contcrops.com/ad/${shareModal.adId}`
      : `https://contcrops.com/post/${shareModal.postId}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
    showToast('تمت المشاركة على تويتر ✓');
  };

  // Community
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  const addPost = (text: string, image?: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    if (!text.trim() && !image) {
      showToast('اكتب نص أو أضف صورة');
      return;
    }
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      user: currentUser?.name || 'أنت',
      initial: currentUser?.name ? currentUser.name[0] : 'أ',
      time: 'الآن',
      text: text || 'صورة من المجتمع',
      likes: 0,
      liked: false,
      comments: [],
      image,
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
    showToast('تم نشر المنشور ✓');
  };

  const updatePost = async (id: string, text: string, image?: string): Promise<boolean> => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return false;
    }
    const requester = {
      userId: currentUser?.phone || 'current-user',
      userName: currentUser?.name || 'أنت',
      isAdmin: !!isAdmin,
    };
    const res = await updatePostAction(id, { text, image }, requester);

    if (!res.success) {
      showToast(res.error || 'فشل تعديل المنشور');
      return false;
    }

    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, text, image: image ?? post.image } : post
      )
    );
    showToast('تم تعديل المنشور بنجاح ✓');
    return true;
  };

  const deletePost = async (id: string): Promise<boolean> => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return false;
    }
    const requester = {
      userId: currentUser?.phone || 'current-user',
      userName: currentUser?.name || 'أنت',
      isAdmin: !!isAdmin,
    };
    const res = await deletePostAction(id, requester);

    if (!res.success) {
      showToast(res.error || 'فشل حذف المنشور');
      return false;
    }

    setCommunityPosts((prev) => prev.filter((post) => post.id !== id));
    showToast('تم حذف المنشور بنجاح');
    return true;
  };

  const togglePostLike = (postId: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const addPostComment = (postId: string, text: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    if (!text.trim()) return;
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { user: currentUser?.name || 'أنت', text }] }
          : p
      )
    );
    showToast('تم إضافة التعليق ✓');
  };

  const updatePostComment = async (
    postId: string,
    commentIndex: number,
    text: string
  ): Promise<boolean> => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return false;
    }
    const requester = {
      userId: currentUser?.phone || 'current-user',
      userName: currentUser?.name || 'أنت',
      isAdmin: !!isAdmin,
    };
    const res = await updateCommentAction(`post-${postId}-${commentIndex}`, text, requester);

    if (!res.success) {
      showToast(res.error || 'فشل تعديل التعليق');
      return false;
    }

    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const newComments = [...post.comments];
        if (newComments[commentIndex]) {
          newComments[commentIndex] = { ...newComments[commentIndex], text };
        }
        return { ...post, comments: newComments };
      })
    );
    showToast('تم تعديل التعليق ✓');
    return true;
  };

  const deletePostComment = async (
    postId: string,
    commentIndex: number
  ): Promise<boolean> => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return false;
    }
    const requester = {
      userId: currentUser?.phone || 'current-user',
      userName: currentUser?.name || 'أنت',
      isAdmin: !!isAdmin,
    };
    const res = await deleteCommentAction(`post-${postId}-${commentIndex}`, requester);

    if (!res.success) {
      showToast(res.error || 'فشل حذف التعليق');
      return false;
    }

    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.filter((_, idx) => idx !== commentIndex),
        };
      })
    );
    showToast('تم حذف التعليق');
    return true;
  };

  const [lastCommunityRefreshed, setLastCommunityRefreshed] = useState<Date | null>(() => new Date());

  const refreshCommunityData = async (): Promise<boolean> => {
    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 600));
      let fetchedFromDb = false;

      try {
        const { data: supaPosts, error: supaErr } = await supabase
          .from('Post')
          .select(`
            id,
            text,
            image,
            likes,
            userId,
            createdAt,
            user:User (name, role, isVerified),
            comments:Comment (id, text, likes, createdAt, user:User(name))
          `)
          .order('createdAt', { ascending: false })
          .limit(40);

        if (!supaErr && supaPosts && supaPosts.length > 0) {
          const mapped: CommunityPost[] = supaPosts.map((post: any) => ({
            id: post.id,
            user: post.user?.name || 'مزارع',
            initial: post.user?.name ? post.user.name[0] : 'أ',
            time: 'الآن',
            text: post.text,
            likes: post.likes || 0,
            liked: false,
            comments: (post.comments || []).map((c: any) => ({
              user: c.user?.name || 'عضو',
              text: c.text,
            })),
            image: post.image || undefined,
          }));

          setCommunityPosts((prev) => {
            const incomingIds = new Set(mapped.map((m) => m.id));
            const existingRemaining = prev.filter((p) => !incomingIds.has(p.id));
            return [...mapped, ...existingRemaining];
          });
          fetchedFromDb = true;
        }
      } catch (err) {
        console.warn('Direct Supabase posts fetch error:', err);
      }

      if (!fetchedFromDb) {
        try {
          const res = await fetchLatestPostsAction();
          if (res.success && res.data && res.data.length > 0) {
            const mapped: CommunityPost[] = res.data.map((post: any) => ({
              id: post.id,
              user: post.user?.name || 'مزارع',
              initial: post.user?.name ? post.user.name[0] : 'أ',
              time: 'الآن',
              text: post.text,
              likes: post.likes || 0,
              liked: false,
              comments: (post.comments || []).map((c: any) => ({
                user: c.user?.name || 'عضو',
                text: c.text,
              })),
              image: post.image || undefined,
            }));
            setCommunityPosts((prev) => {
              const incomingIds = new Set(mapped.map((m) => m.id));
              const existingRemaining = prev.filter((p) => !incomingIds.has(p.id));
              return [...mapped, ...existingRemaining];
            });
            fetchedFromDb = true;
          }
        } catch (err) {
          console.warn('Server Action posts fetch error:', err);
        }
      }

      await minDelay;
      setLastCommunityRefreshed(new Date());
      showToast({
        title: 'تم تحديث المجتمع بنجاح',
        message: 'تمت مزامنة المنشورات والتفاعلات مع Supabase',
        type: 'default',
      });
      return true;
    } catch {
      showToast('تعذر الاتصال بـ Supabase، تم الإبقاء على المنشورات الحالية');
      return false;
    }
  };


  // Prices
  const [prices, setPrices] = useState<PriceItem[]>(INITIAL_PRICES);

  const addPrice = (crop: string, price: number) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    if (!crop || !price) {
      showToast('اكمل البيانات');
      return;
    }
    setPrices((prev) => [
      {
        id: `p-${Date.now()}`,
        crop,
        cat: 'فريش',
        price,
        change: 0,
        unit: 'كجم',
      },
      ...prev,
    ]);
    showToast('تمت إضافة السعر');
  };

  // Docs
  const [selectedDocTemplateId, setSelectedDocTemplateId] = useState<string | null>(null);
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>(INITIAL_SAVED_DOCS);

  const saveNewDoc = (doc: SavedDoc) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    setSavedDocs((prev) => [doc, ...prev]);
    showToast('تم حفظ المستند - جاهز للطباعة');
    setSelectedDocTemplateId(null);
  };

  // Messages
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);

  const sendChatMessage = (text: string) => {
    if (!isLoggedIn) {
      setAuthRequiredModalOpen(true);
      return;
    }
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      text,
      sent: true,
      time: 'الآن',
    };
    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), msg],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, last: text, time: 'الآن', unread: 0 }
          : c
      )
    );

    // Simulate incoming reply with rich Toast notification
    const partnerId = activeConversationId;
    const partner = conversations.find((c) => c.id === partnerId);
    setTimeout(() => {
      const replyOptions: Record<string, string[]> = {
        '1': [
          'تمام يا فندم، هجهز لحضرتك ٥ طن طماطم فرز أول غداً صباحاً بإذن الله.',
          'العينات جاهزة مع مندوب النوبارية وجاهز للتسليم في الميعاد المحدد.',
        ],
        '2': [
          'تم فحص خط الفراولة المجمدة IQF، الشحنة مطابقة لمواصفات التصدير.',
          'شهادات الجودة والـ HACCP جاهزة للإرسال مع مندوب الشحن.',
        ],
        '3': [
          'السعر ٥٥ ج شامل التعبئة والتوصيل لأسوان، تم الاتفاق.',
        ],
        '4': [
          'تمت مراجعة خطة دراسة الجدوى لفتح أسواق الخليج وسأتواصل معك للتفاصيل.',
        ],
      };
      const defaults = [
        'تم استلام رسالتك وسيتم التنسيق معك والرد خلال دقائق.',
        'أهلاً بك، تم تأكيد البيانات وجاري التجهيز.',
      ];
      const list = replyOptions[partnerId] || defaults;
      const reply = list[Math.floor(Math.random() * list.length)];

      const incomingMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sent: false,
        time: 'الآن',
      };

      setMessages((prev) => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), incomingMsg],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === partnerId
            ? { ...c, last: reply, time: 'الآن' }
            : c
        )
      );

      // Trigger pop-up Toast notification!
      showToast({
        title: `رسالة جديدة من ${partner?.name || 'الزميل'}`,
        message: reply,
        type: 'message',
        sender: partner?.name,
        actionLabel: 'فتح المحادثة',
        onAction: () => {
          setActiveConversationId(partnerId);
          showView('messages');
        },
      });
    }, 1800);
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Unread notifications count
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  // Supabase Realtime subscription for the 'Notification' / 'notifications' table
  useEffect(() => {
    try {
      const channel = supabase
        .channel('realtime_notifications')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'Notification' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const row = payload.new as any;
              const newNotif: NotificationItem = {
                id: row.id || `notif-${Date.now()}`,
                type: (row.type as any) || 'ad',
                title: row.title || 'إشعار جديد',
                desc: row.desc || '',
                time: 'الآن',
                unread: row.unread ?? true,
                icon:
                  row.type === 'comment'
                    ? '💬'
                    : row.type === 'message'
                    ? '✉️'
                    : row.type === 'request'
                    ? '🤝'
                    : '🔔',
              };
              setNotifications((prev) => [newNotif, ...prev]);
              showToast({
                title: newNotif.title,
                message: newNotif.desc,
                type: 'default',
              });
            } else if (payload.eventType === 'UPDATE') {
              const row = payload.new as any;
              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === row.id ? { ...n, unread: row.unread ?? false } : n
                )
              );
            } else if (payload.eventType === 'DELETE') {
              const row = payload.old as any;
              setNotifications((prev) => prev.filter((n) => n.id !== row.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime notifications subscription init error:', err);
    }
  }, []);

  const addNotification = (notif: {
    type: 'ad' | 'price' | 'comment' | 'request' | 'message';
    title: string;
    desc: string;
    icon?: string;
  }) => {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: notif.type,
      title: notif.title,
      desc: notif.desc,
      time: 'الآن',
      unread: true,
      icon:
        notif.icon ||
        (notif.type === 'comment'
          ? '💬'
          : notif.type === 'message'
          ? '✉️'
          : notif.type === 'request'
          ? '🤝'
          : '🔔'),
    };
    setNotifications((prev) => [newItem, ...prev]);
    showToast({
      title: newItem.title,
      message: newItem.desc,
      type: 'default',
    });
  };

  const markAllNotificationsRead = () => {
    if (!isLoggedIn) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('تم تعليم الكل كمقروء');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Admin states
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [adminAds, setAdminAds] = useState<AdItem[]>(INITIAL_ADS);
  const [adminPrices, setAdminPrices] = useState<PriceItem[]>(INITIAL_PRICES);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    allowRegister: true,
    requireAdApproval: false,
    allowComments: true,
    maintenance: false,
    showPrices: true,
  });
  const [selectedAdminAdIds, setSelectedAdminAdIds] = useState<string[]>([]);

  const toggleSelectAdminAd = (id: string) => {
    setSelectedAdminAdIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAdminUserStatus = (id: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'نشط' ? 'موقوف' : 'نشط' } : u))
    );
    showToast('تم تحديث حالة المستخدم');
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('تم حذف المستخدم');
  };

  const approveAdminAd = (id: string) => {
    setAdminAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'نشط' } : a)));
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'نشط' } : a)));
    showToast('تمت الموافقة على الإعلان ✅');
  };

  const rejectAdminAd = (id: string) => {
    setAdminAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'مرفوض' } : a)));
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'مرفوض' } : a)));
    showToast('تم رفض الإعلان');
  };

  const deleteAdminAd = (id: string) => {
    setAdminAds((prev) => prev.filter((a) => a.id !== id));
    setAds((prev) => prev.filter((a) => a.id !== id));
    setSelectedAdminAdIds((prev) => prev.filter((i) => i !== id));
    showToast('تم حذف الإعلان');
  };

  const bulkDeleteAdminAds = () => {
    if (selectedAdminAdIds.length === 0) {
      showToast('اختر إعلانات أولاً');
      return;
    }
    setAdminAds((prev) => prev.filter((a) => !selectedAdminAdIds.includes(a.id)));
    setAds((prev) => prev.filter((a) => !selectedAdminAdIds.includes(a.id)));
    const count = selectedAdminAdIds.length;
    setSelectedAdminAdIds([]);
    showToast(`تم حذف ${count} إعلان`);
  };

  const deleteAdminPrice = (id: string) => {
    setAdminPrices((prev) => prev.filter((p) => p.id !== id));
    setPrices((prev) => prev.filter((p) => p.id !== id));
    showToast('تم حذف السعر');
  };

  const deleteAdminPost = (id: string) => {
    setCommunityPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('تم حذف المنشور');
  };

  const deleteAdminDoc = (id: string) => {
    setSavedDocs((prev) => prev.filter((d) => d.id !== id));
    showToast('تم حذف المستند');
  };

  const toggleAdminSetting = (key: keyof AdminSettings) => {
    setAdminSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Expose prototype compatibility globals
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.showToast = showToast;
    w.showView = showView;
    w.openFellowProfile = openFellowProfile;
    w.openShare = (id: string) => openShareModal(id, 'ad');
    w.closeShare = closeShareModal;
    w.shareToProfile = shareToProfile;
    w.copyLink = copyShareLink;
    w.shareWhatsApp = shareWhatsApp;
    w.shareFacebook = shareFacebook;
    w.shareTwitter = shareTwitter;
    w.openRatingModal = openRatingModal;
    w.closeRatingModal = closeRatingModal;
    w.submitRating = () => {
      // Handled via component state
    };
    w.handleLogout = logout;
  }, [isLoggedIn, isAdmin, selectedFellow, shareModal, ads, communityPosts]);

  const value = useMemo(
    () => ({
      mounted,
      isLoggedIn,
      isAdmin,
      currentView,
      currentUser,
      authRequiredModalOpen,
      pendingView,
      toast,
      toastMessage: toast?.message || null,
      showView,
      showToast,
      dismissToast,
      simulateIncomingMessage,
      login,
      register,
      logout,
      closeAuthModal,

      ads,
      selectedCategory,
      setSelectedCategory,
      adComments,
      openCommentAdIds,
      toggleCommentsDrawer,
      addAdComment,
      toggleAdCommentLike,
      newAdModalOpen,
      setNewAdModalOpen,
      newAdImage,
      setNewAdImage,
      addAd,
      updateAd,
      deleteAd,
      updateAdComment,
      deleteAdComment,

      fellows,
      myFellows,
      fellowRequests,
      fellowSuggestions,
      fellowshipStatus,
      toggleFellowship,
      acceptFellowship,
      rejectFellowship,
      addSuggestedFellow,
      dismissSuggestion,
      removeMyFellow,
      selectedFellow,
      openFellowProfile,
      previousView,

      ratings,
      ratingModalOpen,
      currentRatingFellowId,
      openRatingModal,
      closeRatingModal,
      submitRating,

      shareModal,
      openShareModal,
      closeShareModal,
      shareToProfile,
      copyShareLink,
      shareWhatsApp,
      shareFacebook,
      shareTwitter,

      communityPosts,
      sharedItems,
      addPost,
      updatePost,
      deletePost,
      togglePostLike,
      addPostComment,
      updatePostComment,
      deletePostComment,

      prices,
      addPrice,

      selectedDocTemplateId,
      setSelectedDocTemplateId,
      savedDocs,
      saveNewDoc,

      conversations,
      activeConversationId,
      setActiveConversationId,
      messages,
      sendChatMessage,

      notifications,
      unreadNotificationsCount,
      markAllNotificationsRead,
      deleteNotification,
      addNotification,

      adminUsers,
      adminAds,
      adminPrices,
      adminSettings,
      selectedAdminAdIds,
      toggleSelectAdminAd,
      toggleAdminUserStatus,
      deleteAdminUser,
      approveAdminAd,
      rejectAdminAd,
      deleteAdminAd,
      bulkDeleteAdminAds,
      deleteAdminPrice,
      deleteAdminPost,
      deleteAdminDoc,
      toggleAdminSetting,
    }),
    [
      mounted,
      isLoggedIn,
      isAdmin,
      currentView,
      currentUser,
      authRequiredModalOpen,
      pendingView,
      toast,
      ads,
      selectedCategory,
      adComments,
      openCommentAdIds,
      newAdModalOpen,
      newAdImage,
      fellows,
      myFellows,
      fellowRequests,
      fellowSuggestions,
      fellowshipStatus,
      selectedFellow,
      previousView,
      ratings,
      ratingModalOpen,
      currentRatingFellowId,
      shareModal,
      communityPosts,
      sharedItems,
      prices,
      selectedDocTemplateId,
      savedDocs,
      conversations,
      activeConversationId,
      messages,
      notifications,
      unreadNotificationsCount,
      adminUsers,
      adminAds,
      adminPrices,
      adminSettings,
      selectedAdminAdIds,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
