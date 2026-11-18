import React from 'react';
import Section11 from '@/components/originkit/hero-02';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Originkit Hero 02 Component Preview | SignTap',
  description: 'Raw Originkit Hero 02 section preview.',
};

export default function OriginkitHero02Page() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="py-3 bg-[#923cf6] text-white text-center text-xs font-semibold">
        Originkit CLI Installation: Hero-02 Section Preview
      </div>
      <Section11 />
      <Footer />
    </div>
  );
}

