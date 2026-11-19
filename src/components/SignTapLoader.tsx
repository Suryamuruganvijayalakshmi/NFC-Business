'use client';

import React, { useState, useEffect, useRef } from 'react';
import Signature from '@/components/originkit/ui/signature';

interface SignTapLoaderProps {
  forceShow?: boolean;
  onFinish?: () => void;
}

export default function SignTapLoader({ forceShow = false, onFinish }: SignTapLoaderProps) {
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // Only load once per session unless forceShow is specified
    if (!forceShow) {
      try {
        const seen = sessionStorage.getItem('signtap_loader_seen');
        if (seen === '1') {
          if (onFinish) onFinish();
          return;
        }
      } catch {
        // Fallback for restricted storage environments
      }
    }

    setVisible(true);

    // Duration: 1.9s signature drawing + 250ms hold = 2.15s, then smooth fade
    const timer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setIsExiting(true);
        try {
          sessionStorage.setItem('signtap_loader_seen', '1');
        } catch {
          // Fallback
        }
        setTimeout(() => {
          setVisible(false);
          if (onFinish) onFinish();
        }, 500);
      }
    }, 2150);

    return () => clearTimeout(timer);
  }, [forceShow, onFinish]);

  const handleDismiss = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
    try {
      sessionStorage.setItem('signtap_loader_seen', '1');
    } catch {
      // Fallback
    }
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAFAFB] transition-opacity duration-500 ease-out select-none cursor-default ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Centered signature box on clean light theme background */}
      <div className="w-full max-w-xl h-56 sm:h-72 md:h-80 flex items-center justify-center p-4">
        <Signature
          text="SignTap"
          ink="#0D0D0D"
          size={132}
          duration={1.9}
          outline={true}
          inset={16}
          background="transparent"
        />
      </div>
    </div>
  );
}
