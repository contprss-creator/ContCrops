import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ContCrops - سوق زراعي مجاني من الأرض للمصنع للتصدير',
  description:
    'سوق زراعي مجاني ١٠٠٪ من الأرض للمصنع للتصدير - يغطي فريش، مجمد، مجفف، تصنيع غذائي، استشارات ونقل مبرد',
  openGraph: {
    title: 'ContCrops - سوق زراعي مجاني من الأرض للمصنع للتصدير',
    description:
      'سوق زراعي مجاني ١٠٠٪ من الأرض للمصنع للتصدير - يغطي فريش، مجمد، مجفف، تصنيع غذائي، استشارات ونقل مبرد',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContCrops - سوق زراعي مجاني من الأرض للمصنع للتصدير',
    description:
      'سوق زراعي مجاني ١٠٠٪ من الأرض للمصنع للتصدير - يغطي فريش، مجمد، مجفف، تصنيع غذائي، استشارات ونقل مبرد',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-green-100" suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
