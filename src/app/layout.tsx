import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SignBridge ID — Your Identity. One Tap Away.',
  description: 'Create your personalized digital identity. Connect your SignBridge NFC Smart Card to showcase your portfolio, links, achievements, and contact details with a single smartphone tap.',
  keywords: ['NFC Smart Card', 'Digital Business Card', 'SignBridge ID', 'Contactless Identity', 'Portfolio Builder', 'vCard'],
  authors: [{ name: 'SignBridge', url: 'https://signbridge.click' }],
  metadataBase: new URL('https://signbridge.click'),
  openGraph: {
    title: 'SignBridge ID — Your Identity. One Tap Away.',
    description: 'Personalized digital identity platform connected to physical NFC Smart Cards. Instant contactless sharing with 1-tap phonebook save.',
    url: 'https://signbridge.click',
    siteName: 'SignBridge ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignBridge ID — Your Identity. One Tap Away.',
    description: 'Personalized digital identity platform connected to physical NFC Smart Cards.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFB] text-[#101828]">
        {children}
      </body>
    </html>
  );
}
