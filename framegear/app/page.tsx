'use client';
import { Frame } from '@/components/Frame';
import { FrameInput } from '@/components/FrameInput';
import { ValidationResults } from '@/components/ValidationResults';
import { APP_NAME } from '@/utils/constants';

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>{APP_NAME}</h1>
      <FrameInput />
      <div className="grid grid-cols-2 gap-4">
        <Frame />
        <ValidationResults />
      </div>
    </div>
  );
}
