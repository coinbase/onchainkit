import { fetchFrame } from '@/utils/fetchFrame';
import { frameResultsAtom } from '@/utils/store';
import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';

export function FrameInput() {
  const [url, setUrl] = useState('');
  const [_, setResults] = useAtom(frameResultsAtom);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const getResults = useCallback(async () => {
    const result = await fetchFrame(url);
    setResults((prev) => [...prev, result]);
  }, [setResults, url]);

  useEffect(() => {
    textAreaRef.current?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        getResults();
      }
    });
  }, [textAreaRef, getResults]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrl(e.target.value);
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-4">
      <label className="flex flex-col">
        Enter your frame URL
        <textarea
          className={`border-pallette-line bg-content-light dark:bg-input h-[40px] resize-none overflow-hidden rounded-md border p-2`}
          placeholder="Enter URL"
          value={url}
          onChange={handleChange}
          rows={1}
          ref={textAreaRef}
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
