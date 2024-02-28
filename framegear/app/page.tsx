'use client';
import { Frame } from '@/components/Frame';
import { FrameInput } from '@/components/FrameInput';
import { Header } from '@/components/Header';
import { ValidationResults } from '@/components/ValidationResults';
import { RedirectModalProvider } from '@/components/RedirectModalContext/RedirectModalContext';

export default function Home() {
  return (
    <RedirectModalProvider>
      <div className="mx-auto flex flex-col items-center gap-8 pb-16">
        <Header />
        <div className={`max-w-layout-max grid w-full grid-cols-[5fr,4fr] gap-16`}>
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
