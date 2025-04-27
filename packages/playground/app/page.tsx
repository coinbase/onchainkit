'use client';

import { AppProvider } from '@/components/AppProvider';
import Demo from '@/components/Demo';
import OnchainProviders from '@/components/OnchainProviders';

export default function Home() {
  return (
    <OnchainProviders>
      <main className="flex min-h-screen w-full bg-muted/40">
        <AppProvider>
          <Demo />
        </AppProvider>
      </main>
    </OnchainProviders>
  );
}
