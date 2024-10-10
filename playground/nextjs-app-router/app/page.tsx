'use client';

import { AppProvider } from '@/components/AppProvider';
import Demo from '@/components/Demo';

export default function Home() {
  return (
    <main className='flex min-h-screen w-full bg-muted/50 font-sans'>
      <AppProvider>
        <Demo />
      </AppProvider>
    </main>
  );
}
