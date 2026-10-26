import type { ComponentType } from 'react';

export type ViewType =
  | 'landing'
  | 'market'
  | 'services'
  | 'prices'
  | 'community'
  | 'docs'
  | 'doc-editor'
  | 'register'
  | 'login'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'fellow-profile'
  | 'admin-dashboard'
  | 'map';

export type SectorCategory =
  | 'الكل'
  | 'فريش'
  | 'مجمد'
  | 'مجفف'
  | 'تصنيع غذائي'
  | 'استشارات'
  | 'نقل';

export type AccountType =
  | 'مزارع'
  | 'تاجر'
  | 'مصنع'
  | 'مهندس'
  | 'مورد'
  | 'مصدر';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export interface OfficialDocumentItem {
  id: string;
  name: string;
  type: string;
  fileName?: string;
  uploadDate: string;
  status: 'approved' | 'in_review' | 'rejected';
  docNumber?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  governorate: string;
  accountType: string;
  role: string;
  location: string;
  rating?: number;
  isVerified?: boolean;
  verificationStatus?: VerificationStatus;
  verifiedDocuments?: string[];
  verifiedAt?: string;
  verificationId?: string;
}

export interface AdItem {
  id: string;
  category: string;
  userInitial: string;
  userName: string;
  role: string;
  time: string;
  title: string;
  desc: string;
  qty: string;
  location: string;
  price: string;
  likes: number;
  comments: number;
  image?: string;
  status?: 'نشط' | 'قيد المراجعة' | 'مرفوض';
  owner?: string;
  ownerId?: string;
  date?: string;
  reports?: number;
  lat?: number;
  lng?: number;
  cropType?: string;
}

export interface AdComment {
  id: string;
  adId: string;
  userName: string;
  initial: string;
  text: string;
  time: string;
  likes: number;
  liked: boolean;
}

export interface FellowReview {
  user: string;
  text: string;
  stars: number;
  time: string;
}

export interface Fellow {
  id: string;
  name: string;
  spec: string;
  stars: number;
  loc: string;
  initial: string;
  jobs: number;
  role: string;
  followers: number;
  adsCount: number;
  exp: string;
  bio: string;
  skills: string[];
  reviews: FellowReview[];
  phone: string;
  mutual?: number;
  accountType?: string;
  isVerified?: boolean;
  verificationStatus?: VerificationStatus;
  verifiedDocuments?: string[];
  verifiedAt?: string;
  verificationId?: string;
  lat?: number;
  lng?: number;
  cropSpecialty?: string[];
}

export interface ReviewItem {
  id: string;
  fellowId: string;
  userName: string;
  initial: string;
  stars: number;
  comment: string;
  date: string;
  tags: string[];
}

export interface PriceItem {
  id?: string;
  crop: string;
  cat: string;
  price: number;
  change: number;
  unit?: string;
  source?: string;
}

export interface DocTemplate {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface SavedDoc {
  id: string;
  title: string;
  date: string;
  party: string;
}

export interface PostComment {
  user: string;
  text: string;
}

export interface CommunityPost {
  id: string;
  user: string;
  initial: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
  comments: PostComment[];
  image?: string;
}

export interface SharedItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  sourceId: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  initial: string;
  last: string;
  time: string;
  unread: number;
  color: string;
  role: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sent: boolean;
  time: string;
}

export type OrderStatus = 'قيد المراجعة' | 'مقبول' | 'مرفوض';

export interface NotificationItem {
  id: string;
  type: 'ad' | 'price' | 'comment' | 'request' | 'message';
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  icon: string;
  orderStatus?: OrderStatus;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  accountType: string;
  governorate: string;
  status: 'نشط' | 'موقوف';
  ads: number;
  joinDate: string;
}

export interface AdminSettings {
  allowRegister: boolean;
  requireAdApproval: boolean;
  allowComments: boolean;
  maintenance: boolean;
  showPrices: boolean;
}

export interface CategoryInfo {
  id: string;
  label: string;
  desc: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;
  count: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  title?: string;
  type?: 'default' | 'message' | 'request' | 'success';
  sender?: string;
  actionLabel?: string;
  onAction?: () => void;
}
