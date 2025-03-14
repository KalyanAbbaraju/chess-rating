import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React from 'react';
import SideNav from "@/components/navigation/SideNav";
import "./globals.css";
import Footer from '@/components/layout/Footer';
import PWARegistration from './pwa';
import { Analytics } from '@vercel/analytics/react';
import type { Viewport } from 'next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elo Estimate",
  description: "Your complete chess rating calculator for analysis and improvement",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` || 
    'https://eloestimate.com'
  ),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Elo Estimate",
    description: "Your complete chess rating calculator for analysis and improvement",
    url: "https://eloestimate.com",
    siteName: "Elo Estimate",
    images: [
      {
        url: "https://eloestimate.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elo Estimate",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elo Estimate",
    description: "Your complete chess rating calculator for analysis and improvement",
    images: ["https://eloestimate.com/twitter-image.jpg"],
  },
  other: {
    'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
  },
  keywords: 'chess, rating calculator, FIDE, USCF, ECF, chess rating, elo rating',
  authors: [{ name: 'Elo Estimate Team' }],
  creator: 'Elo Estimate',
  publisher: 'Elo Estimate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Elo Estimate',
  },
  applicationName: 'Elo Estimate',
  referrer: 'origin-when-cross-origin',
};

export const viewport: Viewport = {
  themeColor: '#4338ca',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'light',
};

export const headers = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#4338ca" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-white focus:text-black focus:z-50">
          Skip to content
        </a>
        <PWARegistration />
        <div className="flex min-h-screen">
          <SideNav />
          <div className="flex flex-col flex-1">
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
