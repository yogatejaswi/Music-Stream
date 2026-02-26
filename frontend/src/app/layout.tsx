import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/components/ThemeProvider';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Music Stream - Your Ultimate Music Experience',
  description: 'Stream millions of songs, create playlists, discover new music, and enjoy high-quality audio streaming with advanced features like offline mode, lyrics, and social sharing.',
  keywords: [
    'music streaming',
    'online music',
    'playlists',
    'songs',
    'artists',
    'albums',
    'audio streaming',
    'music player',
    'offline music',
    'lyrics'
  ],
  authors: [{ name: 'Music Stream Team' }],
  creator: 'Music Stream',
  publisher: 'Music Stream',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Music Stream - Your Ultimate Music Experience',
    description: 'Stream millions of songs, create playlists, and discover new music',
    siteName: 'Music Stream',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Music Stream - Your Ultimate Music Experience',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Stream - Your Ultimate Music Experience',
    description: 'Stream millions of songs, create playlists, and discover new music',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Music Stream',
  },
  applicationName: 'Music Stream',
  category: 'entertainment',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Music Stream" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <KeyboardShortcuts />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
