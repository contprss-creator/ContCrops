'use client';

import Link from 'next/link';
import {
  House,
  Store,
  Users,
  ChartColumn,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MobileNav() {
  const { currentView, showView } = useApp();

  const navItems = [
    { id: 'landing', label: 'الرئيسية', icon: House, href: '/' },
    { id: 'market', label: 'السوق', icon: Store, href: '/market' },
    { id: 'services', label: 'الخدمات', icon: Users, href: '/services' },
    { id: 'prices', label: 'أسعار', icon: ChartColumn, href: '/prices' },
    { id: 'community', label: 'مجتمع', icon: MessageCircle, href: '/community' },
    { id: 'docs', label: 'مستندات', icon: FileText, href: '/docs' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-gray-100 px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive =
            currentView === item.id ||
            (currentView === 'doc-editor' && item.id === 'docs');
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                showView(item.id);
              }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-xl transition cursor-pointer ${
                isActive ? 'text-[#16a34a]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                  isActive ? 'bg-[#f0fdf4] text-[#16a34a]' : ''
                }`}
              >
                <Icon size={17} />
              </div>
              <span
                className={`text-[10px] font-bold ${
                  isActive ? 'text-[#16a34a]' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
