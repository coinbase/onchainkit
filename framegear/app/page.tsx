'use client';
import { Frame } from '@/components/Frame';
import { FrameInput } from '@/components/FrameInput';
import { Header } from '@/components/Header';
import { ValidationResults } from '@/components/ValidationResults';
import { RedirectModalProvider } from '@/components/RedirectModalContext/RedirectModalContext';
import TextInputsProvider from '@/contexts/TextInputs';

export default function Home() {
  return (
    <RedirectModalProvider>
      <TextInputsProvider>
        <div className="mx-auto flex flex-col items-center gap-8 pb-16 p-2">
          <Header />
          <div
            className={`max-w-layout-max grid w-full grid-cols-1 lg:grid-cols-2 gap-16`}
          >
            <div className="flex flex-col gap-4">
              <FrameInput />
              <Frame />
            </div>
            <ValidationResults />
          </div>
        </div>
      </TextInputsProvider>
    </RedirectModalProvider>
  );
}
