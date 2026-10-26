'use client';

import { useEffect, type ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import type { ViewType } from '@/types';
import Sidebar from '@/components/ui/Sidebar';
import MobileNav from '@/components/ui/MobileNav';
import Toast from '@/components/ui/Toast';
import AuthRequiredModal from '@/components/ui/AuthRequiredModal';
import NewAdModal from '@/components/ui/NewAdModal';
import RatingModal from '@/components/ui/RatingModal';
import ShareModal from '@/components/ui/ShareModal';

import LandingView from '@/components/views/LandingView';
import MarketView from '@/components/views/MarketView';
import ServicesView from '@/components/views/ServicesView';
import PricesView from '@/components/views/PricesView';
import DocsView from '@/components/views/DocsView';
import CommunityView from '@/components/views/CommunityView';
import RegisterView from '@/components/views/RegisterView';
import LoginView from '@/components/views/LoginView';
import MessagesView from '@/components/views/MessagesView';
import NotificationsView from '@/components/views/NotificationsView';
import ProfileView from '@/components/views/ProfileView';
import FellowProfileView from '@/components/views/FellowProfileView';
import AdminDashboardView from '@/components/views/AdminDashboardView';
import CropsFarmsMap from '@/components/map/CropsFarmsMap';

interface AppShellProps {
  initialView?: ViewType;
}

export default function AppShell({ initialView }: AppShellProps) {
  const { currentView, showView } = useApp();

  useEffect(() => {
    if (initialView && initialView !== currentView) {
      showView(initialView);
    }
  }, [initialView]);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'market':
        return <MarketView />;
      case 'map':
        return <CropsFarmsMap />;
      case 'services':
        return <ServicesView />;
      case 'prices':
        return <PricesView />;
      case 'docs':
      case 'doc-editor':
        return <DocsView />;
      case 'community':
        return <CommunityView />;
      case 'register':
        return <RegisterView />;
      case 'login':
        return <LoginView />;
      case 'messages':
        return <MessagesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'fellow-profile':
        return <FellowProfileView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main view area */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1">{renderView()}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating interactive elements & modals */}
      <Toast />
      <AuthRequiredModal />
      <NewAdModal />
      <RatingModal />
      <ShareModal />
    </div>
  );
}
