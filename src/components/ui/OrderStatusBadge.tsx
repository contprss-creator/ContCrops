'use client';

import { Clock, Check, X } from 'lucide-react';
import type { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export default function OrderStatusBadge({
  status,
  size = 'md',
  className = '',
}: OrderStatusBadgeProps) {
  const configs = {
    'قيد المراجعة': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
      dotColor: 'bg-amber-500',
      label: 'قيد المراجعة',
    },
    'مقبول': {
      bg: 'bg-green-50 text-green-700 border-green-200',
      icon: Check,
      dotColor: 'bg-[#16a34a]',
      label: 'مقبول',
    },
    'مرفوض': {
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: X,
      dotColor: 'bg-red-500',
      label: 'مرفوض',
    },
  };

  const current = configs[status] || configs['قيد المراجعة'];
  const Icon = current.icon;

  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-2 py-0.5 gap-1'
      : 'text-[11px] px-2.5 py-1 gap-1.5';

  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs whitespace-nowrap transition-colors ${current.bg} ${sizeClasses} ${className}`}
      data-status={status}
    >
      <Icon size={iconSize} strokeWidth={2.5} />
      <span>{current.label}</span>
    </span>
  );
}
