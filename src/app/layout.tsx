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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function hideDevPortal() {
                  var portals = document.querySelectorAll('nextjs-portal, [data-nextjs-toast], #__next-build-watcher');
                  portals.forEach(function(el) {
                    try { el.remove(); } catch(e) { el.style.display = 'none'; }
                  });
                }
                if (typeof window !== 'undefined') {
                  hideDevPortal();
                  var obs = new MutationObserver(hideDevPortal);
                  if (document.documentElement) {
                    obs.observe(document.documentElement, { childList: true, subtree: true });
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAFB] text-[#101828]">
        {children}
      </body>
    </html>
  );
}
