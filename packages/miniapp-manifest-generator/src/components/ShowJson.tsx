import { useState } from 'react';
import { FarcasterManifest, FrameEmbed } from '../types';

type ShowJsonProps = {
  label: string;
  json: FarcasterManifest | FrameEmbed;
};

export function ShowJson({ label, json }: ShowJsonProps) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2"
        onClick={() => setShowRaw(!showRaw)}
      >
        <span className="text-gray-500">
          {showRaw ? 'Hide' : 'Show'} {label}
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
        <div className="overflow-hidden relative">
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText(JSON.stringify(json, null, 2))
            }
            className="rounded !bg-blue-800 px-2 py-1 text-sm text-white hover:!bg-blue-600 absolute top-2 right-2"
          >
            Copy
          </button>
          <pre className="text-black overflow-auto rounded p-4 border border-gray-300">
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
