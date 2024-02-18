import { frameResultsAtom } from '@/utils/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

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
  console.log({ buttons });
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`rounded-t-xl aspect-[${imageAspectRatio}]`} src={image} alt="" />
      <div className="flex flex-wrap gap-2 rounded-b-xl border-b border-l border-r border-slate-600 px-4 py-2">
        {buttons.map((button) =>
          button ? (
            <button
              className="w-[45%] grow rounded-lg bg-pink-950 p-2"
              type="button"
              key={button.key}
              disabled
            >
              <span>{button.value}</span>
            </button>
          ) : null,
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
    <div className="flex aspect-[1.91/1] w-full rounded-xl border-slate-700 bg-fuchsia-950">
      <div></div>
      <div className="flex h-16 w-full flex-wrap gap-2 self-end rounded-b-xl bg-slate-700 px-4 py-2">
        <button className="w-[45%] grow rounded-lg bg-slate-400 p-2 text-black" type="button">
          Load Frame To Continue
        </button>
      </div>
    </div>
  );
}
