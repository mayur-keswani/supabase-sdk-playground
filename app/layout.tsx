import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "./context/NotificationContext";
import { DatabaseSchemaProvider } from "./context/DatabaseSchemaContext";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from '@vercel/analytics/next';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Supabase Query Playground - Build, Edit, and Execute Queries in Real Time',
    template: '%s | Supabase Query Playground',
  },
  description: 'A powerful, intuitive database management tool for Supabase developers. Explore, query, and manage your Supabase database with ease.',
  keywords: 'supabase, supabase sdk playground, sdk client tester, supabase API tester, database runner, developer tools, API runner,API tester, custom queries',
  authors: [{ name: 'Mayur Keswani' }],
  creator: 'Mayur Keswani',
  publisher: 'Mayur Keswani',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://supabase-sdk-playground.vercel.app/',
    title: 'Supabase Query Playground - Build, Edit, and Execute Queries in Real Time',
    description: 'A powerful, intuitive database management tool for Supabase developers. Explore, query, and manage your Supabase database with ease.',
    siteName: 'Supabase Query Playground',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Supabase Query Playground',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Supabase Query Playground - Build, Edit, and Execute Queries in Real Time',
    description: 'A powerful, intuitive database management tool for Supabase developers. Explore, query, and manage your Supabase database with ease.',
    images: ['/og-image.png'],
  },

  // Additional SEO
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
    google: 'Xnd4fGrwx1Tuik8ldwIlerKOstJ64S_97NKmr-Dns5A',
  },
};

<meta name="google-adsense-account" content="ca-pub-5545104283099959"></meta>

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          <DatabaseSchemaProvider>
            <AuthProvider>{children}</AuthProvider>
            <Analytics mode="production" />
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5545104283099959" crossOrigin="anonymous"></script>
          </DatabaseSchemaProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
