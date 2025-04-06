import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "./context/NotificationContext";
import { DatabaseSchemaProvider } from "./context/DatabaseSchemaContext";
import { AuthProvider } from "./context/AuthContext";

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
  keywords: 'supabase, database management, sql editor, database query, postgresql, database development, developer tools',
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
          </DatabaseSchemaProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
