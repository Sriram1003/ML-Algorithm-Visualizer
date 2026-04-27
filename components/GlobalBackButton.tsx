'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import React from 'react';

export const GlobalBackButton = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();

  // Do not show the back button on the main home page
  if (pathname === '/') return null;

  return (
    <div className="fixed top-4 left-4 z-[100] md:top-6 md:left-6">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="border-purple-500 text-purple-300 bg-black/80 hover:bg-purple-900 shadow-lg backdrop-blur"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" /> Back
      </Button>
    </div>
  );
});

GlobalBackButton.displayName = 'GlobalBackButton';
