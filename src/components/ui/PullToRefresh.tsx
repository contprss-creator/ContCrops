'use client';

import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { ArrowDown, Check, RotateCcw, Database } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<any>;
  children: ReactNode;
  threshold?: number;
  maxPull?: number;
  lastUpdated?: Date | null;
  label?: string;
}

export default function PullToRefresh({
  onRefresh,
  children,
  threshold = 68,
  maxPull = 120,
  lastUpdated,
  label = 'البيانات',
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [canRelease, setCanRelease] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const hasVibrated = useRef(false);

  // Format time since last updated
  const getLastUpdatedText = useCallback(() => {
    if (!lastUpdated) return 'الآن';
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 10) return 'الآن';
    if (seconds < 60) return `منذ ${seconds} ثانية`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    return lastUpdated.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  }, [lastUpdated]);

  const [timeAgo, setTimeAgo] = useState(getLastUpdatedText());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeAgo(getLastUpdatedText());
    }, 15000);
    return () => clearInterval(timer);
  }, [getLastUpdatedText]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setPullDistance(56); // Hold at indicator height

    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(20);
        } catch {}
      }
      await onRefresh();
      setIsSuccess(true);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([15, 30, 20]);
        } catch {}
      }
      setTimeout(() => {
        setIsSuccess(false);
        setIsRefreshing(false);
        setPullDistance(0);
        setCanRelease(false);
      }, 600);
    } catch {
      setIsRefreshing(false);
      setPullDistance(0);
      setCanRelease(false);
    }
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRefreshing) return;
    // Only allow pull-down if user is at the very top of page or container
    const isAtTop = window.scrollY <= 2;
    if (isAtTop) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
      hasVibrated.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    // Only engage if pulling down and window scroll is at top
    if (deltaY > 0 && window.scrollY <= 2) {
      // Damped resistance formula (feels like iOS native elastic scroll)
      const dampedDistance = Math.min(maxPull, Math.pow(deltaY, 0.82) * 1.5);
      setPullDistance(dampedDistance);

      const reached = dampedDistance >= threshold;
      setCanRelease(reached);

      // Light haptic tick when passing threshold
      if (reached && !hasVibrated.current) {
        hasVibrated.current = true;
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(15);
          } catch {}
        }
      } else if (!reached) {
        hasVibrated.current = false;
      }
    } else {
      setPullDistance(0);
      setCanRelease(false);
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling.current || isRefreshing) return;
    isPulling.current = false;

    if (canRelease && pullDistance >= threshold) {
      handleRefresh();
    } else {
      // Smoothly snap back
      setPullDistance(0);
      setCanRelease(false);
    }
  };

  // Mouse Handlers for Desktop Drag-to-Refresh
  const isMouseDown = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isRefreshing) return;
    if (window.scrollY <= 2) {
      startY.current = e.clientY;
      isMouseDown.current = true;
      hasVibrated.current = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || isRefreshing) return;

    const deltaY = e.clientY - startY.current;
    if (deltaY > 0 && window.scrollY <= 2) {
      const dampedDistance = Math.min(maxPull, Math.pow(deltaY, 0.82) * 1.4);
      setPullDistance(dampedDistance);
      const reached = dampedDistance >= threshold;
      setCanRelease(reached);
    }
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current || isRefreshing) return;
    isMouseDown.current = false;

    if (canRelease && pullDistance >= threshold) {
      handleRefresh();
    } else {
      setPullDistance(0);
      setCanRelease(false);
    }
  };

  // Calculate rotation & opacity of arrow based on pull distance
  const progressRatio = Math.min(1, pullDistance / threshold);
  const arrowRotation = canRelease ? 180 : Math.min(180, progressRatio * 180);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative select-none-when-pulling"
    >
      {/* Pull Indicator Banner */}
      <div
        style={{
          height: `${pullDistance}px`,
          transition: isPulling.current || isMouseDown.current ? 'none' : 'height 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)',
        }}
        className="overflow-hidden flex items-center justify-center pointer-events-none relative"
      >
        <div
          style={{
            opacity: pullDistance > 10 ? 1 : 0,
            transform: `scale(${Math.min(1, Math.max(0.65, progressRatio))}) translateY(${Math.min(0, (progressRatio - 1) * 10)}px)`,
            transition: isPulling.current || isMouseDown.current ? 'none' : 'transform 0.2s ease, opacity 0.2s ease',
          }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#16a34a]/25 shadow-md shadow-emerald-950/5 text-gray-800"
        >
          {isRefreshing ? (
            <>
              {isSuccess ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-bounce">
                  <Check size={13} className="stroke-[3]" />
                </div>
              ) : (
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                </div>
              )}
              <span className="text-xs font-bold text-emerald-800">
                {isSuccess ? 'تم التحديث بنجاح ✓' : 'جارٍ التحديث من Supabase...'}
              </span>
            </>
          ) : (
            <>
              <div
                style={{
                  transform: `rotate(${arrowRotation}deg)`,
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  canRelease
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                <ArrowDown size={14} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[12px] font-bold text-gray-800">
                  {canRelease ? 'أفلت للتحديث الآن' : 'اسحب للأسفل للتحديث'}
                </span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Database size={9} className="text-emerald-600" />
                  <span>تزامن مباشر مع Supabase</span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Desktop / Tablet Refresh Floating Pill */}
      <div className="flex items-center justify-between px-4 pt-1 pb-1 text-xs text-gray-400 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-gray-500 font-medium">
            تزامن Supabase Realtime • آخر تحديث: {timeAgo}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="تحديث البيانات فورياً"
          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/60 transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RotateCcw
            size={12}
            className={`transition-transform duration-500 group-hover:rotate-180 ${
              isRefreshing ? 'animate-spin text-emerald-600' : ''
            }`}
          />
          <span>{isRefreshing ? 'جارٍ التحديث...' : `تحديث ${label}`}</span>
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          transform: isPulling.current || isMouseDown.current || isRefreshing ? `translateY(${pullDistance * 0.25}px)` : 'none',
          transition: isPulling.current || isMouseDown.current ? 'none' : 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
