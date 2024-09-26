'use client';

import { AppProvider } from '@/components/AppProvider';
import PayDemo from '@/components/demo/Pay';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full bg-muted/40 items-center justify-center">
      <AppProvider>
        <PayDemo />
      </AppProvider>
    </main>
  );
}
