import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SignTap — Your Identity. One Tap Away.',
  description: 'Create your personalized digital identity with SignTap. Connect your physical NFC Smart Card to showcase your portfolio, links, achievements, and contact details with a single smartphone tap.',
  keywords: ['SignTap', 'SignTap NFC', 'Digital Business Card', 'SignBridge SignTap', 'Contactless Identity', 'Portfolio Builder', 'vCard'],
  authors: [{ name: 'SignTap by SignBridge', url: 'https://signbridge.click' }],
  metadataBase: new URL('https://signbridge.click'),
  openGraph: {
    title: 'SignTap — Your Identity. One Tap Away.',
    description: 'Personalized digital identity platform connected to physical NFC Smart Cards. Instant contactless sharing with 1-tap phonebook save.',
    url: 'https://signbridge.click',
    siteName: 'SignTap NFC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignTap — Your Identity. One Tap Away.',
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
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFB] text-[#101828]">
        {children}
      </body>
    </html>
  );
}
