'use client';
import { Frame } from '@/components/Frame';
import { FrameInput } from '@/components/FrameInput';
import { Header } from '@/components/Header';
import { RedirectModalProvider } from '@/components/RedirectModalContext/RedirectModalContext';
import { ValidationResults } from '@/components/ValidationResults';

export default function Home() {
  return (
    <RedirectModalProvider>
      <div className="mx-auto flex flex-col items-center gap-8 pb-16">
        <Header />
        <div className="grid w-full max-w-layout-max grid-cols-[5fr,4fr] gap-16">
          <div className="flex flex-col gap-4">
            <FrameInput />
            <Frame />
          </div>
          <ValidationResults />
        </div>
      </div>
    </RedirectModalProvider>
  );
}
