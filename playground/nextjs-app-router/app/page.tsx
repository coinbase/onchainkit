'use client';

import { AppProvider } from '@/components/AppProvider';
import Demo from '@/components/Demo';
import { Suspense } from 'react';

export default function Home() {
  return (
    // Suspense required for nuqs
    <Suspense>
      <main className="flex min-h-screen w-full bg-muted/40">
        <AppProvider>
          <Demo />
        </AppProvider>
      </main>
    </Suspense>
  );
}
