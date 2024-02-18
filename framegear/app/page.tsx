'use client';
import { Header } from '@/components/Header';
import { Frame } from '@/components/Frame';
import { FrameInput } from '@/components/FrameInput';
import { ValidationResults } from '@/components/ValidationResults';
import { MAX_WIDTH } from '@/utils/constants';

export default function Home() {
  return (
    <div className="mx-auto flex flex-col items-center gap-8 pb-16">
      <Header />
      <div className={`grid w-full grid-cols-[5fr,4fr] gap-16 ${MAX_WIDTH}`}>
        <div className="flex flex-col gap-4">
          <FrameInput />
          <Frame />
        </div>
        <ValidationResults />
      </div>
    </div>
  );
}
