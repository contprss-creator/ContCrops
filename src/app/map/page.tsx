import type { Metadata } from 'next';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'خريطة المحاصيل والمزارع | ContCrops',
  description: 'خريطة تفاعلية لعرض مواقع إعلانات المحاصيل والمزارع القريبة مع تصفية حسب نوع المحصول',
};

export default function MapPage() {
  return <AppShell initialView="map" />;
}
