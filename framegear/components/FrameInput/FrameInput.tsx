import { useCallback, useState } from 'react';
import { fetchFrame } from '@/utils/fetchFrame';
import { frameResultsAtom } from '@/utils/store';
import { useAtom } from 'jotai';
import { useTextInputs } from '@/contexts/TextInputs';
import clsx from 'clsx';

export function FrameInput() {
  const [url, setUrl] = useState('');
  const [_, setResults] = useAtom(frameResultsAtom);
  const { setInputText } = useTextInputs();
  const [isLoading, setIsLoading] = useState(false);

  const getResults = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchFrame(url);
    setResults((prev) => [...prev, result]);
    setInputText('');
    setIsLoading(false);
  }, [setInputText, setResults, url]);

  return (
    <div className="grid grid-cols-[3fr_1fr] gap-4">
      <label className="flex flex-col">
        Enter your frame URL
        <input
          className="border-pallette-line bg-content-light dark:bg-input h-[40px] rounded-md border p-2"
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
      <button
        className={clsx('h-[40px] self-end rounded-full',
          isLoading ? 'bg-neutral-800 text-white' : 'bg-white text-black'
        )}
        type="button"
        onClick={getResults}
        disabled={url.length < 1}
      >
        {isLoading ? 'Loading...' : 'Fetch'}
      </button>
    </div>
  );
}
