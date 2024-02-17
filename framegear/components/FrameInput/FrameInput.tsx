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
      <input
        className="rounded-lg border border-white p-2 text-black"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="rounded-lg border border-white"
        type="button"
        onClick={getResults}
        disabled={url.length < 1}
      >
        Fetch
      </button>
    </div>
  );
}
