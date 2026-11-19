'use client';

import React, { useState, useEffect, useRef } from 'react';
import Signature from '@/components/originkit/ui/signature';

interface SignTapLoaderProps {
  onFinish?: () => void;
}

export default function SignTapLoader({ onFinish }: SignTapLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    // 1.5s signature writing + 200ms hold = 1.7s, then smoothly reveal the site
    const timer = setTimeout(() => {
      triggerExit();
    }, 1700);

    return () => clearTimeout(timer);
  }, []);

  const triggerExit = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
    if (onFinishRef.current) {
      onFinishRef.current();
    }
    setTimeout(() => {
      setVisible(false);
    }, 450);
  };

  const handleDismiss = () => {
    triggerExit();
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAFAFB] transition-opacity duration-400 ease-out select-none cursor-default ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Centered signature box on clean light theme background - ONLY SignTap */}
      <div className="w-full max-w-xl h-56 sm:h-72 md:h-80 flex items-center justify-center p-4">
        <Signature
          text="SignTap"
          ink="#0D0D0D"
          size={136}
          duration={1.5}
          outline={false}
          inset={16}
          background="transparent"
        />
      </div>
    </div>
  );
}
