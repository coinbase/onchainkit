import { frameResultsAtom } from '@/utils/store';
import { useAtom } from 'jotai';
import { PropsWithChildren, useMemo } from 'react';

export function Frame() {
  const [results] = useAtom(frameResultsAtom);

  if (results.length === 0) {
    return <PlaceholderFrame />;
  }

  const latestFrame = results[results.length - 1];

  if (!latestFrame.isValid) {
    return <ErrorFrame />;
  }

  return <ValidFrame tags={latestFrame.tags} />;
}

function ValidFrame({ tags }: { tags: Record<string, string> }) {
  const { image, imageAspectRatio, input, buttons } = useMemo(() => {
    const image = tags['fc:frame:image'];
    const imageAspectRatio = tags['fc:frame:image:aspect_ratio'] === '1:1' ? '1/1' : '1.91/1';
    const input = tags['fc:frame:input:text'];
    // TODO: when debugger is live we will also need to extract actions, etc.
    const buttons = [1, 2, 3, 4].map((index) => {
      const key = `fc:frame:button:${index}`;
      const value = tags[key];
      return value ? { key, value } : undefined;
    });
    return {
      image,
      imageAspectRatio,
      input,
      buttons,
    };
  }, [tags]);

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`w-full rounded-t-xl aspect-[${imageAspectRatio}]`} src={image} alt="" />
      <div className="bg-button flex flex-wrap gap-2 rounded-b-xl px-4 py-2">
        {buttons.map((button) =>
          button ? <FrameButton key={button.key}>{button.value}</FrameButton> : null,
        )}
      </div>
    </div>
  );
}

function ErrorFrame() {
  // TODO: implement -- decide how to handle
  // - simply show an error?
  // - best effort rendering of what they do have?
  return <PlaceholderFrame />;
}

function PlaceholderFrame() {
  return (
    <div className="flex flex-col">
      <div className="bg-farcaster flex aspect-[1.91/1] w-full rounded-t-xl"></div>
      <div className="bg-button flex flex-wrap gap-2 rounded-b-xl px-4 py-2">
        <FrameButton>Get Started</FrameButton>
      </div>
    </div>
  );
}

function FrameButton({ children }: PropsWithChildren<{}>) {
  return (
    <button
      className="border-button w-[45%] grow rounded-lg border bg-white p-2 text-black"
      type="button"
      disabled
    >
      <span>{children}</span>
    </button>
  );
}
