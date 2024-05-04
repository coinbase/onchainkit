import { fetchFrame } from '@/utils/fetchFrame';
import { frameResultsAtom } from '@/utils/store';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';

export function FrameInput() {
  const [url, setUrl] = useState('');
  const [_, setResults] = useAtom(frameResultsAtom);

  const getResults = useCallback(async () => {
    const result = await fetchFrame(url);
    setResults((prev) => [...prev, result]);
  }, [setResults, url]);

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-4">
      <label className="flex flex-col">
        Enter your frame URL
        <input
          className={`border-pallette-line bg-content-light dark:bg-input h-[40px] rounded-md border p-2`}
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
      <button
        className="h-[40px] self-end rounded-full bg-white text-black"
        type="button"
        onClick={getResults}
        disabled={url.length < 1}
      >
        Fetch
      </button>
    </div>
  );
}
