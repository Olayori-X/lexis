'use client';

import { useEffect } from 'react';
import { registerSyncListener } from '@/lib/sync';

export function AppInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
    registerSyncListener();
  }, []);

  return null;
}