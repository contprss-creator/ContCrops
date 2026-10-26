'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Filter, Check, MessageSquare } from 'lucide-react';
import Header from '@/components/ui/Header';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import { useApp } from '@/context/AppContext';
import type { OrderStatus } from '@/types';

export default function NotificationsView() {
  const {
    notifications,
    markAllNotificationsRead,
    deleteNotification,
    showToast,
    showView,
    simulateIncomingMessage,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [localStatuses, setLocalStatuses] = useState<Record<string, OrderStatus>>({});

  const getEffectiveStatus = (id: string, defaultStatus?: OrderStatus) => {
    return localStatuses[id] || defaultStatus;
  };

  const handleAcceptOrder = (id: string, title: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: 'مقبول' }));
    showToast({
      title: 'تم قبول وتأكيد الطلب بنجاح ✅',
      message: `تمت الموافقة على ${title} وإشعار العميل لتجهيز النقل`,
      type: 'request',
      actionLabel: 'إنشاء عقد للعملية',
      onAction: () => showView('docs'),
    });
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications =
    statusFilter === 'all'
      ? notifications
      : notifications.filter(
          (n) => getEffectiveStatus(n.id, n.orderStatus) === statusFilter
        );

  const pendingCount = notifications.filter(
    (n) => getEffectiveStatus(n.id, n.orderStatus) === 'قيد المراجعة'
  ).length;
  const acceptedCount = notifications.filter(
    (n) => getEffectiveStatus(n.id, n.orderStatus) === 'مقبول'
  ).length;
  const rejectedCount = notifications.filter(
    (n) => getEffectiveStatus(n.id, n.orderStatus) === 'مرفوض'
  ).length;

  return (
    <div>
      <Header />
      <div className="max-w-[760px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-[22px] font-extrabold flex items-center gap-2">
            <Bell className="text-[#16a34a]" size={22} />
            <span>الإشعارات والطلبات</span>
            <span className="bg-[#f0fdf4] text-[#15803d] border border-green-100 text-[11px] px-2.5 py-1 rounded-full font-bold">
              {unreadCount} غير مقروء
            </span>
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => simulateIncomingMessage('محمد الزراعي', 'متوفر ٥ طن طماطم فريش وجاهزة للشحن اليوم، هل ترغب في المعاينة؟')}
              className="h-9 px-3.5 bg-[#f0fdf4] text-[#15803d] border border-green-200 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-green-100 transition cursor-pointer shadow-2xs"
              title="محاكاة وصول رسالة جديدة من عميل"
            >
              <MessageSquare size={13} />
              <span>تجربة تنبيه رسالة</span>
            </button>

            <button
              onClick={markAllNotificationsRead}
              className="h-9 px-4 bg-white border border-gray-100 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-50 cursor-pointer shadow-2xs"
            >
              <CheckCheck size={14} />
              <span>تعليم الكل كمقروء</span>
            </button>
          </div>
        </div>

        {/* Order Status Filters */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 p-2 mb-4 flex gap-1.5 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setStatusFilter('all')}
            className={`h-9 px-4 rounded-full text-xs font-bold border whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-[#16a34a] text-white border-[#16a34a] shadow-2xs'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <Filter size={13} />
            <span>الكل ({notifications.length})</span>
          </button>

          <button
            onClick={() => setStatusFilter('قيد المراجعة')}
            className={`h-9 px-4 rounded-full text-xs font-bold border whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'قيد المراجعة'
                ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
                : 'bg-white text-amber-700 border-amber-100 hover:bg-amber-50/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>قيد المراجعة ({pendingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('مقبول')}
            className={`h-9 px-4 rounded-full text-xs font-bold border whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'مقبول'
                ? 'bg-green-100 text-green-800 border-green-300 shadow-2xs'
                : 'bg-white text-green-700 border-green-100 hover:bg-green-50/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>مقبول ({acceptedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('مرفوض')}
            className={`h-9 px-4 rounded-full text-xs font-bold border whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'مرفوض'
                ? 'bg-red-100 text-red-800 border-red-300 shadow-2xs'
                : 'bg-white text-red-700 border-red-100 hover:bg-red-50/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>مرفوض ({rejectedCount})</span>
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {filteredNotifications.map((n) => {
            const currentStatus = getEffectiveStatus(n.id, n.orderStatus);

            return (
              <div
                key={n.id}
                className={`bg-white rounded-2xl shadow-2xs border border-gray-100 p-4 flex gap-3 hover:shadow-md transition ${
                  n.unread ? 'border-r-4 border-r-[#16a34a]' : 'opacity-90'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-[#f9fafb] border border-gray-100 flex items-center justify-center text-lg shrink-0">
                  {n.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">
                        {n.title}
                      </span>
                      {currentStatus && (
                        <OrderStatusBadge status={currentStatus} size="sm" />
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                      {n.time}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 leading-6 mt-1.5">
                    {n.desc}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {currentStatus === 'قيد المراجعة' && (
                      <button
                        onClick={() => handleAcceptOrder(n.id, n.title)}
                        className="h-8 px-4 bg-[#16a34a] text-white rounded-full text-xs font-bold hover:bg-[#15803d] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Check size={13} />
                        <span>قبول الطلب</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        showToast({
                          title: n.title,
                          message: n.desc,
                          type: 'default',
                        });
                      }}
                      className="h-8 px-4 bg-[#f0fdf4] text-[#15803d] border border-green-100 rounded-full text-xs font-bold hover:bg-green-50 cursor-pointer"
                    >
                      عرض التفاصيل
                    </button>

                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="h-8 px-4 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                </div>

                {n.unread && (
                  <div className="w-2 h-2 bg-[#16a34a] rounded-full mt-2 shrink-0" />
                )}
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-500">
              لا يوجد إشعارات مطابقة لهذا التصنيف
            </div>
          )}
        </div>

        {/* Footer info box */}
        <div className="mt-6 bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mx-auto mb-3">
            <Bell size={20} />
          </div>
          <div className="font-bold text-sm">تنبيهات فورية وتفاعلية</div>
          <div className="text-xs text-gray-500 mt-1">
            عند قبول أي طلب أو استلام رسالة جديدة، تظهر تنبيهات منبثقة تفاعلية مع إمكانية اتخاذ إجراء مباشر
          </div>
        </div>
      </div>
    </div>
  );
}
