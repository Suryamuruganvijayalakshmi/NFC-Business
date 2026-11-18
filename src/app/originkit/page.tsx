import React from 'react';
import Hero01 from '@/components/originkit/hero-01';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Originkit Hero 01 Component Preview | SignBridge NFC',
  description: 'Raw Originkit Hero 01 section preview.',
};

export default function OriginkitPreviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="py-4 bg-slate-900 text-white text-center text-xs">
        <span className="font-semibold text-[#087CF0]">Originkit CLI Installation:</span> Hero-01 Section Preview
      </div>
      <Hero01 />
      <Footer />
    </div>
  );
}

