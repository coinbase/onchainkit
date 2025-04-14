import { useState } from 'react';
import { FarcasterJson } from '../types';

type FarcasterJsonRawProps = {
  farcasterJson: FarcasterJson;
};

export function FarcasterJsonRaw({ farcasterJson }: FarcasterJsonRawProps) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2"
        onClick={() => setShowRaw(!showRaw)}
      >
        <span className="text-gray-500">
          {showRaw ? 'Hide' : 'Show'} raw farcaster.json
        </span>
        <svg
          className={`text-gray-400 w-4 h-4 transition-transform duration-200 ${showRaw ? 'rotate-180' : '-rotate-90'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showRaw ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        data-testid="jsonRawContainer"
      >
        <div className="overflow-hidden">
          <pre className="text-black overflow-auto rounded p-4 border border-gray-300">
            {JSON.stringify(farcasterJson, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
